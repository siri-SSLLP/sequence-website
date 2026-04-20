import React, { useState } from 'react';
import Layout from './Layout.jsx';
import Modal from './Modal.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useData } from '../Context/DataContext.jsx';

function SubcategoryRow({ sub, onEdit, onDelete }) {
  return (
    <div className="subcategory-item">
      <div>
        <span className="td-strong" style={{ fontSize: '13px' }}>{sub.name}</span>
        <span style={{ color: '#444', fontSize: '11px', marginLeft: '10px' }}>ID: {sub.id}</span>
      </div>
      <div className="actions-cell">
        <button className="btn-edit"   onClick={onEdit}>✏️</button>
        <button className="btn-danger" onClick={onDelete}>🗑️</button>
      </div>
    </div>
  );
}

export default function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [expanded, setExpanded]     = useState(null);
  const [modal, setModal]           = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [form, setForm]       = useState({ id: '', main: '', iconUrl: '', subcategories: [] });
  const [subForm, setSubForm] = useState({ id: '', name: '' });

  const toggleExpand = (i) => setExpanded(prev => prev === i ? null : i);

  // ── Category CRUD ──
  const openAddCat = () => {
    let max = 0;
    categories.forEach(c => {
      if (c.id && String(c.id).startsWith('PC')) {
        const num = parseInt(String(c.id).replace('PC', ''), 10);
        if (!isNaN(num) && num > max) max = num;
      }
    });
    const newId = `PC${String(max + 1).padStart(3, '0')}`;
    setForm({ id: newId, main: '', iconUrl: '', subcategories: [] });
    setModal({ type: 'cat', mode: 'add' });
  };

  const openEditCat = (idx) => {
    setForm({ iconUrl: '', ...categories[idx] });
    setModal({ type: 'cat', mode: 'edit', catIdx: idx });
  };

  const handleSaveCat = () => {
    if (modal.mode === 'add') addCategory(form);
    else updateCategory(modal.catIdx, form);
    setModal(null);
  };

  const handleDeleteCat = (idx) => setConfirmDelete({ type: 'cat', catIdx: idx });

  // ── Subcategory CRUD ──
  const openAddSub = (catIdx) => {
    let max = 0;
    categories.forEach(c => {
      (c.subcategories || []).forEach(sub => {
        if (sub.id && String(sub.id).startsWith('CC')) {
          const num = parseInt(String(sub.id).replace('CC', ''), 10);
          if (!isNaN(num) && num > max) max = num;
        }
      });
    });
    const newId = `CC${max > 0 ? max + 1 : 101}`;
    setSubForm({ id: newId, name: '' });
    setModal({ type: 'sub', mode: 'add', catIdx });
  };

  const openEditSub = (catIdx, subIdx) => {
    setSubForm({ ...categories[catIdx].subcategories[subIdx] });
    setModal({ type: 'sub', mode: 'edit', catIdx, subIdx });
  };

  const handleSaveSub = () => {
    const cat  = { ...categories[modal.catIdx] };
    const subs = [...(cat.subcategories || [])];
    if (modal.mode === 'add') subs.push(subForm);
    else subs[modal.subIdx] = subForm;
    cat.subcategories = subs;
    updateCategory(modal.catIdx, cat);
    setModal(null);
  };

  const handleDeleteSub = (catIdx, subIdx) => setConfirmDelete({ type: 'sub', catIdx, subIdx });

  return (
    <Layout title="Categories">
      <div className="page-header">
        <div>
          <h1>Categories <span className="count-badge">{categories.length}</span></h1>
          <p>Manage parent categories, their subcategories, and category icons</p>
        </div>
        <button className="btn-primary" onClick={openAddCat}>+ Add Category</button>
      </div>

      <div className="category-list">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="category-item">
            <div className="category-item-header" onClick={() => toggleExpand(catIdx)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Icon thumbnail */}
                {cat.iconUrl ? (
                  <img
                    src={cat.iconUrl}
                    alt={cat.main}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#111', flexShrink: 0 }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '18px' }}>📂</span>
                  </div>
                )}
                <div>
                  <h4 style={{ margin: 0 }}>{cat.main}</h4>
                  <div className="cat-meta">ID: {cat.id} · {cat.subcategories?.length || 0} subcategories</div>
                </div>
              </div>
              <div className="actions-cell" onClick={e => e.stopPropagation()}>
                <button className="btn-edit"   onClick={() => openEditCat(catIdx)}>✏️ Edit</button>
                <button className="btn-danger" onClick={() => handleDeleteCat(catIdx)}>🗑️</button>
                <span style={{ color: '#555', fontSize: '16px', cursor: 'pointer' }}>
                  {expanded === catIdx ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {expanded === catIdx && (
              <div className="category-item-body">
                {/* Icon URL preview inside body */}
                {cat.iconUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', padding: '10px 12px', background: '#0e0e0e', borderRadius: '8px', border: '1px solid #1e1e1e' }}>
                    <img src={cat.iconUrl} alt="icon" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }} onError={e => { e.target.style.display = 'none'; }} />
                    <div>
                      <div style={{ fontSize: '11px', color: '#555', marginBottom: '2px' }}>Category Icon URL</div>
                      <div style={{ fontSize: '12px', color: '#888', wordBreak: 'break-all', maxWidth: '480px' }}>{cat.iconUrl}</div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                  <button className="btn-primary" style={{ fontSize: '12px', padding: '7px 14px' }} onClick={() => openAddSub(catIdx)}>
                    + Add Subcategory
                  </button>
                </div>

                {(cat.subcategories || []).length === 0 && (
                  <div style={{ color: '#444', fontSize: '13px', textAlign: 'center', padding: '16px' }}>No subcategories yet</div>
                )}

                <div className="subcategory-list">
                  {(cat.subcategories || []).map((sub, subIdx) => (
                    <SubcategoryRow
                      key={subIdx}
                      sub={sub}
                      onEdit={() => openEditSub(catIdx, subIdx)}
                      onDelete={() => handleDeleteSub(catIdx, subIdx)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Category Modal ── */}
      {modal?.type === 'cat' && (
        <Modal
          title={modal.mode === 'add' ? 'Add Category' : 'Edit Category'}
          onClose={() => setModal(null)}
          footer={<>
            <button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn-primary"   onClick={handleSaveCat}>Save</button>
          </>}
        >
          <div className="form-grid cols-1">
            <div className="form-group">
              <label className="form-label">Category ID</label>
              <input className="form-input" value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Category Name (Main)</label>
              <input className="form-input" value={form.main} onChange={e => setForm(f => ({ ...f, main: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Category Icon URL</label>
              <input className="form-input" placeholder="https://…" value={form.iconUrl || ''} onChange={e => setForm(f => ({ ...f, iconUrl: e.target.value }))} />
              {form.iconUrl && (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={form.iconUrl} alt="preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0e0e0e' }} onError={e => { e.target.style.display = 'none'; }} />
                  <span style={{ fontSize: '12px', color: '#555' }}>Icon preview</span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ── Subcategory Modal ── */}
      {modal?.type === 'sub' && (
        <Modal
          title={modal.mode === 'add' ? 'Add Subcategory' : 'Edit Subcategory'}
          onClose={() => setModal(null)}
          footer={<>
            <button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn-primary"   onClick={handleSaveSub}>Save</button>
          </>}
        >
          <div className="form-grid cols-1">
            <div className="form-group">
              <label className="form-label">Subcategory ID</label>
              <input className="form-input" value={subForm.id} onChange={e => setSubForm(f => ({ ...f, id: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Subcategory Name</label>
              <input className="form-input" value={subForm.name} onChange={e => setSubForm(f => ({ ...f, name: e.target.value }))} />
            </div>
          </div>
        </Modal>
      )}

      {/* ── Confirm Delete ── */}
      {confirmDelete && (
        <ConfirmDialog
          message={
            confirmDelete.type === 'cat'
              ? 'Delete this category and all its subcategories? This cannot be undone.'
              : 'Delete this subcategory? This cannot be undone.'
          }
          onConfirm={() => {
            if (confirmDelete.type === 'cat') {
              deleteCategory(confirmDelete.catIdx);
            } else {
              const cat = { ...categories[confirmDelete.catIdx] };
              cat.subcategories = cat.subcategories.filter((_, i) => i !== confirmDelete.subIdx);
              updateCategory(confirmDelete.catIdx, cat);
            }
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </Layout>
  );
}
