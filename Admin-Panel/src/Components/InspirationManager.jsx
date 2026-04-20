import React, { useState } from 'react';
import Layout from './Layout.jsx';
import Modal from './Modal.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useData } from '../Context/DataContext.jsx';

function ImagesEditor({ images, onChange }) {
  const [newUrl, setNewUrl] = useState('');

  const addImg = () => {
    if (newUrl.trim()) {
      onChange([...images, newUrl.trim()]);
      setNewUrl('');
    }
  };

  const removeImg = (i) => onChange(images.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="form-label">Images</label>
      <div className="images-tag-list">
        {images.map((url, i) => (
          <div key={i} className="img-tag" title={url}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{url}</span>
            <button onClick={() => removeImg(i)}>✕</button>
          </div>
        ))}
      </div>
      <div className="add-image-row">
        <input
          className="form-input"
          placeholder="Add image URL..."
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImg(); } }}
        />
        <button className="btn-edit" onClick={addImg}>+ Add</button>
      </div>
    </div>
  );
}

const EMPTY = { name: '', images: [] };

export default function InspirationManager() {
  const { inspiration, addInspiration, updateInspiration, deleteInspiration } = useData();
  const [modal, setModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // null | idx
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm(EMPTY); setModal({ mode: 'add' }); };
  const openEdit = (idx) => { setForm({ ...inspiration[idx] }); setModal({ mode: 'edit', idx }); };
  const close = () => setModal(null);

  const handleSave = () => {
    if (modal.mode === 'add') addInspiration(form);
    else updateInspiration(modal.idx, form);
    close();
  };

  const handleDelete = (idx) => setConfirmDelete(idx);
  const handleConfirmDelete = () => {
    deleteInspiration(confirmDelete);
    setConfirmDelete(null);
  };

  return (
    <Layout title="Inspiration">
      <div className="page-header">
        <div>
          <h1>Inspiration <span className="count-badge">{inspiration.length}</span></h1>
          <p>Manage room inspiration categories and their image galleries</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Section</button>
      </div>

      <div className="gallery-grid">
        {inspiration.map((item, idx) => (
          <div key={idx} className="gallery-card">
            {item.images?.[0] && (
              <img src={item.images[0]} alt={item.name} className="gallery-card-img"
                onError={e => { e.target.style.display = 'none'; }} />
            )}
            {!item.images?.[0] && (
              <div className="gallery-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a', color: '#333', fontSize: '32px' }}>
                🏠
              </div>
            )}
            <div className="gallery-card-body">
              <div>
                <h4>{item.name}</h4>
                <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{item.images?.length || 0} images</div>
              </div>
              <div className="actions-cell">
                <button className="btn-edit" onClick={() => openEdit(idx)}>✏️</button>
                <button className="btn-danger" onClick={() => handleDelete(idx)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}

        {inspiration.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="empty-icon">✨</div>
            <p>No inspiration sections yet</p>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.mode === 'add' ? 'Add Inspiration Section' : 'Edit Inspiration Section'}
          onClose={close}
          footer={
            <>
              <button className="btn-secondary" onClick={close}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save</button>
            </>
          }
        >
          <div className="form-grid cols-1" style={{ gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Section Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Living Room"
              />
            </div>
            <ImagesEditor
              images={form.images || []}
              onChange={imgs => setForm(f => ({ ...f, images: imgs }))}
            />
          </div>
        </Modal>
      )}

      {confirmDelete !== null && (
        <ConfirmDialog
          message={`Are you sure you want to delete the inspiration section "${inspiration[confirmDelete]?.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </Layout>
  );
}
