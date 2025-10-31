import { getPrice } from "../utils/getPrice";

// ========================
// 💾 Interface
// ========================
export interface Product {
  id: string;
  imageUrl: string;
  name: string;
  displayName: string;
  size: string;
  category: string;
  subcategory: string | null;
  fullPath: string;
  price: number;
  shippedFrom: string;
  shippedTo: string[];
  allImages?: string[];
  shadingOptions?: { label: string; value: string; preview?: string }[];
  sizeFrameOptions?: { label: string; value: string; image: string }[];
}

// ========================
// 🗂️ Mapping kategori
// ========================
export const categoryMapping: Record<string, string> = {
  "3D": "3D Frame",
  "2D": "2D Frame",
  "ACRYLIC STAND": "Acrylic Stand",
  "SOFTCOPY DESIGN": "Softcopy Design",
  "ADDITIONAL": "Additional",
};

// ========================
// 📦 Import semua media (glob aman untuk Vite di Linux)
// ========================
const allMedia = import.meta.glob(
  [
    "../assets/list-products/**/*.{jpg,jpeg,png,mp4,jfif}",
    "../assets/list-products/**/*.{JPG,JPEG,PNG,MP4,JFIF}",
  ],
  { eager: true, import: "default" }
) as Record<string, string>;

// Debug global
console.log("🧭 Total imported media:", Object.keys(allMedia).length);

// ========================
// 🎨 Variasi 2D
// ========================
const shadingImages = import.meta.glob(
  "../assets/list-products/2D/variations/shading/**/*.{jpg,JPG,jpeg,JPEG,png,PNG}",
  { eager: true, import: "default" }
) as Record<string, string>;

const sizeFrameImages = import.meta.glob(
  "../assets/list-products/2D/variations/size frame/*.{jpg,JPG,jpeg,JPEG,png,PNG}",
  { eager: true, import: "default" }
) as Record<string, string>;

// ========================
// 🧩 Grouping Gambar
// ========================
const groupedImages: Record<string, string[]> = {};

Object.entries(allMedia).forEach(([path, imageUrl]) => {
  const lowerPath = path.toLowerCase();

  if (lowerPath.includes("/variation/") || lowerPath.includes("/variations/"))
    return;

  const parts = path.split("/");
  const baseIndex = parts.findIndex((p) => p.toLowerCase() === "list-products");
  if (baseIndex === -1) return;

  const rawCategory = parts[baseIndex + 1] || "Unknown";
  let subcategory = parts[baseIndex + 2] || null;

  // Skip folder 2D/variations/shading & size frame
  if (
    rawCategory.toLowerCase() === "2d" &&
    subcategory &&
    ["shading", "size frame", "size-frame"].some((v) =>
      subcategory.toLowerCase().includes(v)
    )
  ) {
    return;
  }

  // Jika file langsung di root kategori
  if (subcategory?.match(/\.(jpg|jpeg|png|mp4|jfif)$/i)) subcategory = null;

  const groupKey = subcategory ? `${rawCategory}/${subcategory}` : rawCategory;

  if (!groupedImages[groupKey]) groupedImages[groupKey] = [];
  groupedImages[groupKey].push(imageUrl);
});

// ========================
// 🧠 Fungsi deteksi main image
// ========================
function findMainImage(images: string[]): string {
  const decodedImages = images.map((img) => decodeURIComponent(img));

  console.log("📂 Checking images in group:", decodedImages.map((i) => i.split("/").pop()));

  const priorityImages = decodedImages.filter((url) => {
    const fileName = url.split("/").pop()?.toLowerCase() || "";
    const normalized = fileName
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[^a-z0-9]/g, "");

    return (
      normalized.includes("mainimage") ||
      normalized.includes("cover") ||
      normalized.includes("utama") ||
      normalized === "main"
    );
  });

  if (priorityImages.length > 0) {
    console.log("✅ Found main image →", priorityImages[0].split("/").pop());
    return priorityImages[0];
  }

  // 🧩 Fallback khusus 2D
  const fallback2D = decodedImages.find((url) =>
    url.toLowerCase().includes("/2d/") &&
    url.toLowerCase().endsWith("main-image.jpg")
  );
  if (fallback2D) {
    console.log("⚙️ Fallback 2D main →", fallback2D.split("/").pop());
    return fallback2D;
  }

  console.warn("⚠️ No main image detected, fallback to first:", decodedImages[0]);
  return decodedImages.sort((a, b) => a.localeCompare(b))[0];
}

