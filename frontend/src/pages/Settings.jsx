import React, { useState, useEffect } from 'react';
import {
  Save,
  MapPin,
  Building,
  User,
  Mail,
  Phone,
  Clock,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Globe,
  Briefcase,
  Layers,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import '../styles/settings.css';

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata (IST, UTC+5:30)', label: 'Asia/Kolkata (IST, UTC+5:30) — Primary Production Belt' },
  { value: 'Asia/Singapore (SGT, UTC+8:00)', label: 'Asia/Singapore (SGT, UTC+8:00) — APAC Regional Hub' },
  { value: 'Asia/Dubai (GST, UTC+4:00)', label: 'Asia/Dubai (GST, UTC+4:00) — Middle East Hub' },
  { value: 'Europe/London (GMT/BST, UTC+0:00)', label: 'Europe/London (GMT/BST, UTC+0:00)' },
  { value: 'Europe/Frankfurt (CET/CEST, UTC+1:00)', label: 'Europe/Frankfurt (CET/CEST, UTC+1:00)' },
  { value: 'America/New_York (EST/EDT, UTC-5:00)', label: 'America/New_York (EST/EDT, UTC-5:00) — US East' },
  { value: 'America/Chicago (CST/CDT, UTC-6:00)', label: 'America/Chicago (CST/CDT, UTC-6:00) — US Central' },
  { value: 'America/Los_Angeles (PST/PDT, UTC-8:00)', label: 'America/Los_Angeles (PST/PDT, UTC-8:00) — US West' },
  { value: 'UTC (Coordinated Universal Time)', label: 'UTC (Coordinated Universal Time) — Global Standard' }
];

const DEFAULT_PLANTS = [
  {
    plantCode: 'IN-TN-01',
    plantName: 'Chennai Electronics Plant',
    state: 'Tamil Nadu',
    district: 'Sriperumbudur / Kanchipuram',
    lines: 4,
    status: 'Active',
    lead: 'Murugan K (Operations Lead)'
  },
  {
    plantCode: 'IN-KA-01',
    plantName: 'Bengaluru Electronics Plant',
    state: 'Karnataka',
    district: 'Peenya / Whitefield',
    lines: 3,
    status: 'Active',
    lead: 'Sunita Rao (Robotics & R&D Lead)'
  }
];

