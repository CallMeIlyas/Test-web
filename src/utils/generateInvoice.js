"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoice = void 0;
var pdf_lib_1 = require("pdf-lib");
var fontkit_1 = require("@pdf-lib/fontkit");
var file_saver_1 = require("file-saver");
var generateInvoice = function (cartData, customerData) { return __awaiter(void 0, void 0, void 0, function () {
    var templateUrl, templateBytes, pdfDoc, poppinsRegularBytes, poppinsSemiBoldBytes, poppinsBoldBytes, poppinsItalicBytes, poppinsRegular, poppinsSemiBold, poppinsBold, poppinsItalic, page, drawText, billToX, billToY, lineGap, safeText, box, cols, y, _i, _a, _b, i, item, template, imgBytes, img, _c, size, _d, width, height, aspect, drawW, drawH, imgX, imgY, _e, subtotal, textY, nameX, nameY, nameSize, symbolFontBytes, symbolFont, labelFontSize, variationFontSize, labelX, labelY, labelWidth, total, totalX, totalY, result;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                templateUrl = "/INVOICE PDF.pdf";
                return [4 /*yield*/, fetch(templateUrl).then(function (res) { return res.arrayBuffer(); })];
            case 1:
                templateBytes = _f.sent();
                return [4 /*yield*/, pdf_lib_1.PDFDocument.load(templateBytes)];
            case 2:
                pdfDoc = _f.sent();
                // 🟢 Daftarkan fontkit
                pdfDoc.registerFontkit(fontkit_1.default);
                return [4 /*yield*/, fetch("/fonts/poppins/Poppins-Regular.ttf").then(function (r) {
                        return r.arrayBuffer();
                    })];
            case 3:
                poppinsRegularBytes = _f.sent();
                return [4 /*yield*/, fetch("/fonts/poppins/Poppins-SemiBold.ttf").then(function (r) {
                        return r.arrayBuffer();
                    })];
            case 4:
                poppinsSemiBoldBytes = _f.sent();
                return [4 /*yield*/, fetch("/fonts/poppins/Poppins-Bold.ttf").then(function (r) {
                        return r.arrayBuffer();
                    })];
            case 5:
                poppinsBoldBytes = _f.sent();
                return [4 /*yield*/, fetch("/fonts/poppins/Poppins-Italic.ttf").then(function (r) {
                        return r.arrayBuffer();
                    })];
            case 6:
                poppinsItalicBytes = _f.sent();
                return [4 /*yield*/, pdfDoc.embedFont(poppinsRegularBytes)];
            case 7:
                poppinsRegular = _f.sent();
                return [4 /*yield*/, pdfDoc.embedFont(poppinsSemiBoldBytes)];
            case 8:
                poppinsSemiBold = _f.sent();
                return [4 /*yield*/, pdfDoc.embedFont(poppinsBoldBytes)];
            case 9:
                poppinsBold = _f.sent();
                return [4 /*yield*/, pdfDoc.embedFont(poppinsItalicBytes)];
            case 10:
                poppinsItalic = _f.sent();
                page = pdfDoc.getPage(0);
                drawText = function (text, x, y, _a) {
                    var _b = _a === void 0 ? {} : _a, _c = _b.size, size = _c === void 0 ? 10 : _c, _d = _b.font, font = _d === void 0 ? poppinsRegular : _d, _e = _b.color, color = _e === void 0 ? (0, pdf_lib_1.rgb)(0, 0, 0) : _e;
                    page.drawText(String(text), { x: x, y: y, size: size, font: font, color: color });
                };
                billToX = 240;
                billToY = 626;
                lineGap = 16;
                safeText = function (val) { return (val && val.trim() !== "" ? val : "-"); };
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
                box = { left: 45, right: 545, top: 530, bottom: 170, rowH: 50 };
                cols = { image: 60, name: 210, price: 90, qty: 60, total: 90 };
                y = box.top;
                _i = 0, _a = cartData.entries();
                _f.label = 11;
            case 11:
                if (!(_i < _a.length)) return [3 /*break*/, 25];
                _b = _a[_i], i = _b[0], item = _b[1];
                if (!(y - box.rowH < box.bottom)) return [3 /*break*/, 13];
                return [4 /*yield*/, pdfDoc.copyPages(pdfDoc, [0])];
            case 12:
                template = (_f.sent())[0];
                page = pdfDoc.addPage(template);
                y = box.top;
                _f.label = 13;
            case 13:
                _f.trys.push([13, 19, , 20]);
                return [4 /*yield*/, fetch(item.imageUrl).then(function (r) { return r.arrayBuffer(); })];
            case 14:
                imgBytes = _f.sent();
                if (!item.imageUrl.endsWith(".png")) return [3 /*break*/, 16];
                return [4 /*yield*/, pdfDoc.embedPng(imgBytes)];
            case 15:
                _c = _f.sent();
                return [3 /*break*/, 18];
            case 16: return [4 /*yield*/, pdfDoc.embedJpg(imgBytes)];
            case 17:
                _c = _f.sent();
                _f.label = 18;
            case 18:
                img = _c;
                size = 35;
                _d = img.scale(1), width = _d.width, height = _d.height;
                aspect = width / height;
                drawW = aspect >= 1 ? size : size * aspect;
                drawH = aspect >= 1 ? size / aspect : size;
                imgX = box.left + (cols.image - drawW) / 2;
                imgY = y - drawH - 53;
                page.drawImage(img, { x: imgX, y: imgY, width: drawW, height: drawH });
                return [3 /*break*/, 20];
            case 19:
                _e = _f.sent();
                return [3 /*break*/, 20];
            case 20:
                subtotal = item.price * item.quantity;
                textY = y - 70;
                nameX = box.left + cols.image + 8;
                nameY = textY;
                nameSize = 8;
                // ✏️ Nama Produk
                drawText(item.name, nameX, nameY, {
                    font: poppinsRegular,
                    size: nameSize,
                });
                if (!item.variation) return [3 /*break*/, 23];
                return [4 /*yield*/, fetch("/fonts/NotoSansSymbols2-Regular.ttf").then(function (r) {
                        return r.arrayBuffer();
                    })];
            case 21:
                symbolFontBytes = _f.sent();
                return [4 /*yield*/, pdfDoc.embedFont(symbolFontBytes)];
            case 22:
                symbolFont = _f.sent();
                labelFontSize = 9.5;
                variationFontSize = 10;
                labelX = nameX + 103;
                labelY = nameY;
                // Baris pertama: Variations:
                drawText("Variations:", labelX, labelY, {
                    font: poppinsRegular,
                    size: 8,
                });
                labelWidth = poppinsRegular.widthOfTextAtSize("Variations:", labelFontSize);
                // 🧭 Gambar panah ▼ dengan transform skala
                page.pushOperators((0, pdf_lib_1.pushGraphicsState)());
                page.pushOperators((0, pdf_lib_1.scale)(1.5, 1)); // scale horizontal 3x
                drawText("▼", (labelX + labelWidth - 6) / 1.5, labelY, {
                    font: symbolFont,
                    size: 6,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0),
                });
                page.pushOperators((0, pdf_lib_1.popGraphicsState)());
                // Baris kedua: nama variasi
                drawText(item.variation, labelX, labelY - 12, {
                    font: poppinsRegular,
                    size: 8,
                });
                _f.label = 23;
            case 23:
                // 💰 Harga satuan
                drawText("Rp".concat(item.price.toLocaleString("id-ID")), box.left + cols.image + cols.name - 13, textY, {
                    font: poppinsSemiBold,
                    size: 11,
                });
                // 🔢 Quantity
                drawText(String(item.quantity), box.left + cols.image + cols.name + cols.price + 40, textY, {
                    font: poppinsRegular,
                    size: 11,
                });
                // 🧮 Subtotal
                drawText("Rp".concat(subtotal.toLocaleString("id-ID")), box.right - cols.total + 50, textY, {
                    font: poppinsSemiBold,
                    size: 12,
                    color: (0, pdf_lib_1.rgb)(0.862, 0.149, 0.149),
                });
                y -= box.rowH;
                _f.label = 24;
            case 24:
                _i++;
                return [3 /*break*/, 11];
            case 25:
                total = cartData.reduce(function (acc, cur) { return acc + cur.price * cur.quantity; }, 0);
                totalX = 435;
                totalY = 299;
                drawText("Rp".concat(total.toLocaleString("id-ID")), totalX, totalY, {
                    font: poppinsBold,
                    size: 14,
                    color: (0, pdf_lib_1.rgb)(0.862, 0.149, 0.149),
                });
                return [4 /*yield*/, pdfDoc.save()];
            case 26:
                result = _f.sent();
                (0, file_saver_1.saveAs)(new Blob([result], { type: "application/pdf" }), "Invoice_LittleAmora.pdf");
                return [2 /*return*/];
        }
    });
}); };
exports.generateInvoice = generateInvoice;
