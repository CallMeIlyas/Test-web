import { useState } from "react";
import type { FC } from "react";
import { useOutletContext } from "react-router-dom";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import SortControl from "./SortControls";
import type { FilterOptions } from "../../types/types";

interface Product {
  imageUrl: string;
  name: string;
  size: string;
  category: string;
}

// --- Context dari Layout ---
interface LayoutContext {
  searchQuery: string;
}

// --- Mapping folder → kategori ---
const folderToCategory: Record<string, string> = {
  "company-office-brand": "Company/Office/Brand",
  "goverment-police": "Goverment/Police",
  "oil-construction-ship": "Oil/Construction",
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
}

const ProductGridWithPagination: FC<ProductGridWithPaginationProps> = ({ filters }) => {
  const { searchQuery } = useOutletContext<LayoutContext>(); // ✅ ambil dari Layout

  const PRODUCTS_PER_PAGE = 16;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("all");

  // --- Filter kategori + search ---
  const filteredProducts = allProducts.filter((product) => {
    // filter kategori
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }
    // filter search
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // --- Sorting ---
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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

  return (
    <div className="pb-10">
      {/* SortControl */}
      <div className="flex justify-start w-full px-5 max-w-7xl mx-auto mb-5">
        <div className="w-full">
          <SortControl sortOption={sortOption} onSortChange={setSortOption} />
        </div>
      </div>

      {/* Produk Grid */}
      <div className="grid grid-cols-4 gap-5 px-10 max-w-[1230px] mx-auto">
        {currentProducts.map((product, index) => (
          <ProductCard
            key={`${product.name}-${index}`}
            imageUrl={product.imageUrl}
            name={product.name}
          />
        ))}
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