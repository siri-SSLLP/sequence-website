import React, { useState } from 'react';
import Layout from './Layout.jsx';
import Modal from './Modal.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useData } from '../Context/DataContext.jsx';

export default function CategoryIconManager() {
  const { categoryIcons, updateCategoryIcons } = useData();
  const [modal, setModal] = useState(null); // null | { mode: 'add'|'edit', key }
  const [confirmDelete, setConfirmDelete] = useState(null); // null | key
  const [keyField, setKeyField] = useState('');
  const [urlField, setUrlField] = useState('');

  const entries = Object.entries(categoryIcons || {});

  const openAdd = () => {
    setKeyField('');
    setUrlField('');
    setModal({ mode: 'add' });
  };

  const openEdit = (key) => {
    setKeyField(key);
    setUrlField(categoryIcons[key] || '');
    setModal({ mode: 'edit', key });
  };

  const handleSave = () => {
    const updated = { ...categoryIcons };
    if (modal.mode === 'edit' && modal.key !== keyField) {
      delete updated[modal.key];
    }
    updated[keyField] = urlField;
    updateCategoryIcons(updated);
    setModal(null);
  };

  const handleDelete = (key) => setConfirmDelete(key);
  const handleConfirmDelete = () => {
    const updated = { ...categoryIcons };
    delete updated[confirmDelete];
    updateCategoryIcons(updated);
    setConfirmDelete(null);
  };

  const isImgUrl = (url) => typeof url === 'string' && url.startsWith('http');

  return (
    <Layout title="Category Icons">
      <div className="page-header">
        <div>
          <h1>Category Icons <span className="count-badge">{entries.length}</span></h1>
          <p>Manage the key → image URL mapping for category icons</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Icon</button>
      </div>

      <div className="icon-grid">
        {entries.map(([key, val]) => (
          <div key={key} className="icon-card">
            {isImgUrl(val) ? (
              <img src={val} alt={key} className="icon-preview" onError={e => { e.target.style.display='none'; }} />
            ) : (
              <div className="icon-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                🖼️
              </div>
            )}
            <div className="icon-info">
              <div className="icon-key">{key}</div>
              <div className="icon-url">{typeof val === 'string' ? val : '[imported asset]'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
              <button className="btn-edit" style={{ fontSize: '11px', padding: '5px 10px' }} onClick={() => openEdit(key)}>
                ✏️
              </button>
              <button className="btn-danger" style={{ fontSize: '11px', padding: '5px 10px' }} onClick={() => handleDelete(key)}>
                🗑️
              </button>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="empty-icon">🖼️</div>
            <p>No category icons configured</p>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.mode === 'add' ? 'Add Category Icon' : 'Edit Category Icon'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save</button>
            </>
          }
        >
          <div className="form-grid cols-1">
            <div className="form-group">
              <label className="form-label">Category Key</label>
              <input
                className="form-input"
                value={keyField}
                onChange={e => setKeyField(e.target.value)}
                placeholder="e.g. Decorative Laminates"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                className="form-input"
                value={urlField}
                onChange={e => setUrlField(e.target.value)}
                placeholder="https://..."
              />
            </div>
            {urlField && urlField.startsWith('http') && (
              <div className="form-group">
                <label className="form-label">Preview</label>
                <img
                  src={urlField}
                  alt="preview"
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #2a2a2a' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`Are you sure you want to delete the icon mapping for "${confirmDelete}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </Layout>
  );
}
