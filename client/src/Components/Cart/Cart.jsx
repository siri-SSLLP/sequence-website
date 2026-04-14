import React, { useContext, useMemo, useState, useRef } from "react";
import { ProductContext } from "../../Context/Context";
import { product as products } from "../../assets/assets";
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

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

/**
 * jsPDF's built-in Helvetica does NOT support the ₹ glyph.
 * We load NotoSans from Google Fonts as a TTF, convert it to
 * a base64 data-URL, then register it as a custom font so the
 * rupee symbol renders correctly inside the PDF.
 */
const loadRupeeFontBase64 = async () => {
  // Use a minimal subset TTF that contains the ₹ glyph.
  // We fetch it at runtime so we don't bloat the bundle.
  const url =
    "https://fonts.gstatic.com/s/notosans/v36/o-0IIpQlx3QUlC5A4PNr5TRG.woff2";

  // woff2 isn't directly embeddable in jsPDF; fetch the TTF variant instead.
  const ttfUrl =
    "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.0.8/files/noto-sans-latin-ext-400-normal.woff2";

  // Fallback: use a small open-source TTF that has the rupee sign
  const fallbackTtf =
    "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Regular.ttf";

  try {
    const res = await fetch(fallbackTtf);
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch {
    return null;
  }
};

/**
 * Load the Sequence Surface logo as a base64 JPEG/PNG string
 * so jsPDF can embed it.
 */
const loadLogoBase64 = async () => {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      // Use a CORS proxy-safe direct URL
      img.src = "https://sequencesurface.com/images/logo.png";
      setTimeout(res, 3000); // timeout fallback
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || 300;
    canvas.height = img.naturalHeight || 80;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
};

/* ─── PDF Generation ─────────────────────────────────────────── */
// const generatePDF = async (
//   userInfo,
//   cartItems,
//   finalTotal,
//   appliedCoupon,
//   discountFromCoupon,
//   subtotal,
//   totalBeforeCoupon
// ) => {
//   // ── 1. Load jsPDF ──
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

//   // ── 2. Load custom font (for ₹ support) ──
//   const fontB64 = await loadRupeeFontBase64();
//   let useCustomFont = false;
//   if (fontB64) {
//     try {
//       doc.addFileToVFS("NotoSans-Regular.ttf", fontB64);
//       doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
//       useCustomFont = true;
//     } catch {
//       useCustomFont = false;
//     }
//   }

//   // Font helper — falls back to helvetica if custom font failed
//   const setFont = (style = "normal", size = 10) => {
//     if (useCustomFont) {
//       doc.setFont("NotoSans", style === "bold" ? "normal" : "normal");
//     } else {
//       doc.setFont("helvetica", style);
//     }
//     doc.setFontSize(size);
//   };

//   // ── 3. Currency formatter — always outputs Rs. + value ──
//   //    We intentionally do NOT use ₹ with helvetica because it
//   //    renders as a blank square. With NotoSans it renders fine.
//   const fmt = (n) => {
//     const formatted = Number(n).toLocaleString("en-IN");
//     return useCustomFont ? `\u20B9${formatted}` : `Rs. ${formatted}`;
//   };

//   // ── 4. Load logo ──
//   const logoDataUrl = await loadLogoBase64();

//   // ── Palette ──
//   const BG = [10, 10, 14];
//   const SURFACE = [18, 18, 26];
//   const SURFACE2 = [28, 28, 40];
//   const GOLD = [212, 175, 95];
//   const GOLD_DIM = [160, 130, 60];
//   const WHITE = [255, 255, 255];
//   const MUTED = [130, 128, 142];
//   const GREEN = [80, 200, 140];
//   const BORDER = [45, 45, 62];

//   const setFill = (col) => doc.setFillColor(...col);
//   const setStroke = (col) => doc.setDrawColor(...col);
//   const setTxt = (col) => doc.setTextColor(...col);

//   /* ── Full BG ── */
//   setFill(BG);
//   doc.rect(0, 0, W, H, "F");

//   /* ── Top gold bar ── */
//   setFill(GOLD);
//   doc.rect(0, 0, W, 5, "F");

//   /* ── Header section ── */
//   let y = 42;

//   // Logo — embed real image if loaded, else fallback to text mark
//   if (logoDataUrl) {
//     // White pill background so logo is visible on dark bg
//     setFill([255, 255, 255]);
//     doc.roundedRect(36, y - 8, 140, 38, 5, 5, "F");
//     // Draw logo centered in the pill
//     doc.addImage(logoDataUrl, "PNG", 40, y - 4, 132, 30, undefined, "FAST");
//   } else {
//     // Fallback: gold square + text
//     setFill(GOLD);
//     doc.roundedRect(40, y - 6, 28, 28, 4, 4, "F");
//     setTxt(BG);
//     setFont("bold", 14);
//     doc.text("S", 49, y + 12);

//     setTxt(WHITE);
//     setFont("bold", 20);
//     doc.text("SEQUENCE", 78, y + 10);
//     setTxt(MUTED);
//     setFont("normal", 8);
//     doc.text("PREMIUM SURFACES", 78, y + 22);
//   }

//   // Invoice label — right aligned
//   setTxt(GOLD);
//   setFont("bold", 28);
//   doc.text("ORDER", W - 40, y + 16, { align: "right" });
//   setTxt(MUTED);
//   setFont("normal", 8);
//   doc.text("INVOICE", W - 40, y + 28, { align: "right" });

//   y += 52;

//   /* ── Thin gold separator ── */
//   setStroke(GOLD_DIM);
//   doc.setLineWidth(0.5);
//   doc.line(40, y, W - 40, y);
//   y += 22;

//   /* ── Invoice meta row ── */
//   const invoiceNo = `#SSL-${Date.now().toString().slice(-6)}`;
//   const dateStr = new Date().toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });

//   setTxt(MUTED);
//   setFont("normal", 8);
//   doc.text("INVOICE NO", 40, y);
//   doc.text("DATE", W / 2, y, { align: "center" });
//   doc.text("STATUS", W - 40, y, { align: "right" });

//   y += 10;
//   setTxt(WHITE);
//   setFont("bold", 10);
//   doc.text(invoiceNo, 40, y);
//   doc.text(dateStr, W / 2, y, { align: "center" });

//   // Status pill
//   setFill(GREEN);
//   doc.roundedRect(W - 120, y - 9, 80, 13, 3, 3, "F");
//   setTxt(BG);
//   setFont("bold", 8);
//   doc.text("FROM CART", W - 80, y, { align: "center" });

//   y += 28;

//   /* ── Two-column: Bill To + Company ── */
//   const colW = (W - 80 - 20) / 2;

//   // Left card
//   setFill(SURFACE);
//   doc.roundedRect(40, y, colW, 90, 6, 6, "F");
//   setStroke(BORDER);
//   doc.setLineWidth(0.5);
//   doc.roundedRect(40, y, colW, 90, 6, 6, "S");

//   setTxt(GOLD);
//   setFont("bold", 7.5);
//   doc.text("BILL TO", 56, y + 18);

//   setTxt(WHITE);
//   setFont("bold", 13);
//   doc.text(userInfo.name || "Customer", 56, y + 34);

//   setTxt(MUTED);
//   setFont("normal", 8.5);
//   doc.text(userInfo.email || "—", 56, y + 48);
//   doc.text(userInfo.phone || "—", 56, y + 60);

//   // Right card
//   const rx = 40 + colW + 20;
//   setFill(SURFACE);
//   doc.roundedRect(rx, y, colW, 90, 6, 6, "F");
//   setStroke(BORDER);
//   doc.roundedRect(rx, y, colW, 90, 6, 6, "S");

//   setTxt(GOLD);
//   setFont("bold", 7.5);
//   doc.text("COMPANY", rx + 16, y + 18);

//   setTxt(WHITE);
//   setFont("bold", 13);
//   doc.text(userInfo.company || "—", rx + 16, y + 34);

//   setTxt(MUTED);
//   setFont("normal", 8.5);
//   doc.text("B2B Commercial Order", rx + 16, y + 48);

//   // Gold left accent lines
//   setFill(GOLD);
//   doc.rect(40, y + 10, 3, 70, "F");
//   doc.rect(rx, y + 10, 3, 70, "F");

//   y += 108;

//   /* ── Items Table ── */
//   setFill(GOLD);
//   doc.roundedRect(40, y, W - 80, 26, 4, 4, "F");

//   setTxt(BG);
//   setFont("bold", 8);
//   const cols = {
//     item: 60,
//     qty: W - 200,
//     unit: W - 140,
//     total: W - 55,
//   };
//   doc.text("PRODUCT", cols.item, y + 17);
//   doc.text("QTY", cols.qty, y + 17, { align: "center" });
//   doc.text("UNIT PRICE", cols.unit, y + 17, { align: "right" });
//   doc.text("TOTAL", cols.total, y + 17, { align: "right" });

//   y += 30;

//   for (let i = 0; i < cartItems.length; i++) {
//     const item = cartItems[i];
//     const rowH = 52;

//     if (y + rowH > H - 160) {
//       doc.addPage();
//       setFill(BG);
//       doc.rect(0, 0, W, H, "F");
//       setFill(GOLD);
//       doc.rect(0, 0, W, 3, "F");
//       y = 40;
//     }

//     setFill(i % 2 === 0 ? SURFACE2 : SURFACE);
//     doc.roundedRect(40, y, W - 80, rowH, 3, 3, "F");

//     // Product image
//     setFill(BORDER);
//     doc.roundedRect(52, y + 6, 38, 38, 3, 3, "F");
//     setTxt(MUTED);
//     setFont("normal", 7);
//     doc.text("IMG", 71, y + 29, { align: "center" });

//     try {
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       await new Promise((res) => {
//         img.onload = res;
//         img.onerror = res;
//         img.src = item.imageUrl;
//         setTimeout(res, 2000);
//       });
//       const canvas = document.createElement("canvas");
//       canvas.width = 80;
//       canvas.height = 80;
//       const ctx = canvas.getContext("2d");
//       ctx.fillStyle = "#1c1c28";
//       ctx.fillRect(0, 0, 80, 80);
//       ctx.drawImage(img, 4, 4, 72, 72);
//       doc.addImage(canvas.toDataURL("image/jpeg", 0.85), "JPEG", 52, y + 6, 38, 38, undefined, "FAST");
//     } catch (_) { }

//     // Product name
//     setTxt(WHITE);
//     setFont("bold", 9.5);
//     const nameTrunc =
//       item.productName.length > 38
//         ? item.productName.slice(0, 36) + "…"
//         : item.productName;
//     doc.text(nameTrunc, 100, y + 20);

//     // Sale tag
//     if (item.salePrice && item.salePrice < item.mrpPrice) {
//       const save = Math.round((1 - item.salePrice / item.mrpPrice) * 100);
//       setFill([80, 200, 140]);
//       doc.roundedRect(100, y + 24, 48, 12, 2, 2, "F");
//       setTxt(BG);
//       setFont("bold", 7);
//       doc.text(`SAVE ${save}%`, 124, y + 33, { align: "center" });
//     } else {
//       setTxt(MUTED);
//       setFont("normal", 7.5);
//       doc.text("Standard price", 100, y + 34);
//     }

//     // Qty
//     setTxt(WHITE);
//     setFont("bold", 11);
//     doc.text(String(item.quantity), cols.qty, y + 30, { align: "center" });

//     // Unit price
//     const unitPrice = item.salePrice ?? item.mrpPrice;
//     setTxt(GOLD);
//     setFont("bold", 9);
//     doc.text(fmt(unitPrice), cols.unit, y + 30, { align: "right" });

//     // Line total
//     setTxt(WHITE);
//     setFont("bold", 10);
//     doc.text(fmt(unitPrice * item.quantity), cols.total, y + 30, { align: "right" });

//     // Bottom border
//     setStroke(BORDER);
//     doc.setLineWidth(0.4);
//     doc.line(52, y + rowH - 1, W - 52, y + rowH - 1);

//     y += rowH + 3;
//   }

//   y += 16;

//   /* ── Summary Box ── */
//   const summaryH = 130 + (appliedCoupon ? 22 : 0);

//   if (y + summaryH > H - 60) {
//     doc.addPage();
//     setFill(BG);
//     doc.rect(0, 0, W, H, "F");
//     setFill(GOLD);
//     doc.rect(0, 0, W, 3, "F");
//     y = 40;
//   }

//   const sumX = W / 2 + 10;
//   const sumW = W - 40 - sumX;

//   setFill(SURFACE);
//   doc.roundedRect(sumX, y, sumW, summaryH, 6, 6, "F");
//   setStroke(GOLD_DIM);
//   doc.setLineWidth(0.5);
//   doc.roundedRect(sumX, y, sumW, summaryH, 6, 6, "S");

//   let sy = y + 18;
//   const lineRow = (label, value, highlight = false) => {
//     setTxt(MUTED);
//     setFont("normal", 8.5);
//     doc.text(label, sumX + 14, sy);
//     setTxt(highlight ? GREEN : WHITE);
//     setFont("bold", 8.5);
//     doc.text(value, sumX + sumW - 14, sy, { align: "right" });
//     sy += 18;
//   };

//   lineRow("Subtotal (MRP)", fmt(subtotal));
//   lineRow("Product Discount", `- ${fmt(subtotal - totalBeforeCoupon)}`, true);
//   if (appliedCoupon) {
//     lineRow(`Coupon (${appliedCoupon})`, `- ${fmt(discountFromCoupon)}`, true);
//   }
//   lineRow("Shipping", "FREE", true);

//   setStroke(BORDER);
//   doc.setLineWidth(0.5);
//   doc.line(sumX + 14, sy - 4, sumX + sumW - 14, sy - 4);
//   sy += 6;

//   // Grand total pill
//   setFill(GOLD);
//   doc.roundedRect(sumX + 8, sy - 10, sumW - 16, 30, 4, 4, "F");
//   setTxt(BG);
//   setFont("bold", 9);
//   doc.text("TOTAL PAYABLE", sumX + 20, sy + 5);
//   setFont("bold", 14);
//   doc.text(fmt(finalTotal), sumX + sumW - 20, sy + 6, { align: "right" });

//   /* ── Left note ── */
//   setTxt(MUTED);
//   setFont("normal", 8);
//   const noteLines = [
//     "Thank you for your order!",
//     "All prices are inclusive of applicable taxes.",
//     "For support: experience@sequencesurface.com",
//   ];
//   let ny = y + 18;
//   noteLines.forEach((ln) => {
//     doc.text(ln, 40, ny);
//     ny += 14;
//   });

//   /* ── Footer ── */
//   setFill(GOLD);
//   doc.rect(0, H - 4, W, 4, "F");
//   setTxt(MUTED);
//   setFont("normal", 7.5);
//   doc.text(
//     "Sequence Surface - An Exclusive Laminate Company",
//     W / 2,
//     H - 14,
//     { align: "center" }
//   );

//   doc.save(`Sequence_Order_${invoiceNo}.pdf`);
// };

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
      img.src = url;
      setTimeout(() => resolve(null), 2000);
    });

  const generateQR = (text) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
      text
    )}`;

  /* ================= COVER PAGE ================= */
  doc.setFillColor(10, 10, 12);
  doc.rect(0, 0, W, H, "F");

  const logo = await loadImage(
    "https://sequencesurface.com/images/logo.png"
  );

  if (logo) {
    doc.addImage(logo, "PNG", W / 2 - 80, 120, 160, 60);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("Sequence Surface", W / 2, 250, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(180);
  doc.text("Premium Laminate Catalogue", W / 2, 280, { align: "center" });

  const now = new Date().toLocaleString("en-IN");
  doc.setFontSize(10);
  doc.text(now, W / 2, H - 60, { align: "center" });

  doc.addPage();

  /* ================= PRODUCTS ================= */
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];

    const productUrl =
      item.productLink ||
      `https://sequencesurface.com/product/${item.productId}`;

    // New page per product (Apple style)
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, W, H, "F");

    /* ===== SOFT GRADIENT BACK ===== */
    for (let g = 0; g < H; g += 4) {
      doc.setFillColor(250 - g * 0.05, 250 - g * 0.05, 250);
      doc.rect(0, g, W, 4, "F");
    }

    /* ===== IMAGE (FULL WIDTH HERO) ===== */
    const img = await loadImage(item.imageUrl);

    if (img) {
      doc.addImage(img, "JPEG", 0, 0, W, H * 0.55);
    }

    /* ===== SHADOW EFFECT ===== */
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(30, H * 0.5, W - 60, H * 0.45, 20, 20, "F");

    /* ===== TEXT ===== */
    let y = H * 0.58;

    doc.setTextColor(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);

    doc.text(item.productName, 50, y, {
      maxWidth: W - 100,
    });

    y += 30;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100);

    const desc =
      item.description ||
      "Premium decorative laminate designed for elegant interiors with high durability and modern aesthetics.";

    const split = doc.splitTextToSize(desc, W - 120);
    doc.text(split, 50, y);

    y += split.length * 16 + 20;

    /* ===== PRICE ===== */
    const price = item.salePrice ?? item.mrpPrice;

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`₹${price}`, 50, y);

    /* ===== LINK ===== */
    doc.setTextColor(0, 102, 204);
    doc.setFontSize(12);

    doc.textWithLink("Explore Product →", 50, y + 25, {
      url: productUrl,
    });

    /* ===== QR ===== */
    const qrImg = await loadImage(generateQR(productUrl));

    if (qrImg) {
      doc.addImage(qrImg, "PNG", W - 140, H * 0.65, 90, 90);
    }

    /* ===== FOOTER ===== */
    doc.setFontSize(10);
    doc.setTextColor(150);

    doc.text(
      `${userInfo.name || ""} · ${userInfo.phone || ""} · ${
        userInfo.email || ""
      }`,
      W / 2,
      H - 30,
      { align: "center" }
    );

    if (i !== cartItems.length - 1) doc.addPage();
  }

  doc.save("Sequence_Brochure.pdf");
};


