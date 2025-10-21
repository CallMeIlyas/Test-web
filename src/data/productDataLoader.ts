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
  "ACRYLIC STAND": "Acrylic Stand",  
  "SOFTCOPY DESIGN": "Softcopy Design",  
  "ADDITIONAL": "Additional",  
};  
  
// === Import Semua Gambar ===  
const allMedia = import.meta.glob(  
  "../assets/list-products/**/*.{jpg,JPG,jpeg,png,mp4}",  
  { eager: true, import: "default" }  
) as Record<string, string>;  
  
console.log("✅ Total media ditemukan:", Object.keys(allMedia).length);  
  
// === Import variasi 2D ===  
const shadingImages = import.meta.glob(  
  "../assets/list-products/2D/variations/shading/**/*.{jpg,JPG,jpeg,png}",  
  { eager: true, import: "default" }  
) as Record<string, string>;  
  
const sizeFrameImages = import.meta.glob(  
  "../assets/list-products/2D/variations/size frame/*.{jpg,JPG,jpeg,png}",  
  { eager: true, import: "default" }  
) as Record<string, string>;  
  
// === Group images by folder ===  
const groupedImages: Record<string, string[]> = {};  
  
Object.entries(allMedia).forEach(([path, imageUrl]) => {  
  if (path.includes("/variations/")) return;  
  const parts = path.split("/");  
  const baseIndex = parts.findIndex((p) => p === "list-products");  
  if (baseIndex === -1) return;  
  
  const rawCategory = parts[baseIndex + 1] || "Unknown";  
  let subcategory = parts[baseIndex + 2] || null;  
  if (subcategory?.match(/\.(jpg|jpeg|png|mp4)$/i)) subcategory = null;  
  
  const groupKey = subcategory ? `${rawCategory}/${subcategory}` : rawCategory;  
  if (!groupedImages[groupKey]) groupedImages[groupKey] = [];  
  groupedImages[groupKey].push(imageUrl);  
});  
  
console.log("📦 Grouped images:", Object.keys(groupedImages));  
  
// === Helper 2D ===  
const get2DShadingOptions = () => {  
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
};  
  
const get2DSizeFrameOptions = () => {  
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
};  
  
// === Generate Semua Produk ===  
export const allProducts: Product[] = Object.entries(groupedImages).map(  
  ([groupKey, images], index) => {  
    const [rawCategory, subcategory] = groupKey.split("/");  
    const mappedCategory =  
      categoryMapping[rawCategory.toUpperCase()] || rawCategory;  
  
    const decodedImages = images.map((img) => decodeURIComponent(img));  
    const mainImage =  
      decodedImages.find((img) =>  
        img.split("/").pop()?.toUpperCase().includes("MAIN IMAGE")  
      ) || decodedImages[0];  
  
    const cleanSubcategory = subcategory?.trim() || null;  
    const fileName = cleanSubcategory || `Product ${index + 1}`;  
  
    return {  
      id: `prod-${index + 1}`,  
      imageUrl: mainImage,  
      name: fileName,  
      displayName: fileName,  
      size: "Custom",  
      category: mappedCategory,  
      subcategory: subcategory || null,  
      fullPath: `${mappedCategory}${subcategory ? " / " + subcategory : ""}`,  
      price: getPrice(mappedCategory, fileName),  
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
  
// BARIS 1 (Top 3D)  
const baris1 = [  
  { category: "3D Frame", name: "12R" },  
  { category: "3D Frame", name: "10R" },  
  { category: "3D Frame", name: "A2-40X55CM" },  
  { category: "3D Frame", name: "A1-55X80CM" },  
];  
  
// BARIS 2 (2D)  
const baris2 = [  
  { category: "2D Frame", name: "15cm" },  
  { category: "2D Frame", name: "6R" },  
  { category: "2D Frame", name: "8R" },  
  { category: "2D Frame", name: "2D 12R" },  
];  
  
// BARIS 3 (Acrylic & Softcopy)  
const baris3 = [  
  { category: "Acrylic Stand", name: "ACRYLIC STAND 2CM" },  
  { category: "Acrylic Stand", name: "ACRYLIC STAND 3MM" },  
  { category: "Softcopy Design", name: "WITH BACKGROUND CUSTOM" },  
  { category: "Additional", name: "BACKGROUND CUSTOM" },  
];  
  

// BARIS 4 (PENTING – Custom Fix)    
const baris4 = [    
  { category: "3D Frame", name: "4R" },    
  { category: "Additional", name: "TAMBAHAN WAJAH KARIKATUR" },    
  { category: "Additional", name: "BIAYA EXPRESS" },    
  { category: "Additional", name: "BIAYA" },    
];

// Helper ambil produk  
const findProduct = (item) =>  
  allProducts.find(  
    (p) => p.category === item.category && p.name === item.name  
  ) || null;  
  
// Ambil produk per baris  
const part1 = baris1.map(findProduct).filter(Boolean);  
const part2 = baris2.map(findProduct).filter(Boolean);  
const part3 = baris3.map(findProduct).filter(Boolean);  
const part4 = baris4.map(findProduct).filter(Boolean);  
  
// Gabungkan urutan 1–4  
let orderedProducts = [...part1, ...part2, ...part3, ...part4];  
  
// Tambahkan sisa produk (tanpa duplikat)  
const usedIds = new Set(orderedProducts.map((p) => p.id));  
const remainingProducts = allProducts.filter((p) => !usedIds.has(p.id));  
  
orderedProducts = [...orderedProducts, ...remainingProducts];  
  
console.log("%c✅ URUTAN PRODUK AKHIR (Nomor urut tampil):", "color: lightgreen; font-weight: bold;");  
orderedProducts.forEach((p, i) => {  
  console.log(`${i + 1}. ${p.category} / ${p.name}`);  
});  
  
// === EXPORT FINAL TANPA DUPLIKAT ===  
export { orderedProducts };