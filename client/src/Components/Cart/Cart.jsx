// import React, { useContext, useMemo, useState, useRef } from "react";
// import { ProductContext } from "../../Context/Context";
// // import { product as products } from "../../assets/assets";
// import {
//   FaTrash,
//   FaTag,
//   FaLock,
//   FaShoppingCart,
//   FaTruck,
//   FaCreditCard,
//   FaWallet,
//   FaPlus,
//   FaMinus,
//   FaChevronRight,
//   FaFilePdf,
//   FaTimes,
//   FaUser,
//   FaPhone,
//   FaEnvelope,
//   FaBuilding,
// } from "react-icons/fa";
// import "./Cart.css";
// import { Link } from "react-router-dom";

// /* ─────────────────────────────────────────────────────────────
//    HELPERS
// ───────────────────────────────────────────────────────────── */

// /**
//  * jsPDF's built-in Helvetica does NOT support the ₹ glyph.
//  * We load NotoSans from Google Fonts as a TTF, convert it to
//  * a base64 data-URL, then register it as a custom font so the
//  * rupee symbol renders correctly inside the PDF.
//  */
// const loadRupeeFontBase64 = async () => {
//   // Use a minimal subset TTF that contains the ₹ glyph.
//   // We fetch it at runtime so we don't bloat the bundle.
//   const url =
//     "https://fonts.gstatic.com/s/notosans/v36/o-0IIpQlx3QUlC5A4PNr5TRG.woff2";

//   // woff2 isn't directly embeddable in jsPDF; fetch the TTF variant instead.
//   const ttfUrl =
//     "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.0.8/files/noto-sans-latin-ext-400-normal.woff2";

//   // Fallback: use a small open-source TTF that has the rupee sign
//   const fallbackTtf =
//     "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Regular.ttf";

//   try {
//     const res = await fetch(fallbackTtf);
//     const buf = await res.arrayBuffer();
//     const bytes = new Uint8Array(buf);
//     let binary = "";
//     for (let i = 0; i < bytes.byteLength; i++) {
//       binary += String.fromCharCode(bytes[i]);
//     }
//     return btoa(binary);
//   } catch {
//     return null;
//   }
// };

// /**
//  * Load the Sequence Surface logo as a base64 JPEG/PNG string
//  * so jsPDF can embed it.
//  */
// const loadLogoBase64 = async () => {
//   try {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     await new Promise((res, rej) => {
//       img.onload = res;
//       img.onerror = rej;
//       // Use a CORS proxy-safe direct URL
//       img.src = "https://sequencesurface.com/images/logo.png";
//       setTimeout(res, 3000); // timeout fallback
//     });

//     const canvas = document.createElement("canvas");
//     canvas.width = img.naturalWidth || 300;
//     canvas.height = img.naturalHeight || 80;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(img, 0, 0);
//     return canvas.toDataURL("image/png");
//   } catch {
//     return null;
//   }
// };

// /* ─── PDF Generation ─────────────────────────────────────────── */

// const generatePDF = async (userInfo, cartItems) => {
//   if (!window.jspdf) {
//     await new Promise((resolve, reject) => {
//       const script = document.createElement("script");
//       script.src =
//         "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
//       script.onload = resolve;
//       script.onerror = reject;
//       document.head.appendChild(script);
//     });
//   }

//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF({ unit: "pt", format: "a4" });

//   const W = doc.internal.pageSize.getWidth();
//   const H = doc.internal.pageSize.getHeight();

//   const loadImage = (url) =>
//     new Promise((resolve) => {
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       img.onload = () => resolve(img);
//       img.onerror = () => resolve(null);
//       img.src = url;
//       setTimeout(() => resolve(null), 2000);
//     });

//   const generateQR = (text) =>
//     `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(text)}`;

//   /* ================= COVER PAGE ================= */
//   doc.setFillColor(10, 10, 12);
//   doc.rect(0, 0, W, H, "F");

//   const logo = await loadImage("https://sequencesurface.com/images/logo.png");
//   if (logo) {
//     doc.addImage(logo, "PNG", W / 2 - 80, 120, 160, 60);
//   }

//   doc.setTextColor(255, 255, 255);
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(28);
//   doc.text("Sequence Surface", W / 2, 250, { align: "center" });

//   doc.setFontSize(14);
//   doc.setTextColor(180, 180, 180);
//   doc.text("Premium Laminate Catalogue", W / 2, 280, { align: "center" });

//   const now = new Date().toLocaleString("en-IN");
//   doc.setFontSize(10);
//   doc.setTextColor(120, 120, 120);
//   doc.text(now, W / 2, H - 60, { align: "center" });

//   doc.addPage();

//   /* ================= PRODUCTS ================= */
//   for (let i = 0; i < cartItems.length; i++) {
//     const item = cartItems[i];
//     const productUrl =
//       item.productLink ||
//       `https://sequencesurface.com/product/${item.productId}`;

//     doc.setFillColor(250, 250, 250);
//     doc.rect(0, 0, W, H, "F");

//     /* ===== SOFT GRADIENT BACK ===== */
//     for (let g = 0; g < H; g += 4) {
//       const shade = Math.max(220, 250 - g * 0.05);
//       doc.setFillColor(shade, shade, shade);
//       doc.rect(0, g, W, 4, "F");
//     }

//     /* ===== IMAGE — orientation-aware layout ===== */
//     const img = await loadImage(item.imageUrl);

//     // Determine if image is portrait or landscape
//     let heroH = H * 0.55; // default for landscape/square
//     let imgX = 0,
//       imgY = 0,
//       imgW = W,
//       imgDrawH = heroH;

//     if (img) {
//       const aspectRatio = img.naturalWidth / img.naturalHeight;

//       if (aspectRatio < 0.85) {
//         // Portrait image: place on right half, content on left
//         const portraitW = W * 0.45;
//         const portraitH = Math.min(H * 0.85, portraitW / aspectRatio);
//         imgX = W - portraitW - 20;
//         imgY = (H - portraitH) / 2;
//         imgW = portraitW;
//         imgDrawH = portraitH;

//         // Draw portrait image
//         doc.addImage(img, "JPEG", imgX, imgY, imgW, imgDrawH);

//         // Vertical divider
//         doc.setDrawColor(220, 220, 220);
//         doc.line(W * 0.52, 40, W * 0.52, H - 40);

//         /* ===== TEXT BLOCK (left side for portrait) ===== */
//         let y = 80;
//         const textMaxW = W * 0.48 - 60;

