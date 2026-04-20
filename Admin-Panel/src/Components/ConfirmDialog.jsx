import React from 'react';

/**
 * ConfirmDialog — a styled in-app confirmation dialog to replace window.confirm().
 * Props:
 *   message: string
 *   onConfirm: () => void
 *   onCancel: () => void
 *   danger?: boolean  (makes confirm button red instead of gold)
 */
export default function ConfirmDialog({ message, onConfirm, onCancel, danger = true }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="modal-box"
        style={{ maxWidth: '400px' }}
      >
        <div className="modal-header">
          <h3>{danger ? '⚠️ Confirm Delete' : '❓ Confirm Action'}</h3>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
          <p style={{ fontSize: '14px', color: '#cccccc', lineHeight: '1.6' }}>
            {message}
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: danger ? '#cc3333' : '#ebc76c',
              color: danger ? '#ffffff' : '#0a0a0a',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {danger ? '🗑️ Delete' : '✅ Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
