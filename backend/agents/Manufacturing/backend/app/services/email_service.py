import os
import re
import time
import json
import smtplib
import logging
import threading
from abc import ABC, abstractmethod
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone
from typing import Dict, Any, Optional, Tuple, List
from sqlalchemy.orm import Session

logger = logging.getLogger("manufacturing.email")

from ..config import settings
from ..models.workflow import EmailNotificationLog, DepartmentContact, RiskAlert, SystemSetting
from ..database import SessionLocal


def utcnow():
    return datetime.now(timezone.utc)


EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

SEVERITY_ORDER = {
    "LOW": 1,
    "MEDIUM": 2,
    "HIGH": 3,
    "CRITICAL": 4,
}


class BaseEmailProvider(ABC):
    @abstractmethod
    def is_configured(self, recipient: Optional[str] = None) -> bool:
        pass

    @abstractmethod
    def send_email(
        self,
        recipient: str,
        subject: str,
        body: str,
        sender: Optional[str] = None,
    ) -> Tuple[bool, Optional[str], Optional[str]]:
        """Returns (success: bool, error_message: Optional[str], provider_message_id: Optional[str])"""
        pass


class SMTPEmailProvider(BaseEmailProvider):
    """
    Standard enterprise SMTP provider with direct delivery support for testing mailboxes (e.g. YOPmail).
    Reads host, port, user and password from application settings, environment variables, or database system settings.
    Never exposes or prints credentials.
    """

    def __init__(self):
        self.host = getattr(settings, "smtp_host", None)
        self.user = getattr(settings, "smtp_user", None)
        self.password = getattr(settings, "smtp_password", None)
        self.port = getattr(settings, "smtp_port", 587)
        self.default_sender = getattr(settings, "smtp_from", "noreply@manufacturing.internal")

    _cached_smtp_config: Optional[Dict[str, Any]] = None
    _config_cache_time: float = 0.0

    @classmethod
    def clear_config_cache(cls):
        cls._cached_smtp_config = None
        cls._config_cache_time = 0.0
        cls._cached_connection = None

    def _get_smtp_config(self) -> Dict[str, Any]:
        now = time.time()
        if self._cached_smtp_config and (now - self._config_cache_time < 60):
            return self._cached_smtp_config

        # 1. Database system_settings table takes precedence for runtime user configuration!
        db_settings = {}
        try:
            db = SessionLocal()
            db_settings = {s.key: s.value for s in db.query(SystemSetting).all() if s.value}
            db.close()
        except Exception as e:
            logger.debug(f"Could not load SystemSetting for SMTP: {e}")

        host = db_settings.get("smtp_host") or os.environ.get("SMTP_HOST") or self.host or getattr(settings, "smtp_host", None)
        user = db_settings.get("smtp_user") or os.environ.get("SMTP_USER") or self.user or getattr(settings, "smtp_user", None)
        password = db_settings.get("smtp_password") or os.environ.get("SMTP_PASSWORD") or self.password or getattr(settings, "smtp_password", None)
        port_raw = db_settings.get("smtp_port") or os.environ.get("SMTP_PORT") or self.port or getattr(settings, "smtp_port", 587) or 587
        try:
            port = int(port_raw)
        except (ValueError, TypeError):
            port = 587
        sender = db_settings.get("smtp_from") or os.environ.get("SMTP_FROM") or self.default_sender or getattr(settings, "smtp_from", "noreply@manufacturing.internal")

        cfg = {
            "host": host,
            "user": user,
            "password": password,
            "port": port,
            "sender": sender,
        }
        self.__class__._cached_smtp_config = cfg
        self.__class__._config_cache_time = now
        return cfg

    def is_configured(self, recipient: Optional[str] = None) -> bool:
        cfg = self._get_smtp_config()
        if recipient and "yopmail" in recipient.lower():
            return True
        if cfg.get("host") and cfg["host"].lower() not in ("sandbox", "mock", "test", "dev") and cfg.get("user") and cfg.get("password"):
            return True
        if cfg.get("host") and cfg["host"].lower() in ("sandbox", "mock", "test", "dev"):
            if recipient and (recipient.endswith(".internal") or recipient.endswith(".local") or "yopmail" in recipient.lower()):
                return True
            return False
        return False

    _cached_connection = None
    _cached_cfg_tuple = None
    _cached_conn_time = 0.0

    def _get_connection(self, cfg: dict):
        now = time.time()
        cfg_tuple = (cfg.get("host"), cfg.get("port"), cfg.get("user"), cfg.get("password"))
        if self._cached_connection and self._cached_cfg_tuple == cfg_tuple and (now - self._cached_conn_time < 35):
            try:
                code, _ = self._cached_connection.noop()
                if code == 250:
                    return self._cached_connection
            except Exception:
                self._cached_connection = None

        port = int(cfg["port"])
        if port == 465:
            server = smtplib.SMTP_SSL(cfg["host"], port, timeout=10)
            server.login(cfg["user"], cfg["password"])
        else:
            server = smtplib.SMTP(cfg["host"], port, timeout=10)
            server.starttls()
            server.login(cfg["user"], cfg["password"])

        self._cached_connection = server
        self._cached_cfg_tuple = cfg_tuple
        self._cached_conn_time = time.time()
        return server

    def send_email(
        self,
        recipient: str,
        subject: str,
        body: str,
        sender: Optional[str] = None,
    ) -> Tuple[bool, Optional[str], Optional[str]]:
        cfg = self._get_smtp_config()

        # 1. Full authenticated SMTP if real credentials are provided (e.g. Gmail App Password or Ethereal)
        if cfg.get("host") and cfg["host"].lower() not in ("sandbox", "mock", "test", "dev") and cfg.get("user") and cfg.get("password"):
            try:
                msg = MIMEMultipart()
                msg["From"] = sender or cfg.get("sender") or self.default_sender
                msg["To"] = recipient
                msg["Subject"] = subject
                msg.attach(MIMEText(body, "plain"))

                server = self._get_connection(cfg)
                try:
                    server.send_message(msg)
                except Exception:
                    # Connection dropped or timed out; reconnect and retry once
                    self._cached_connection = None
                    server = self._get_connection(cfg)
                    server.send_message(msg)

                message_id = f"smtp-{int(utcnow().timestamp())}"
                return True, None, message_id
            except Exception as e:
                self._cached_connection = None
                return False, f"SMTP delivery failed to {recipient}: {str(e)}", None

        # 2. Direct delivery for public testing mailboxes (YOPmail on port 587)
        if "yopmail" in recipient.lower():
            try:
                msg = MIMEMultipart()
                msg["From"] = sender or "Manufacturing 360 <alerts@manufacturing360.com>"
                msg["To"] = recipient
                msg["Subject"] = subject
                msg.attach(MIMEText(body, "plain"))

                with smtplib.SMTP("smtp.yopmail.com", 587, timeout=12) as server:
                    server.send_message(msg)

                message_id = f"yopmail-{int(utcnow().timestamp())}"
                return True, None, message_id
            except Exception as e:
                return False, f"YOPmail direct delivery failed: {str(e)}", None

        # 3. Sandbox mode handling
        if cfg.get("host") and cfg["host"].lower() in ("sandbox", "mock", "test", "dev"):
            if recipient.endswith(".internal") or recipient.endswith(".local"):
                logger.info(f"[SANDBOX INTERNAL DISPATCH] Recipient: {recipient} | Subject: {subject}")
                message_id = f"sandbox-{int(utcnow().timestamp())}"
                return True, None, message_id

            # External commercial recipient (e.g. Gmail) without real SMTP credentials
            err_msg = (
                f"Cannot deliver to external address '{recipient}': SMTP relay is currently running in zero-credential sandbox mode. "
                "To deliver real emails to your Gmail inbox, please configure your SMTP Host (smtp.gmail.com), Port (587), and Google App Password in Settings -> Email Configuration, "
                "or use zero-credential instant delivery with 'chithrap1p2s8123@yopmail.com' (instantly viewable at https://yopmail.com)."
            )
            return False, err_msg, None

        # 4. Otherwise unconfigured
        return False, (
            "SMTP credentials not configured. Configure SMTP in Settings -> Email Configuration (e.g. smtp.gmail.com with App Password), "
            "or use a '@yopmail.com' test address for instant zero-credential delivery."
        ), None


