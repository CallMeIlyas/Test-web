import type { FC } from "react";
import { useLocation } from "react-router-dom"; 
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import type { FilterOptions } from "../../types/types";
import { orderedProducts } from "../../data/productDataLoader";
import { useProductFilter } from "../../hooks/useProductFilter";
import { useSort } from "../../hooks/useSort";
import { usePagination } from "../../hooks/usePagination";
import { useEffect } from "react";

export interface ProductGridWithPaginationProps {
  filters: FilterOptions;
  searchQuery: string;
  sortOption: string;
}

const ProductGridWithPagination: FC<ProductGridWithPaginationProps> = ({
  filters,
  searchQuery,
  sortOption,
}) => {
  const location = useLocation(); // Tambahkan ini
  const PRODUCTS_PER_PAGE = 16;

  // ✅ Step 1: Filter products - SEKARANG DENGAN URL PARAMS
  const filteredProducts = useProductFilter(
    orderedProducts, 
    filters, 
    searchQuery,
    location.search // Kirim URL search string ke hook
  );
  
  // ✅ Step 2: Sort products menggunakan useSort yang sudah diperbaiki
  const { sortedProducts } = useSort(filteredProducts);
  
  // ✅ Step 3: Apply sort option dari parent (untuk override jika perlu)
  const finalProducts = (() => {
    switch (sortOption) {
      case "best-selling":
        // Filter best selling products
        return sortedProducts.filter((p) => {
          if (!p.displayName || !p.category) return false;
          const name = p.displayName.toLowerCase().trim();
          const category = p.category.toLowerCase().trim();

          if (
            category.includes("3d") &&
            (/\b12r\b/.test(name) || /\b10r\b/.test(name)) &&
            !name.includes("by ai")
          ) {
            return true;
          }

          if (category.includes("2d") && /\b8r\b/.test(name)) {
            return true;
          }

          if (name.includes("acrylic stand") && name.includes("2cm")) {
            return true;
          }

          return false;
        });
      case "price-asc":
        return [...sortedProducts].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...sortedProducts].sort((a, b) => b.price - a.price);
      default:
        return sortedProducts;
    }
  })();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentProducts,
  } = usePagination(finalProducts, PRODUCTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortOption, location.search]);

  return (
    <div className="pb-10 bg-white">
      {/* === GRID PRODUK === */}
      <div
        className="
          grid 
          grid-cols-2 
          md:grid-cols-4 
          gap-5 
          px-4 md:px-10 
          max-w-[1230px] 
          mx-auto 
          place-items-center
        "
      >
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.id} className="w-full flex justify-center">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            {orderedProducts.length === 0
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