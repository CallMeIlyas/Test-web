import type { FC } from "react";
import { useLocation, useSearchParams } from "react-router-dom"; 
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import type { FilterOptions } from "../../types/types";
import { orderedProducts } from "../../data/productDataLoader";
import { useProductFilter } from "../../hooks/useProductFilter";
import { useSort } from "../../hooks/useSort";
import { usePagination } from "../../hooks/usePagination";
import { useEffect, useMemo } from "react";

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
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const PRODUCTS_PER_PAGE = 16;

  // === PRIORITAS URL PARAMS UNTUK TAB BARU ===
  // Jika membuka di tab baru, props mungkin kosong, ambil dari URL
  const effectiveFilters = useMemo(() => {
    const urlCategory = searchParams.get('category');
    const urlType = searchParams.get('type');
    const urlExclude = searchParams.get('exclude');
    
    // Jika ada params di URL dan filters kosong (tab baru), gunakan URL params
    if ((urlCategory || urlType || urlExclude) && 
        filters.categories.length === 0 && 
        filters.shippedFrom.length === 0 && 
        filters.shippedTo.length === 0) {
      
      const newFilters: FilterOptions = {
        categories: urlCategory ? [urlCategory] : [],
        shippedFrom: filters.shippedFrom,
        shippedTo: filters.shippedTo
      };
      
      return newFilters;
    }
    
    return filters;
  }, [filters, searchParams]);

  const effectiveSearchQuery = useMemo(() => {
    const urlSearch = searchParams.get('search');
    // Prioritaskan URL search jika ada dan searchQuery kosong
    return urlSearch && !searchQuery ? urlSearch : searchQuery;
  }, [searchQuery, searchParams]);

  const effectiveSortOption = useMemo(() => {
    const urlSort = searchParams.get('sort');
    // Prioritaskan URL sort jika ada dan sortOption default
    return urlSort && sortOption === 'default' ? urlSort : sortOption;
  }, [sortOption, searchParams]);

  // Step 1: Filter products dengan URL params
  const filteredProducts = useProductFilter(
    orderedProducts, 
    effectiveFilters, 
    effectiveSearchQuery,
    location.search
  );
  
  // Step 2: Sort products
  const { sortedProducts } = useSort(filteredProducts);
  
  // Step 3: Apply sort option
  const finalProducts = useMemo(() => {
    switch (effectiveSortOption) {
      case "best-selling":
        // Filter best selling products dengan logika lebih fleksibel
        return sortedProducts.filter((p) => {
          if (!p.displayName || !p.category) return false;
          const name = p.displayName.toLowerCase().trim();
          const category = p.category.toLowerCase().trim();
          const subcategory = p.subcategory?.toLowerCase().trim() || '';

          // 3D Frame - terima berbagai ukuran populer
          if (category.includes("3d") || category === "3d frame") {
            const hasPopularSize = 
              /\b(12r|10r|8r|a0|a1|a2|a0-80x110cm|a1-55x80cm|a2-40x55cm)\b/.test(name) ||
              /\b(12r|10r|8r|a0|a1|a2|a0-80x110cm|a1-55x80cm|a2-40x55cm)\b/.test(subcategory);
            
            return hasPopularSize && !name.includes("by ai");
          }

          // 2D Frame - terima berbagai ukuran populer
          if (category.includes("2d") || category === "2d frame") {
            return /\b(8r|12r|15cm|4r|6r)\b/.test(name) ||
                   /\b(8r|12r|15cm|4r|6r)\b/.test(subcategory);
          }

          // Acrylic Stand
          if (name.includes("acrylic stand")) {
            return name.includes("2cm") || name.includes("3mm");
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
  }, [sortedProducts, effectiveSortOption]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentProducts,
  } = usePagination(finalProducts, PRODUCTS_PER_PAGE);

  // Reset page ketika filter/search/sort/URL berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [effectiveFilters, effectiveSearchQuery, effectiveSortOption, location.search, setCurrentPage]);

  // Debug untuk tab baru
  useEffect(() => {
    console.log("=== ProductGrid Debug ===");
    console.log("URL Search:", location.search);
    console.log("Effective Filters:", effectiveFilters);
    console.log("Effective Search Query:", effectiveSearchQuery);
    console.log("Effective Sort Option:", effectiveSortOption);
    console.log("Filtered Products Count:", filteredProducts.length);
    console.log("Final Products Count:", finalProducts.length);
  }, [location.search, effectiveFilters, effectiveSearchQuery, effectiveSortOption, filteredProducts.length, finalProducts.length]);

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
            <ProductCard key={product.id} product={product} />
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
      {totalPages > 1 && (
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