class MockEmailProvider(BaseEmailProvider):
    """
    In-memory mock provider for testing and offline development.
    Can be configured to simulate network or credentials failure.
    """

    def __init__(self, simulate_failure: bool = False, failure_reason: str = "Simulated provider failure"):
        self.simulate_failure = simulate_failure
        self.failure_reason = failure_reason
        self.sent_emails: List[Dict[str, Any]] = []

    def is_configured(self, recipient: Optional[str] = None) -> bool:
        return not self.simulate_failure

    def send_email(
        self,
        recipient: str,
        subject: str,
        body: str,
        sender: Optional[str] = None,
    ) -> Tuple[bool, Optional[str], Optional[str]]:
        if self.simulate_failure:
            return False, self.failure_reason, None

        msg_id = f"mock-msg-{len(self.sent_emails) + 1}-{int(utcnow().timestamp())}"
        self.sent_emails.append({
            "recipient": recipient,
            "subject": subject,
            "body": body,
            "sender": sender or "noreply@manufacturing.internal",
            "message_id": msg_id,
            "sent_at": utcnow(),
        })
        return True, None, msg_id


DEFAULT_DEPARTMENT_CONTACTS = {
    "ERP": ("Order Management Lead", "dyfs2m763cn7s2uz@ethereal.email"),
    "MMS": ("Master Production Scheduler", "dyfs2m763cn7s2uz@ethereal.email"),
    "MES": ("Plant Operations Lead", "dyfs2m763cn7s2uz@ethereal.email"),
    "WMS": ("Warehouse & Materials Manager", "dyfs2m763cn7s2uz@ethereal.email"),
    "QMS": ("Quality Assurance Engineer", "dyfs2m763cn7s2uz@ethereal.email"),
    "TMS": ("Logistics & Dispatch Coordinator", "dyfs2m763cn7s2uz@ethereal.email"),
    "PLM": ("Configuration Management Engineer", "dyfs2m763cn7s2uz@ethereal.email"),
    "CUSTOMER_SERVICE": ("Customer Service Lead", "dyfs2m763cn7s2uz@ethereal.email"),
}


