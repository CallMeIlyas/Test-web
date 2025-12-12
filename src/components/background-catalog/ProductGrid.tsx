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
  folder: string;
}

// --- Mapping folder → kategori ---
const folderToCategory: Record<string, string> = {
  "company-office-brand": "Company/Office/Brand",
  "goverment-police": "Goverment/Police",
  "government-police": "Goverment/Police",
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
    folder: folder
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
    const isInList = FREQUENTLY_USED_NAMES.some(name => 
      product.name.toUpperCase().includes(name.toUpperCase())
    );
    const isCompanyCategory = product.category === "Company/Office/Brand";
    return isInList || isCompanyCategory;
  };

  // --- Filter kategori + search + frequently/rarely ---
  const filteredProducts = allProducts.filter((product) => {
    // 1. Filter berdasarkan sortOption (frequently/rarely)
    if (sortOption === "frequently-used") {
      if (!isFrequentlyUsed(product)) return false;
    } else if (sortOption === "rarely-used") {
      if (isFrequentlyUsed(product)) return false;
    }

    // 2. Filter kategori (dari sidebar)
    if (filters.categories.length > 0) {
      const productCategoryLower = product.category.toLowerCase();
      const hasMatch = filters.categories.some(filterCat => 
        productCategoryLower.includes(filterCat.toLowerCase()) ||
        filterCat.toLowerCase().includes(productCategoryLower)
      );
      
      if (!hasMatch) return false;
    }
    
    // 3. Filter search
    if (searchQuery && searchQuery.trim() !== "") {
      const normalizedSearch = searchQuery.toLowerCase().trim();
      
      // Cari di berbagai field dengan logika partial match
      const searchInName = product.name.toLowerCase().includes(normalizedSearch);
      const searchInCategory = product.category.toLowerCase().includes(normalizedSearch);
      const searchInFolder = product.folder.toLowerCase().includes(normalizedSearch);
      
      // Juga coba cari dengan menghapus tanda baca/spasi
      const cleanName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanSearch = normalizedSearch.replace(/[^a-z0-9]/g, '');
      const searchInCleanName = cleanName.includes(cleanSearch);
      
      // Untuk keyword khusus seperti "TNI", "PNS", "suster", cari di kategori yang sesuai
      let searchInKeywords = false;
      
      // Mapping keyword ke kategori yang mungkin
      const keywordToCategoryMapping: Record<string, string[]> = {
        'tni': ['goverment', 'police', 'militer', 'tentara'],
        'pns': ['company', 'office', 'brand', 'kantor'],
        'suster': ['hospital', 'medical', 'medis', 'dokter'],
        'dokter': ['hospital', 'medical', 'medis'],
        'polisi': ['goverment', 'police'],
        'karyawan': ['company', 'office', 'brand'],
        'pegawai': ['company', 'office', 'brand'],
        'bos': ['company', 'office', 'brand'],
        'manager': ['company', 'office', 'brand'],
        'direktur': ['company', 'office', 'brand'],
        'wisuda': ['graduation', 'school'],
        'sekolah': ['graduation', 'school', 'children'],
        'anak': ['graduation', 'school', 'children'],
        'ultah': ['couple', 'wedding', 'birthday'],
        'nikah': ['couple', 'wedding', 'birthday'],
        'olahraga': ['sport'],
        'gym': ['sport'],
        'travel': ['travel', 'place', 'country', 'culture'],
        'liburan': ['travel', 'place', 'country', 'culture'],
        'cafe': ['indoor', 'cafe', 'kitchen'],
        'restoran': ['indoor', 'cafe', 'kitchen'],
      };
      
      // Cek jika search query adalah keyword yang punya mapping
      if (keywordToCategoryMapping[normalizedSearch]) {
        const possibleCategories = keywordToCategoryMapping[normalizedSearch];
        searchInKeywords = possibleCategories.some(keyword => 
          product.category.toLowerCase().includes(keyword) ||
          product.folder.toLowerCase().includes(keyword)
        );
      }
      
      // Gabungkan semua kemungkinan pencarian
      const hasMatch = searchInName || searchInCategory || searchInFolder || 
                      searchInCleanName || searchInKeywords;
      
      if (!hasMatch) return false;
    }
    
    return true;
  });

  // --- Sorting ---
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "frequently-used") {
      const aIsSpecific = FREQUENTLY_USED_NAMES.some(name => 
        a.name.toUpperCase().includes(name.toUpperCase())
      );
      const bIsSpecific = FREQUENTLY_USED_NAMES.some(name => 
        b.name.toUpperCase().includes(name.toUpperCase())
      );

      if (aIsSpecific && !bIsSpecific) return -1;
      if (!aIsSpecific && bIsSpecific) return 1;
      if (aIsSpecific && bIsSpecific) {
        const aIndex = FREQUENTLY_USED_NAMES.findIndex(name => 
          a.name.toUpperCase().includes(name.toUpperCase())
        );
        const bIndex = FREQUENTLY_USED_NAMES.findIndex(name => 
          b.name.toUpperCase().includes(name.toUpperCase())
        );
        return aIndex - bIndex;
      }
      return a.name.localeCompare(b.name);
    }

    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "size-asc") return a.size.localeCompare(a.size);
    if (sortOption === "size-desc") return b.size.localeCompare(b.size);
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
      {/* Product Grid */}
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
      {sortedProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ProductGridWithPagination;