// ========================
// 🧱 Generate Produk
// ========================
export const allProducts: Product[] = Object.entries(groupedImages).map(
  ([groupKey, images], index) => {
    const [rawCategory, subcategory] = groupKey.split("/");
    const mappedCategory =
      categoryMapping[rawCategory.toUpperCase()] || rawCategory;

    const mainImage = findMainImage(images);

    console.log(
      "🖼️ Main pick for",
      subcategory || mappedCategory,
      "→",
      mainImage.split("/").pop()
    );

    const decodedImages = images.map((img) => decodeURIComponent(img));

    return {
      id: `prod-${index + 1}`,
      imageUrl: mainImage,
      name: subcategory || mappedCategory,
      displayName: subcategory
        ? `${mappedCategory} ${subcategory.replace(/-\s*\d+\s*x\s*\d+\s*cm/i, "").trim()}`
        : mappedCategory,
      size: "Custom",
      category: mappedCategory,
      subcategory: subcategory || null,
      fullPath: `${mappedCategory}${subcategory ? " / " + subcategory : ""}`,
      price: getPrice(mappedCategory, subcategory || mappedCategory),
      shippedFrom: ["Bogor", "Jakarta"][index % 2],
      shippedTo: ["Worldwide"],
      allImages: decodedImages,
      shadingOptions:
        mappedCategory === "2D Frame" ? get2DShadingOptions() : undefined,
      sizeFrameOptions:
        mappedCategory === "2D Frame" ? get2DSizeFrameOptions() : undefined,
    };
  }
);

// ========================
// 🧮 2D Variations Helper
// ========================
function get2DShadingOptions() {
  const options: { label: string; value: string; preview?: string }[] = [];
  Object.entries(shadingImages).forEach(([path, imageUrl]) => {
    const parts = path.split("/");
    const shadingType = parts[parts.findIndex((p) => p === "shading") + 1];
    if (!shadingType || options.find((o) => o.value === shadingType)) return;
    options.push({
      label: shadingType.replace(/2D\s*/i, "").trim(),
      value: shadingType,
      preview: imageUrl,
    });
  });
  return options;
}

function get2DSizeFrameOptions() {
  const options: { label: string; value: string; image: string }[] = [];
  Object.entries(sizeFrameImages).forEach(([path, imageUrl]) => {
    const filename = path.split("/").pop() || "";
    const sizeName = filename.replace(/\.(jpg|jpeg|png)$/i, "");
    options.push({
      label: sizeName,
      value: sizeName.toLowerCase().replace(/\s+/g, "_"),
      image: imageUrl,
    });
  });
  const sizeOrder = ["4R", "6R", "8R", "12R", "15cm"];
  options.sort(
    (a, b) =>
      (sizeOrder.indexOf(a.label) === -1
        ? 99
        : sizeOrder.indexOf(a.label)) -
      (sizeOrder.indexOf(b.label) === -1 ? 99 : sizeOrder.indexOf(b.label))
  );
  return options;
}

// ========================
// 📊 Log tambahan
// ========================
console.log("📊 Total groups:", Object.keys(groupedImages).length);
Object.keys(groupedImages).forEach((key) => {
  console.log("   -", key, "(", groupedImages[key].length, "files )");
});

// Export default ordered list (kamu bisa tambahkan urutan custom di bawah)
export { allProducts as orderedProducts };
