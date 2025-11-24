import { PDFDocument, rgb } from "pdf-lib";

/**
 * 🔗 Merge Header PDF + Products + Footer PDF
 * 
 * @param pdfDoc - PDF Document yang sudah ada header & products
 * @param currentPage - Halaman terakhir dengan produk
 * @param lastProductY - Posisi Y dari produk terakhir
 * @param footerPdfPath - Path ke footer PDF
 * @param total - Total harga
 * @param fonts - Fonts object
 * @returns Object { finalPage, finalY }
 */
export const mergeFooterPdf = async (
  pdfDoc: PDFDocument,
  currentPage: any,
  lastProductY: number,
  footerPdfPath: string = "/FOOTER.pdf",
  total: number,
  fonts: any
) => {
  try {
    // 📥 Load footer PDF
    const footerBytes = await fetch(footerPdfPath).then((res) => {
      if (!res.ok) throw new Error(`Footer PDF not found: ${footerPdfPath}`);
      return res.arrayBuffer();
    });
    
    const footerPdf = await PDFDocument.load(footerBytes);
    
    // 📄 Embed footer page
    const [footerPage] = await pdfDoc.embedPdf(footerPdf, [0]);
    const { width: footerWidth, height: footerHeight } = footerPage.scale(1);

    // 🎯 Konfigurasi
    const CONFIG = {
      marginTop: 70, // 🔥 NAIKKAN LAGI dari 50 ke 70 - kasih jarak lebih besar
      forceInCurrentPage: true,
      absoluteMinY: 5,
      x: (595.28 - footerWidth) / 2,
    };

    // 📍 Hitung posisi Y untuk footer berdasarkan produk terakhir
    let footerY = 40 + footerHeight;
    let targetPage = currentPage;
    
    const footerBottom = footerY - footerHeight;

    // 🔥 PAKSA footer masuk di halaman current
    if (footerBottom < CONFIG.absoluteMinY) {
      // Kalau benar-benar mentok, adjust footerY ke atas supaya footer bottom = absoluteMinY
      footerY = CONFIG.absoluteMinY + footerHeight;
    }

    // 🖼️ Stamp footer page
    targetPage.drawPage(footerPage, {
      x: CONFIG.x,
      y: footerY - footerHeight,
      width: footerWidth,
      height: footerHeight,
    });

    // 💰 Tulis total di atas footer
    // SESUAIKAN koordinat ini dengan layout footer PDF kamu
    const totalX = 480; // Posisi X untuk total
    const totalY = footerY - 30; // 🔥 Adjust offset (dari -40 ke -30, lebih dekat ke footer)

    targetPage.drawText(`Rp${total.toLocaleString("id-ID")}`, {
      x: totalX,
      y: totalY,
      size: 14,
      font: fonts.poppinsBold,
      color: rgb(0.862, 0.149, 0.149),
    });


    return {
      finalPage: targetPage,
      finalY: footerY - footerHeight,
    };
};

/**
 * 🔄 Copy header template ke halaman baru (untuk multiple pages)
 * 
 * @param pdfDoc - PDF Document
 * @param headerPdfPath - Path ke header PDF template
 * @returns New page dengan header
 */
export const addPageWithHeader = async (
  pdfDoc: PDFDocument,
  headerPdfPath: string = "/HEADER.pdf"
) => {
  try {
    // Load header template
    const headerBytes = await fetch(headerPdfPath).then((res) => {
      if (!res.ok) throw new Error(`Header PDF not found: ${headerPdfPath}`);
      return res.arrayBuffer();
    });
    
    const headerPdf = await PDFDocument.load(headerBytes);
    const [headerTemplate] = await pdfDoc.copyPages(headerPdf, [0]);
    
    // Add page dengan template header
    return pdfDoc.addPage(headerTemplate);
    
};

/**
 * 🔍 Cek apakah footer akan muat di halaman
 */
export const needsNewPageForFooter = (
  currentY: number,
  footerHeight: number = 280,
  marginTop: number = 30,
  minY: number = 50
): boolean => {
  return (currentY - marginTop - footerHeight) < minY;
};