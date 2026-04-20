const fs = require('fs');
const path = require('path');

const files = [
  'src/Components/ProductsManager.jsx',
  'src/Components/NewLaunchManager.jsx'
];

const formFieldCode = `function FormField({ form, set, label, fKey, type = 'text', hint, span, opts }) {
  return (
    <div className={\`form-group\${span ? ' span-2' : ''}\`}>
      <label className="form-label">{label}</label>
      {opts ? (
        <select className="form-select" value={form[fKey] ?? ''} onChange={e => set(fKey, e.target.value)}>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea className="form-textarea" value={form[fKey] ?? ''} onChange={e => set(fKey, e.target.value)} />
      ) : (
        <input className="form-input" type={type} value={form[fKey] ?? ''} onChange={e => set(fKey, e.target.value)} />
      )}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
}

`;

for (const file of files) {
  const p = path.join(__dirname, file);
  let content = fs.readFileSync(p, 'utf8');
  
  // Remove the inline F component
  content = content.replace(/  const F = \(\{ label, fKey, type = 'text', hint, span, opts \}\) => \([\s\S]*?  \);\n\n/m, '');
  
  // Replace <F with <FormField form={form} set={set}
  content = content.replace(/<F /g, '<FormField form={form} set={set} ');
  
  // Add FormField to the top of the file before ProductForm/LaunchForm
  if (file.includes('ProductsManager')) {
    content = content.replace(/function ProductForm/, formFieldCode + 'function ProductForm');
  } else {
    content = content.replace(/function LaunchForm/, formFieldCode + 'function LaunchForm');
  }
  
  fs.writeFileSync(p, content);
  console.log('Fixed', file);
}
