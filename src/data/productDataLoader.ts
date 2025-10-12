import { getPrice } from "../utils/getPrice";
import { productOptions } from "./productOptions";

export interface Product {
  id: string;
  imageUrl: string;
  name: string;
  size: string;
  category: string;
  subcategory: string | null;
  fullPath: string;
  price: number;
  shippedFrom: string;
  shippedTo: string[];
  allImages?: string[];
  specialVariations?: { label: string; value: string }[];
  shadingOptions?: { label: string; value: string; preview?: string }[];
  sizeFrameOptions?: { label: string; value: string; image: string }[];
  details?: Record<string, any>; 
}

// === Mapping Folder → Nama Kategori Custom ===
export const categoryMapping: Record<string, string> = {
  "3D": "3D Frame",
  "2D": "2D Frame",
  "Acrylic Stand": "Acrylic Stand",
  "Softcopy Design": "Softcopy Design",
  "ADDITIONAL": "Additional",
};

// === Import Semua Gambar dari Folder dan Subfolder ===
const allMedia = import.meta.glob(
  "../assets/list-products/**/*.{jpg,JPG,jpeg,png,mp4}",
  { eager: true, import: "default" }
) as Record<string, string>;

console.log("🔍 [DEBUG] Total media found:", Object.keys(allMedia).length);

// === Import variasi 2D ===
const shadingImages = import.meta.glob(
  "../assets/list-products/2D/variations/shading/**/*.{jpg,JPG,jpeg,png}",
  { eager: true, import: "default" }
) as Record<string, string>;

const sizeFrameImages = import.meta.glob(
  "../assets/list-products/2D/variations/size frame/*.{jpg,JPG,jpeg,png}",
  { eager: true, import: "default" }
) as Record<string, string>;

// === Group images by product folder (exclude variations folder) ===
const groupedImages: Record<string, string[]> = {};

Object.entries(allMedia).forEach(([path, imageUrl]) => {
  // Skip jika path mengandung "variations"
  if (path.includes("/variations/")) return;
  
  const parts = path.split("/");
  const baseIndex = parts.findIndex((p) => p === "list-products");
  if (baseIndex === -1) return;

  const rawCategory = parts[baseIndex + 1] || "Unknown";
  if (rawCategory.match(/\.(jpg|jpeg|png|mp4)$/i)) return;

  let subcategory = parts[baseIndex + 2] || null;
  if (subcategory && subcategory.match(/\.(jpg|jpeg|png|mp4)$/i)) {
    subcategory = null;
  }

  const groupKey = subcategory ? `${rawCategory}/${subcategory}` : rawCategory;

  if (!groupedImages[groupKey]) groupedImages[groupKey] = [];
  groupedImages[groupKey].push(imageUrl);
});

console.log("📦 [DEBUG] Grouped products:", Object.keys(groupedImages).length);

// === Helper untuk mendapatkan opsi shading 2D ===
const get2DShadingOptions = () => {
  const options: { label: string; value: string; preview?: string }[] = [];
  
  Object.entries(shadingImages).forEach(([path, imageUrl]) => {
    const parts = path.split("/");
    const shadingIndex = parts.findIndex((p) => p === "shading");
    if (shadingIndex === -1) return;
    
    const shadingType = parts[shadingIndex + 1];
    if (!shadingType || shadingType.match(/\.(jpg|jpeg|png)$/i)) return;
    
    // Ambil satu preview image per shading type
    if (!options.find(opt => opt.value === shadingType)) {
      const label = shadingType.replace(/2D\s*/i, "").trim();
      options.push({
        label: label,
        value: shadingType,
        preview: imageUrl
      });
    }
  });
  
  return options;
};

// === Helper untuk mendapatkan opsi size frame 2D ===
const get2DSizeFrameOptions = () => {
  const options: { label: string; value: string; image: string }[] = [];
  
  Object.entries(sizeFrameImages).forEach(([path, imageUrl]) => {
    const filename = path.split("/").pop() || "";
    const sizeName = filename.replace(/\.(jpg|jpeg|png)$/i, "");
    
    options.push({
      label: sizeName,
      value: sizeName.toLowerCase().replace(/\s+/g, "_"),
      image: imageUrl
    });
  });
  
  // Sort by common size order
  const sizeOrder = ["4R", "6R", "8R", "12R", "15cm"];
  options.sort((a, b) => {
    const indexA = sizeOrder.indexOf(a.label);
    const indexB = sizeOrder.indexOf(b.label);
    return indexA - indexB;
  });
  
  return options;
};

// === Generate Products ===
export const allProducts: Product[] = Object.entries(groupedImages).map(
  ([groupKey, images], index) => {
    const [rawCategory, subcategory] = groupKey.split("/");
    const mappedCategory = categoryMapping[rawCategory] || rawCategory;

    const decodedImages = images.map((img) => decodeURIComponent(img));

    // Cari main image
    const mainImageCandidates = decodedImages.filter((img) => {
      const fileName = img.split("/").pop()?.toUpperCase() || "";
      return fileName.includes("MAIN IMAGE");
    });

    const mainImage =
      mainImageCandidates.sort((a, b) => b.length - a.length)[0] ||
      decodedImages[0];

    console.log(`🖼️ [${groupKey}] Main image:`, mainImage?.split("/").pop());

    const fileName = subcategory || `Product ${index + 1}`;

    // === Ambil size default dari productOptions ===
    const categoryOptions = productOptions[mappedCategory];
    let defaultSize = "Custom";

    if (subcategory && categoryOptions?.sizes) {
      let matchedSize = categoryOptions.sizes.find(s =>
        s.label.match(new RegExp(`^${subcategory}`, "i"))
      );

      if (!matchedSize) {
        matchedSize = categoryOptions.sizes.find(s =>
          s.value.toUpperCase().includes(subcategory.toUpperCase())
        );
      }

      if (matchedSize) defaultSize = matchedSize.label;
    }

    // === Ambil special variations jika ada ===
    let specialVariations: { label: string; value: string }[] | undefined;
    if (categoryOptions?.specialCases && defaultSize !== "Custom") {
      const sizeValue = categoryOptions.sizes?.find(
        (s) => s.label === defaultSize
      )?.value;

      if (sizeValue && categoryOptions.specialCases[sizeValue]) {
        specialVariations = categoryOptions.specialCases[sizeValue];
      }
    }

    // === Tambahan untuk 2D Frame ===
    let shadingOptions: { label: string; value: string; preview?: string }[] | undefined;
    let sizeFrameOptions: { label: string; value: string; image: string }[] | undefined;
    
    if (mappedCategory === "2D Frame" && subcategory === "2D Frame") {
      shadingOptions = get2DShadingOptions();
      sizeFrameOptions = get2DSizeFrameOptions();
      console.log("🎨 [2D Frame] Shading options:", shadingOptions);
      console.log("📏 [2D Frame] Size frame options:", sizeFrameOptions);
    }

    return {
      id: `prod-${index + 1}`,
      imageUrl: mainImage,
      name: fileName,
      size: defaultSize,
      category: mappedCategory,
      subcategory: subcategory || null,
      fullPath: `${mappedCategory}${subcategory ? " / " + subcategory : ""}`,
      price: getPrice(mappedCategory, fileName),
      shippedFrom: ["Bogor", "Jakarta"][index % 2],
      shippedTo: ["Worldwide"],
      allImages: decodedImages,
      specialVariations,
      shadingOptions,
      sizeFrameOptions,
    };
  }
);