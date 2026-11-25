import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, ExternalLink, Check, Trash2, ArrowRight } from 'lucide-react';
import '../../styles/teammateLightform.css';

/**
 * Temporary Lightform Modal / Card for registering teammate agent URLs.
 * Modeled directly on the "Create Extra Dashboard Card" studio layout in Light Mode.
 * Positions strictly at the top-right corner of the Home page.
 */
export default function TeammateLightform({
  sectors = [],
  customUrls = {},
  onSaveUrl,
  onRemoveUrl,
  onSelectAgent,
  onLaunchApp,
  visible = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  // Flatten all 19 agents across all sectors
  const allAgents = useMemo(() => {
    const list = [];
    sectors.forEach((sec) => {
      sec.agents?.forEach((ag) => {
        list.push({
          id: ag.id,
          name: ag.name,
          shortName: ag.shortName || ag.name,
          sectorId: sec.id,
          sectorName: sec.name,
          accentColor: sec.accentColor || '#8b5cf6',
          existingUrl: customUrls[ag.id] || ag.appUrl || ''
        });
      });
    });
    return list;
  }, [sectors, customUrls]);

  // Set default selected agent once agents are loaded
  useEffect(() => {
    if (!selectedAgentId && allAgents.length > 0) {
      setSelectedAgentId(allAgents[0].id);
    }
  }, [allAgents, selectedAgentId]);

  // Selected agent object
  const currentAgent = useMemo(() => {
    return allAgents.find((a) => a.id === selectedAgentId) || allAgents[0] || null;
  }, [allAgents, selectedAgentId]);

  // Pre-fill URL input when switching selected agent
  useEffect(() => {
    if (currentAgent) {
      const existing = customUrls[currentAgent.id] || currentAgent.existingUrl || '';
      setUrlInput(existing);
      setSuccessInfo(null);
    }
  }, [selectedAgentId, customUrls, currentAgent]);

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentAgent || !urlInput.trim()) return;

    let cleanUrl = urlInput.trim();
    // Auto-prepend http:// if localhost or https:// otherwise if protocol missing
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      if (cleanUrl.startsWith('localhost') || cleanUrl.startsWith('127.0.0.1')) {
        cleanUrl = 'http://' + cleanUrl;
      } else {
        cleanUrl = 'https://' + cleanUrl;
      }
    }

    onSaveUrl?.(currentAgent.id, cleanUrl);
    setSuccessInfo({
      agentName: currentAgent.name,
      agentId: currentAgent.id,
      sectorId: currentAgent.sectorId,
      url: cleanUrl
    });

    // Automatically open the teammate UI as requested
    onLaunchApp?.(cleanUrl, currentAgent.name);
  };

  // Handle Remove / Reset URL
  const handleRemove = () => {
    if (!currentAgent) return;
    onRemoveUrl?.(currentAgent.id);
    setUrlInput('');
    setSuccessInfo(null);
  };

  const linkedCount = Object.keys(customUrls).length;

  if (!visible) return null;

  return (
    <div className="teammate-lightform-container">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          // Minimized Floating Pill Button in Top-Right
          <motion.button
            key="toggle-btn"
            className="teammate-lightform-toggle-btn"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            title="Open Teammate URL Registration Form"
          >
            <span className="teammate-toggle-dot" />
            <Link2 size={14} />
            <span>+ Link Teammate URL</span>
            {linkedCount > 0 && (
              <span className="teammate-toggle-badge">{linkedCount} linked</span>
            )}
          </motion.button>
        ) : (
          // Full Lightform Card (Matches layout from reference image in Light Mode)
          <motion.div
            key="modal-card"
            className="teammate-lightform-card"
            initial={{ opacity: 0, scale: 0.92, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header: Eyebrow + Title + Close Button */}
            <div className="teammate-card-header">
              <div>
                <div className="teammate-eyebrow">EXTRA CARD STUDIO</div>
                <h3 className="teammate-card-title">Register Teammate Agent URL</h3>
              </div>
              <button
                className="teammate-close-btn"
                onClick={() => setIsOpen(false)}
                title="Minimize Form"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            {/* Success Feedback Notification */}
            {successInfo && (
              <div className="teammate-success-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} />
                  <span>Stored in <strong>{successInfo.agentName}</strong>!</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    className="teammate-open-ui-btn"
                    onClick={() => {
                      onLaunchApp?.(successInfo.url, successInfo.agentName);
                    }}
                    title="Open Teammate application view"
                  >
                    <ExternalLink size={12} />
                    <span>Open UI</span>
                  </button>
                  <button
                    type="button"
                    className="teammate-view-node-btn"
                    onClick={() => {
                      onSelectAgent?.(successInfo.agentId, successInfo.sectorId);
                    }}
                    title="Open this agent node and inspect its live button"
                  >
                    View Node →
                  </button>
                </div>
              </div>
            )}

            {/* Main Form */}
            <form className="teammate-card-form" onSubmit={handleSubmit}>
              {/* Row 1: Agent Selection + Accent Color Swatch */}
              <div className="teammate-top-field-row">
                <div className="teammate-field-group">
                  <label className="teammate-field-label">
                    Card Title / Agent Node <span className="teammate-req-star">*</span>
                  </label>
                  <select
                    className="teammate-select"
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                  >
                    {sectors.map((sec) => (
                      <optgroup key={sec.id} label={sec.name}>
                        {sec.agents?.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            {ag.name} {customUrls[ag.id] ? '● (URL Linked)' : ''}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="teammate-field-group">
                  <label className="teammate-field-label">Accent Color</label>
                  <div className="teammate-accent-swatch-box">
                    <div
                      className="teammate-swatch-chip"
                      style={{ backgroundColor: currentAgent?.accentColor || '#8b5cf6' }}
                    />
                    <span className="teammate-swatch-hex">
                      {currentAgent?.accentColor || '#8b5cf6'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Eyebrow/Category + Subtitle/Header */}
              <div className="teammate-two-col-row">
                <div className="teammate-field-group">
                  <label className="teammate-field-label">
                    Eyebrow / Category <span className="teammate-req-star">*</span>
                  </label>
                  <div className="teammate-readonly-field" title={currentAgent?.sectorName}>
                    {currentAgent?.sectorName || 'Manufacturing'}
                  </div>
                </div>

                <div className="teammate-field-group">
                  <label className="teammate-field-label">
                    Subtitle / Header <span className="teammate-req-star">*</span>
                  </label>
                  <div className="teammate-readonly-field" title={currentAgent?.shortName}>
                    {currentAgent?.shortName || 'Agent Node'}
                  </div>
                </div>
              </div>

              {/* Row 3: Card Description / Teammate Notes */}
              <div className="teammate-field-group">
                <label className="teammate-field-label">Card Description / Teammate Note</label>
                <textarea
                  className="teammate-textarea"
                  placeholder="e.g. Deployed on Vercel by teammate, tracking live plant telemetry..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Row 4: URL Input (Proxy ID format from screenshot) */}
              <div className="teammate-field-group">
                <label className="teammate-field-label">
                  Teammate App URL <span className="teammate-req-star">*</span>
                </label>
                <div className="teammate-url-input-wrapper">
                  <div className="teammate-url-icon-box">
                    <Link2 size={15} />
                  </div>
                  <input
                    type="text"
                    className="teammate-input"
                    placeholder="https://customer-order-management-two.vercel.app/monitoring"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    required
                  />
                </div>
                <div className="teammate-helper-caption">
                  Paste the full URL (e.g. https://... or localhost:300X). We'll automatically route and store it in this node.
                </div>
              </div>

              {/* Active Linked Nodes Quick Pills (if any) */}
              {linkedCount > 0 && (
                <div className="teammate-field-group">
                  <label className="teammate-field-label">Active Linked Nodes ({linkedCount})</label>
                  <div className="teammate-active-links-strip">
                    {Object.keys(customUrls).map((id) => {
                      const match = allAgents.find((a) => a.id === id);
                      if (!match) return null;
                      const isSel = match.id === selectedAgentId;
                      return (
                        <button
                          key={id}
                          type="button"
                          className={`teammate-active-pill ${isSel ? 'selected' : ''}`}
                          onClick={() => setSelectedAgentId(match.id)}
                          title={`Click to view or edit URL for ${match.name}`}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: match.accentColor
                            }}
                          />
                          <span>{match.shortName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="teammate-card-actions">
                {customUrls[currentAgent?.id] && (
                  <button
                    type="button"
                    className="teammate-btn-remove"
                    onClick={handleRemove}
                    title="Remove custom URL from this node"
                  >
                    <Trash2 size={12} style={{ display: 'inline', marginRight: 4 }} />
                    Clear URL
                  </button>
                )}

                <button
                  type="button"
                  className="teammate-btn-cancel"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>

                {urlInput.trim() && (
                  <button
                    type="button"
                    className="teammate-btn-launch-now"
                    onClick={() => {
                      let cleanUrl = urlInput.trim();
                      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
                        if (cleanUrl.startsWith('localhost') || cleanUrl.startsWith('127.0.0.1')) {
                          cleanUrl = 'http://' + cleanUrl;
                        } else {
                          cleanUrl = 'https://' + cleanUrl;
                        }
                      }
                      onSaveUrl?.(currentAgent?.id, cleanUrl);
                      onLaunchApp?.(cleanUrl, currentAgent?.name || 'Teammate System App');
                    }}
                    title="Launch teammate application now"
                  >
                    <ExternalLink size={13} />
                    <span>Open UI Now</span>
                  </button>
                )}

                <button
                  type="submit"
                  className="teammate-btn-submit"
                  disabled={!urlInput.trim()}
                  title="Save URL and open teammate application"
                >
                  <ExternalLink size={14} />
                  <span>Link & Open Teammate UI</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