//         doc.setTextColor(20, 20, 20);
//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(20);
//         doc.text(item.productName, 40, y, { maxWidth: textMaxW });

//         y += 36;
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(11);
//         doc.setTextColor(100, 100, 100);
//         const desc =
//           item.description ||
//           "Premium decorative laminate designed for elegant interiors with high durability and modern aesthetics.";
//         const split = doc.splitTextToSize(desc, textMaxW);
//         doc.text(split, 40, y);
//         y += split.length * 15 + 24;

//         /* Price — rupee fix */
//         const price = item.salePrice ?? item.mrpPrice;
//         doc.setFontSize(16);
//         doc.setFont("helvetica", "bold");
//         doc.setTextColor(20, 20, 20);
//         doc.text(`Rs. ${price}`, 40, y);

//         y += 28;
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(11);
//         doc.setTextColor(0, 102, 204);
//         doc.textWithLink("Explore Product \u2192", 40, y, { url: productUrl });

//         /* QR below link */
//         const qrImg = await loadImage(generateQR(productUrl));
//         if (qrImg) {
//           doc.addImage(qrImg, "PNG", 40, y + 20, 90, 90);
//         }
//       } else {
//         // Landscape or square image: full-width hero at top
//         heroH = aspectRatio > 1.4 ? H * 0.45 : H * 0.52;
//         doc.addImage(img, "JPEG", 0, 0, W, heroH);

//         /* ===== CARD OVERLAY ===== */
//         doc.setFillColor(255, 255, 255);
//         doc.roundedRect(30, heroH - 20, W - 60, H - heroH - 10, 20, 20, "F");

//         /* ===== TEXT BLOCK ===== */
//         let y = heroH + 24;

//         doc.setTextColor(20, 20, 20);
//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(22);
//         doc.text(item.productName, 50, y, { maxWidth: W - 100 });

//         y += 30;
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(12);
//         doc.setTextColor(100, 100, 100);
//         const desc =
//           item.description ||
//           "Premium decorative laminate designed for elegant interiors with high durability and modern aesthetics.";
//         const split = doc.splitTextToSize(desc, W - 120);
//         doc.text(split, 50, y);
//         y += split.length * 16 + 20;

//         /* Price — rupee fix */
//         const price = item.salePrice ?? item.mrpPrice;
//         doc.setFontSize(15);
//         doc.setFont("helvetica", "bold");
//         doc.setTextColor(20, 20, 20);
//         doc.text(`Rs. ${price}`, 50, y);

//         y += 28;
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(12);
//         doc.setTextColor(0, 102, 204);
//         doc.textWithLink("Explore Product \u2192", 50, y, { url: productUrl });

//         /* QR */
//         const qrImg = await loadImage(generateQR(productUrl));
//         if (qrImg) {
//           doc.addImage(qrImg, "PNG", W - 140, heroH + 20, 90, 90);
//         }
//       }
//     }

//     /* ===== FOOTER ===== */
//     doc.setFontSize(9);
//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(150, 150, 150);
//     doc.text(
//       `${userInfo.name || ""} · ${userInfo.phone || ""} · ${userInfo.email || ""}`,
//       W / 2,
//       H - 22,
//       { align: "center" }
//     );

//     if (i !== cartItems.length - 1) doc.addPage();
//   }

//   doc.save("Sequence_Brochure.pdf");
// };


// /* ─── User Info Modal ─────────────────────────────────────────── */
// const UserInfoModal = ({ onClose, onGenerate, isGenerating }) => {
//   const [form, setForm] = useState({ name: "", phone: "", email: "", company: "" });
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = "Name is required";
//     if (!form.phone.trim()) e.phone = "Phone is required";
//     if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
//       e.email = "Valid email required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handle = (k) => (ev) => {
//     setForm((p) => ({ ...p, [k]: ev.target.value }));
//     if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
//   };

//   return (
//     <div className="pdf-overlay" onClick={onClose}>
//       <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="pdf-modal-header">
//           <div className="pdf-modal-brand">
//             <span className="pdf-brand-dot" />
//             <span>Generate Order PDF</span>
//           </div>
//           <button className="pdf-modal-close" onClick={onClose}>
//             <FaTimes />
//           </button>
//         </div>

//         <p className="pdf-modal-sub">
//           Fill in your details to personalise the invoice. Company field is optional.
//         </p>

//         <div className="pdf-fields">
//           {[
//             { key: "name", icon: <FaUser />, label: "Full Name", placeholder: "Arjun Sharma", type: "text" },
//             { key: "phone", icon: <FaPhone />, label: "Phone Number", placeholder: "+91 98765 43210", type: "tel" },
//             { key: "email", icon: <FaEnvelope />, label: "Email", placeholder: "arjun@example.com", type: "email" },
//             { key: "company", icon: <FaBuilding />, label: "Company", placeholder: "Acme Pvt. Ltd. (optional)", type: "text" },
//           ].map(({ key, icon, label, placeholder, type }) => (
//             <div key={key} className={`pdf-field ${errors[key] ? "field-error" : ""}`}>
//               <label className="pdf-field-label">{label}</label>
//               <div className="pdf-field-wrap">
//                 <span className="pdf-field-icon">{icon}</span>
//                 <input
//                   type={type}
//                   className="pdf-field-input"
//                   placeholder={placeholder}
//                   value={form[key]}
//                   onChange={handle(key)}
//                 />
//               </div>
//               {errors[key] && <span className="pdf-field-err">{errors[key]}</span>}
//             </div>
//           ))}
//         </div>

//         <button
//           className={`pdf-generate-btn ${isGenerating ? "pdf-generating" : ""}`}
//           onClick={() => validate() && onGenerate(form)}
//           disabled={isGenerating}
//         >
//           {isGenerating ? (
//             <>
//               <span className="pdf-spinner" />
//               Generating PDF…
//             </>
//           ) : (
//             <>
//               <FaFilePdf />
//               Download Invoice PDF
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ─── Main Cart Component ─────────────────────────────────────── */
// const Cart = () => {
//   const { cart, setCart, products } = useContext(ProductContext);
//   const [coupon, setCoupon] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [payMethod, setPayMethod] = useState("upi");
//   const [showPdfModal, setShowPdfModal] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);

//   const coupons = { SAVE10: 0.1, SAVE20: 0.2, FIRST50: 0.5, NINJALUI100: 1 };

