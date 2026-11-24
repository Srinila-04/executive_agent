import os
import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from contextlib import contextmanager

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

DATABASE_URL = os.getenv("DATABASE_URL")

# Initialize Threaded Connection Pool
db_pool = None
if DATABASE_URL:
    try:
        db_pool = pool.ThreadedConnectionPool(
            minconn=2,
            maxconn=20,
            dsn=DATABASE_URL,
            sslmode="require"
        )
        print("[FASTAPI DB] Connected to Neon PostgreSQL pool successfully.")
    except Exception as e:
        print(f"[FASTAPI DB] Warning: Could not connect to Neon DB: {e}")

@contextmanager
def get_db():
    """Context manager for obtaining a database connection from the pool with automatic dead connection pruning."""
    if not db_pool:
        raise Exception("Database connection pool not initialized. Check DATABASE_URL in .env")
    conn = db_pool.getconn()
    is_closed = False
    try:
        if conn.closed:
            try:
                db_pool.putconn(conn, close=True)
            except Exception:
                pass
            conn = db_pool.getconn()
        yield conn
    except Exception as e:
        if "closed" in str(e).lower() or conn.closed:
            is_closed = True
        else:
            try:
                conn.rollback()
            except Exception:
                is_closed = True
        raise
    finally:
        if is_closed or conn.closed:
            try:
                db_pool.putconn(conn, close=True)
            except Exception:
                pass
        else:
            try:
                conn.rollback()
                db_pool.putconn(conn)
            except Exception:
                try:
                    db_pool.putconn(conn, close=True)
                except Exception:
                    pass

def query_all(sql: str, params: tuple = None) -> list:
    """Execute SQL query and return rows as list of dictionaries."""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql, params or ())
            rows = cur.fetchall()
            conn.commit()
            return [dict(r) for r in rows]

def query_one(sql: str, params: tuple = None) -> dict | None:
    """Execute SQL query and return single row as dictionary."""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql, params or ())
            row = cur.fetchone()
            conn.commit()
            return dict(row) if row else None

def execute_stmt(sql: str, params: tuple = None):
    """Execute INSERT/UPDATE/DELETE statement and commit."""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql, params or ())
            conn.commit()
            if "RETURNING" in sql.upper():
                row = cur.fetchone()
                return dict(row) if row else None
            return cur.rowcount
