import * as XLSX from 'xlsx';

// ─── Column definitions ───────────────────────────────────────────────────────
// Each entry: { key, header, type }
// type: 'string' | 'number' | 'array' (comma-separated in cell)
export const PRODUCT_COLUMNS = [
  { key: 'productId',           header: 'Product ID',           type: 'string' },
  { key: 'productName',         header: 'Product Name',         type: 'string' },
  { key: 'productCode',         header: 'Product Code',         type: 'string' },
  { key: 'date',                header: 'Date (YYYY-MM-DD)',    type: 'string' },
  { key: 'parentCategoryId',    header: 'Parent Category ID',   type: 'string' },
  { key: 'parentCategoryName',  header: 'Parent Category Name', type: 'string' },
  { key: 'childCategoryId',     header: 'Child Category ID',    type: 'string' },
  { key: 'childCategoryName',   header: 'Child Category Name',  type: 'string' },
  { key: 'brand',               header: 'Brand',                type: 'string' },
  { key: 'status',              header: 'Status',               type: 'string' },
  { key: 'color',               header: 'Color',                type: 'string' },
  { key: 'colorTone',           header: 'Color Tone',           type: 'string' },
  { key: 'size',                header: 'Size',                 type: 'string' },
  { key: 'unit',                header: 'Unit',                 type: 'string' },
  { key: 'netWeight',           header: 'Net Weight',           type: 'string' },
  { key: 'hsnCode',             header: 'HSN Code',             type: 'string' },
  { key: 'gst',                 header: 'GST %',                type: 'number' },
  { key: 'saleType',            header: 'Sale Type',            type: 'string' },
  { key: 'stock',               header: 'Stock',                type: 'number' },
  { key: 'mrpPrice',            header: 'MRP Price',            type: 'number' },
  { key: 'mrpDiscount',         header: 'MRP Discount %',       type: 'number' },
  { key: 'displayMRP',          header: 'Display MRP',          type: 'number' },
  { key: 'finishTexture',       header: 'Finish Texture',       type: 'string' },
  { key: 'finishType',          header: 'Finish Type',          type: 'string' },
  { key: 'materialComposition', header: 'Material Composition', type: 'string' },
  { key: 'styleFit',            header: 'Style Fit',            type: 'string' },
  { key: 'orientation',         header: 'Orientation',          type: 'string' },
  { key: 'area',                header: 'Area',                 type: 'string' },
  { key: 'height',              header: 'Height',               type: 'string' },
  { key: 'width',               header: 'Width',                type: 'string' },
  { key: 'descriptionShort',    header: 'Short Description',    type: 'string' },
  { key: 'description',         header: 'Description',          type: 'string' },
  { key: 'imageUrl',            header: 'Main Image URL',       type: 'string' },
  { key: 'whereToUse',          header: 'Where To Use',         type: 'array'  },
  { key: 'tags',                header: 'Tags',                 type: 'array'  },
  { key: 'applications',        header: 'Applications',         type: 'array'  },
  { key: 'images',              header: 'Gallery Images (URLs)','type': 'array' },
];

// ─── Download Sample Excel ────────────────────────────────────────────────────
export function downloadSampleExcel() {
  // Header row
  const headers = PRODUCT_COLUMNS.map(c => c.header);

  // Sample data row
  const sampleRow = PRODUCT_COLUMNS.map(c => {
    switch (c.key) {
      case 'productId':           return 'PRD9001';
      case 'productName':         return 'Sample Laminate';
      case 'productCode':         return 'SMP-LM-01';
      case 'date':                return new Date().toISOString().slice(0, 10);
      case 'parentCategoryId':    return 'PC001';
      case 'parentCategoryName':  return 'Decorative Laminates';
      case 'childCategoryId':     return 'CC101';
      case 'childCategoryName':   return 'Sample Subcategory';
      case 'brand':               return 'Sequence Surface';
      case 'status':              return 'Active';
      case 'color':               return 'Silver';
      case 'colorTone':           return 'Cool Silver';
      case 'size':                return '8ft x 4ft';
      case 'unit':                return 'Sheet';
      case 'netWeight':           return '12kg';
      case 'hsnCode':             return '4412';
      case 'gst':                 return 18;
      case 'saleType':            return 'Retail';
      case 'stock':               return 100;
      case 'mrpPrice':            return 2500;
      case 'mrpDiscount':         return 10;
      case 'displayMRP':          return 2500;
      case 'finishTexture':       return 'Smooth';
      case 'finishType':          return 'Matte';
      case 'materialComposition': return 'High Pressure Laminate';
      case 'styleFit':            return 'Modern';
      case 'orientation':         return 'Horizontal';
      case 'area':                return '32 sq ft';
      case 'height':              return '8 ft';
      case 'width':               return '4 ft';
      case 'descriptionShort':    return 'A beautiful sample laminate.';
      case 'description':         return 'Full description of the laminate product here.';
      case 'imageUrl':            return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c';
      case 'whereToUse':          return 'Wardrobes, Furniture, Panels';
      case 'tags':                return 'silver, modern, laminate';
      case 'applications':        return 'Furniture, Interior Decor';
      case 'images':              return 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6, https://images.unsplash.com/photo-1600573472550-8090b5e0745e';
      default:                    return '';
    }
  });

  const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow]);

  // Style: make header row bold and gold-ish (xlsx basic styling)
  ws['!cols'] = PRODUCT_COLUMNS.map(c => ({
    wch: Math.max(c.header.length + 4, 18)
  }));

  // Instructions sheet
  const instructions = [
    ['BULK PRODUCT UPLOAD — INSTRUCTIONS'],
    [''],
    ['1. Fill in one product per row starting from row 2.'],
    ['2. Do NOT change the column headers in row 1.'],
    ['3. Array fields (Where To Use, Tags, Applications, Gallery Images) should use comma-separated values.'],
    ['4. Status must be: Active or Inactive'],
    ['5. Orientation must be: Horizontal or Vertical'],
    ['6. Finish Type must be: Matte, Gloss, High Gloss, or Satin'],
    ['7. Date format: YYYY-MM-DD (e.g. 2026-04-16)'],
    [''],
    ['Upload this file back in the Admin Panel → Products → Upload Excel'],
  ];
  const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
  wsInstructions['!cols'] = [{ wch: 70 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');
  XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

  XLSX.writeFile(wb, 'Sequence_Bulk_Products_Template.xlsx');
}

// ─── Parse uploaded Excel → products array ────────────────────────────────────
export function parseProductsExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

        // Build a map: header → column def
        const headerMap = {};
        PRODUCT_COLUMNS.forEach(c => { headerMap[c.header] = c; });

        const products = rows.map(row => {
          const product = {};
          PRODUCT_COLUMNS.forEach(col => {
            const raw = row[col.header] ?? '';
            if (col.type === 'number') {
              product[col.key] = Number(raw) || 0;
            } else if (col.type === 'array') {
              product[col.key] = String(raw).split(',').map(s => s.trim()).filter(Boolean);
            } else {
              product[col.key] = String(raw).trim();
            }
          });

          // Reconstruct nested objects
          product.parentCategory = {
            id: product.parentCategoryId || '',
            name: product.parentCategoryName || '',
          };
          product.childCategory = {
            id: product.childCategoryId || '',
            name: product.childCategoryName || '',
          };

          // Clean up flat keys
          delete product.parentCategoryId;
          delete product.parentCategoryName;
          delete product.childCategoryId;
          delete product.childCategoryName;

          return product;
        }).filter(p => p.productName); // skip completely empty rows

        resolve(products);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
