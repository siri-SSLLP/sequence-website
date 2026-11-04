// Builds the Sequence product brochure PDF with jsPDF (loaded on demand).
// Used by the Cart page for the customer's picks and by the home page
// "Download Catalogue" button for the whole collection.
import logoMark from "../assets/logo.png";

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

export const generatePDF = async (userInfo, cartItems) => {
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
      // A photo can finish loading with no usable data; treat that as failed
      img.onload = () => resolve(img.naturalWidth > 0 ? img : null);
      img.onerror = () => resolve(null);
      // Separate URL so the browser can't reuse the page's non-CORS cached copy
      img.src = `${url}${url.includes("?") ? "&" : "?"}pdf=1`;
      setTimeout(() => resolve(null), 8000);
    });

  // Product photos arrive at camera size (often ~5000px). Scale them down to
  // print size first, or the PDF takes minutes to build and runs to ~20MB.
  const shrinkPhoto = async (img, maxSide = 1600) => {
    if (!img || Math.max(img.naturalWidth, img.naturalHeight) <= maxSide) return img;
    try {
      const scale = maxSide / Math.max(img.naturalWidth, img.naturalHeight);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const small = await new Promise((resolve) => {
        const out = new Image();
        out.onload = () => resolve(out);
        out.onerror = () => resolve(null);
        out.src = canvas.toDataURL("image/jpeg", 0.85);
      });
      return small || img;
    } catch (err) {
      console.error(err);
      return img;
    }
  };

  // One bad image should cost that image, not the whole PDF
  const addImageSafely = (...args) => {
    try {
      doc.addImage(...args);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

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
  const drawProductDetails = (item, x, startY, width, columns, bottomY) => {
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

    const LABEL_W = 78;
    const columnW = width / columns;
    let y = startY;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(20, 20, 20);
    doc.text("Product details", x, y);
    y += 9;
    doc.setDrawColor(235, 199, 108);
    doc.line(x, y, x + width, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);

    const uses = item.whereToUse?.length ? item.whereToUse : item.applications;
    const useLines = uses?.length
      ? doc.splitTextToSize(uses.join(", "), width - LABEL_W)
      : [];

    // Spread the rows over the space left on this page, within readable limits
    const rowCount = Math.ceil(rows.length / columns) + (useLines.length ? 1 : 0);
    const spareH = bottomY - y - Math.max(useLines.length - 1, 0) * 14;
    const ROW_H = Math.min(Math.max(spareH / Math.max(rowCount, 1), 17), 26);

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

    if (useLines.length) {
      doc.setTextColor(120, 120, 120);
      doc.text("Where to use", x, y);
      doc.setTextColor(30, 30, 30);
      doc.text(useLines, x + LABEL_W, y);
      y += useLines.length * 14 + 4;
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
    addImageSafely(logo, "PNG", W / 2 - logoW / 2, y, logoW, 60);
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

  const productUrlFor = (item) =>
    item.productLink || `https://sequencesurface.com/product/${item.productId}`;

  // Fetch every photo and QR code at once rather than one page at a time
  const pictures = await Promise.all(
    cartItems.map(async (item) => {
      const [photo, qr] = await Promise.all([
        loadImage(item.imageUrl).then((img) => shrinkPhoto(img)),
        loadImage(generateQR(productUrlFor(item))),
      ]);
      return { photo, qr };
    })
  );

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const productUrl = productUrlFor(item);

    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, W, H, "F");

    for (let g = 0; g < H; g += 4) {
      const shade = Math.max(220, 250 - g * 0.05);
      doc.setFillColor(shade, shade, shade);
      doc.rect(0, g, W, 4, "F");
    }

    const { photo: img, qr: qrImg } = pictures[i];

    // The whole picture goes on top, never cropped, stretched or covered
    let pictureBottom = 130;
    const fit = img
      ? Math.min((W - 60) / img.naturalWidth, (H * 0.42) / img.naturalHeight)
      : 0;
    const pictureW = img ? img.naturalWidth * fit : 0;
    const pictureH = img ? img.naturalHeight * fit : 0;

    if (img && addImageSafely(img, "JPEG", (W - pictureW) / 2, 30, pictureW, pictureH)) {
      pictureBottom = 30 + pictureH;
    } else {
      doc.setFillColor(10, 10, 12);
      doc.rect(0, 0, W, pictureBottom, "F");
    }

    // The details card starts below the picture and runs almost to the page edge
    const cardTop = pictureBottom + 14;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(30, cardTop, W - 60, H - cardTop - 18, 20, 20, "F");

    const y = drawProductInfo(item, productUrl, 50, cardTop + 40, W - 210, 3);
    drawProductDetails(item, 50, y + 28, W - 100, 2, H - 62);

    if (qrImg) {
      addImageSafely(qrImg, "PNG", W - 140, cardTop + 24, 90, 90);
    }

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(
      `${COMPANY.name}  |  ${COMPANY.showroom.join(", ")}  |  ${COMPANY.phones[0]}  |  ${COMPANY.email}`,
      W / 2,
      H - 44,
      { align: "center" }
    );

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    // The full-collection catalogue has no customer, so skip the line
    const customer = [userInfo.name, userInfo.phone, userInfo.email].filter(Boolean).join(" · ");
    if (customer) doc.text(customer, W / 2, H - 30, { align: "center" });

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

  return doc;
};

export const PDF_FILE_NAME = "Sequence_Brochure.pdf";
