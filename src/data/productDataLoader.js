"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderedProducts = exports.allProducts = exports.categoryMapping = void 0;
var getPrice_1 = require("../utils/getPrice");
// === Mapping Folder → Nama Kategori Custom ===
exports.categoryMapping = {
    "3D": "3D Frame",
    "2D": "2D Frame",
    "ACRYLIC STAND": "Acrylic Stand",
    "SOFTCOPY DESIGN": "Softcopy Design",
    "ADDITIONAL": "Additional",
};
// === Import Semua Gambar ===
var allMedia = import.meta.glob("../assets/list-products/**/*.{jpg,JPG,jpeg,png,mp4}", { eager: true, import: "default" });
// === Import variasi 2D ===
var shadingImages = import.meta.glob("../assets/list-products/2D/variations/shading/**/*.{jpg,JPG,jpeg,png}", { eager: true, import: "default" });
var sizeFrameImages = import.meta.glob("../assets/list-products/2D/variations/size frame/*.{jpg,JPG,jpeg,png}", { eager: true, import: "default" });
// === Group images by folder ===
var groupedImages = {};
Object.entries(allMedia).forEach(function (_a) {
    var path = _a[0], imageUrl = _a[1];
    var lowerPath = path.toLowerCase();
    // 🚫 Abaikan folder variation
    if (lowerPath.includes("/variation/") || lowerPath.includes("/variations/"))
        return;
    var parts = path.split("/");
    var baseIndex = parts.findIndex(function (p) { return p.toLowerCase() === "list-products"; });
    if (baseIndex === -1)
        return;
    var rawCategory = parts[baseIndex + 1] || "Unknown";
    var subcategory = parts[baseIndex + 2] || null;
    // 🚫 Skip jika subcategory adalah variasi (khusus kategori 2D)
    if (subcategory) {
        var lowerSub = subcategory.toLowerCase();
        if (lowerSub === "variation" ||
            lowerSub === "variations" ||
            (rawCategory.toLowerCase() === "2d" &&
                (lowerSub.includes("shading") || lowerSub.includes("size frame")))) {
            return;
        }
    }
    // Abaikan file langsung
    if (subcategory === null || subcategory === void 0 ? void 0 : subcategory.match(/\.(jpg|jpeg|png|mp4)$/i))
        subcategory = null;
    var groupKey = subcategory ? "".concat(rawCategory, "/").concat(subcategory) : rawCategory;
    if (!groupedImages[groupKey])
        groupedImages[groupKey] = [];
    groupedImages[groupKey].push(imageUrl);
});
// === Helper 2D ===
var get2DShadingOptions = function () {
    var options = [];
    Object.entries(shadingImages).forEach(function (_a) {
        var path = _a[0], imageUrl = _a[1];
        var parts = path.split("/");
        var shadingType = parts[parts.findIndex(function (p) { return p === "shading"; }) + 1];
        if (!shadingType || options.find(function (o) { return o.value === shadingType; }))
            return;
        options.push({
            label: shadingType.replace(/2D\s*/i, "").trim(),
            value: shadingType,
            preview: imageUrl,
        });
    });
    return options;
};
var get2DSizeFrameOptions = function () {
    var options = [];
    Object.entries(sizeFrameImages).forEach(function (_a) {
        var path = _a[0], imageUrl = _a[1];
        var filename = path.split("/").pop() || "";
        var sizeName = filename.replace(/\.(jpg|jpeg|png)$/i, "");
        options.push({
            label: sizeName,
            value: sizeName.toLowerCase().replace(/\s+/g, "_"),
            image: imageUrl,
        });
    });
    var sizeOrder = ["4R", "6R", "8R", "12R", "15cm"];
    options.sort(function (a, b) {
        return (sizeOrder.indexOf(a.label) === -1
            ? 99
            : sizeOrder.indexOf(a.label)) -
            (sizeOrder.indexOf(b.label) === -1 ? 99 : sizeOrder.indexOf(b.label));
    });
    return options;
};
// === Generate Semua Produk ===
exports.allProducts = Object.entries(groupedImages).map(function (_a, index) {
    var groupKey = _a[0], images = _a[1];
    var _b = groupKey.split("/"), rawCategory = _b[0], subcategory = _b[1];
    var mappedCategory = exports.categoryMapping[rawCategory.toUpperCase()] || rawCategory;
    // ✅ Gunakan versi yang sudah disortir, jangan ada 2x deklarasi
    var decodedImages = images
        .map(function (img) { return decodeURIComponent(img); })
        // Urutkan supaya MAIN IMAGE.jpg selalu diprioritaskan
        .sort(function (a, b) {
        var _a, _b;
        var nameA = ((_a = a.split("/").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
        var nameB = ((_b = b.split("/").pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "";
        if (nameA.includes("main"))
            return -1; // dorong ke atas
        if (nameB.includes("main"))
            return 1;
        return nameA.localeCompare(nameB);
    });
    var mainImage = decodedImages.find(function (img) {
        var fileName = decodeURIComponent(img.split("/").pop() || "").toLowerCase();
        var baseName = fileName
            .replace(/\.[a-z0-9]+$/, "") // hapus ekstensi
            .replace(/-[a-z0-9]{6,10}$/i, ""); // hapus hash
        return (baseName.includes("mainimage") ||
            baseName.includes("main image") ||
            baseName.includes("main-image") ||
            baseName.includes("main_image") ||
            baseName.startsWith("main"));
    }) || decodedImages[0];
    console.log("🖼️ Main pick for", subcategory, "→", mainImage.split("/").pop());
    console.log("🧩 Checking files for:", subcategory);
    decodedImages.forEach(function (img) {
        var f = decodeURIComponent(img.split("/").pop() || "");
        console.log("   ↳", f);
    });
    console.log("👉 Main chosen:", mainImage.split("/").pop());
    var cleanSubcategory = (subcategory === null || subcategory === void 0 ? void 0 : subcategory.trim()) || null;
    var fileName = cleanSubcategory || "Product ".concat(index + 1);
    return {
        id: "prod-".concat(index + 1),
        imageUrl: mainImage,
        name: fileName,
        displayName: subcategory
            ? "".concat(mappedCategory, " ").concat(subcategory.replace(/-\s*\d+\s*x\s*\d+\s*cm/i, "").trim())
            : mappedCategory,
        size: "Custom",
        category: mappedCategory,
        subcategory: subcategory || null,
        fullPath: "".concat(mappedCategory).concat(subcategory ? " / " + subcategory : ""),
        price: (0, getPrice_1.getPrice)(mappedCategory, fileName),
        shippedFrom: ["Bogor", "Jakarta"][index % 2],
        shippedTo: ["Worldwide"],
        allImages: decodedImages,
        shadingOptions: mappedCategory === "2D Frame" ? get2DShadingOptions() : undefined,
        sizeFrameOptions: mappedCategory === "2D Frame" ? get2DSizeFrameOptions() : undefined,
    };
});
// === Custom Ordering ===
// BARIS 1 (Top 3D)
var baris1 = [
    { category: "3D Frame", name: "12R" },
    { category: "3D Frame", name: "10R" },
    { category: "3D Frame", name: "A2-40X55CM" },
    { category: "3D Frame", name: "A1-55X80CM" },
];
// BARIS 2 (2D)
var baris2 = [
    { category: "2D Frame", name: "15cm" },
    { category: "2D Frame", name: "6R" },
    { category: "2D Frame", name: "8R" },
    { category: "2D Frame", name: "12R" },
];
// BARIS 3 (Acrylic & Softcopy)
var baris3 = [
    { category: "Acrylic Stand", name: "ACRYLIC STAND 2CM" },
    { category: "Acrylic Stand", name: "ACRYLIC STAND 3MM" },
    { category: "Softcopy Design", name: "WITH BACKGROUND CUSTOM" },
    { category: "Additional", name: "BACKGROUND CUSTOM" },
];
// BARIS 4 (PENTING – Custom Fix)
var baris4 = [
    { category: "3D Frame", name: "4R" },
    { category: "Additional", name: "BIAYA TAMBAHAN WAJAH KARIKATUR" },
    { category: "Additional", name: "BIAYA EKSPRESS GENERAL" },
    { category: "Additional", name: "BIAYA TAMBAHAN GANTI FRAME KACA KE ACRYLIC" },
];
// === Pencarian Produk Berdasarkan Nama ===
var findProduct = function (item) {
    return exports.allProducts.find(function (p) { return p.category === item.category && p.name === item.name; }) || null;
};
// === Filter Produk Valid
var part1 = baris1.map(findProduct).filter(function (p) { return p !== null; });
var part2 = baris2.map(findProduct).filter(function (p) { return p !== null; });
var part3 = baris3.map(findProduct).filter(function (p) { return p !== null; });
var part4 = baris4.map(findProduct).filter(function (p) { return p !== null; });
// === Gabungkan & Hilangkan Duplikat
var orderedProducts = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], part1, true), part2, true), part3, true), part4, true);
exports.orderedProducts = orderedProducts;
var usedIds = new Set(orderedProducts.map(function (p) { return p.id; }));
var remainingProducts = exports.allProducts.filter(function (p) { return !usedIds.has(p.id); });
exports.orderedProducts = orderedProducts = __spreadArray(__spreadArray([], orderedProducts, true), remainingProducts, true);
console.log("🧾 Semua Produk Additional:", exports.allProducts.filter(function (p) { return p.category === "Additional"; }).map(function (p) { return ({
    name: p.name,
    price: p.price
}); }));