//   const cartItems = useMemo(() => {
//     return Object.keys(cart)
//       .map((id) => {
//         const found = products.find((p) => p.productId === id);
//         return found ? { ...found, quantity: cart[id] } : null;
//       })
//       .filter(Boolean);
//   }, [cart]);

//   const subtotal = cartItems.reduce((a, i) => a + i.mrpPrice * i.quantity, 0);
//   const totalBeforeCoupon = cartItems.reduce(
//     (a, i) => a + (i.salePrice ?? i.mrpPrice) * i.quantity,
//     0
//   );
//   const discountFromCoupon = appliedCoupon
//     ? totalBeforeCoupon * coupons[appliedCoupon]
//     : 0;
//   const finalTotal = totalBeforeCoupon - discountFromCoupon;
//   const totalQty = cartItems.reduce((a, i) => a + i.quantity, 0);
//   const totalSaved = subtotal - finalTotal;

//   // UI formatter — ₹ works fine in the browser
//   const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

//   const applyCoupon = () => {
//     const code = coupon.trim().toUpperCase();
//     if (coupons[code]) setAppliedCoupon(code);
//     else alert("Invalid Coupon Code");
//   };

//   const removeCoupon = () => {
//     setAppliedCoupon(null);
//     setCoupon("");
//   };

//   const increaseQty = (id) =>
//     setCart((prev) => ({ ...prev, [id]: prev[id] + 1 }));

//   const decreaseQty = (id) =>
//     setCart((prev) => {
//       if (prev[id] === 1) {
//         const next = { ...prev };
//         delete next[id];
//         return next;
//       }
//       return { ...prev, [id]: prev[id] - 1 };
//     });

//   const removeItem = (id) =>
//     setCart((prev) => {
//       const next = { ...prev };
//       delete next[id];
//       return next;
//     });

//   const handleGenerate = async (userInfo) => {
//     setIsGenerating(true);
//     try {
//       await generatePDF(
//         userInfo,
//         cartItems,
//         finalTotal,
//         appliedCoupon,
//         discountFromCoupon,
//         subtotal,
//         totalBeforeCoupon
//       );
//     } catch (err) {
//       console.error(err);
//       alert("Failed to generate PDF. Please try again.");
//     } finally {
//       setIsGenerating(false);
//       setShowPdfModal(false);
//     }
//   };

//   return (
//     <div className="cart-page">
//       {showPdfModal && (
//         <UserInfoModal
//           onClose={() => setShowPdfModal(false)}
//           onGenerate={handleGenerate}
//           isGenerating={isGenerating}
//         />
//       )}

//       {/* Header */}
//       <div className="cart-header">
//         <div className="cart-header-inner">
//           <span className="cart-eyebrow">Shopping Bag</span>
//           <h1 className="cart-title">
//             {totalQty === 0
//               ? "Your bag is empty"
//               : `${totalQty} item${totalQty > 1 ? "s" : ""}`}
//           </h1>
//         </div>
//       </div>

//       <div className="cart-body">
//         {/* LEFT — Items */}
//         <div className="cart-left">
//           {cartItems.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-icon">
//                 <FaShoppingCart />
//               </div>
//               <p className="empty-text">Add items to get started</p>
//               <Link className="cart-shop-link" to="/products">
//                 <button className="empty-cta">
//                   Continue Shopping 
//                   <div className="empty-cart-icon">
//                   <FaChevronRight />
//                   </div>
//                 </button>
//               </Link>
//             </div>
//           ) : (
//             <>
//               <div className="items-list">
//                 {cartItems.map((item, idx) => {
//                   const hasSale = item.salePrice && item.salePrice < item.mrpPrice;
//                   const savings = hasSale
//                     ? ((1 - item.salePrice / item.mrpPrice) * 100).toFixed(0)
//                     : null;

//                   return (
//                     <div
//                       key={item.productId}
//                       className="item-row"
//                       style={{ animationDelay: `${idx * 60}ms` }}
//                     >
//                       <div className="item-img-wrap">
//                         <img
//                           src={item.imageUrl}
//                           alt={item.productName}
//                           className="item-img"
//                         />
//                         {savings && (
//                           <span className="item-badge">-{savings}%</span>
//                         )}
//                       </div>

//                       <div className="item-body">
//                         <div className="item-top">
//                           <h3 className="item-name">{item.productName}</h3>
//                           <button
//                             className="item-remove"
//                             onClick={() => removeItem(item.productId)}
//                             aria-label="Remove item"
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>

//                         <div className="item-prices">
//                           {hasSale ? (
//                             <>
//                               <span className="price-sale">
//                                 {fmt(item.salePrice)}
//                               </span>
//                               <span className="price-mrp">
//                                 {fmt(item.mrpPrice)}
//                               </span>
//                             </>
//                           ) : (
//                             <span className="price-sale">
//                               {fmt(item.mrpPrice)}
//                             </span>
//                           )}
//                         </div>

//                         <div className="item-footer">
//                           <div className="qty-control">
//                             <button
//                               className="qty-btn"
//                               onClick={() => decreaseQty(item.productId)}
//                             >
//                               <FaMinus />
//                             </button>
//                             <span className="qty-num">{item.quantity}</span>
//                             <button
//                               className="qty-btn"
//                               onClick={() => increaseQty(item.productId)}
//                             >
//                               <FaPlus />
//                             </button>
//                           </div>
//                           <span className="item-line-total">
//                             {fmt(
//                               (item.salePrice ?? item.mrpPrice) * item.quantity
//                             )}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {totalSaved > 0 && (
//                 <div className="savings-banner">
//                   <span className="savings-icon">✦</span>
//                   <span>
//                     You're saving <strong>{fmt(totalSaved)}</strong> on this
//                     order
//                   </span>
//                 </div>
//               )}

//               <button
//                 className="pdf-export-btn"
//                 onClick={() => setShowPdfModal(true)}
//               >
//                 <FaFilePdf />
//                 <span>Export as Invoice PDF</span>
//                 <span className="pdf-export-badge">PREMIUM</span>
//               </button>
//             </>
//           )}
//         </div>

