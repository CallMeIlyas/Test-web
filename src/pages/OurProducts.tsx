import { useState, type FC, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import Footer from "../components/home/Footer";
import SidebarFilters from "../components/our-products/SidebarFilters";
import ProductGridWithPagination from "../components/our-products/ProductGrid";
import type { FilterOptions } from "../types/types";

interface OurProductsProps {
  searchQuery?: string; // ✅ Terima sebagai props
}

const OurProducts: FC<OurProductsProps> = ({ searchQuery = "" }) => {
  const location = useLocation();
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    shippedFrom: [],
    shippedTo: [],
  });

  // ✅ AUTO FILTER kalau ada ?category= di URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromURL = params.get("category");

    if (categoryFromURL) {
      setFilters(prev => ({
        ...prev,
        categories: [categoryFromURL],
      }));
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 bg-white">
        <SidebarFilters onFilterChange={setFilters} />
        <div className="flex-1">
          <ProductGridWithPagination
            filters={filters}
            searchQuery={searchQuery}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OurProducts;