/* ─── User Info Modal ─────────────────────────────────────────── */
const UserInfoModal = ({ onClose, onGenerate, isGenerating }) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", company: "" });
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
            <>
              <span className="pdf-spinner" />
              Generating PDF…
            </>
          ) : (
            <>
              <FaFilePdf />
              Download Invoice PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ─── Main Cart Component ─────────────────────────────────────── */
const Cart = () => {
  const { cart, setCart } = useContext(ProductContext);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [payMethod, setPayMethod] = useState("upi");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const coupons = { SAVE10: 0.1, SAVE20: 0.2, FIRST50: 0.5, NINJALUI100: 1 };

  const cartItems = useMemo(() => {
    return Object.keys(cart)
      .map((id) => {
        const found = products.find((p) => p.productId === id);
        return found ? { ...found, quantity: cart[id] } : null;
      })
      .filter(Boolean);
  }, [cart]);

  const subtotal = cartItems.reduce((a, i) => a + i.mrpPrice * i.quantity, 0);
  const totalBeforeCoupon = cartItems.reduce(
    (a, i) => a + (i.salePrice ?? i.mrpPrice) * i.quantity,
    0
  );
  const discountFromCoupon = appliedCoupon
    ? totalBeforeCoupon * coupons[appliedCoupon]
    : 0;
  const finalTotal = totalBeforeCoupon - discountFromCoupon;
  const totalQty = cartItems.reduce((a, i) => a + i.quantity, 0);
  const totalSaved = subtotal - finalTotal;

  // UI formatter — ₹ works fine in the browser
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

  const handleGenerate = async (userInfo) => {
    setIsGenerating(true);
    try {
      await generatePDF(
        userInfo,
        cartItems,
        finalTotal,
        appliedCoupon,
        discountFromCoupon,
        subtotal,
        totalBeforeCoupon
      );
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
      setShowPdfModal(false);
    }
  };

  return (
    <div className="cart-page">
      {showPdfModal && (
        <UserInfoModal
          onClose={() => setShowPdfModal(false)}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
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
              <div className="empty-icon">
                <FaShoppingCart />
              </div>
              <p className="empty-text">Add items to get started</p>
              <a className="cart-shop-link" href="/products">
                <button className="empty-cta">
                  Continue Shopping <FaChevronRight />
                </button>
              </a>
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
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="item-img"
                        />
                        {savings && (
                          <span className="item-badge">-{savings}%</span>
                        )}
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
                              <span className="price-sale">
                                {fmt(item.salePrice)}
                              </span>
                              <span className="price-mrp">
                                {fmt(item.mrpPrice)}
                              </span>
                            </>
                          ) : (
                            <span className="price-sale">
                              {fmt(item.mrpPrice)}
                            </span>
                          )}
                        </div>

                        <div className="item-footer">
                          <div className="qty-control">
                            <button
                              className="qty-btn"
                              onClick={() => decreaseQty(item.productId)}
                            >
                              <FaMinus />
                            </button>
                            <span className="qty-num">{item.quantity}</span>
                            <button
                              className="qty-btn"
                              onClick={() => increaseQty(item.productId)}
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <span className="item-line-total">
                            {fmt(
                              (item.salePrice ?? item.mrpPrice) * item.quantity
                            )}
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
                  <span>
                    You're saving <strong>{fmt(totalSaved)}</strong> on this
                    order
                  </span>
                </div>
              )}

              <button
                className="pdf-export-btn"
                onClick={() => setShowPdfModal(true)}
              >
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
                <button className="coupon-apply-btn" onClick={applyCoupon}>
                  Apply
                </button>
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
                <button className="coupon-remove" onClick={removeCoupon}>
                  Remove
                </button>
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
                <span>
                  <FaTruck style={{ marginRight: 6 }} />
                  Delivery
                </span>
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