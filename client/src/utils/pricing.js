// Single source of truth for product pricing.
// mrpPrice is the MRP; mrpDiscount is the % taken off it.
// salePrice is what the customer actually pays.
export const getPricing = (product = {}) => {
  const mrp = Number(product.mrpPrice) || 0;
  const discountPct = Math.min(Math.max(Number(product.mrpDiscount) || 0, 0), 100);
  const salePrice = Math.round(mrp * (1 - discountPct / 100));
  return { mrp, salePrice, discountPct, hasDiscount: discountPct > 0 && salePrice < mrp };
};

// Adds salePrice to a product so the cart, checkout and brochure all charge the discounted price.
export const withPricing = (product) => ({ ...product, salePrice: getPricing(product).salePrice });