class EmailService:
    """
    Enterprise Email Notification Service for Agent 3 order surveillance.
    - Resolves recipients from database department contacts.
    - Handles independent Operational Department and Customer Service notifications.
    - Prevents duplicates while notifying on severity escalation and resolution.
    - Tracks complete lifecycle: PENDING, SENT, FAILED, RETRYING, PENDING_CONFIG.
    """

    _provider: Optional[BaseEmailProvider] = None

    @classmethod
    def get_provider(cls) -> BaseEmailProvider:
        if cls._provider is None:
            cls._provider = SMTPEmailProvider()
        return cls._provider

    @classmethod
    def set_provider(cls, provider: BaseEmailProvider):
        """Allows injecting MockEmailProvider in unit tests."""
        cls._provider = provider

    @classmethod
    def reset_provider(cls):
        cls._provider = None

    @classmethod
    def validate_email_address(cls, email: str) -> bool:
        if not email or not isinstance(email, str):
            return False
        return bool(EMAIL_REGEX.match(email.strip()))

    @classmethod
    def get_recipient_for_department(cls, db: Session, department: str) -> Tuple[str, bool]:
        """Returns (recipient_email, is_configured_in_db)"""
        contact = db.query(DepartmentContact).filter(
            DepartmentContact.department == department.upper().strip(),
            DepartmentContact.is_active == True,
        ).first()

        if contact and contact.email:
            email = contact.email.strip().lower()
            if email.endswith(".internal") or email.endswith(".local"):
                return "dyfs2m763cn7s2uz@ethereal.email", True
            return email, True

        dept_upper = department.upper().strip()
        if dept_upper in DEFAULT_DEPARTMENT_CONTACTS:
            return DEFAULT_DEPARTMENT_CONTACTS[dept_upper][1], False

        return "dyfs2m763cn7s2uz@ethereal.email", False

    @classmethod
    def get_customer_service_recipient(cls, db: Session) -> Tuple[str, bool]:
        """Resolves Customer Service recipient address."""
        contact = db.query(DepartmentContact).filter(
            DepartmentContact.department.in_(["CUSTOMER_SERVICE", "CS"]),
            DepartmentContact.is_active == True,
        ).first()

        if contact and contact.email:
            email = contact.email.strip().lower()
            if email.endswith(".internal") or email.endswith(".local"):
                return "dyfs2m763cn7s2uz@ethereal.email", True
            return email, True

        return DEFAULT_DEPARTMENT_CONTACTS["CUSTOMER_SERVICE"][1], False

    @classmethod
    def seed_default_contacts(cls, db: Session):
        for dept, (role, email) in DEFAULT_DEPARTMENT_CONTACTS.items():
            exists = db.query(DepartmentContact).filter(DepartmentContact.department == dept).first()
            if not exists:
                contact = DepartmentContact(
                    department=dept,
                    role_name=role,
                    email=email,
                    is_active=True,
                )
                db.add(contact)
        db.commit()

    @classmethod
    def _dispatch_and_persist_notification(
        cls,
        db: Session,
        alert_id: Optional[int],
        customer_order_id: str,
        recipient_email: str,
        recipient_category: str,
        department: str,
        notification_type: str,
        subject: str,
        body_text: str,
    ) -> EmailNotificationLog:
        """
        Creates notification log record, validates address, and dispatches via provider.
        """
        if recipient_email and (recipient_email.endswith(".internal") or recipient_email.endswith(".local") or "@manufacturing" in recipient_email):
            recipient_email = "dyfs2m763cn7s2uz@ethereal.email"

        log = EmailNotificationLog(
            alert_id=alert_id,
            customer_order_id=customer_order_id,
            recipient_email=recipient_email,
            recipient_category=recipient_category,
            department=department,
            notification_type=notification_type,
            subject=subject,
            body_text=body_text,
            status="PENDING_CONFIG",
            retry_count=0,
            created_at=utcnow(),
            last_attempt_at=utcnow(),
        )

        # 1. Validate email syntax
        if not cls.validate_email_address(recipient_email):
            log.status = "FAILED"
            log.failure_reason = f"Recipient email address '{recipient_email}' failed validation check."
            db.add(log)
            db.commit()
            return log

        # 2. Check provider configuration
        provider = cls.get_provider()
        try:
            is_conf = provider.is_configured(recipient_email)
        except TypeError:
            is_conf = provider.is_configured()

        if not is_conf:
            log.status = "PENDING_CONFIG"
            log.failure_reason = "Email provider credentials are not configured in application environment."
            db.add(log)
            db.commit()
            return log

        # 3. Dispatch via provider
        success, err, msg_id = provider.send_email(
            recipient=recipient_email,
            subject=subject,
            body=body_text,
        )

        if success:
            log.status = "SENT"
            log.sent_at = utcnow()
            log.failure_reason = None
            log.provider_message_id = msg_id
        else:
            log.status = "FAILED"
            log.failure_reason = err
            log.retry_count = 1

        db.add(log)
        db.commit()
        return log

    @classmethod
    def dispatch_notifications_async(cls, notifications: List[Dict[str, Any]]):
        """
        Dispatches a list of notifications asynchronously in a background daemon thread
        using a dedicated DB session and reusing the cached SMTP connection.
        """
        if not notifications:
            return

        def _worker():
            db = SessionLocal()
            try:
                for notif in notifications:
                    try:
                        cls._dispatch_and_persist_notification(
                            db=db,
                            alert_id=notif.get("alert_id"),
                            customer_order_id=notif["customer_order_id"],
                            recipient_email=notif["recipient_email"],
                            recipient_category=notif["recipient_category"],
                            department=notif["department"],
                            notification_type=notif["notification_type"],
                            subject=notif["subject"],
                            body_text=notif["body_text"],
                        )
                    except Exception as e:
                        logger.error(f"Error dispatching notification for order {notif.get('customer_order_id')}: {e}")
            finally:
                db.close()

        t = threading.Thread(target=_worker, daemon=True, name="AsyncNotificationDispatcher")
        t.start()

    @classmethod
    def send_operational_risk_notification(
        cls,
        db: Session,
        alert: RiskAlert,
        customer_name: Optional[str] = None,
        product_name: Optional[str] = None,
        product_qty: Optional[int] = None,
        required_date: Optional[str] = None,
        approved_date: Optional[str] = None,
        app_url: str = "http://localhost:5173",
        force_send: bool = False,
    ) -> Optional[EmailNotificationLog]:
        """
        Agent 3 Operational Department Email Notification (Section 5).
        - Notifies responsible operational department of actionable issues delaying orders.
        - Suppresses duplicates for unchanged issues.
        - Triggers escalation if severity increased.
        """
        recipient_email, _ = cls.get_recipient_for_department(db, alert.department)
        order_id = alert.customer_order_id

        # Duplicate / Escalation check against the target recipient
        prev_logs = db.query(EmailNotificationLog).filter(
            EmailNotificationLog.alert_id == alert.id,
            EmailNotificationLog.recipient_category == "OPERATIONAL",
            EmailNotificationLog.status.in_(["SENT", "PENDING_CONFIG"]),
        ).order_by(EmailNotificationLog.created_at.desc()).all()

        notification_type = "ACTION_REQUIRED"
        if prev_logs and not force_send:
            # Check if this specific recipient already received this alert with identical severity
            has_identical = any(
                pl.recipient_email.strip().lower() == recipient_email.strip().lower()
                and (f"[{alert.severity}]" in pl.subject or alert.severity in pl.body_text)
                for pl in prev_logs
            )
            if has_identical:
                # Issue unchanged for this recipient - prevent duplicate email spam
                return None
            else:
                # If this recipient already received an earlier severity, mark as escalation
                has_sent_to_recipient = any(pl.recipient_email.strip().lower() == recipient_email.strip().lower() for pl in prev_logs)
                if has_sent_to_recipient:
                    notification_type = "RISK_ESCALATION"

        # Format Subject per specification: Subject: Action Required – {Issue Category} – Order {Order ID}
        subject_prefix = "Action Required" if notification_type == "ACTION_REQUIRED" else "ESCALATED Action Required"
        subject = f"{subject_prefix} – {alert.title} – Order {order_id}"

        order_link = f"{app_url}/orders/{order_id}"
        issue_link = f"{app_url}/my-work?dept={alert.department}"

        # Determine delay impact type
        impact_type = "Confirmed Delivery Delay" if alert.severity == "CRITICAL" else "Potential Delivery Risk"

        body = f"""MANUFACTURING 360 – OPERATIONAL CORRECTIVE ACTION REQUIRED
================================================================================
Order Number:               {order_id}
Customer Name:              {customer_name or 'Commercial Account'}
Product Model & Quantity:   {product_name or 'N/A'} (Qty: {product_qty or 'N/A'})
Required Delivery Date:     {required_date or 'N/A'}
Approved Committed Date:    {approved_date or 'Awaiting Confirmation'}
Issue Category:             {alert.risk_category}
Responsible Department:     {alert.department}
Risk Severity:              {alert.severity}
Delivery Impact Status:     {impact_type}
Estimated Delivery Impact:  {alert.delivery_impact or 'Under verification'}

ISSUE REASON & EVIDENCE:
{alert.description}

REQUIRED CORRECTIVE ACTION:
{alert.recommended_action or 'Investigate issue in assigned department work center.'}

APPLICATION ACTIONS:
- Inspect Assigned Order: {order_link}
- Review Department Queue: {issue_link}

Notice: The revised delivery date is not confirmed. Do not invent revised dates or schedule promises without verified department evidence.
================================================================================
"""

        return cls._dispatch_and_persist_notification(
            db=db,
            alert_id=alert.id,
            customer_order_id=order_id,
            recipient_email=recipient_email,
            recipient_category="OPERATIONAL",
            department=alert.department,
            notification_type=notification_type,
            subject=subject,
            body_text=body,
        )

    @classmethod
    def send_customer_service_notification(
        cls,
        db: Session,
        alert: RiskAlert,
        customer_name: Optional[str] = None,
        required_date: Optional[str] = None,
        approved_date: Optional[str] = None,
        estimated_achievable_date: Optional[str] = None,
        app_url: str = "http://localhost:5173",
        force_send: bool = False,
    ) -> Optional[EmailNotificationLog]:
        """
        Agent 3 Customer Service Email Notification (Section 6).
        - Independently notifies Customer Service when an issue may affect the customer's delivery date.
        - CS receives delivery-risk notifications; operational receives corrective action notifications.
        """
        cs_email, _ = cls.get_customer_service_recipient(db)
        order_id = alert.customer_order_id

        # Duplicate check against target recipient
        prev_logs = db.query(EmailNotificationLog).filter(
            EmailNotificationLog.alert_id == alert.id,
            EmailNotificationLog.recipient_category == "CUSTOMER_SERVICE",
            EmailNotificationLog.status.in_(["SENT", "PENDING_CONFIG"]),
        ).order_by(EmailNotificationLog.created_at.desc()).all()

        notification_type = "DELIVERY_RISK"
        if prev_logs and not force_send:
            # Check if this specific recipient already received this alert with identical severity
            has_identical = any(
                pl.recipient_email.strip().lower() == cs_email.strip().lower()
                and (f"[{alert.severity}]" in pl.subject or alert.severity in pl.body_text)
                for pl in prev_logs
            )
            if has_identical:
                return None
            else:
                has_sent_to_recipient = any(pl.recipient_email.strip().lower() == cs_email.strip().lower() for pl in prev_logs)
                if has_sent_to_recipient:
                    notification_type = "RISK_ESCALATION"

        subject = f"Delivery Risk Alert – Order {order_id}"
        if notification_type == "RISK_ESCALATION":
            subject = f"ESCALATED Delivery Risk Alert – Order {order_id}"

        order_link = f"{app_url}/orders/{order_id}"
        monitoring_link = f"{app_url}/monitoring?order={order_id}"

        impact_type = "Confirmed Delivery Delay" if alert.severity == "CRITICAL" else "Potential Delivery Risk"

        body = f"""MANUFACTURING 360 – CUSTOMER SERVICE DELIVERY RISK NOTIFICATION
================================================================================
Order Number:               {order_id}
Customer Name:              {customer_name or 'Enterprise Customer'}
Required Delivery Date:     {required_date or 'N/A'}
Approved Committed Date:    {approved_date or 'Pending Human Confirmation'}
Issue Reason:               {alert.title}
Responsible Department:     {alert.department}
Risk Severity:              {alert.severity}
Delivery Impact Status:     {impact_type}
Current Achievable Date:    {estimated_achievable_date or 'Under verification by operations'}

DETAILED RISK SUMMARY:
{alert.description}

ESTIMATED DELIVERY IMPACT:
{alert.delivery_impact or 'Awaiting formal operational review.'}

GOVERNANCE DIRECTIVE:
The revised delivery date has not yet been confirmed. Please monitor this order in Manufacturing 360 and prepare to communicate with the customer once verified delivery information is available.
Do NOT send unverified delivery promises to customers.

APPLICATION ACTIONS:
- Review Order Details: {order_link}
- View Monitoring History: {monitoring_link}
================================================================================
"""

        return cls._dispatch_and_persist_notification(
            db=db,
            alert_id=alert.id,
            customer_order_id=order_id,
            recipient_email=cs_email,
            recipient_category="CUSTOMER_SERVICE",
            department="CUSTOMER_SERVICE",
            notification_type=notification_type,
            subject=subject,
            body_text=body,
        )

    @classmethod
    def build_cs_notification_dict(
        cls,
        alert: RiskAlert,
        customer_name: Optional[str] = None,
        required_date: Optional[str] = None,
        approved_date: Optional[str] = None,
        estimated_achievable_date: Optional[str] = None,
        cs_email: Optional[str] = None,
        notification_type: str = "DELIVERY_RISK",
        app_url: str = "http://localhost:5173",
    ) -> Dict[str, Any]:
        order_id = alert.customer_order_id
        subject = f"Delivery Risk Alert – Order {order_id}"
        if notification_type == "RISK_ESCALATION":
            subject = f"ESCALATED Delivery Risk Alert – Order {order_id}"

        order_link = f"{app_url}/orders/{order_id}"
        monitoring_link = f"{app_url}/monitoring?order={order_id}"
        impact_type = "Confirmed Delivery Delay" if alert.severity == "CRITICAL" else "Potential Delivery Risk"

        body = f"""MANUFACTURING 360 – CUSTOMER SERVICE DELIVERY RISK NOTIFICATION
================================================================================
Order Number:               {order_id}
Customer Name:              {customer_name or 'Enterprise Customer'}
Required Delivery Date:     {required_date or 'N/A'}
Approved Committed Date:    {approved_date or 'Pending Human Confirmation'}
Issue Reason:               {alert.title}
Responsible Department:     {alert.department}
Risk Severity:              {alert.severity}
Delivery Impact Status:     {impact_type}
Current Achievable Date:    {estimated_achievable_date or 'Under verification by operations'}

DETAILED RISK SUMMARY:
{alert.description}

ESTIMATED DELIVERY IMPACT:
{alert.delivery_impact or 'Awaiting formal operational review.'}

GOVERNANCE DIRECTIVE:
The revised delivery date has not yet been confirmed. Please monitor this order in Manufacturing 360 and prepare to communicate with the customer once verified delivery information is available.
Do NOT send unverified delivery promises to customers.

APPLICATION ACTIONS:
- Review Order Details: {order_link}
- View Monitoring History: {monitoring_link}
================================================================================
"""
        return {
            "alert_id": alert.id,
            "customer_order_id": order_id,
            "recipient_email": cs_email or "dyfs2m763cn7s2uz@ethereal.email",
            "recipient_category": "CUSTOMER_SERVICE",
            "department": "CUSTOMER_SERVICE",
            "notification_type": notification_type,
            "subject": subject,
            "body_text": body,
        }

    @classmethod
    def build_op_notification_dict(
        cls,
        alert: RiskAlert,
        customer_name: Optional[str] = None,
        product_name: Optional[str] = None,
        product_qty: Optional[int] = None,
        required_date: Optional[str] = None,
        approved_date: Optional[str] = None,
        op_email: Optional[str] = None,
        notification_type: str = "ACTION_REQUIRED",
        app_url: str = "http://localhost:5173",
    ) -> Dict[str, Any]:
        order_id = alert.customer_order_id
        subject = f"[{alert.department}] Action Required – Delivery Risk on Order {order_id}"
        if notification_type == "RISK_ESCALATION":
            subject = f"[{alert.department}] ESCALATED – Delivery Risk on Order {order_id}"

        order_link = f"{app_url}/orders/{order_id}"
        issue_link = f"{app_url}/monitoring?dept={alert.department}"
        impact_type = "Critical Schedule Breach" if alert.severity == "CRITICAL" else "Schedule Variance Warning"

        body = f"""MANUFACTURING 360 – OPERATIONAL RISK ACTION NOTICE
================================================================================
Order Number:               {order_id}
Customer:                   {customer_name or 'N/A'}
Product:                    {product_name or 'Manufactured Unit'} (Qty: {product_qty or 'N/A'})
Required Delivery Date:     {required_date or 'N/A'}
Approved Target Date:       {approved_date or 'N/A'}

RISK CLASSIFICATION:
Issue Category:             {alert.risk_category}
Responsible Department:     {alert.department}
Risk Severity:              {alert.severity}
Delivery Impact Status:     {impact_type}
Estimated Delivery Impact:  {alert.delivery_impact or 'Under verification'}

ISSUE REASON & EVIDENCE:
{alert.description}

REQUIRED CORRECTIVE ACTION:
{alert.recommended_action or 'Investigate issue in assigned department work center.'}

APPLICATION ACTIONS:
- Inspect Assigned Order: {order_link}
- Review Department Queue: {issue_link}

Notice: The revised delivery date is not confirmed. Do not invent revised dates or schedule promises without verified department evidence.
================================================================================
"""
        return {
            "alert_id": alert.id,
            "customer_order_id": order_id,
            "recipient_email": op_email or "dyfs2m763cn7s2uz@ethereal.email",
            "recipient_category": "OPERATIONAL",
            "department": alert.department,
            "notification_type": notification_type,
            "subject": subject,
            "body_text": body,
        }

    @classmethod
    def send_resolution_notification(
        cls,
        db: Session,
        alert: RiskAlert,
        customer_name: Optional[str] = None,
        resolved_by_name: Optional[str] = None,
        app_url: str = "http://localhost:5173",
    ) -> List[EmailNotificationLog]:
        """
        Notifies both Operational Department and Customer Service when a risk alert is resolved (Rule 4).
        """
        results = []
        order_id = alert.customer_order_id
        subject = f"Resolved – Manufacturing Alert: Order {order_id} – {alert.title}"

        # 1. Operational recipient
        op_email, _ = cls.get_recipient_for_department(db, alert.department)
        op_body = f"""MANUFACTURING 360 – RISK RESOLUTION NOTICE
================================================================================
Order Number:           {order_id}
Resolved Department:    {alert.department}
Risk Category:          {alert.risk_category}
Resolved At:            {alert.resolved_at.strftime('%Y-%m-%d %H:%M:%S UTC') if alert.resolved_at else 'Recent'}
Resolved By:            {resolved_by_name or 'Authorized Department Operator'}

RESOLUTION EVIDENCE & NOTES:
{alert.resolution_notes or 'Corrective actions verified and closed.'}

Application link: {app_url}/orders/{order_id}
================================================================================
"""
        log1 = cls._dispatch_and_persist_notification(
            db=db,
            alert_id=alert.id,
            customer_order_id=order_id,
            recipient_email=op_email,
            recipient_category="OPERATIONAL",
            department=alert.department,
            notification_type="RESOLVED",
            subject=subject,
            body_text=op_body,
        )
        results.append(log1)

        # 2. Customer Service recipient
        cs_email, _ = cls.get_customer_service_recipient(db)
        cs_body = f"""MANUFACTURING 360 – CUSTOMER SERVICE ISSUE RESOLUTION
================================================================================
Order Number:           {order_id}
Customer Name:          {customer_name or 'Enterprise Customer'}
Resolved Issue:         {alert.title}
Department:             {alert.department}
Status:                 RESOLVED

RESOLUTION SUMMARY:
{alert.resolution_notes or 'Department has completed corrective action; order returned to baseline schedule.'}

The operational blocker has been cleared. You may update customer status notes accordingly.
Application link: {app_url}/orders/{order_id}
================================================================================
"""
        log2 = cls._dispatch_and_persist_notification(
            db=db,
            alert_id=alert.id,
            customer_order_id=order_id,
            recipient_email=cs_email,
            recipient_category="CUSTOMER_SERVICE",
            department="CUSTOMER_SERVICE",
            notification_type="RESOLVED",
            subject=subject,
            body_text=cs_body,
        )
        results.append(log2)

        return results

    @classmethod
    def send_followup_notification(
        cls,
        db: Session,
        alert: RiskAlert,
        days_unresolved: int = 3,
        first_email_date: Optional[str] = None,
        customer_name: Optional[str] = None,
        product_name: Optional[str] = None,
        product_qty: Optional[int] = None,
        required_date: Optional[str] = None,
        approved_date: Optional[str] = None,
        app_url: str = "http://localhost:5173",
        force_send: bool = False,
    ) -> List[EmailNotificationLog]:
        """
        Dispatches an automated Agent 3 follow-up email when an operational risk alert
        remains unresolved >= 3 days after the first risk email was sent.
        Notifies the responsible Operational Department and Customer Service with an
        urgent escalation message.
        """
        results = []
        order_id = alert.customer_order_id
        order_link = f"{app_url}/orders/{order_id}"
        issue_link = f"{app_url}/my-work?dept={alert.department}"

        # 1. Operational Department Follow-up
        op_email, _ = cls.get_recipient_for_department(db, alert.department)
        
        # Check de-duplication: don't send repeat follow-up if one was sent in the last 3 days
        skip_op = False
        if not force_send:
            recent_op_followup = db.query(EmailNotificationLog).filter(
                EmailNotificationLog.alert_id == alert.id,
                EmailNotificationLog.recipient_category == "OPERATIONAL",
                EmailNotificationLog.notification_type == "FOLLOW_UP",
                EmailNotificationLog.status.in_(["SENT", "PENDING_CONFIG"]),
            ).order_by(EmailNotificationLog.created_at.desc()).first()
            if recent_op_followup:
                now_dt = utcnow()
                created = recent_op_followup.created_at
                if created.tzinfo is None:
                    created = created.replace(tzinfo=timezone.utc)
                if (now_dt - created).total_seconds() < (3 * 86400):
                    logger.info(f"Skipping operational follow-up for Alert #{alert.id}: follow-up already sent on {created}")
                    skip_op = True

        if not skip_op:
            op_subject = f"[FOLLOW-UP URGENT] Action Required: Unresolved Risk Alert – {alert.title} – Order {order_id} (Day {days_unresolved})"
            op_body = f"""MANUFACTURING 360 – AGENT 3 SURVEILLANCE: 3-DAY FOLLOW-UP NOTICE
================================================================================
URGENCY: 3+ DAYS UNRESOLVED OPERATIONAL RISK ALERT (SLA BREACHED)
--------------------------------------------------------------------------------
Order Number:               {order_id}
Customer Name:              {customer_name or 'Enterprise Customer'}
Product Model & Quantity:   {product_name or 'Manufactured Unit'} (Qty: {product_qty or 'N/A'})
Required Delivery Date:     {required_date or 'N/A'}
Approved Committed Date:    {approved_date or 'Under verification'}
Responsible Department:     {alert.department}
Issue Category:             {alert.risk_category}
Risk Severity:              {alert.severity}
Current Alert Status:       {alert.status} (UNRESOLVED)
Initial Risk Email Sent:    {first_email_date or 'Earlier cycle'} ({days_unresolved} days ago)
Resolution SLA Window:      3 Days (EXPIRED)
--------------------------------------------------------------------------------

SURVEILLANCE FOLLOW-UP DIRECTIVE:
This is an automated follow-up notification dispatched by Agent 3 (Order Surveillance).
The initial risk notification for this order was dispatched to your department on {first_email_date or '3+ days ago'}.
To date ({days_unresolved} days later), verified corrective actions have NOT been recorded,
and this alert remains {alert.status} in Manufacturing 360.

Continued non-resolution of this issue threatens customer delivery milestones,
escalates backlog ageing, and risks contract penalty clauses. Customer Service has been alerted.

DETECTED RISK EVIDENCE:
{alert.description}

DELIVERY IMPACT ASSESSMENT:
{alert.delivery_impact or 'Unresolved operational blocker threatens committed delivery date.'}

RECOMMENDED CORRECTIVE ACTION:
{alert.recommended_action or 'Investigate work center blocker and record corrective action.'}

MANDATORY RESOLUTION WORKFLOW:
1. Access Assigned Order: {order_link}
2. Access Department Work Queue: {issue_link}
3. Once corrective action is verified on the shop floor or ERP, click 'Record Corrective Action & Resolve' in the portal to close this alert and cease automated follow-up surveillance.

Notice: The revised delivery date is not confirmed. Do not invent revised dates or schedule promises without verified department evidence.
================================================================================
"""
            log_op = cls._dispatch_and_persist_notification(
                db=db,
                alert_id=alert.id,
                customer_order_id=order_id,
                recipient_email=op_email,
                recipient_category="OPERATIONAL",
                department=alert.department,
                notification_type="FOLLOW_UP",
                subject=op_subject,
                body_text=op_body,
            )
            results.append(log_op)

        # 2. Customer Service Follow-up
        cs_email, _ = cls.get_customer_service_recipient(db)
        skip_cs = False
        if not force_send:
            recent_cs_followup = db.query(EmailNotificationLog).filter(
                EmailNotificationLog.alert_id == alert.id,
                EmailNotificationLog.recipient_category == "CUSTOMER_SERVICE",
                EmailNotificationLog.notification_type == "FOLLOW_UP",
                EmailNotificationLog.status.in_(["SENT", "PENDING_CONFIG"]),
            ).order_by(EmailNotificationLog.created_at.desc()).first()
            if recent_cs_followup:
                now_dt = utcnow()
                created = recent_cs_followup.created_at
                if created.tzinfo is None:
                    created = created.replace(tzinfo=timezone.utc)
                if (now_dt - created).total_seconds() < (3 * 86400):
                    skip_cs = True

        if not skip_cs:
            cs_subject = f"[FOLLOW-UP] Delivery Risk Reminder: Unresolved Issue – Order {order_id} (Day {days_unresolved})"
            cs_body = f"""MANUFACTURING 360 – CUSTOMER SERVICE RISK ESCALATION FOLLOW-UP
================================================================================
Order Number:               {order_id}
Customer Name:              {customer_name or 'Enterprise Customer'}
Responsible Department:     {alert.department}
Risk Severity:              {alert.severity}
Current Alert Status:       {alert.status} (UNRESOLVED FOR {days_unresolved} DAYS)
Initial Notice Sent:        {first_email_date or 'Earlier cycle'}
Approved Target Date:       {approved_date or 'Under verification'}

EXECUTIVE SUMMARY:
Agent 3 surveillance indicates the operational risk on Order {order_id} has exceeded the 3-day resolution window without department closure.
An automated urgent follow-up directive has been dispatched to {alert.department}.

DETECTED ISSUE:
{alert.title}

ESTIMATED DELIVERY IMPACT:
{alert.delivery_impact or 'Delivery timeline remains under threat until operational blocker is resolved.'}

GOVERNANCE DIRECTIVE:
Do NOT communicate revised dates to the customer without formal operational confirmation.
Monitor order progress in Manufacturing 360 and coordinate with account stakeholders:
{order_link}
================================================================================
"""
            log_cs = cls._dispatch_and_persist_notification(
                db=db,
                alert_id=alert.id,
                customer_order_id=order_id,
                recipient_email=cs_email,
                recipient_category="CUSTOMER_SERVICE",
                department="CUSTOMER_SERVICE",
                notification_type="FOLLOW_UP",
                subject=cs_subject,
                body_text=cs_body,
            )
            results.append(log_cs)

        return results

    @classmethod
    def send_escalation_notification(
        cls,
        db: Session,
        customer_order_id: str,
        reason: str,
        agent_name: str,
        details: Optional[Dict[str, Any]] = None,
    ) -> Optional[EmailNotificationLog]:
        """
        Notify Customer Service contact when an autonomous agent result has
        confidence LOW or fails validation twice, marking the item NEEDS_HUMAN.
        """
        cs_email, _ = cls.get_customer_service_recipient(db)
        app_url = getattr(settings, "cors_origins", "").split(",")[0].strip() or "http://localhost:5173"
        subject = f"[ESCALATION: NEEDS_HUMAN] {agent_name.upper()} Order #{customer_order_id}"
        details_str = json.dumps(details or {}, indent=2, default=str) if details else "None"
        body_text = f"""MANUFACTURING 360 – AUTONOMOUS AGENT ESCALATION (NEEDS_HUMAN)
================================================================================
Order ID:               {customer_order_id}
Escalating Agent:       {agent_name}
Decision:               NEEDS_HUMAN
Reason:                 {reason}

Autonomous actions have been halted on this order commitment.
Customer Service / Account Manager manual review is required to proceed.

CONTEXT & DETAILS:
{details_str}

Review order in workspace: {app_url}/orders/{customer_order_id}
================================================================================
"""
        return cls._dispatch_and_persist_notification(
            db=db,
            alert_id=None,
            customer_order_id=customer_order_id,
            recipient_email=cs_email,
            recipient_category="CUSTOMER_SERVICE",
            department="CUSTOMER_SERVICE",
            notification_type="ACTION_REQUIRED",
            subject=subject,
            body_text=body_text,
        )

    @classmethod
    def send_admin_alert(
        cls,
        db: Session,
        agent_name: str,
        limit_type: str,
        message: str,
    ) -> Optional[EmailNotificationLog]:
        """
        Notify System Administrator when an autonomous agent hits a central
        limit (max LLM calls/hr, max auto-actions/day, max cycle cost) and is paused.
        """
        admin_email = getattr(settings, "admin_email", "admin@manufacturing.com")
        subject = f"[ADMIN ALERT: KILL SWITCH] Agent '{agent_name}' Limit Exceeded ({limit_type})"
        body_text = f"""MANUFACTURING 360 – SYSTEM BOUNDARY ALERT
================================================================================
CRITICAL: Autonomous Agent Governor Limit Breached
Agent:                  {agent_name}
Limit Category:         {limit_type}
Message:                {message}
Action Taken:           Agent '{agent_name}' has been AUTOMATICALLY PAUSED via Kill Switch.
Timestamp:              {utcnow().isoformat()}

Autonomous operations for this agent are currently suspended.
Please review governance metrics in the Agent Control Dashboard and resume when cleared.
================================================================================
"""
        return cls._dispatch_and_persist_notification(
            db=db,
            alert_id=None,
            customer_order_id="SYSTEM",
            recipient_email=admin_email,
            recipient_category="OPERATIONAL",
            department="ADMIN",
            notification_type="ACTION_REQUIRED",
            subject=subject,
            body_text=body_text,
        )

    @classmethod
    def retry_failed_notification(cls, db: Session, log_id: int) -> EmailNotificationLog:
        """
        Retries a single failed or pending-config email notification idempotently.
        """
        log = db.query(EmailNotificationLog).filter(EmailNotificationLog.id == log_id).first()
        if not log:
            raise ValueError(f"Notification log ID {log_id} not found.")

        if log.status == "SENT":
            return log

        log.last_attempt_at = utcnow()
        log.retry_count = (log.retry_count or 0) + 1

        if not cls.validate_email_address(log.recipient_email):
            log.status = "FAILED"
            log.failure_reason = f"Recipient email address '{log.recipient_email}' failed validation check."
            db.commit()
            return log

        provider = cls.get_provider()
        try:
            is_conf = provider.is_configured(log.recipient_email)
        except TypeError:
            is_conf = provider.is_configured()

        if not is_conf:
            log.status = "PENDING_CONFIG"
            log.failure_reason = "Email provider credentials are not configured in application environment."
            db.commit()
            return log

        success, err, msg_id = provider.send_email(
            recipient=log.recipient_email,
            subject=log.subject,
            body=log.body_text,
        )

        if success:
            log.status = "SENT"
            log.sent_at = utcnow()
            log.failure_reason = None
            log.provider_message_id = msg_id
        else:
            log.status = "FAILED"
            log.failure_reason = err

        db.commit()
        db.refresh(log)
        return log

    @classmethod
    def retry_all_failed_notifications(cls, db: Session, max_retries: int = 3) -> Dict[str, Any]:
        """
        Retries all failed or retrying notifications under max retry limit.
        """
        candidates = db.query(EmailNotificationLog).filter(
            EmailNotificationLog.status.in_(["FAILED", "RETRYING"]),
            EmailNotificationLog.retry_count < max_retries,
        ).all()

        succeeded = 0
        failed = 0

        for item in candidates:
            res = cls.retry_failed_notification(db, item.id)
            if res.status == "SENT":
                succeeded += 1
            else:
                failed += 1

        return {
            "total_candidates": len(candidates),
            "succeeded": succeeded,
            "still_failed": failed,
        }
