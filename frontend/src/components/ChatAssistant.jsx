import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Minimize2,
  Maximize2,
  CornerDownLeft
} from 'lucide-react';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "👋 Welcome! I am your **Human-Friendly Operations Advisor**.\n\nI translate complex shopfloor metrics into plain English, track live data across all 6 sectors, and guide you to any feature in the system. How can I help you today?",
      quickSuggestions: [
        'Explain OEE in simple terms',
        'Where can I find Bulk Upload?',
        'How do I enter manual shift data?',
        'Show Employees & Workforce status',
        'Compare Chennai & Bengaluru plants'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setInput('');
    const userMsg = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          quickSuggestions: data.quickSuggestions || []
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "⚠️ Unable to reach the operational backend. Please ensure the local backend server is running on port 5000.",
          quickSuggestions: ['Retry', 'Check System Health']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          className="chat-fab"
          onClick={() => setIsOpen(true)}
          title="Open Executive Operations Advisor"
        >
          <div className="chat-fab-avatar">
            <Bot size={17} />
          </div>
          <span>Operations Advisor</span>
          <span className="pulse-dot" style={{ background: '#34d399' }} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-title">
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'var(--brand-purple)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700 }}>
                  Executive Operations Advisor
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                  Enterprise Operations Console
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="chat-header-badge">Online</span>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="chat-messages">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${m.role === 'user' ? 'user' : 'bot'}`}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    opacity: 0.8
                  }}
                >
                  {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  <span>{m.role === 'user' ? 'Admin' : 'Operations Advisor'}</span>
                </div>
                <div
                  style={{ whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{
                    __html: m.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }}
                />
                {m.quickSuggestions && m.quickSuggestions.length > 0 && (
                  <div className="chat-quick-actions">
                    {m.quickSuggestions.map((sug, sIdx) => (
                      <span
                        key={sIdx}
                        className="chat-chip"
                        onClick={() => handleSend(sug)}
                      >
                        {sug}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble bot" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pulse-dot" />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Analyzing platform graph and live telemetry...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div className="chat-composer">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask anything about plants, operational modules, architecture..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              autoFocus
            />
            <button
              className="chat-send-btn"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              title="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
