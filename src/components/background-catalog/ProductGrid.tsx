import { useState, useEffect } from "react";
import type { FC } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import type { FilterOptions } from "../../types/types";

interface Product {
  imageUrl: string;
  name: string;
  size: string;
  category: string;
}

// --- Mapping folder → kategori ---
const folderToCategory: Record<string, string> = {
  "company-office-brand": "Company/Office/Brand",
  "goverment-police": "Goverment/Police",
  "oil-construction-ship": "Oil/Construction/Ship",
  "hospital-medical": "Hospital/Medical",
  "graduation-school-children": "Graduation/School/Children",
  "couple-wedding-birthday": "Couple/Wedding/Birthday",
  "travel-place-country-culture": "Travel/Place/Country/Culture",
  "indoor-cafe-kitchen": "Indoor/Cafe/Kitchen",
  "sport": "Sport",
  "others": "Others",
  "pop-up-photos": "Pop Up Photos",
  "plakat": "Acrylic Stand",
};

// --- Daftar gambar FREQUENTLY USED (berdasarkan nama file) ---
const FREQUENTLY_USED_NAMES = [
  "HES-FEB25",
  "APR-MAY23",
  "CAT-DEC20",
  "BIM-JAN24",
  "EKA-JAN25"
];

// --- Import semua gambar ---
const allImages = import.meta.glob(
  "/src/assets/bg-catalog/*/*.{jpg,JPG,jpeg,png}",
  { eager: true, import: "default" }
);

// --- Convert ke products ---
const allProducts: Product[] = Object.keys(allImages).map((path, i) => {
  const parts = path.split("/");
  const folder = parts[parts.length - 2];
  const fileName = parts[parts.length - 1];
  const productName = fileName.replace(/\.(jpg|jpeg|png|JPG)$/i, "");
  
  return {
    imageUrl: allImages[path] as string,
    name: productName,
    size: `${30 + (i % 10)}x${40 + (i % 10)}cm`,
    category: folderToCategory[folder] || "Others",
  };
});

interface ProductGridWithPaginationProps {
  filters: FilterOptions;
  searchQuery?: string;
  sortOption?: string;
}

const ProductGridWithPagination: FC<ProductGridWithPaginationProps> = ({ 
  filters, 
  searchQuery = "",
  sortOption = "all"
}) => {
  const PRODUCTS_PER_PAGE = 16;
  const [currentPage, setCurrentPage] = useState(1);

  // --- Helper: Check if product is frequently used ---
  const isFrequentlyUsed = (product: Product): boolean => {
    // Cek apakah nama produk ada di daftar frequently used
    const isInList = FREQUENTLY_USED_NAMES.some(name => 
      product.name.toUpperCase().includes(name.toUpperCase())
    );
    
    // ATAU apakah dari kategori Company/Office/Brand
    const isCompanyCategory = product.category === "Company/Office/Brand";
    
    return isInList || isCompanyCategory;
  };

  // --- Filter kategori + search + frequently/rarely ---
  const filteredProducts = allProducts.filter((product) => {
    // 1. Filter berdasarkan sortOption (frequently/rarely)
    if (sortOption === "frequently-used") {
      if (!isFrequentlyUsed(product)) {
        return false;
      }
    } else if (sortOption === "rarely-used") {
      if (isFrequentlyUsed(product)) {
        return false;
      }
    }

    // 2. Filter kategori (dari sidebar)
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }
    
    // 3. Filter search
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // --- Sorting (alphabetical + priority for frequently used) ---
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // Jika sortOption adalah "frequently-used", prioritaskan gambar spesifik
    if (sortOption === "frequently-used") {
      const aIsSpecific = FREQUENTLY_USED_NAMES.some(name => 
        a.name.toUpperCase().includes(name.toUpperCase())
      );
      const bIsSpecific = FREQUENTLY_USED_NAMES.some(name => 
        b.name.toUpperCase().includes(name.toUpperCase())
      );

      // Jika a adalah gambar spesifik tapi b bukan, a lebih dulu
      if (aIsSpecific && !bIsSpecific) return -1;
      // Jika b adalah gambar spesifik tapi a bukan, b lebih dulu
      if (!aIsSpecific && bIsSpecific) return 1;

      // Jika keduanya gambar spesifik, urutkan sesuai urutan di FREQUENTLY_USED_NAMES
      if (aIsSpecific && bIsSpecific) {
        const aIndex = FREQUENTLY_USED_NAMES.findIndex(name => 
          a.name.toUpperCase().includes(name.toUpperCase())
        );
        const bIndex = FREQUENTLY_USED_NAMES.findIndex(name => 
          b.name.toUpperCase().includes(name.toUpperCase())
        );
        return aIndex - bIndex;
      }

      // Jika keduanya bukan gambar spesifik, sort alphabetically
      return a.name.localeCompare(b.name);
    }

    // Sorting biasa untuk option lainnya
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "size-asc") return a.size.localeCompare(b.size);
    if (sortOption === "size-desc") return b.size.localeCompare(a.size);
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortOption]);

  return (
    <div className="pb-10 bg-white">
      {/* Product Grid - responsive */}
      <div className="
        grid 
        grid-cols-2 
        md:grid-cols-4 
        gap-4 md:gap-5 
        px-4 md:px-10 
        max-w-[1230px] 
        mx-auto 
        place-items-center
      ">
        {currentProducts.length > 0 ? (
          currentProducts.map((product, index) => (
            <div key={`${product.name}-${index}`} className="w-full flex justify-center">
              <ProductCard
                imageUrl={product.imageUrl}
                name={product.name}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            {allProducts.length === 0
              ? "No images found."
              : "No products match your current filters"}
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProductGridWithPagination;