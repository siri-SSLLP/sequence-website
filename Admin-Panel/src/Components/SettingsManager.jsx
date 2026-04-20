import React, { useState } from 'react';
import Layout from './Layout.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useData } from '../Context/DataContext.jsx';

export default function SettingsManager() {
  const { settings, updateSettings } = useData();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Layout title="Settings">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage contact numbers and default messages</p>
        </div>
      </div>

      <div className="settings-card">
        <h2>📞 Contact Configuration</h2>

        <form onSubmit={handleSave}>
          <div className="form-grid cols-1" style={{ gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Call Number</label>
              <input
                id="settings-callNumber"
                className="form-input"
                type="tel"
                value={form.callNumber || ''}
                onChange={e => set('callNumber', e.target.value)}
                placeholder="+91XXXXXXXXXX"
              />
              <span className="form-hint">Used for call-to-action links (tel: href)</span>
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp Number</label>
              <input
                id="settings-whatsapp"
                className="form-input"
                type="tel"
                value={form.WhatsappNumber || ''}
                onChange={e => set('WhatsappNumber', e.target.value)}
                placeholder="+91XXXXXXXXXX"
              />
              <span className="form-hint">Used for WhatsApp chat links</span>
            </div>

            <div className="form-group">
              <label className="form-label">Default WhatsApp Message</label>
              <textarea
                id="settings-message"
                className="form-textarea"
                value={form.Message || ''}
                onChange={e => set('Message', e.target.value)}
                placeholder="Hello, I am interested in your products..."
                rows={4}
              />
              <span className="form-hint">Pre-filled message when users click the WhatsApp button</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button className="btn-primary" type="submit">
                💾 Save Settings
              </button>
              {saved && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', background: '#1a3d1a',
                  border: '1px solid #66cc6633', borderRadius: '8px',
                  fontSize: '13px', color: '#66cc66', fontWeight: '600'
                }}>
                  ✅ Saved successfully!
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <div style={{ marginTop: '20px' }}>
        <div className="settings-card">
          <h2>🗄️ Data Management</h2>
          <p style={{ color: '#555', fontSize: '13px', marginBottom: '20px' }}>
            All data is stored in your browser's localStorage. Use these options to manage it.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn-secondary"
              onClick={() => {
                const keys = ['admin_products','admin_newLaunches','admin_categories',
                  'admin_categoryIcons','admin_inspiration','admin_trending','admin_themes','admin_settings'];
                const data = {};
                keys.forEach(k => { try { data[k] = JSON.parse(localStorage.getItem(k)); } catch {} });
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'sequence_admin_backup.json';
                a.click();
              }}
            >
              📤 Export Data (JSON)
            </button>
            <button
              className="btn-danger"
              onClick={() => setConfirmReset(true)}
            >
              🔄 Reset to Original Data
            </button>
          </div>
        </div>
      </div>

      {confirmReset && (
        <ConfirmDialog
          message="⚠️ This will clear ALL admin data (products, categories, etc.) from localStorage and reload with original assets.js data. This action cannot be undone."
          onConfirm={() => {
            ['admin_products','admin_newLaunches','admin_categories','admin_categoryIcons',
             'admin_inspiration','admin_trending','admin_themes','admin_settings']
              .forEach(k => localStorage.removeItem(k));
            window.location.reload();
          }}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </Layout>
  );
}