export default function Settings({ settings, onSaveSettings }) {
  const [formData, setFormData] = useState(() => ({
    adminName: settings?.adminName || 'Operations Director',
    adminRole: settings?.adminRole || 'Executive Operations Lead',
    email: settings?.email || 'admin@gwcdata.ai',
    phone: settings?.phone || '+91 98400 12345',
    companyName: settings?.companyName || 'Motherson Group (GWC Industrial Automation Division)',
    headquarters: settings?.headquarters || 'Chennai, Tamil Nadu, India',
    timeZone: settings?.timeZone || 'Asia/Kolkata (IST, UTC+5:30)',
    districtCoverage:
      settings?.districtCoverage && settings.districtCoverage.length > 0
        ? settings.districtCoverage.map((p) => ({
            ...p,
            status: p.status || 'Active'
          }))
        : DEFAULT_PLANTS,
    ...settings
  }));

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modal State for Quick Add / Edit Facility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null means adding new
  const [modalForm, setModalForm] = useState({
    plantCode: '',
    plantName: '',
    state: '',
    district: '',
    lines: 2,
    status: 'Active',
    lead: ''
  });

  // Keep formData synced if external settings prop updates
  useEffect(() => {
    if (settings) {
      setFormData((prev) => ({
        ...prev,
        ...settings,
        districtCoverage:
          settings.districtCoverage && settings.districtCoverage.length > 0
            ? settings.districtCoverage.map((p) => ({
                ...p,
                status: p.status || 'Active'
              }))
            : prev.districtCoverage || DEFAULT_PLANTS
      }));
    }
  }, [settings]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleOpenAddModal = () => {
    const nextCode = `IN-PLANT-${String((formData.districtCoverage || []).length + 1).padStart(2, '0')}`;
    setModalForm({
      plantCode: nextCode,
      plantName: '',
      state: 'Tamil Nadu',
      district: '',
      lines: 2,
      status: 'Active',
      lead: ''
    });
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plant, index) => {
    setModalForm({
      plantCode: plant.plantCode || `PLANT-${index + 1}`,
      plantName: plant.plantName || '',
      state: plant.state || '',
      district: plant.district || '',
      lines: plant.lines || 2,
      status: plant.status || 'Active',
      lead: plant.lead || ''
    });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!modalForm.plantName.trim()) return;

    const currentPlants = [...(formData.districtCoverage || [])];

    if (editingIndex !== null && editingIndex >= 0) {
      // Update existing facility
      currentPlants[editingIndex] = {
        ...currentPlants[editingIndex],
        ...modalForm
      };
    } else {
      // Add new facility
      currentPlants.push({
        ...modalForm,
        activeAgents: 19
      });
    }

    setFormData((prev) => ({ ...prev, districtCoverage: currentPlants }));
    setIsModalOpen(false);
  };

  const handleTogglePlantStatus = (index) => {
    const currentPlants = [...(formData.districtCoverage || [])];
    const currentStatus = currentPlants[index].status || 'Active';
    currentPlants[index] = {
      ...currentPlants[index],
      status: currentStatus === 'Active' ? 'Inactive' : 'Active'
    };
    setFormData((prev) => ({ ...prev, districtCoverage: currentPlants }));
  };

  const handleRemovePlant = (index) => {
    const currentPlants = (formData.districtCoverage || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, districtCoverage: currentPlants }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSaveSettings) {
      onSaveSettings(formData);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="content-scroll settings-page-container">
      {/* Top Banner Header */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(111, 61, 186, 0.08), rgba(49, 183, 195, 0.08))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div className="settings-section-badge">
            Executive Master Administration (Module 20)
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
            Multi-State Enterprise Profile & Plant Operations
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '640px' }}>
            Manage executive account profile credentials, organization time zones, and operational manufacturing facilities.
          </p>
        </div>

        <button className="btn-primary" onClick={handleSubmit}>
          <Save size={16} /> Save Admin Settings
        </button>
      </div>

      {saveSuccess && (
        <div
          style={{
            padding: '14px 20px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--status-success)',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle2 size={18} />
          <span>Account, organization, and plant facility settings saved successfully!</span>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 1: ACCOUNT & ORGANIZATION PROFILE                      */}
      {/* ============================================================= */}
      <div className="card">
        <div className="card-header" style={{ marginBottom: '14px' }}>
          <div>
            <div className="card-title" style={{ gap: '8px' }}>
              <User size={18} style={{ color: 'var(--brand-purple)' }} />
              Account & Organization Profile
            </div>
            <p className="card-subtitle">
              Manage personal identity, corporate designation, headquarters, and operational time zone.
            </p>
          </div>
        </div>

        <div className="settings-profile-grid">
          {/* Sub-Group A: User Profile */}
          <div
            style={{
              padding: '20px',
              borderRadius: '14px',
              background: 'var(--kg-bg-2)',
              border: '1px solid rgba(var(--line-rgb), 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(var(--line-rgb), 0.08)', paddingBottom: '10px' }}>
              <Briefcase size={16} style={{ color: 'var(--brand-purple)' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                User Profile
              </h3>
            </div>

            {/* Name */}
            <div className="settings-form-group">
              <label className="settings-input-label">
                <User size={13} /> Full Name
              </label>
              <input
                type="text"
                value={formData.adminName || ''}
                onChange={(e) => handleChange('adminName', e.target.value)}
                placeholder="e.g. Operations Director"
                className="settings-input"
              />
            </div>

            {/* Role / Designation */}
            <div className="settings-form-group">
              <label className="settings-input-label">
                <Briefcase size={13} /> Role / Corporate Designation
              </label>
              <input
                type="text"
                value={formData.adminRole || ''}
                onChange={(e) => handleChange('adminRole', e.target.value)}
                placeholder="e.g. Executive Plant Operations Lead"
                className="settings-input"
              />
            </div>

            {/* Work Email */}
            <div className="settings-form-group">
              <label className="settings-input-label">
                <Mail size={13} /> Work Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g. director@gwcdata.ai"
                className="settings-input"
              />
            </div>

            {/* Contact Number */}
            <div className="settings-form-group">
              <label className="settings-input-label">
                <Phone size={13} /> Contact Number
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. +91 98400 12345"
                className="settings-input"
              />
            </div>
          </div>

          {/* Sub-Group B: Organization Info */}
          <div
            style={{
              padding: '20px',
              borderRadius: '14px',
              background: 'var(--kg-bg-2)',
              border: '1px solid rgba(var(--line-rgb), 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(var(--line-rgb), 0.08)', paddingBottom: '10px' }}>
              <Building size={16} style={{ color: 'var(--brand-blue)' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Organization Info
              </h3>
            </div>

            {/* Company Name */}
            <div className="settings-form-group">
              <label className="settings-input-label">
                <Building size={13} /> Company Name
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="e.g. Motherson Group"
                className="settings-input"
              />
            </div>

            {/* Headquarters Location */}
            <div className="settings-form-group">
              <label className="settings-input-label">
                <MapPin size={13} /> Headquarters Location
              </label>
              <input
                type="text"
                value={formData.headquarters || ''}
                onChange={(e) => handleChange('headquarters', e.target.value)}
                placeholder="e.g. Chennai, Tamil Nadu, India"
                className="settings-input"
              />
            </div>

            {/* Time Zone */}
            <div className="settings-form-group">
              <label className="settings-input-label">
                <Clock size={13} /> Time Zone
              </label>
              <select
                value={formData.timeZone || 'Asia/Kolkata (IST, UTC+5:30)'}
                onChange={(e) => handleChange('timeZone', e.target.value)}
                className="settings-input"
                style={{ cursor: 'pointer' }}
              >
                {TIMEZONE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="settings-helper-text">
                <Clock size={12} />
                <span>Essential for timestamp alignment across plants/shifts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* SECTION 2: PLANT & FACILITY MANAGEMENT                        */}
      {/* ============================================================= */}
      <div className="card">
        {/* Header and Toolbar */}
        <div className="settings-facility-toolbar">
          <div>
            <div className="card-title" style={{ gap: '8px' }}>
              <MapPin size={18} style={{ color: 'var(--brand-blue)' }} />
              Plant & Facility Management
            </div>
            <p className="card-subtitle">
              Active Locations / Hubs across industrial manufacturing corridors.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Add Facility Button -> Opens Modal */}
            <button
              type="button"
              className="btn-primary"
              onClick={handleOpenAddModal}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={15} />
              <span>Add New Plant Facility</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {(!formData.districtCoverage || formData.districtCoverage.length === 0) && (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              borderRadius: '12px',
              background: 'var(--kg-bg-2)',
              border: '1px dashed rgba(var(--line-rgb), 0.2)',
              color: 'var(--text-muted)'
            }}
          >
            <MapPin size={32} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
            <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              No Plant Facilities Registered
            </h4>
            <p style={{ fontSize: '12.5px', margin: '0 0 16px 0' }}>
              Add manufacturing sites to govern shift telemetry and production line telemetry.
            </p>
            <button type="button" className="btn-primary" onClick={handleOpenAddModal}>
              <Plus size={14} /> Add First Facility
            </button>
          </div>
        )}

        {/* Facility Management: Table List View (Default) */}
        {formData.districtCoverage && formData.districtCoverage.length > 0 && (
          <div className="facilities-table-wrapper">
            <table className="facilities-table">
              <thead>
                <tr>
                  <th>Plant Facility</th>
                  <th>Location (State / District)</th>
                  <th>Assigned Lines</th>
                  <th>Operational Status</th>
                  <th>Lead / Head</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.districtCoverage.map((plant, idx) => {
                  const isActive = plant.status !== 'Inactive';
                  return (
                    <tr key={plant.plantCode || idx}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 700, fontSize: '13.5px' }}>
                            {plant.plantName}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--brand-purple)', fontWeight: 600 }}>
                            {plant.plantCode}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <MapPin size={13} style={{ color: 'var(--brand-blue)', flexShrink: 0 }} />
                          <span>
                            {plant.district ? `${plant.district}, ` : ''}{plant.state || 'India'}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Layers size={13} style={{ color: 'var(--text-muted)' }} />
                          <span style={{ fontWeight: 600 }}>{plant.lines || 2} Lines</span>
                        </div>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={isActive ? 'status-badge-active' : 'status-badge-inactive'}
                          onClick={() => handleTogglePlantStatus(idx)}
                          title={`Click to switch status to ${isActive ? 'Inactive' : 'Active'}`}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: isActive ? '#10b981' : '#94a3b8'
                            }}
                          />
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      <td>
                        <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          {plant.lead || 'Murugan K'}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            type="button"
                            className="facility-action-btn"
                            onClick={() => handleOpenEditModal(plant, idx)}
                            title="Edit facility parameters"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            className="facility-action-btn delete"
                            onClick={() => handleRemovePlant(idx)}
                            title="Remove facility"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================= */}
      {/* QUICK ADD / EDIT FACILITY MODAL DIALOG                        */}
      {/* ============================================================= */}
      {isModalOpen && (
        <div className="settings-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="settings-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="facility-modal-title"
          >
            {/* Modal Header */}
            <div className="settings-modal-header">
              <div>
                <h3 id="facility-modal-title" className="settings-modal-title">
                  {editingIndex !== null ? 'Edit Plant Facility' : 'Add New Plant Facility'}
                </h3>
                <p className="settings-modal-subtitle">
                  Configure operational parameters, state corridor, assigned lines, and status.
                </p>
              </div>
              <button
                type="button"
                className="facility-action-btn"
                onClick={() => setIsModalOpen(false)}
                title="Close modal (Esc)"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveModal}>
              <div className="settings-modal-body">
                {/* Plant Name & Code */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <div className="settings-form-group">
                    <label className="settings-input-label">Plant Facility Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chennai SMT Expansion Unit"
                      value={modalForm.plantName}
                      onChange={(e) => setModalForm({ ...modalForm, plantName: e.target.value })}
                      className="settings-input"
                      autoFocus
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-input-label">Plant Code</label>
                    <input
                      type="text"
                      placeholder="e.g. IN-TN-02"
                      value={modalForm.plantCode}
                      onChange={(e) => setModalForm({ ...modalForm, plantCode: e.target.value })}
                      className="settings-input"
                    />
                  </div>
                </div>

                {/* State & District */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="settings-form-group">
                    <label className="settings-input-label">State / Region *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tamil Nadu, Karnataka"
                      value={modalForm.state}
                      onChange={(e) => setModalForm({ ...modalForm, state: e.target.value })}
                      className="settings-input"
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-input-label">District / Industrial Belt</label>
                    <input
                      type="text"
                      placeholder="e.g. Sriperumbudur Industrial Area"
                      value={modalForm.district}
                      onChange={(e) => setModalForm({ ...modalForm, district: e.target.value })}
                      className="settings-input"
                    />
                  </div>
                </div>

                {/* Assigned Lines & Operational Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="settings-form-group">
                    <label className="settings-input-label">Assigned Line Count</label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={modalForm.lines}
                      onChange={(e) => setModalForm({ ...modalForm, lines: Number(e.target.value) || 1 })}
                      className="settings-input"
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-input-label">Operational Status</label>
                    <select
                      value={modalForm.status}
                      onChange={(e) => setModalForm({ ...modalForm, status: e.target.value })}
                      className="settings-input"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="Active">● Active (Online & Monitored)</option>
                      <option value="Inactive">○ Inactive (Maintenance / Standby)</option>
                    </select>
                  </div>
                </div>

                {/* Facility Lead */}
                <div className="settings-form-group">
                  <label className="settings-input-label">Facility General Manager / Lead</label>
                  <input
                    type="text"
                    placeholder="e.g. Murugan K"
                    value={modalForm.lead}
                    onChange={(e) => setModalForm({ ...modalForm, lead: e.target.value })}
                    className="settings-input"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="settings-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={15} />
                  <span>{editingIndex !== null ? 'Update Facility' : 'Save Facility'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