//         {/* RIGHT — Summary */}
//         <div className="cart-right">
//           <div className="summary-panel">
//             <div className="section-label">Promo Code</div>
//             {!appliedCoupon ? (
//               <div className="coupon-row">
//                 <div className="coupon-input-wrap">
//                   <FaTag className="coupon-icon" />
//                   <input
//                     type="text"
//                     className="coupon-input"
//                     placeholder="Enter code"
//                     value={coupon}
//                     onChange={(e) => setCoupon(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
//                   />
//                 </div>
//                 <button className="coupon-apply-btn" onClick={applyCoupon}>
//                   Apply
//                 </button>
//               </div>
//             ) : (
//               <div className="coupon-applied">
//                 <div className="coupon-applied-left">
//                   <span className="coupon-check">✓</span>
//                   <span className="coupon-code-text">{appliedCoupon}</span>
//                   <span className="coupon-discount-label">
//                     -{(coupons[appliedCoupon] * 100).toFixed(0)}% off
//                   </span>
//                 </div>
//                 <button className="coupon-remove" onClick={removeCoupon}>
//                   Remove
//                 </button>
//               </div>
//             )}

//             <div className="divider" />

//             <div className="section-label">Order Summary</div>
//             <div className="price-rows">
//               <div className="price-row">
//                 <span>Subtotal (MRP)</span>
//                 <span>{fmt(subtotal)}</span>
//               </div>
//               <div className="price-row discount">
//                 <span>Product Discount</span>
//                 <span>− {fmt(subtotal - totalBeforeCoupon)}</span>
//               </div>
//               {appliedCoupon && (
//                 <div className="price-row discount">
//                   <span>Coupon ({appliedCoupon})</span>
//                   <span>− {fmt(discountFromCoupon)}</span>
//                 </div>
//               )}
//               <div className="price-row free-ship">
//                 <span>
//                   <FaTruck style={{ marginRight: 6 }} />
//                   Delivery
//                 </span>
//                 <span className="free-tag">FREE</span>
//               </div>
//             </div>

//             <div className="divider" />

//             <div className="total-row">
//               <span>Total</span>
//               <span>{fmt(finalTotal)}</span>
//             </div>

//             <div className="divider" />

//             <div className="section-label">Payment Method</div>
//             <div className="payment-methods">
//               {[
//                 { id: "upi", icon: <FaWallet />, label: "UPI" },
//                 { id: "card", icon: <FaCreditCard />, label: "Card" },
//                 { id: "cod", icon: <FaTruck />, label: "Cash on Delivery" },
//               ].map(({ id, icon, label }) => (
//                 <label
//                   key={id}
//                   className={`pay-option ${payMethod === id ? "pay-active" : ""}`}
//                 >
//                   <input
//                     type="radio"
//                     name="payment"
//                     value={id}
//                     checked={payMethod === id}
//                     onChange={() => setPayMethod(id)}
//                   />
//                   <span className="pay-icon">{icon}</span>
//                   <span className="pay-label">{label}</span>
//                   {payMethod === id && <span className="pay-dot" />}
//                 </label>
//               ))}
//             </div>

//             <button
//               className="checkout-btn"
//               disabled={cartItems.length === 0}
//             >
//               <FaLock style={{ fontSize: 13 }} />
//               Secure Checkout · {fmt(finalTotal)}
//             </button>

//             <p className="checkout-note">
//               By placing your order you agree to our Terms &amp; Privacy Policy.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;


import React, { useContext, useMemo, useState, useRef, useEffect } from "react";
import { ProductContext } from "../../Context/Context";
import {
  FaTrash,
  FaTag,
  FaLock,
  FaShoppingCart,
  FaTruck,
  FaCreditCard,
  FaWallet,
  FaPlus,
  FaMinus,
  FaChevronRight,
  FaFilePdf,
  FaTimes,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBuilding,
} from "react-icons/fa";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import SignInSignUp from "../Signupsignin/Signupsignin.jsx";
import logoMark from "../../assets/logo.png";

