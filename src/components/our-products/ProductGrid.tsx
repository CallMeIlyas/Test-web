import type { FC } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import SortControls from "./SortControls";
import type { FilterOptions } from "../../types/types";
import { orderedProducts } from "../../data/productDataLoader";
import { useProductFilter } from "../../hooks/useProductFilter";
import { useSort } from "../../hooks/useSort";
import { usePagination } from "../../hooks/usePagination";
import { useEffect } from "react";

export interface ProductGridWithPaginationProps {
  filters: FilterOptions;
  searchQuery: string;
}

const ProductGridWithPagination: FC<ProductGridWithPaginationProps> = ({
  filters,
  searchQuery,
}) => {
  const PRODUCTS_PER_PAGE = 16;

  // Gunakan produk yang sudah diurutkan sesuai custom order
  const filteredProducts = useProductFilter(orderedProducts, filters, searchQuery);
  const { sortedProducts, sortOption, setSortOption } = useSort(filteredProducts);
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
      <div className="flex justify-start w-full px-5 max-w-7xl mx-auto mb-5">
        <div className="w-full">
          <SortControls sortOption={sortOption} onSortChange={setSortOption} />
        </div>
      </div>

<div className="grid grid-cols-4 gap-5 px-10 max-w-[1230px] mx-auto">
  {currentProducts.length > 0 ? (
    currentProducts.map((product) => {
      // Cari urutan asli di orderedProducts
      const originalIndex = orderedProducts.findIndex(p => p.id === product.id) + 1;

      return (
        <div key={product.id} className="relative">
          <ProductCard product={product as import("../../data/productDataLoader").Product} />
          
          {/* Debug badge untuk urutan asli */}
          <span className="absolute top-1 right-1 text-xs font-bold bg-yellow-300 text-black px-1 rounded">
            #{originalIndex}
          </span>
        </div>
      );
    })
  ) : (
    <div className="col-span-4 text-center py-10 text-gray-500">
      {orderedProducts.length === 0
        ? "No images found. Open browser console (F12) to see debug info."
        : "No products match your current filters"}
    </div>
  )}
</div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProductGridWithPagination;