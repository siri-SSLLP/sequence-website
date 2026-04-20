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

// ─── EMPTY template ───────────────────────────────────────────────────────────
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
  // kept for backward-compat but not shown in create form
  saleType:       'Retail',
  stock:          0,
  mrpDiscount:    0,
  styleFit:       '',
  date:           new Date().toISOString().slice(0, 10),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function arrToStr(arr) { return Array.isArray(arr) ? arr.join(', ') : (arr || ''); }
function strToArr(s)   { return String(s).split(',').map(x => x.trim()).filter(Boolean); }

// ─── MultiSelectDropdown ────────────────────────────────────────────────────
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

      {/* Selected pills */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px',
        minHeight: '38px', padding: '6px 10px',
        background: '#0e0e0e', border: '1px solid #2a2a2a', borderRadius: '8px',
        cursor: 'pointer', alignItems: 'center'
      }} onClick={() => setOpen(o => !o)}>
        {value.length === 0 && <span style={{ color: '#444', fontSize: '13px' }}>Select {label}…</span>}
        {value.map(v => (
          <span key={v} style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: '#ebc76c22', border: '1px solid #ebc76c66',
            color: '#ebc76c', borderRadius: '999px',
            padding: '2px 10px 2px 12px', fontSize: '12px', fontWeight: 600
          }}>
            {v}
            <span
              style={{ cursor: 'pointer', fontSize: '14px', lineHeight: 1, color: '#ebc76c99' }}
              onClick={e => { e.stopPropagation(); toggle(v); }}
            >×</span>
          </span>
        ))}
        <span style={{ marginLeft: 'auto', color: '#555', fontSize: '12px' }}>{open ? '▲' : '▼'}</span>
      </div>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 9999,
          background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.7)', maxHeight: '240px', overflowY: 'auto'
        }}>
          {allOptions.map(opt => (
            <div key={opt}
              onClick={() => toggle(opt)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 14px', cursor: 'pointer',
                background: value.includes(opt) ? '#ebc76c11' : 'transparent',
                borderBottom: '1px solid #1e1e1e',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#ebc76c18'}
              onMouseLeave={e => e.currentTarget.style.background = value.includes(opt) ? '#ebc76c11' : 'transparent'}
            >
              <div style={{
                width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
                border: value.includes(opt) ? '2px solid #ebc76c' : '2px solid #333',
                background: value.includes(opt) ? '#ebc76c' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {value.includes(opt) && <span style={{ color: '#111', fontSize: '10px', fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ fontSize: '13px', color: value.includes(opt) ? '#ebc76c' : '#ccc' }}>{opt}</span>
            </div>
          ))}
          {/* Add custom */}
          <div style={{ padding: '8px 10px', borderTop: '1px solid #2a2a2a', display: 'flex', gap: '6px' }}>
            <input
              className="form-input"
              style={{ flex: 1, fontSize: '12px', padding: '5px 10px', height: '32px' }}
              placeholder="Add custom…"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
              onClick={e => e.stopPropagation()}
            />
            <button
              type="button"
              className="btn-edit"
              style={{ fontSize: '12px', padding: '5px 12px' }}
              onClick={e => { e.stopPropagation(); addCustom(); }}
            >+ Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, icon }) {
  return (
    <div className="form-group span-2" style={{
      borderBottom: '1px solid #ebc76c22', paddingBottom: '6px',
      marginBottom: '4px', marginTop: '8px',
      display: 'flex', alignItems: 'center', gap: '8px'
    }}>
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <span style={{ color: '#ebc76c', fontWeight: 700, fontSize: '13px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{title}</span>
    </div>
  );
}

// ─── System Info Badge ────────────────────────────────────────────────────────
function SystemBadge({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ fontSize: '11px', color: '#555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      <span style={{
        background: '#0e0e0e', border: '1px solid #2a2a2a', borderRadius: '6px',
        padding: '7px 12px', fontSize: '13px', color: '#888', fontFamily: 'monospace'
      }}>{value || '—'}</span>
    </div>
  );
}

// ─── Field Input (must be outside ProductForm to avoid remount on every render) ─
function FI({ label, fKey, type = 'text', hint, span, readOnly, form, set }) {
  const cls = `form-group${span ? ' span-2' : ''}`;
  return (
    <div className={cls}>
      <label className="form-label">{label}</label>
      {type === 'textarea' ? (
        <textarea className="form-textarea" value={form[fKey] ?? ''} onChange={e => set(fKey, e.target.value)} readOnly={readOnly} />
      ) : (
        <input
          className="form-input" type={type} value={form[fKey] ?? ''}
          onChange={e => set(fKey, e.target.value)} readOnly={readOnly}
          style={readOnly ? { color: '#555', cursor: 'default' } : {}}
        />
      )}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
}

// ─── Field Select (must be outside ProductForm to avoid remount on every render) ─
function FSel({ label, fKey, opts, span, form, set }) {
  return (
    <div className={`form-group${span ? ' span-2' : ''}`}>
      <label className="form-label">{label}</label>
      <select className="form-select" value={form[fKey] ?? ''} onChange={e => set(fKey, e.target.value)}>
        <option value="">— Select —</option>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Product Form ─────────────────────────────────────────────────────────────
function ProductForm({ initial, onSave, onCancel, isEdit, categories }) {
  const [form, setForm] = useState(() => {
    const base = { ...EMPTY, ...initial };
    // normalise array fields that might be stored as strings
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

  // When parent category changes → reset child + auto-fill IDs
  const handleParentChange = (parentName) => {
    const cat = categories.find(c => c.main === parentName);
    setForm(f => ({
      ...f,
      parentCategoryName: parentName,
      parentCategoryId:   cat ? cat.id : '',
      childCategoryName:  '',
      childCategoryId:    '',
    }));
  };

  const handleChildChange = (childName) => {
    const cat = categories.find(c => c.main === form.parentCategoryName);
    const sub = cat?.subcategories?.find(s => s.name === childName);
    setForm(f => ({
      ...f,
      childCategoryName: childName,
      childCategoryId:   sub ? sub.id : '',
    }));
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
    // clean up UI-only fields
    ['parentCategoryId','parentCategoryName','childCategoryId','childCategoryName','tagsStr'].forEach(k => delete product[k]);
    onSave(product);
  };

  return (
    <div className="form-grid">

      {/* ── System Info (read-only) ── */}
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

      {/* Edit mode: allow editing system fields */}
      {isEdit && (
        <>
          <SectionHeader title="Edit System Fields" icon="✏️" />
          <FI label="Product ID"    fKey="productId"   form={form} set={set} />
          <FI label="Product Code"  fKey="productCode" form={form} set={set} />
          <FI label="Brand"         fKey="brand"       form={form} set={set} />
          <FI label="GST %"         fKey="gst"  type="number" form={form} set={set} />
          <FI label="Date Created"  fKey="dateCreated" type="date" form={form} set={set} />
          <FI label="Date Updated"  fKey="dateUpdated" type="date" form={form} set={set} />
        </>
      )}

      {/* ── Basic Info ── */}
      <SectionHeader title="Basic Info" icon="📋" />
      <FI label="Product Name" fKey="productName" span form={form} set={set} />
      <FSel label="Status" fKey="status" opts={['Active', 'Inactive']} form={form} set={set} />
      <FI label="HSN Code" fKey="hsnCode" form={form} set={set} />

      {/* ── Category ── */}
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

      {/* ── Physical Properties ── */}
      <SectionHeader title="Physical Properties" icon="⚖️" />
      <FI label="Color"       fKey="color"      form={form} set={set} />
      <FI label="Color Tone"  fKey="colorTone"  form={form} set={set} />
      <FI label="Size"        fKey="size"       form={form} set={set} />
      <FI label="Unit"        fKey="unit"       form={form} set={set} />
      <FI label="Net Weight"  fKey="netWeight"  form={form} set={set} />
      <FI label="MRP Price (₹)"   fKey="mrpPrice"   type="number" form={form} set={set} />
      <FI label="Display MRP (₹)" fKey="displayMRP" type="number" form={form} set={set} />

      {/* ── Finish & Material ── */}
      <SectionHeader title="Finish & Material" icon="🎨" />
      <FI label="Finish Texture" fKey="finishTexture" form={form} set={set} />
      <FSel label="Finish Type" fKey="finishType" opts={['Matte', 'Gloss', 'High Gloss', 'Satin', 'Suede']} form={form} set={set} />
      <div className="form-group span-2">
        <MultiSelectDropdown
          label="Material Composition"
          options={materialCompositionOptions}
          value={form.materialComposition}
          onChange={v => set('materialComposition', v)}
        />
      </div>

      {/* ── Dimensions & Orientation ── */}
      <SectionHeader title="Dimensions & Orientation" icon="📐" />
      <FI label="Area"   fKey="area"   form={form} set={set} />
      <FI label="Height" fKey="height" form={form} set={set} />
      <FI label="Width"  fKey="width"  form={form} set={set} />
      <FSel label="Orientation" fKey="orientation" opts={['Horizontal', 'Vertical', 'Both']} form={form} set={set} />

      {/* ── Descriptions ── */}
      <SectionHeader title="Descriptions" icon="📝" />
      <FI label="Short Description" fKey="descriptionShort" span form={form} set={set} />
      <FI label="Full Description"  fKey="description" type="textarea" span form={form} set={set} />

      {/* ── Media ── */}
      <SectionHeader title="Media" icon="🖼️" />
      <FI label="Main Image URL" fKey="imageUrl" span form={form} set={set} />
      <div className="form-group span-2">
        <ImageUrlInput label="Gallery Images" images={form.images} onChange={imgs => set('images', imgs)} />
      </div>

      {/* ── Tags, Applications, Where To Use ── */}
      <SectionHeader title="Tags & Usage" icon="🏷️" />
      <FI label="Tags" fKey="tagsStr" span hint="Comma-separated (e.g. walnut, wood, matte)" form={form} set={set} />
      <div className="form-group span-2">
        <MultiSelectDropdown
          label="Applications"
          options={applicationsOptions}
          value={form.applications}
          onChange={v => set('applications', v)}
        />
      </div>
      <div className="form-group span-2">
        <MultiSelectDropdown
          label="Where To Use"
          options={whereToUseOptions}
          value={form.whereToUse}
          onChange={v => set('whereToUse', v)}
        />
      </div>

      {/* ── Actions ── */}
      <div className="form-group span-2" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
        <button className="btn-secondary" type="button" onClick={onCancel}>Cancel</button>
        <button className="btn-primary"   type="button" onClick={handleSave}>💾 Save Product</button>
      </div>
    </div>
  );
}

// ─── Bulk Upload Modal ─────────────────────────────────────────────────────────
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
    try {
      const products = await parseProductsExcel(f);
      setPreview(products);
    } catch (err) {
      setError('Failed to parse file: ' + err.message);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (preview && preview.length > 0) { onImport(preview); onClose(); }
  };

  return (
    <Modal title="📥 Bulk Product Upload" onClose={onClose}
      footer={<>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={handleImport} disabled={!preview || preview.length === 0}>
          ✅ Import {preview ? preview.length : 0} Products
        </button>
      </>}>
      <div style={{ background: '#0e0e0e', border: '1px solid #ebc76c22', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#f0f0f0', marginBottom: '4px' }}>Step 1: Download the Template</div>
          <div style={{ fontSize: '12px', color: '#555' }}>Fill in the Excel template with your product data, then upload it below.</div>
        </div>
        <button className="btn-edit" onClick={downloadSampleExcel} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>📄 Download Template</button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontWeight: '700', fontSize: '14px', color: '#f0f0f0', marginBottom: '12px' }}>Step 2: Upload Filled Excel</div>
        <div style={{ border: '2px dashed #ebc76c44', borderRadius: '10px', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: '#0e0e0e' }}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#ebc76c'; }}
          onDragLeave={e => { e.currentTarget.style.borderColor = '#ebc76c44'; }}
          onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#ebc76c44'; const f = e.dataTransfer.files[0]; if (f) handleFile({ target: { files: [f] } }); }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>📊</div>
          <div style={{ color: '#888', fontSize: '14px' }}>
            {file ? <span style={{ color: '#ebc76c', fontWeight: '600' }}>✓ {file.name}</span>
              : <>Click to select or drag &amp; drop your Excel file<br /><span style={{ fontSize: '12px', color: '#444' }}>.xlsx or .xls files accepted</span></>}
          </div>
        </div>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleFile} />
      </div>

      {loading && <div style={{ textAlign: 'center', color: '#888', padding: '16px' }}><span className="spinner" style={{ borderTopColor: '#ebc76c', borderColor: '#ebc76c22' }} /><span style={{ marginLeft: '10px' }}>Parsing file...</span></div>}
      {error && <div style={{ background: '#ff333318', border: '1px solid #ff333333', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#ff6666' }}>⚠️ {error}</div>}

      {preview && preview.length > 0 && (
        <div>
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#ebc76c', marginBottom: '10px' }}>✅ {preview.length} product{preview.length !== 1 ? 's' : ''} ready to import — Preview:</div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', borderRadius: '8px', border: '1px solid #1e1e1e' }}>
            <table className="data-table" style={{ fontSize: '12px' }}>
              <thead><tr><th>#</th><th>Product ID</th><th>Name</th><th>Code</th><th>Color</th><th>Stock</th><th>MRP</th></tr></thead>
              <tbody>
                {preview.map((p, i) => (
                  <tr key={i}>
                    <td style={{ color: '#555' }}>{i + 1}</td>
                    <td>{p.productId}</td>
                    <td className="td-strong">{p.productName}</td>
                    <td>{p.productCode}</td>
                    <td>{p.color}</td>
                    <td>{p.stock}</td>
                    <td>₹{p.mrpPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: '12px', color: '#555', marginTop: '8px' }}>⚠️ These products will be <strong style={{ color: '#ebc76c' }}>appended</strong> to your existing product list.</div>
        </div>
      )}
      {preview && preview.length === 0 && !loading && <div style={{ color: '#ff6666', fontSize: '13px' }}>⚠️ No valid products found in the file.</div>}
    </Modal>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProductsManager() {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useData();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'add'|'edit'|'bulk', idx? }
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = products.filter(p =>
    (p.productName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.productId   || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.productCode || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.color       || '').toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    // Auto-generate IDs
    let maxIdNum = 0;
    products.forEach(p => {
      if (p.productId && String(p.productId).startsWith('PRD')) {
        const num = parseInt(String(p.productId).replace('PRD', ''), 10);
        if (!isNaN(num) && num > maxIdNum) maxIdNum = num;
      }
    });
    const newProductId = `PRD${maxIdNum > 0 ? maxIdNum + 1 : 1001}`;

    let maxCodeNum = 0;
    products.forEach(p => {
      if (p.productCode && String(p.productCode).startsWith('PCODE-')) {
        const num = parseInt(String(p.productCode).replace('PCODE-', ''), 10);
        if (!isNaN(num) && num > maxCodeNum) maxCodeNum = num;
      }
    });
    const nextCodeNum = maxCodeNum > 0 ? maxCodeNum + 1 : (maxIdNum > 0 ? maxIdNum + 1 : 1001);

    const now = new Date().toISOString().slice(0, 10);
    setModal({ mode: 'add', initialData: { productId: newProductId, productCode: `PCODE-${nextCodeNum}`, dateCreated: now, dateUpdated: now } });
  };

  const openEdit = (idx) => setModal({ mode: 'edit', idx });
  const openBulk = () => setModal({ mode: 'bulk' });
  const close    = () => setModal(null);

  const handleSave = (product) => {
    if (modal.mode === 'add') addProduct(product);
    else updateProduct(modal.idx, product);
    close();
  };

  const handleDelete = (idx) => setConfirmDelete({ idx });
  const handleConfirmDelete = () => { deleteProduct(confirmDelete.idx); setConfirmDelete(null); };
  const handleBulkImport = (newProducts) => { newProducts.forEach(p => addProduct(p)); };

  return (
    <Layout title="Products">
      <div className="page-header">
        <div>
          <h1>Products <span className="count-badge">{products.length}</span></h1>
          <p>Create, edit and delete products from the catalogue</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={downloadSampleExcel} title="Download sample template">📄 Sample Excel</button>
          <button className="btn-secondary" onClick={openBulk}>📥 Upload Excel</button>
          <button className="btn-primary"   onClick={openAdd}>+ Add Product</button>
        </div>
      </div>

      {/* Search */}
      <div className="toolbar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search by name, ID, code, color…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Code</th>
              <th>Category</th>
              <th>Color</th>
              <th>MRP</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8}><div className="empty-state"><div className="empty-icon">🏷️</div><p>No products found</p></div></td></tr>
            )}
            {filtered.map((p, i) => {
              const realIdx = products.indexOf(p);
              return (
                <tr key={p.productId || i}>
                  <td>
                    <img src={p.imageUrl || p.images?.[0]} alt={p.productName} className="product-img-thumb" onError={e => { e.target.style.display = 'none'; }} />
                  </td>
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
                  <td>
                    <span className={`badge ${p.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>{p.status}</span>
                  </td>
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
        <div className="table-meta">Showing {filtered.length} of {products.length} products</div>
      </div>

      {/* Add / Edit Modal */}
      {modal && modal.mode !== 'bulk' && (
        <Modal title={modal.mode === 'add' ? '+ Add New Product' : '✏️ Edit Product'} onClose={close}>
          <ProductForm
            initial={modal.mode === 'edit' ? products[modal.idx] : { ...EMPTY, ...modal.initialData }}
            onSave={handleSave}
            onCancel={close}
            isEdit={modal.mode === 'edit'}
            categories={categories}
          />
        </Modal>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <ConfirmDialog
          message="Are you sure you want to delete this product? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Bulk Upload */}
      {modal?.mode === 'bulk' && (
        <BulkUploadModal onClose={close} onImport={handleBulkImport} />
      )}
    </Layout>
  );
}
