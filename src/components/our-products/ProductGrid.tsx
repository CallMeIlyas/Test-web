import type { FC } from "react";
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
  sortOption: string; // Tambahkan prop ini
}

const ProductGridWithPagination: FC<ProductGridWithPaginationProps> = ({
  filters,
  searchQuery,
  sortOption, // Terima sortOption dari parent
}) => {
  const PRODUCTS_PER_PAGE = 16;

  const filteredProducts = useProductFilter(orderedProducts, filters, searchQuery);
  
  // Hapus useSort karena sekarang sortOption dikontrol dari parent
  // Gunakan fungsi sorting sederhana di sini
  const sortedProducts = (() => {
    switch (sortOption) {
      case "price-asc":
        return [...filteredProducts].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...filteredProducts].sort((a, b) => b.price - a.price);
      case "best-selling":
        // Implementasi best-selling logic sesuai kebutuhan
        return filteredProducts;
      default:
        return filteredProducts;
    }
  })();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentProducts,
  } = usePagination(sortedProducts, PRODUCTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortOption]);

  return (
    <div className="pb-10 bg-white">
      {/* HAPUS SortControls dari sini karena sudah ada di OurProducts */}

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