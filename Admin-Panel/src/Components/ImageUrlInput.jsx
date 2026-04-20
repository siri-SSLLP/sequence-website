import React, { useState } from 'react';

/**
 * ImageUrlInput — dynamic image URL list with Add "+", individual remove,
 * and instant preview per URL.
 *
 * Props:
 *  - images: string[]
 *  - onChange: (newImages: string[]) => void
 *  - label?: string  (shown above the list)
 */
export default function ImageUrlInput({ images = [], onChange, label = 'Gallery Images' }) {
  const [newUrl, setNewUrl] = useState('');

  const add = () => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setNewUrl('');
  };

  const remove = (i) => onChange(images.filter((_, idx) => idx !== i));

  const update = (i, val) => {
    const copy = [...images];
    copy[i] = val;
    onChange(copy);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label className="form-label">{label}</label>

      {/* Existing URLs list */}
      {images.map((url, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Mini preview */}
          {url && url.startsWith('http') ? (
            <img
              src={url}
              alt={`img-${i}`}
              style={{
                width: '38px', height: '38px', borderRadius: '6px',
                objectFit: 'cover', border: '1px solid #2a2a2a',
                flexShrink: 0, background: '#1a1a1a'
              }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{
              width: '38px', height: '38px', borderRadius: '6px',
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', flexShrink: 0, color: '#333'
            }}>🖼️</div>
          )}

          {/* Editable URL */}
          <input
            className="form-input"
            value={url}
            onChange={e => update(i, e.target.value)}
            placeholder="https://..."
            style={{ flex: 1 }}
          />

          {/* Remove */}
          <button
            type="button"
            onClick={() => remove(i)}
            style={{
              background: 'transparent', border: '1px solid #ff333322',
              color: '#ff6666', borderRadius: '6px', width: '34px', height: '34px',
              cursor: 'pointer', fontSize: '15px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#ff333318'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            title="Remove image"
          >✕</button>
        </div>
      ))}

      {/* Add new URL row */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* Placeholder preview box */}
        <div style={{
          width: '38px', height: '38px', borderRadius: '6px',
          background: '#1a1a1a', border: '1px dashed #2a2a2a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', flexShrink: 0, color: '#333'
        }}>+</div>

        <input
          className="form-input"
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Paste image URL and click +"
          style={{ flex: 1 }}
        />

        <button
          type="button"
          onClick={add}
          style={{
            background: '#ebc76c', color: '#0a0a0a', border: 'none',
            borderRadius: '6px', width: '34px', height: '34px',
            cursor: 'pointer', fontSize: '18px', fontWeight: '800',
            flexShrink: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f5d484'}
          onMouseLeave={e => e.currentTarget.style.background = '#ebc76c'}
          title="Add image"
        >+</button>
      </div>

      <span className="form-hint">
        {images.length} image{images.length !== 1 ? 's' : ''} added · Press Enter or + to add
      </span>
    </div>
  );
}
