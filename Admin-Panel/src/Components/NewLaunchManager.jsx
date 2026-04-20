import React, { useState, useRef, useEffect } from 'react';
import Layout from './Layout.jsx';
import Modal from './Modal.jsx';
import ImageUrlInput from './ImageUrlInput.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useData } from '../Context/DataContext.jsx';
import { downloadSampleExcel, parseProductsExcel } from './excelUtils.js';
import {
  materialCompositionOptions,
  applicationsOptions,
  whereToUseOptions,
} from '../assets/assets.js';

// ─── EMPTY template (same shape as products) ──────────────────────────────────
const EMPTY = {
  dateCreated: new Date().toISOString().slice(0, 10),
  dateUpdated: new Date().toISOString().slice(0, 10),
  parentCategory: { id: '', name: '' },
  childCategory:  { id: '', name: '' },
  productId:      '',
  productName:    '',
  productCode:    '',
  hsnCode:        '4412',
  gst:            18,
  brand:          'Sequence Surface',
  color:          '',
  colorTone:      '',
  size:           '8ft x 4ft',
  unit:           'Sheet',
  netWeight:      '',
  status:         'Active',
  description:    '',
  mrpPrice:       0,
  displayMRP:     0,
  imageUrl:       '',
  finishTexture:  '',
  finishType:     'Matte',
  materialComposition: [],
  whereToUse:     [],
  tags:           [],
  applications:   [],
  area:           '32 sq ft',
  height:         '8 ft',
  width:          '4 ft',
  orientation:    'Horizontal',
  descriptionShort: '',
  images:         [],
  saleType:       'Retail',
  stock:          0,
  mrpDiscount:    0,
  styleFit:       '',
  date:           new Date().toISOString().slice(0, 10),
};

function arrToStr(arr) { return Array.isArray(arr) ? arr.join(', ') : (arr || ''); }
function strToArr(s)   { return String(s).split(',').map(x => x.trim()).filter(Boolean); }

