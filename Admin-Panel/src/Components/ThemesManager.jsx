import React, { useState } from 'react';
import Layout from './Layout.jsx';
import Modal from './Modal.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useData } from '../Context/DataContext.jsx';

const EMPTY = { name: '', image: '' };

export default function ThemesManager() {
  const { themes, addTheme, updateTheme, deleteTheme } = useData();
  const [modal, setModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // null | idx
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm(EMPTY); setModal({ mode: 'add' }); };
  const openEdit = (idx) => { setForm({ ...themes[idx] }); setModal({ mode: 'edit', idx }); };
  const close = () => setModal(null);

  const handleSave = () => {
    if (modal.mode === 'add') addTheme(form);
    else updateTheme(modal.idx, form);
    close();
  };

  const handleDelete = (idx) => setConfirmDelete(idx);
  const handleConfirmDelete = () => {
    deleteTheme(confirmDelete);
    setConfirmDelete(null);
  };

  return (
    <Layout title="Explore Themes">
      <div className="page-header">
        <div>
          <h1>Explore Themes <span className="count-badge">{themes.length}</span></h1>
          <p>Manage the explore themes section displayed on the site</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Theme</button>
      </div>

      <div className="gallery-grid">
        {themes.map((item, idx) => (
          <div key={idx} className="gallery-card">
            <img
              src={item.image}
              alt={item.name}
              className="gallery-card-img"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="gallery-card-body">
              <h4>{item.name}</h4>
              <div className="actions-cell">
                <button className="btn-edit" onClick={() => openEdit(idx)}>✏️</button>
                <button className="btn-danger" onClick={() => handleDelete(idx)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
        {themes.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="empty-icon">🎨</div>
            <p>No themes yet</p>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.mode === 'add' ? 'Add Theme' : 'Edit Theme'}
          onClose={close}
          footer={
            <>
              <button className="btn-secondary" onClick={close}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save</button>
            </>
          }
        >
          <div className="form-grid cols-1" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Theme Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Modern Kitchen"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                className="form-input"
                value={form.image}
                onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            {form.image && form.image.startsWith('http') && (
              <div className="form-group">
                <label className="form-label">Preview</label>
                <img
                  src={form.image}
                  alt="preview"
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #2a2a2a' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        </Modal>
      )}

      {confirmDelete !== null && (
        <ConfirmDialog
          message={`Are you sure you want to delete the theme "${themes[confirmDelete]?.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </Layout>
  );
}
