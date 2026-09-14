import React, { useState, useEffect } from 'react';
import { 
  X, 
  KeyRound, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Trash2, 
  RefreshCw 
} from 'lucide-react';
import { 
  getStoredApiKey, 
  setStoredApiKey, 
  clearStoredApiKey, 
  testApiKey 
} from '../services/pexelsApi';

export const ApiKeyModal = ({
  isOpen,
  onClose,
  onKeyUpdated
}) => {
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    if (!apiKey.trim()) {
      clearStoredApiKey();
      setStatusMessage({ type: 'success', text: 'API key cleared. Using curated 4K & Mobile wallpaper library.' });
      onKeyUpdated();
      return;
    }

    setTesting(true);
    setStatusMessage(null);

    const res = await testApiKey(apiKey);
    setTesting(false);

    if (res.success) {
      setStoredApiKey(apiKey);
      setStatusMessage({ type: 'success', text: 'Success! Connected to Pexels Live API.' });
      onKeyUpdated();
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleClear = () => {
    clearStoredApiKey();
    setApiKey('');
    setStatusMessage({ type: 'success', text: 'API key removed. Running in offline/curated mode.' });
    onKeyUpdated();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '560px', padding: '28px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div className="brand-icon-wrap" style={{ width: '42px', height: '42px' }}>
            <KeyRound size={22} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#ffffff', margin: 0 }}>
              Pexels API Configuration
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Unlock millions of live 4K and mobile wallpapers
            </span>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '20px' }}>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
            Lumina is 100% functional out-of-the-box with built-in curated 4K & AMOLED wallpapers. To search the entire Pexels library live in real-time, enter your free API key below.
          </p>
          <div style={{ marginTop: '8px' }}>
            <a
              href="https://www.pexels.com/api/new/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--primary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none'
              }}
            >
              <span>Get a free API key at pexels.com</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Pexels API Authorization Key
          </label>
          <input
            type="password"
            className="search-input"
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem'
            }}
            placeholder="Paste your 56-character API key here..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        {/* Status Feedback */}
        {statusMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '18px',
              fontSize: '0.84rem',
              background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: statusMessage.type === 'success' ? '#10b981' : '#ef4444'
            }}
          >
            {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: '10px' }}>
          {getStoredApiKey() && (
            <button
              className="btn-secondary"
              onClick={handleClear}
              style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
            >
              <Trash2 size={15} />
              <span>Clear Key</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              className="btn-primary"
              onClick={handleTestAndSave}
              disabled={testing}
            >
              {testing ? (
                <>
                  <RefreshCw size={16} className="spin-animate" />
                  <span>Validating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Save & Connect</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