const API_BASE = import.meta.env.VITE_API_URL || "https://testingserver-73um.onrender.com";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const res = await fetch(`https://testingserver-73um.onrender.com/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

/* Company details printed in the PDF catalogue (same as the site footer) */
const COMPANY = {
  name: "Sequence Surfaces LLP",
  tagline: "Exclusive Laminate Company, Bangalore",
  showroom: ["No 269/1 Mysore Road, Kasturiba Nagar", "Bangalore - 560026"],
  showroomMap: "https://maps.app.goo.gl/uoXK3vrvdthMMRck7",
  warehouse: ["46/1, 1st Main Road, Kamakshipalya", "Bangalore - 560079"],
  warehouseMap: "https://maps.app.goo.gl/noSpS8DtiZXgM16KA",
  phones: ["+91 9164001231", "+91 6363865515"],
  whatsapp: "+91 8660799143",
  email: "experience@sequencesurface.com",
  website: "sequencesurface.com",
  hours: "Mon - Fri, 11 AM to 7 PM",
};

const generatePDF = async (userInfo, cartItems) => {
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  const loadImage = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      // Separate URL so the browser can't reuse the page's non-CORS cached copy
      img.src = `${url}${url.includes("?") ? "&" : "?"}pdf=1`;
      setTimeout(() => resolve(null), 8000);
    });

  const generateQR = (text) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(text)}`;

  // Name, description, price and link. Returns the y below the link.
  const drawProductInfo = (item, productUrl, x, startY, width, maxLines) => {
    let y = startY;

    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    const name = doc.splitTextToSize(item.productName, width);
    doc.text(name, x, y);
    y += name.length * 24 + 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    const desc =
      item.description ||
      "Premium decorative laminate designed for elegant interiors with high durability and modern aesthetics.";
    const allLines = doc.splitTextToSize(desc, width);
    const lines = allLines.slice(0, maxLines);
    if (allLines.length > maxLines) lines[maxLines - 1] += "...";
    doc.text(lines, x, y);
    y += lines.length * 15 + 12;

    const price = item.salePrice ?? item.mrpPrice;
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text(`Rs. ${price}${item.unit ? ` / ${item.unit}` : ""}`, x, y);

    y += 22;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 102, 204);
    doc.textWithLink("View product online", x, y, { url: productUrl });

    return y;
  };

  // Specs table: only shows what the product actually has. Returns the y below it.
  const drawProductDetails = (item, x, startY, width, columns) => {
    const rows = [
      ["Product code", item.productCode],
      ["Brand", item.brand],
      ["Category", item.parentCategory?.name],
      ["Collection", item.childCategory?.name],
      ["Size", item.size],
      ["Area", item.area],
      ["Finish", item.finishType],
      ["Texture", item.finishTexture],
      ["Colour", item.color],
      ["Colour tone", item.colorTone],
      ["Material", item.materialComposition],
      ["Orientation", item.orientation],
      ["Style", item.styleFit],
      ["Net weight", item.netWeight],
      ["HSN code", item.hsnCode],
      ["GST", item.gst ? `${item.gst}%` : null],
    ].filter(([, value]) => value);

    const LABEL_W = 66;
    const ROW_H = 16;
    const columnW = width / columns;
    let y = startY;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text("Product details", x, y);
    y += 8;
    doc.setDrawColor(235, 199, 108);
    doc.line(x, y, x + width, y);
    y += 15;

    doc.setFontSize(9);
    rows.forEach(([label, value], i) => {
      const rowX = x + (i % columns) * columnW;
      const rowY = y + Math.floor(i / columns) * ROW_H;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(label, rowX, rowY);
      doc.setTextColor(30, 30, 30);
      doc.text(
        doc.splitTextToSize(String(value), columnW - LABEL_W - 8)[0],
        rowX + LABEL_W,
        rowY
      );
    });
    y += Math.ceil(rows.length / columns) * ROW_H;

    const uses = item.whereToUse?.length ? item.whereToUse : item.applications;
    if (uses?.length) {
      const useLines = doc.splitTextToSize(uses.join(", "), width - LABEL_W);
      doc.setTextColor(120, 120, 120);
      doc.text("Where to use", x, y);
      doc.setTextColor(30, 30, 30);
      doc.text(useLines, x + LABEL_W, y);
      y += useLines.length * 12 + 4;
    }

    return y;
  };

  doc.setFillColor(10, 10, 12);
  doc.rect(0, 0, W, H, "F");

  // The full logo is blocked for PDFs on other domains, so fall back to the local mark
  const logo =
    (await loadImage("https://sequencesurface.com/images/logo.png")) ||
    (await loadImage(logoMark));

  const drawLogo = (y) => {
    if (!logo) return;
    const logoW = 60 * (logo.naturalWidth / logo.naturalHeight);
    doc.addImage(logo, "PNG", W / 2 - logoW / 2, y, logoW, 60);
  };

  drawLogo(120);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("Sequence Surface", W / 2, 250, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(180, 180, 180);
  doc.text("Premium Laminate Catalogue", W / 2, 280, { align: "center" });

  const now = new Date().toLocaleString("en-IN");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(now, W / 2, H - 60, { align: "center" });

  doc.addPage();

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const productUrl =
      item.productLink ||
      `https://sequencesurface.com/product/${item.productId}`;

    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, W, H, "F");

    for (let g = 0; g < H; g += 4) {
      const shade = Math.max(220, 250 - g * 0.05);
      doc.setFillColor(shade, shade, shade);
      doc.rect(0, g, W, 4, "F");
    }

    const img = await loadImage(item.imageUrl);
    const aspectRatio = img ? img.naturalWidth / img.naturalHeight : 1.5;
    const qrImg = await loadImage(generateQR(productUrl));

    if (aspectRatio < 0.85) {
      const portraitW = W * 0.45;
      const portraitH = Math.min(H * 0.85, portraitW / aspectRatio);

      doc.addImage(img, "JPEG", W - portraitW - 20, (H - portraitH) / 2, portraitW, portraitH);

      doc.setDrawColor(220, 220, 220);
      doc.line(W * 0.52, 40, W * 0.52, H - 40);

      const textMaxW = W * 0.48 - 60;
      let y = drawProductInfo(item, productUrl, 40, 80, textMaxW, 6);
      y = drawProductDetails(item, 40, y + 30, textMaxW, 1);

      if (qrImg) {
        doc.addImage(qrImg, "PNG", 40, y + 6, 80, 80);
      }
    } else {
      const heroH = !img ? 130 : aspectRatio > 1.4 ? H * 0.45 : H * 0.52;

      if (img) {
        doc.addImage(img, "JPEG", 0, 0, W, heroH);
      } else {
        doc.setFillColor(10, 10, 12);
        doc.rect(0, 0, W, heroH, "F");
      }

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(30, heroH - 20, W - 60, H - heroH - 10, 20, 20, "F");

      const y = drawProductInfo(item, productUrl, 50, heroH + 24, W - 210, 3);
      drawProductDetails(item, 50, y + 28, W - 100, 2);

      if (qrImg) {
        doc.addImage(qrImg, "PNG", W - 140, heroH + 10, 90, 90);
      }
    }

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(
      `${COMPANY.name}  |  ${COMPANY.showroom.join(", ")}  |  ${COMPANY.phones[0]}  |  ${COMPANY.email}`,
      W / 2,
      H - 36,
      { align: "center" }
    );

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(
      `${userInfo.name || ""} · ${userInfo.phone || ""} · ${userInfo.email || ""}`,
      W / 2,
      H - 22,
      { align: "center" }
    );

    doc.addPage();
  }

  // Back page with the full company details
  doc.setFillColor(10, 10, 12);
  doc.rect(0, 0, W, H, "F");

  drawLogo(90);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(235, 199, 108);
  doc.text(COMPANY.name, W / 2, 200, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  doc.text(COMPANY.tagline, W / 2, 222, { align: "center" });

  const sections = [
    {
      title: "Showroom",
      lines: [
        ...COMPANY.showroom.map((text) => ({ text })),
        { text: "View on map", url: COMPANY.showroomMap },
      ],
    },
    {
      title: "Warehouse",
      lines: [
        ...COMPANY.warehouse.map((text) => ({ text })),
        { text: "View on map", url: COMPANY.warehouseMap },
      ],
    },
    {
      title: "Call or WhatsApp",
      lines: [
        ...COMPANY.phones.map((text) => ({
          text,
          url: `tel:${text.replace(/\s/g, "")}`,
        })),
        {
          text: `WhatsApp ${COMPANY.whatsapp}`,
          url: `https://wa.me/${COMPANY.whatsapp.replace(/\D/g, "")}`,
        },
      ],
    },
    {
      title: "Email and website",
      lines: [
        { text: COMPANY.email, url: `mailto:${COMPANY.email}` },
        { text: COMPANY.website, url: `https://${COMPANY.website}` },
        { text: COMPANY.hours },
      ],
    },
  ];

  sections.forEach((section, i) => {
    const x = i % 2 === 0 ? 80 : W / 2 + 30;
    let y = 300 + Math.floor(i / 2) * 130;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(235, 199, 108);
    doc.text(section.title, x, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    section.lines.forEach(({ text, url }) => {
      y += 19;
      if (url) {
        doc.setTextColor(235, 199, 108);
        doc.textWithLink(text, x, y, { url });
      } else {
        doc.setTextColor(220, 220, 220);
        doc.text(text, x, y);
      }
    });
  });

  doc.save("Sequence_Brochure.pdf");
};

/* ─── User Info Modal ───────────────────────── */
const UserInfoModal = ({ onClose, onGenerate, isGenerating, prefillData }) => {
  const [form, setForm] = useState({
    name: prefillData?.name || "",
    phone: prefillData?.phone || "",
    email: prefillData?.email || "",
    company: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handle = (k) => (ev) => {
    setForm((p) => ({ ...p, [k]: ev.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  return (
    <div className="pdf-overlay" onClick={onClose}>
      <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-modal-header">
          <div className="pdf-modal-brand">
            <span className="pdf-brand-dot" />
            <span>Generate Order PDF</span>
          </div>
          <button className="pdf-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <p className="pdf-modal-sub">
          Fill in your details to personalise the invoice. Company field is optional.
        </p>

        <div className="pdf-fields">
          {[
            { key: "name", icon: <FaUser />, label: "Full Name", placeholder: "Arjun Sharma", type: "text" },
            { key: "phone", icon: <FaPhone />, label: "Phone Number", placeholder: "+91 98765 43210", type: "tel" },
            { key: "email", icon: <FaEnvelope />, label: "Email", placeholder: "arjun@example.com", type: "email" },
            { key: "company", icon: <FaBuilding />, label: "Company", placeholder: "Acme Pvt. Ltd. (optional)", type: "text" },
          ].map(({ key, icon, label, placeholder, type }) => (
            <div key={key} className={`pdf-field ${errors[key] ? "field-error" : ""}`}>
              <label className="pdf-field-label">{label}</label>
              <div className="pdf-field-wrap">
                <span className="pdf-field-icon">{icon}</span>
                <input
                  type={type}
                  className="pdf-field-input"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={handle(key)}
                />
              </div>
              {errors[key] && <span className="pdf-field-err">{errors[key]}</span>}
            </div>
          ))}
        </div>

        <button
          className={`pdf-generate-btn ${isGenerating ? "pdf-generating" : ""}`}
          onClick={() => validate() && onGenerate(form)}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <><span className="pdf-spinner" />Generating PDF…</>
          ) : (
            <><FaFilePdf />Download Invoice PDF</>
          )}
        </button>
      </div>
    </div>
  );
};

/* ─── Checkout Info Modal ─────────────────────── */
const CheckoutInfoModal = ({ onClose, onProceed, isProcessing, amount, payMethod, prefillData }) => {
  const [form, setForm] = useState({
    name: prefillData?.name || "",
    phone: prefillData?.phone || "",
    email: prefillData?.email || "",
    address: prefillData?.address || "",
    city: prefillData?.city || "",
    state: prefillData?.state || "",
    pincode: prefillData?.pincode || "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim() || !/^[0-9]{10}$/.test(form.phone.replace(/\D/g, "").slice(-10)))
      e.phone = "Valid 10-digit phone required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.pincode.trim() || !/^[0-9]{6}$/.test(form.pincode))
      e.pincode = "Valid 6-digit pincode required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handle = (k) => (ev) => {
    setForm((p) => ({ ...p, [k]: ev.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  const isCOD = payMethod === "cod";

  return (
    <div className="pdf-overlay" onClick={onClose}>
      <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-modal-header">
          <div className="pdf-modal-brand">
            <span className="pdf-brand-dot" />
            <span>Secure Checkout</span>
          </div>
          <button className="pdf-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <p className="pdf-modal-sub">
          {isCOD ? (
            <>You'll pay <strong>{fmt(amount)}</strong> in cash on delivery.</>
          ) : (
            <>You'll pay <strong>{fmt(amount)}</strong> via Razorpay. Test mode is active — no real money will be charged.</>
          )}
        </p>

        <div className="pdf-fields">
          {[
            { key: "name", icon: <FaUser />, label: "Full Name", placeholder: "Arjun Sharma", type: "text" },
            { key: "phone", icon: <FaPhone />, label: "Phone Number", placeholder: "9876543210", type: "tel" },
            { key: "email", icon: <FaEnvelope />, label: "Email", placeholder: "arjun@example.com", type: "email" },
            { key: "address", icon: <FaBuilding />, label: "Street Address", placeholder: "Flat 12, MG Road", type: "text" },
            { key: "city", icon: <FaBuilding />, label: "City", placeholder: "Bengaluru", type: "text" },
            { key: "state", icon: <FaBuilding />, label: "State", placeholder: "Karnataka", type: "text" },
            { key: "pincode", icon: <FaBuilding />, label: "Pincode", placeholder: "560001", type: "text" },
          ].map(({ key, icon, label, placeholder, type }) => (
            <div key={key} className={`pdf-field ${errors[key] ? "field-error" : ""}`}>
              <label className="pdf-field-label">{label}</label>
              <div className="pdf-field-wrap">
                <span className="pdf-field-icon">{icon}</span>
                <input
                  type={type}
                  className="pdf-field-input"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={handle(key)}
                />
              </div>
              {errors[key] && <span className="pdf-field-err">{errors[key]}</span>}
            </div>
          ))}
        </div>

        <button
          className={`pdf-generate-btn ${isProcessing ? "pdf-generating" : ""}`}
          onClick={() => validate() && onProceed(form)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <><span className="pdf-spinner" />{isCOD ? "Placing order…" : "Opening Razorpay…"}</>
          ) : (
            <><FaLock />{isCOD ? `Place COD Order · ${fmt(amount)}` : `Pay ${fmt(amount)} Securely`}</>
          )}
        </button>

        {!isCOD && (
          <p style={{ fontSize: 11, color: "#888", textAlign: "center", marginTop: 10 }}>
            🔒 TEST MODE — Card: <strong>4111 1111 1111 1111</strong> · any future expiry · any CVV
          </p>
        )}
      </div>
    </div>
  );
};

/* ─── Main Cart Component ─────────────────────────────────────── */
const Cart = () => {
  const { cart, setCart, products } = useContext(ProductContext);
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [payMethod, setPayMethod] = useState("upi");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // ✅ NEW — controls login popup instead of alert
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const coupons = { SAVE10: 0.1, SAVE20: 0.2, FIRST50: 0.5, NINJALUI100: 1 };

  useEffect(() => {
    loadRazorpayScript();
    if (isLoggedIn()) {
      fetchUserProfile().then((profile) => {
        if (profile) {
          const defaultAddr = profile.addresses?.find((a) => a.isDefault) || profile.addresses?.[0];
          setUserProfile({
            name: profile.name || "",
            phone: profile.phone || "",
            email: profile.email || "",
            address: defaultAddr?.street || defaultAddr?.address || "",
            city: defaultAddr?.city || "",
            state: defaultAddr?.state || "",
            pincode: defaultAddr?.pincode || defaultAddr?.zip || "",
          });
        }
      });
    }
  }, []);

  const cartItems = useMemo(() => {
    return Object.keys(cart)
      .map((id) => {
        const found = products.find((p) => p.productId === id);
        return found ? { ...found, quantity: cart[id] } : null;
      })
      .filter(Boolean);
  }, [cart, products]);

  const subtotal = cartItems.reduce((a, i) => a + i.mrpPrice * i.quantity, 0);
  const totalBeforeCoupon = cartItems.reduce(
    (a, i) => a + (i.salePrice ?? i.mrpPrice) * i.quantity, 0
  );
  const discountFromCoupon = appliedCoupon ? totalBeforeCoupon * coupons[appliedCoupon] : 0;
  const finalTotal = totalBeforeCoupon - discountFromCoupon;
  const totalQty = cartItems.reduce((a, i) => a + i.quantity, 0);
  const totalSaved = subtotal - finalTotal;

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (coupons[code]) setAppliedCoupon(code);
    else alert("Invalid Coupon Code");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
  };

  const increaseQty = (id) =>
    setCart((prev) => ({ ...prev, [id]: prev[id] + 1 }));

  const decreaseQty = (id) =>
    setCart((prev) => {
      if (prev[id] === 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: prev[id] - 1 };
    });

  const removeItem = (id) =>
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  // ✅ Now opens popup instead of alert + redirect
  const redirectToLogin = () => {
    setShowAuthPopup(true);
  };

  const handleOpenPdfModal = async () => {
    if (!isLoggedIn()) {
      redirectToLogin();
      return;
    }
    if (!userProfile) {
      const profile = await fetchUserProfile();
      if (profile) {
        setUserProfile({
          name: profile.name || "",
          phone: profile.phone || "",
          email: profile.email || "",
        });
      }
    }
    setShowPdfModal(true);
  };

  const handleOpenCheckoutModal = async () => {
    if (!isLoggedIn()) {
      redirectToLogin();
      return;
    }
    if (!userProfile) {
      const profile = await fetchUserProfile();
      if (profile) {
        const defaultAddr = profile.addresses?.find((a) => a.isDefault) || profile.addresses?.[0];
        setUserProfile({
          name: profile.name || "",
          phone: profile.phone || "",
          email: profile.email || "",
          address: defaultAddr?.street || defaultAddr?.address || "",
          city: defaultAddr?.city || "",
          state: defaultAddr?.state || "",
          pincode: defaultAddr?.pincode || defaultAddr?.zip || "",
        });
      }
    }
    setShowCheckoutModal(true);
  };

  const handleGenerate = async (userInfo) => {
    setIsGenerating(true);
    try {
      await generatePDF(userInfo, cartItems, finalTotal, appliedCoupon, discountFromCoupon, subtotal, totalBeforeCoupon);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
      setShowPdfModal(false);
    }
  };

  const handleRazorpayPayment = async (userInfo) => {
    setIsProcessingPayment(true);

    const token = localStorage.getItem("token");
    if (!token) {
      redirectToLogin();
      setIsProcessingPayment(false);
      return;
    }

    const itemsPayload = cartItems.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      imageUrl: i.imageUrl,
      quantity: i.quantity,
      price: i.salePrice ?? i.mrpPrice,
      mrpPrice: i.mrpPrice,
    }));

    if (payMethod === "cod") {
      try {
        alert(`✅ COD Order placed!\n\nTotal: ${fmt(finalTotal)}\nWe'll contact ${userInfo.phone} to confirm delivery.`);
        setCart({});
        setShowCheckoutModal(false);
      } catch (err) {
        alert("Failed to place COD order");
      } finally {
        setIsProcessingPayment(false);
      }
      return;
    }

    try {
      const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: finalTotal,
          items: itemsPayload,
          coupon: appliedCoupon,
          shippingAddress: userInfo,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        if (orderRes.status === 401) {
          localStorage.removeItem("token");
          redirectToLogin();
          return;
        }
        throw new Error(orderData.message || "Order creation failed");
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay failed to load. Check your connection.");

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sequence Surface",
        description: `Order of ${totalQty} item${totalQty > 1 ? "s" : ""}`,
        image: "https://sequencesurface.com/images/logo.png",
        order_id: orderData.orderId,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              alert(`✅ Payment Successful!\n\nPayment ID: ${response.razorpay_payment_id}\nAmount: ${fmt(finalTotal)}\n\nThank you, ${userInfo.name}!`);
              setCart({});
              setShowCheckoutModal(false);
            } else {
              alert(`⚠️ Payment received but verification failed.\nContact support with Payment ID: ${response.razorpay_payment_id}`);
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert(`⚠️ Payment received but verification failed.\nContact support with Payment ID: ${response.razorpay_payment_id}`);
          }
        },

        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.phone,
        },

        notes: {
          address: `${userInfo.address}, ${userInfo.city}, ${userInfo.state} - ${userInfo.pincode}`,
          coupon: appliedCoupon || "none",
        },

        theme: { color: "#0a0a0c" },

        modal: {
          ondismiss: async function () {
            try {
              await fetch(`${API_BASE}/api/payment/failed`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: orderData.orderId,
                  reason: "User closed the payment window",
                }),
              });
            } catch (_) {}
            setIsProcessingPayment(false);
          },
        },

        method: {
          upi: payMethod === "upi",
          card: payMethod === "card",
          netbanking: true,
          wallet: true,
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function (response) {
        console.error("Payment Failed:", response.error);
        try {
          await fetch(`${API_BASE}/api/payment/failed`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: orderData.orderId,
              reason: response.error.description,
            }),
          });
        } catch (_) {}

        alert(`❌ Payment Failed\n\nReason: ${response.error.description}\nCode: ${response.error.code}\n\nPlease try again.`);
        setIsProcessingPayment(false);
      });

      rzp.open();
      setIsProcessingPayment(false);
    } catch (err) {
      console.error("Checkout error:", err);
      alert(`Checkout failed: ${err.message}`);
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="cart-page">

      {/* ✅ Login popup — opens instead of alert when user is not logged in */}
      {showAuthPopup && (
        <SignInSignUp onClose={() => setShowAuthPopup(false)} />
      )}

      {showPdfModal && (
        <UserInfoModal
          onClose={() => setShowPdfModal(false)}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          prefillData={userProfile}
        />
      )}

      {showCheckoutModal && (
        <CheckoutInfoModal
          onClose={() => setShowCheckoutModal(false)}
          onProceed={handleRazorpayPayment}
          isProcessing={isProcessingPayment}
          amount={finalTotal}
          payMethod={payMethod}
          prefillData={userProfile}
        />
      )}

      {/* Header */}
      <div className="cart-header">
        <div className="cart-header-inner">
          <span className="cart-eyebrow">Shopping Bag</span>
          <h1 className="cart-title">
            {totalQty === 0
              ? "Your bag is empty"
              : `${totalQty} item${totalQty > 1 ? "s" : ""}`}
          </h1>
        </div>
      </div>

      <div className="cart-body">
        {/* LEFT — Items */}
        <div className="cart-left">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><FaShoppingCart /></div>
              <p className="empty-text">Add items to get started</p>
              <Link className="cart-shop-link" to="/products">
                <button className="empty-cta">
                  Continue Shopping
                  <div className="empty-cart-icon"><FaChevronRight /></div>
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="items-list">
                {cartItems.map((item, idx) => {
                  const hasSale = item.salePrice && item.salePrice < item.mrpPrice;
                  const savings = hasSale
                    ? ((1 - item.salePrice / item.mrpPrice) * 100).toFixed(0)
                    : null;

                  return (
                    <div
                      key={item.productId}
                      className="item-row"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <div className="item-img-wrap">
                        <img src={item.imageUrl} alt={item.productName} className="item-img" />
                        {savings && <span className="item-badge">-{savings}%</span>}
                      </div>

                      <div className="item-body">
                        <div className="item-top">
                          <h3 className="item-name">{item.productName}</h3>
                          <button
                            className="item-remove"
                            onClick={() => removeItem(item.productId)}
                            aria-label="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </div>

                        <div className="item-prices">
                          {hasSale ? (
                            <>
                              <span className="price-sale">{fmt(item.salePrice)}</span>
                              <span className="price-mrp">{fmt(item.mrpPrice)}</span>
                            </>
                          ) : (
                            <span className="price-sale">{fmt(item.mrpPrice)}</span>
                          )}
                        </div>

                        <div className="item-footer">
                          <div className="qty-control">
                            <button className="qty-btn" onClick={() => decreaseQty(item.productId)}>
                              <FaMinus />
                            </button>
                            <span className="qty-num">{item.quantity}</span>
                            <button className="qty-btn" onClick={() => increaseQty(item.productId)}>
                              <FaPlus />
                            </button>
                          </div>
                          <span className="item-line-total">
                            {fmt((item.salePrice ?? item.mrpPrice) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalSaved > 0 && (
                <div className="savings-banner">
                  <span className="savings-icon">✦</span>
                  <span>You're saving <strong>{fmt(totalSaved)}</strong> on this order</span>
                </div>
              )}

              <button className="pdf-export-btn" onClick={handleOpenPdfModal}>
                <FaFilePdf />
                <span>Export as Invoice PDF</span>
                <span className="pdf-export-badge">PREMIUM</span>
              </button>
            </>
          )}
        </div>

        {/* RIGHT — Summary */}
        <div className="cart-right">
          <div className="summary-panel">
            <div className="section-label">Promo Code</div>
            {!appliedCoupon ? (
              <div className="coupon-row">
                <div className="coupon-input-wrap">
                  <FaTag className="coupon-icon" />
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Enter code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  />
                </div>
                <button className="coupon-apply-btn" onClick={applyCoupon}>Apply</button>
              </div>
            ) : (
              <div className="coupon-applied">
                <div className="coupon-applied-left">
                  <span className="coupon-check">✓</span>
                  <span className="coupon-code-text">{appliedCoupon}</span>
                  <span className="coupon-discount-label">
                    -{(coupons[appliedCoupon] * 100).toFixed(0)}% off
                  </span>
                </div>
                <button className="coupon-remove" onClick={removeCoupon}>Remove</button>
              </div>
            )}

            <div className="divider" />

            <div className="section-label">Order Summary</div>
            <div className="price-rows">
              <div className="price-row">
                <span>Subtotal (MRP)</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="price-row discount">
                <span>Product Discount</span>
                <span>− {fmt(subtotal - totalBeforeCoupon)}</span>
              </div>
              {appliedCoupon && (
                <div className="price-row discount">
                  <span>Coupon ({appliedCoupon})</span>
                  <span>− {fmt(discountFromCoupon)}</span>
                </div>
              )}
              <div className="price-row free-ship">
                <span><FaTruck style={{ marginRight: 6 }} />Delivery</span>
                <span className="free-tag">FREE</span>
              </div>
            </div>

            <div className="divider" />

            <div className="total-row">
              <span>Total</span>
              <span>{fmt(finalTotal)}</span>
            </div>

            <div className="divider" />

            <div className="section-label">Payment Method</div>
            <div className="payment-methods">
              {[
                { id: "upi", icon: <FaWallet />, label: "UPI" },
                { id: "card", icon: <FaCreditCard />, label: "Card" },
                { id: "cod", icon: <FaTruck />, label: "Cash on Delivery" },
              ].map(({ id, icon, label }) => (
                <label
                  key={id}
                  className={`pay-option ${payMethod === id ? "pay-active" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={id}
                    checked={payMethod === id}
                    onChange={() => setPayMethod(id)}
                  />
                  <span className="pay-icon">{icon}</span>
                  <span className="pay-label">{label}</span>
                  {payMethod === id && <span className="pay-dot" />}
                </label>
              ))}
            </div>

            <button
              className="checkout-btn"
              disabled={cartItems.length === 0}
              onClick={handleOpenCheckoutModal}
            >
              <FaLock style={{ fontSize: 13 }} />
              Secure Checkout · {fmt(finalTotal)}
            </button>

            <p className="checkout-note">
              By placing your order you agree to our Terms &amp; Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;