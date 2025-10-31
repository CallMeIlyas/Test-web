import { priceList } from "../data/priceList";

export function getPrice(category: string, name: string, size?: string): number {
  if (!category || !name) return 0;

  const normalize = (str: string) =>
    str.trim().toLowerCase().replace(/\s+/g, " ");

  const normalizedCategory = normalize(category);
  const normalizedName = normalize(name);
  const normalizedSize = size ? normalize(size) : "";

  const matchedCategory = Object.keys(priceList).find(
    (key) => normalize(key) === normalizedCategory
  );

  if (!matchedCategory) {
    console.warn(`⚠️ Category not found in priceList: ${category}`);
    return 0;
  }

  // Fix: Use proper type assertion with keyof typeof priceList
  const categoryData = priceList[matchedCategory as keyof typeof priceList];

  if (!categoryData || typeof categoryData !== 'object') {
    console.warn(`⚠️ Invalid category data for: ${matchedCategory}`);
    return 0;
  }

  // 🔍 Cari key di dalam category yang mengandung size + name
let matchedKey: string | undefined;

if (normalizedCategory === "additional") {
  // 🟢 Jika mengandung 'ekspress' → cocokkan penuh
  if (normalizedName.includes("ekspress")) {
    matchedKey = Object.keys(categoryData).find(
      (key) => normalize(key) === normalizedName
    );
  }
  // 🟢 Jika mengandung 'wajah' → cocokkan berdasarkan jenis shading
  else if (normalizedName.includes("wajah")) {
    const shadingTypes = ["ai", "bold shading", "dari foto asli", "karikatur", "banyak"];
    const foundType = shadingTypes.find((type) =>
      normalizedName.includes(type)
    );
    matchedKey = Object.keys(categoryData).find(
      (key) => normalize(key).includes(foundType || "wajah")
    );
  }
  // 🟢 Fallback untuk additional lainnya
  else {
    matchedKey = Object.keys(categoryData).find(
      (key) => normalize(key) === normalizedName
    );
  }
} else {
  // 🔄 Fallback default (3D, 2D, dll.)
  matchedKey = Object.keys(categoryData).find((key) => {
    const normalizedKey = normalize(key);
    return (
      normalizedKey.includes(normalizedSize) &&
      normalizedKey.includes(normalizedName.split(" ")[1] ?? normalizedName)
    );
  });
}


  if (!matchedKey) {
    console.warn(`⚠️ Size not found in priceList[${matchedCategory}]: ${name} (normalized: ${normalizedName})`);
    return 0;
  }

  // Fix: Use proper type assertion for the matched key
  const price = categoryData[matchedKey as keyof typeof categoryData];
  return typeof price === 'number' ? price : 0;
}