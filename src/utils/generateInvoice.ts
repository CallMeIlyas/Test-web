import { PDFDocument, rgb, pushGraphicsState, popGraphicsState, scale } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { saveAs } from "file-saver";

export const generateInvoice = async (cartData, customerData) => {
  const templateUrl = "/INVOICE PDF.pdf";
  const templateBytes = await fetch(templateUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(templateBytes);

  // 🟢 Daftarkan fontkit
  pdfDoc.registerFontkit(fontkit);

  // 🅿️ Load font Poppins
  const poppinsRegularBytes = await fetch("/fonts/poppins/Poppins-Regular.ttf").then((r) =>
    r.arrayBuffer()
  );
  const poppinsSemiBoldBytes = await fetch("/fonts/poppins/Poppins-SemiBold.ttf").then((r) =>
    r.arrayBuffer()
  );
  const poppinsBoldBytes = await fetch("/fonts/poppins/Poppins-Bold.ttf").then((r) =>
    r.arrayBuffer()
  );
  const poppinsItalicBytes = await fetch("/fonts/poppins/Poppins-Italic.ttf").then((r) =>
    r.arrayBuffer()
  );

  const poppinsRegular = await pdfDoc.embedFont(poppinsRegularBytes);
  const poppinsSemiBold = await pdfDoc.embedFont(poppinsSemiBoldBytes);
  const poppinsBold = await pdfDoc.embedFont(poppinsBoldBytes);
  const poppinsItalic = await pdfDoc.embedFont(poppinsItalicBytes);

  let page = pdfDoc.getPage(0);

  // 🎨 Helper teks
  const drawText = (text, x, y, { size = 10, font = poppinsRegular, color = rgb(0, 0, 0) } = {}) => {
    page.drawText(String(text), { x, y, size, font, color });
  };

// 💼 BILL TO (posisi sudah pas)
const billToX = 240; 
let billToY = 626;   
const lineGap = 16;  

// Helper: fallback kalau field kosong → “-”
const safeText = (val) => (val && val.trim() !== "" ? val : "-");

// Company
drawText(safeText(customerData.companyName), billToX, billToY, { font: poppinsRegular, size: 10 });
billToY -= lineGap;

// Name & Contact Person
drawText(safeText(customerData.contactPerson), billToX, billToY, { font: poppinsRegular, size: 10 });
billToY -= lineGap;

// Order via
drawText(safeText(customerData.orderVia), billToX, billToY, { font: poppinsRegular, size: 10 });
billToY -= lineGap;

// Payment Date
drawText(safeText(customerData.paymentDate), billToX, billToY, { font: poppinsRegular, size: 10 });
billToY -= lineGap;

// Estimated Product Arrival
drawText(safeText(customerData.estimatedArrival), billToX, billToY, { font: poppinsRegular, size: 10 });
billToY -= lineGap;

// Payment transfer via Bank (geser lebih kiri dikit)
drawText(safeText(customerData.paymentMethod), billToX, billToY, { font: poppinsRegular, size: 10 });

  // 🧾 Area tabel produk
  const box = { left: 45, right: 545, top: 530, bottom: 170, rowH: 50 };
  const cols = { image: 60, name: 210, price: 90, qty: 60, total: 90 };
  let y = box.top;

  // 🔁 Loop produk
  for (const [i, item] of cartData.entries()) {
    if (y - box.rowH < box.bottom) {
      const [template] = await pdfDoc.copyPages(pdfDoc, [0]);
      page = pdfDoc.addPage(template);
      y = box.top;
    }

    // 🖼️ Gambar produk proporsional
    try {
      const imgBytes = await fetch(item.imageUrl).then((r) => r.arrayBuffer());
      const img = item.imageUrl.endsWith(".png")
        ? await pdfDoc.embedPng(imgBytes)
        : await pdfDoc.embedJpg(imgBytes);

      const size = 35;
      const { width, height } = img.scale(1);
      const aspect = width / height;
      const drawW = aspect >= 1 ? size : size * aspect;
      const drawH = aspect >= 1 ? size / aspect : size;
      const imgX = box.left + (cols.image - drawW) / 2;
      const imgY = y - drawH - 53;
      page.drawImage(img, { x: imgX, y: imgY, width: drawW, height: drawH });
    } catch {}

    // 🧮 Hitung subtotal
    const subtotal = item.price * item.quantity;

    //  📍Posisi teks produk
    const textY = y - 70;
    const nameX = box.left + cols.image + 8;
    const nameY = textY;
    const nameSize = 8;

    // ✏️ Nama Produk
    drawText(item.name, nameX, nameY, {
      font: poppinsRegular,
      size: nameSize,
    });

    // 🧩 Variasi Produk
    if (item.variation) {
      const symbolFontBytes = await fetch("/fonts/NotoSansSymbols2-Regular.ttf").then((r) =>
        r.arrayBuffer()
      );
      const symbolFont = await pdfDoc.embedFont(symbolFontBytes);

      const labelFontSize = 9.5;
      const variationFontSize = 10;

      // Posisi teks variasi di kanan nama produk
      const labelX = nameX + 103;
      const labelY = nameY;

      // Baris pertama: Variations:
      drawText("Variations:", labelX, labelY, {
        font: poppinsRegular,
        size: 8,
      });

      const labelWidth = poppinsRegular.widthOfTextAtSize("Variations:", labelFontSize);

      // 🧭 Gambar panah ▼ dengan transform skala
      page.pushOperators(pushGraphicsState());
      page.pushOperators(scale(1.5, 1)); // scale horizontal 3x

      drawText("▼", (labelX + labelWidth - 6) / 1.5, labelY, {
        font: symbolFont,
        size: 6,
        color: rgb(0, 0, 0),
      });

      page.pushOperators(popGraphicsState());

      // Baris kedua: nama variasi
      drawText(item.variation, labelX, labelY - 12, {
        font: poppinsRegular,
        size: 8,
      });
    }

    // 💰 Harga satuan
    drawText(`Rp${item.price.toLocaleString("id-ID")}`, box.left + cols.image + cols.name - 13, textY, {
      font: poppinsSemiBold,
      size: 11,
    });

    // 🔢 Quantity
    drawText(String(item.quantity), box.left + cols.image + cols.name + cols.price + 40, textY, {
      font: poppinsRegular,
      size: 11,
    });

    // 🧮 Subtotal
    drawText(`Rp${subtotal.toLocaleString("id-ID")}`, box.right - cols.total + 50, textY, {
      font: poppinsSemiBold,
      size: 12,
      color: rgb(0.862, 0.149, 0.149),
    });

    y -= box.rowH;
  }

  // 💵 Total Akhir (Pisahkan biar bisa dikustom posisinya)
  const total = cartData.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
  const totalX = 435;
  const totalY = 299;

  drawText(`Rp${total.toLocaleString("id-ID")}`, totalX, totalY, {
    font: poppinsBold,
    size: 14,
    color: rgb(0.862, 0.149, 0.149),
  });

  // 💾 Simpan hasil PDF
  const result = await pdfDoc.save();
  saveAs(new Blob([result], { type: "application/pdf" }), "Invoice_LittleAmora.pdf");
};