// ─── MultiSelectDropdown (identical to ProductsManager) ──────────────────────
function MultiSelectDropdown({ label, options: baseOptions, value = [], onChange, hint }) {
  const [open, setOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [allOptions, setAllOptions] = useState(baseOptions);
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (opt) => {
    const next = value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt];
    onChange(next);
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!allOptions.includes(trimmed)) setAllOptions(prev => [...prev, trimmed]);
    if (!value.includes(trimmed)) onChange([...value, trimmed]);
    setCustomInput('');
  };

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <label className="form-label">{label}{hint && <span className="form-hint"> — {hint}</span>}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '38px', padding: '6px 10px', background: '#0e0e0e', border: '1px solid #2a2a2a', borderRadius: '8px', cursor: 'pointer', alignItems: 'center' }}
        onClick={() => setOpen(o => !o)}>
        {value.length === 0 && <span style={{ color: '#444', fontSize: '13px' }}>Select {label}…</span>}
        {value.map(v => (
          <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#ebc76c22', border: '1px solid #ebc76c66', color: '#ebc76c', borderRadius: '999px', padding: '2px 10px 2px 12px', fontSize: '12px', fontWeight: 600 }}>
            {v}
            <span style={{ cursor: 'pointer', fontSize: '14px', lineHeight: 1, color: '#ebc76c99' }} onClick={e => { e.stopPropagation(); toggle(v); }}>×</span>
          </span>
        ))}
        <span style={{ marginLeft: 'auto', color: '#555', fontSize: '12px' }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 9999, background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.7)', maxHeight: '240px', overflowY: 'auto' }}>
          {allOptions.map(opt => (
            <div key={opt} onClick={() => toggle(opt)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px', cursor: 'pointer', background: value.includes(opt) ? '#ebc76c11' : 'transparent', borderBottom: '1px solid #1e1e1e', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#ebc76c18'}
              onMouseLeave={e => e.currentTarget.style.background = value.includes(opt) ? '#ebc76c11' : 'transparent'}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0, border: value.includes(opt) ? '2px solid #ebc76c' : '2px solid #333', background: value.includes(opt) ? '#ebc76c' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {value.includes(opt) && <span style={{ color: '#111', fontSize: '10px', fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ fontSize: '13px', color: value.includes(opt) ? '#ebc76c' : '#ccc' }}>{opt}</span>
            </div>
          ))}
          <div style={{ padding: '8px 10px', borderTop: '1px solid #2a2a2a', display: 'flex', gap: '6px' }}>
            <input className="form-input" style={{ flex: 1, fontSize: '12px', padding: '5px 10px', height: '32px' }} placeholder="Add custom…"
              value={customInput} onChange={e => setCustomInput(e.target.value)} onClick={e => e.stopPropagation()}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }} />
            <button type="button" className="btn-edit" style={{ fontSize: '12px', padding: '5px 12px' }} onClick={e => { e.stopPropagation(); addCustom(); }}>+ Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, icon }) {
  return (
    <div className="form-group span-2" style={{ borderBottom: '1px solid #ebc76c22', paddingBottom: '6px', marginBottom: '4px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <span style={{ color: '#ebc76c', fontWeight: 700, fontSize: '13px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{title}</span>
    </div>
  );
}

function SystemBadge({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ fontSize: '11px', color: '#555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      <span style={{ background: '#0e0e0e', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '7px 12px', fontSize: '13px', color: '#888', fontFamily: 'monospace' }}>{value || '—'}</span>
    </div>
  );
}

// ─── Launch Form ──────────────────────────────────────────────────────────────
function LaunchForm({ initial, onSave, onCancel, isEdit, categories }) {
  const [form, setForm] = useState(() => {
    const base = { ...EMPTY, ...initial };
    const normaliseArr = (v) => Array.isArray(v) ? v : strToArr(v);
    return {
      ...base,
      parentCategoryId:   base.parentCategory?.id   || '',
      parentCategoryName: base.parentCategory?.name || '',
      childCategoryId:    base.childCategory?.id    || '',
      childCategoryName:  base.childCategory?.name  || '',
      tagsStr:            arrToStr(base.tags),
      materialComposition: normaliseArr(base.materialComposition),
      whereToUse:          normaliseArr(base.whereToUse),
      applications:        normaliseArr(base.applications),
      images: Array.isArray(base.images) ? [...base.images] : [],
    };
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleParentChange = (parentName) => {
    const cat = categories.find(c => c.main === parentName);
    setForm(f => ({ ...f, parentCategoryName: parentName, parentCategoryId: cat ? cat.id : '', childCategoryName: '', childCategoryId: '' }));
  };

  const handleChildChange = (childName) => {
    const cat = categories.find(c => c.main === form.parentCategoryName);
    const sub = cat?.subcategories?.find(s => s.name === childName);
    setForm(f => ({ ...f, childCategoryName: childName, childCategoryId: sub ? sub.id : '' }));
  };

  const childOptions = (categories.find(c => c.main === form.parentCategoryName)?.subcategories || []);

  const handleSave = () => {
    const now = new Date().toISOString().slice(0, 10);
    const product = {
      ...form,
      parentCategory: { id: form.parentCategoryId, name: form.parentCategoryName },
      childCategory:  { id: form.childCategoryId,  name: form.childCategoryName  },
      tags:           strToArr(form.tagsStr),
      dateUpdated:    now,
      dateCreated:    form.dateCreated || now,
      date:           form.dateCreated || now,
      gst:            Number(form.gst),
      stock:          Number(form.stock),
      mrpPrice:       Number(form.mrpPrice),
      mrpDiscount:    Number(form.mrpDiscount),
      displayMRP:     Number(form.displayMRP),
    };
    ['parentCategoryId','parentCategoryName','childCategoryId','childCategoryName','tagsStr'].forEach(k => delete product[k]);
    onSave(product);
  };

  const FI = ({ label, fKey, type = 'text', hint, span }) => (
    <div className={`form-group${span ? ' span-2' : ''}`}>
      <label className="form-label">{label}</label>
      {type === 'textarea'
        ? <textarea className="form-textarea" value={form[fKey] ?? ''} onChange={e => set(fKey, e.target.value)} />
        : <input className="form-input" type={type} value={form[fKey] ?? ''} onChange={e => set(fKey, e.target.value)} />}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );

  const FSel = ({ label, fKey, opts, span }) => (
    <div className={`form-group${span ? ' span-2' : ''}`}>
      <label className="form-label">{label}</label>
      <select className="form-select" value={form[fKey] ?? ''} onChange={e => set(fKey, e.target.value)}>
        <option value="">— Select —</option>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="form-grid">
      {/* ── System Info ── */}
      <SectionHeader title="System Info" icon="🔐" />
      <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <SystemBadge label="Product ID"    value={form.productId} />
        <SystemBadge label="Product Code"  value={form.productCode} />
      </div>
      <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <SystemBadge label="Date Created"  value={form.dateCreated} />
        <SystemBadge label="Date Updated"  value={form.dateUpdated} />
      </div>
      <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <SystemBadge label="Brand"         value={form.brand} />
        <SystemBadge label="GST %"         value={`${form.gst}%`} />
      </div>
      <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <SystemBadge label="Parent Cat. ID" value={form.parentCategoryId} />
        <SystemBadge label="Child Cat. ID"  value={form.childCategoryId} />
      </div>

      {isEdit && (
        <>
          <SectionHeader title="Edit System Fields" icon="✏️" />
          <FI label="Product ID"    fKey="productId" />
          <FI label="Product Code"  fKey="productCode" />
          <FI label="Brand"         fKey="brand" />
          <FI label="GST %"         fKey="gst"  type="number" />
          <FI label="Date Created"  fKey="dateCreated" type="date" />
          <FI label="Date Updated"  fKey="dateUpdated" type="date" />
        </>
      )}

      <SectionHeader title="Basic Info" icon="📋" />
      <FI label="Product Name" fKey="productName" span />
      <FSel label="Status" fKey="status" opts={['Active', 'Inactive']} />
      <FI label="HSN Code" fKey="hsnCode" />

      <SectionHeader title="Category" icon="📂" />
      <div className="form-group">
        <label className="form-label">Parent Category Name</label>
        <select className="form-select" value={form.parentCategoryName} onChange={e => handleParentChange(e.target.value)}>
          <option value="">— Select Parent Category —</option>
          {categories.map(c => <option key={c.id} value={c.main}>{c.main}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Child Category Name</label>
        <select className="form-select" value={form.childCategoryName} onChange={e => handleChildChange(e.target.value)} disabled={!form.parentCategoryName}>
          <option value="">— Select Child Category —</option>
          {childOptions.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
      </div>

      <SectionHeader title="Physical Properties" icon="⚖️" />
      <FI label="Color"           fKey="color" />
      <FI label="Color Tone"      fKey="colorTone" />
      <FI label="Size"            fKey="size" />
      <FI label="Unit"            fKey="unit" />
      <FI label="Net Weight"      fKey="netWeight" />
      <FI label="MRP Price (₹)"   fKey="mrpPrice"   type="number" />
      <FI label="Display MRP (₹)" fKey="displayMRP" type="number" />

      <SectionHeader title="Finish & Material" icon="🎨" />
      <FI label="Finish Texture" fKey="finishTexture" />
      <FSel label="Finish Type" fKey="finishType" opts={['Matte', 'Gloss', 'High Gloss', 'Satin', 'Suede']} />
      <div className="form-group span-2">
        <MultiSelectDropdown label="Material Composition" options={materialCompositionOptions} value={form.materialComposition} onChange={v => set('materialComposition', v)} />
      </div>

      <SectionHeader title="Dimensions & Orientation" icon="📐" />
      <FI label="Area"   fKey="area" />
      <FI label="Height" fKey="height" />
      <FI label="Width"  fKey="width" />
      <FSel label="Orientation" fKey="orientation" opts={['Horizontal', 'Vertical', 'Both']} />

      <SectionHeader title="Descriptions" icon="📝" />
      <FI label="Short Description" fKey="descriptionShort" span />
      <FI label="Full Description"  fKey="description" type="textarea" span />

      <SectionHeader title="Media" icon="🖼️" />
      <FI label="Main Image URL" fKey="imageUrl" span />
      <div className="form-group span-2">
        <ImageUrlInput label="Gallery Images" images={form.images} onChange={imgs => set('images', imgs)} />
      </div>

      <SectionHeader title="Tags & Usage" icon="🏷️" />
      <FI label="Tags" fKey="tagsStr" span hint="Comma-separated (e.g. marble, premium, new)" />
      <div className="form-group span-2">
        <MultiSelectDropdown label="Applications" options={applicationsOptions} value={form.applications} onChange={v => set('applications', v)} />
      </div>
      <div className="form-group span-2">
        <MultiSelectDropdown label="Where To Use" options={whereToUseOptions} value={form.whereToUse} onChange={v => set('whereToUse', v)} />
      </div>

      <div className="form-group span-2" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
        <button className="btn-secondary" type="button" onClick={onCancel}>Cancel</button>
        <button className="btn-primary"   type="button" onClick={handleSave}>💾 Save Product</button>
      </div>
    </div>
  );
}

// ─── Pick from Products Modal ─────────────────────────────────────────────────
function PickProductModal({ products, onPick, onClose }) {
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    (p.productName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.productId   || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.color       || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.parentCategory?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal title="🚀 Pick Product for New Launch" onClose={onClose}
      footer={<button className="btn-secondary" onClick={onClose}>Cancel</button>}>
      <div style={{ marginBottom: '14px' }}>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>
          Select a product from your catalogue. All its fields will be copied into a new launch entry with a fresh ID.
        </p>
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ maxHeight: '420px', overflowY: 'auto', borderRadius: '8px', border: '1px solid #1e1e1e' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#555' }}>No products match your search.</div>
        )}
        {filtered.map((p, i) => (
          <div key={p.productId || i}
            onClick={() => onPick(p)}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '12px 16px', borderBottom: '1px solid #1a1a1a',
              cursor: 'pointer', transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#ebc76c0a'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <img
              src={p.imageUrl || p.images?.[0]}
              alt={p.productName}
              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', background: '#111', flexShrink: 0 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#f0f0f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.productName}</div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                {p.productId} · {p.parentCategory?.name} › {p.childCategory?.name}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '13px', color: '#ebc76c', fontWeight: 700 }}>₹{p.mrpPrice}</div>
              <div style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>{p.color}</div>
            </div>
            <span className={`badge ${p.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>{p.status}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '12px', color: '#444', marginTop: '10px', textAlign: 'center' }}>
        Showing {filtered.length} of {products.length} products
      </div>
    </Modal>
  );
}

// ─── Bulk Upload Modal ────────────────────────────────────────────────────────
function BulkUploadModal({ onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f); setError(''); setLoading(true);
    try { setPreview(await parseProductsExcel(f)); }
    catch (err) { setError('Failed to parse file: ' + err.message); setPreview(null); }
    finally { setLoading(false); }
  };

  const handleImport = () => {
    if (preview && preview.length > 0) { onImport(preview); onClose(); }
  };

  return (
    <Modal title="📥 Bulk New Launch Upload" onClose={onClose}
      footer={<>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={handleImport} disabled={!preview || preview.length === 0}>✅ Import {preview ? preview.length : 0} Products</button>
      </>}>
      <div style={{ background: '#0e0e0e', border: '1px solid #ebc76c22', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#f0f0f0', marginBottom: '4px' }}>Step 1: Download the Template</div>
          <div style={{ fontSize: '12px', color: '#555' }}>Same template as Products — reuse it.</div>
        </div>
        <button className="btn-edit" onClick={downloadSampleExcel} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>📄 Download Template</button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#f0f0f0', marginBottom: '12px' }}>Step 2: Upload Filled Excel</div>
        <div style={{ border: '2px dashed #ebc76c44', borderRadius: '10px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: '#0e0e0e' }}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile({ target: { files: [f] } }); }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>📊</div>
          <div style={{ color: '#888', fontSize: '14px' }}>
            {file ? <span style={{ color: '#ebc76c', fontWeight: 600 }}>✓ {file.name}</span>
              : <>Click or drag &amp; drop your Excel file<br /><span style={{ fontSize: '12px', color: '#444' }}>.xlsx or .xls accepted</span></>}
          </div>
        </div>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleFile} />
      </div>

      {loading && <div style={{ textAlign: 'center', color: '#888', padding: '16px' }}><span className="spinner" style={{ borderTopColor: '#ebc76c', borderColor: '#ebc76c22' }} /> <span style={{ marginLeft: '10px' }}>Parsing…</span></div>}
      {error && <div style={{ background: '#ff333318', border: '1px solid #ff333333', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#ff6666' }}>⚠️ {error}</div>}
      {preview && preview.length > 0 && (
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#ebc76c', marginBottom: '10px' }}>✅ {preview.length} product{preview.length > 1 ? 's' : ''} ready — Preview:</div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', borderRadius: '8px', border: '1px solid #1e1e1e' }}>
            <table className="data-table" style={{ fontSize: '12px' }}>
              <thead><tr><th>#</th><th>Product ID</th><th>Name</th><th>Color</th><th>Stock</th><th>MRP</th></tr></thead>
              <tbody>
                {preview.map((p, i) => <tr key={i}><td style={{ color: '#555' }}>{i + 1}</td><td>{p.productId}</td><td className="td-strong">{p.productName}</td><td>{p.color}</td><td>{p.stock}</td><td>₹{p.mrpPrice}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: '12px', color: '#555', marginTop: '8px' }}>⚠️ Products will be <strong style={{ color: '#ebc76c' }}>appended</strong> to your existing New Launches list.</div>
        </div>
      )}
    </Modal>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NewLaunchManager() {
  const { newLaunches, addNewLaunch, updateNewLaunch, deleteNewLaunch, products, categories } = useData();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | {mode:'add'|'edit'|'bulk'|'pick'|'choose', ...}
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = newLaunches.filter(p =>
    (p.productName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.productId   || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.color       || '').toLowerCase().includes(search.toLowerCase())
  );

  // Generate next IDs for new launch entries
  const genIds = (sourceList) => {
    let maxIdNum = 0;
    sourceList.forEach(p => {
      if (p.productId && String(p.productId).startsWith('PRD')) {
        const num = parseInt(String(p.productId).replace('PRD', ''), 10);
        if (!isNaN(num) && num > maxIdNum) maxIdNum = num;
      }
    });
    const newProductId = `PRD${maxIdNum > 0 ? maxIdNum + 1 : 2001}`;

    let maxCodeNum = 0;
    sourceList.forEach(p => {
      if (p.productCode && String(p.productCode).startsWith('PCODE-')) {
        const num = parseInt(String(p.productCode).replace('PCODE-', ''), 10);
        if (!isNaN(num) && num > maxCodeNum) maxCodeNum = num;
      }
    });
    const nextCodeNum = maxCodeNum > 0 ? maxCodeNum + 1 : (maxIdNum > 0 ? maxIdNum + 1 : 2001);
    return { productId: newProductId, productCode: `PCODE-${nextCodeNum}` };
  };

  const openChoose = () => setModal({ mode: 'choose' });
  const openAdd    = () => {
    const now = new Date().toISOString().slice(0, 10);
    const { productId, productCode } = genIds(newLaunches);
    setModal({ mode: 'add', initialData: { productId, productCode, dateCreated: now, dateUpdated: now } });
  };
  const openPick   = () => setModal({ mode: 'pick' });
  const openEdit   = (idx) => setModal({ mode: 'edit', idx });
  const openBulk   = () => setModal({ mode: 'bulk' });
  const close      = () => setModal(null);

  // Called when user picks a product from the catalogue
  const handlePick = (sourceProduct) => {
    const now = new Date().toISOString().slice(0, 10);
    const { productId, productCode } = genIds(newLaunches);
    const initialData = {
      ...sourceProduct,
      productId,
      productCode,
      dateCreated: now,
      dateUpdated: now,
    };
    setModal({ mode: 'add', initialData });
  };

  const handleSave = (product) => {
    if (modal.mode === 'add') addNewLaunch(product);
    else updateNewLaunch(modal.idx, product);
    close();
  };

  const handleDelete       = (idx) => setConfirmDelete({ idx });
  const handleConfirmDelete = () => { deleteNewLaunch(confirmDelete.idx); setConfirmDelete(null); };
  const handleBulkImport   = (prods) => prods.forEach(p => addNewLaunch(p));

  return (
    <Layout title="New Launches">
      <div className="page-header">
        <div>
          <h1>New Launches <span className="count-badge">{newLaunches.length}</span></h1>
          <p>Manage new launch product listings</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={downloadSampleExcel} title="Download Excel template">📄 Sample Excel</button>
          <button className="btn-secondary" onClick={openBulk}>📥 Upload Excel</button>
          <button className="btn-primary"   onClick={openChoose}>+ Add Product</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search new launches…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th><th>Product</th><th>Code</th><th>Category</th><th>Color</th><th>MRP</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8}><div className="empty-state"><div className="empty-icon">🚀</div><p>No products found</p></div></td></tr>
            )}
            {filtered.map((p, i) => {
              const realIdx = newLaunches.indexOf(p);
              return (
                <tr key={p.productId || i}>
                  <td><img src={p.imageUrl || p.images?.[0]} alt={p.productName} className="product-img-thumb" onError={e => { e.target.style.display = 'none'; }} /></td>
                  <td>
                    <div className="td-strong">{p.productName}</div>
                    <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{p.productId}</div>
                  </td>
                  <td>{p.productCode}</td>
                  <td>
                    <div style={{ fontSize: '12px' }}>{p.parentCategory?.name}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>{p.childCategory?.name}</div>
                  </td>
                  <td>{p.color}</td>
                  <td>₹{p.mrpPrice}</td>
                  <td><span className={`badge ${p.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>{p.status}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-edit"   onClick={() => openEdit(realIdx)}>✏️ Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(realIdx)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="table-meta">Showing {filtered.length} of {newLaunches.length} products</div>
      </div>

      {/* ── Choose Mode (manual vs pick) ── */}
      {modal?.mode === 'choose' && (
        <Modal title="+ Add New Launch Product" onClose={close}
          footer={<button className="btn-secondary" onClick={close}>Cancel</button>}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '8px 0' }}>
            <div
              onClick={() => { close(); setTimeout(() => openPick(), 0); }}
              style={{ background: '#0e0e0e', border: '1px solid #ebc76c33', borderRadius: '12px', padding: '24px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ebc76c'; e.currentTarget.style.background = '#ebc76c08'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#ebc76c33'; e.currentTarget.style.background = '#0e0e0e'; }}
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#ebc76c', marginBottom: '6px' }}>Pick from Products</div>
              <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.5' }}>Copy an existing product from your catalogue into a new launch entry</div>
            </div>
            <div
              onClick={() => { close(); setTimeout(() => openAdd(), 0); }}
              style={{ background: '#0e0e0e', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.background = '#ffffff06'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.background = '#0e0e0e'; }}
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>✏️</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#ccc', marginBottom: '6px' }}>Create Manually</div>
              <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.5' }}>Fill in all fields from scratch for a brand new launch entry</div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Pick from Products Modal ── */}
      {modal?.mode === 'pick' && (
        <PickProductModal products={products} onPick={handlePick} onClose={close} />
      )}

      {/* ── Add / Edit Form ── */}
      {modal && (modal.mode === 'add' || modal.mode === 'edit') && (
        <Modal title={modal.mode === 'add' ? '+ Add New Launch' : '✏️ Edit Launch Product'} onClose={close}>
          <LaunchForm
            initial={modal.mode === 'edit' ? newLaunches[modal.idx] : { ...EMPTY, ...modal.initialData }}
            onSave={handleSave}
            onCancel={close}
            isEdit={modal.mode === 'edit'}
            categories={categories}
          />
        </Modal>
      )}

      {/* ── Bulk Upload ── */}
      {modal?.mode === 'bulk' && (
        <BulkUploadModal onClose={close} onImport={handleBulkImport} />
      )}

      {/* ── Confirm Delete ── */}
      {confirmDelete && (
        <ConfirmDialog
          message="Are you sure you want to delete this product? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </Layout>
  );
}
