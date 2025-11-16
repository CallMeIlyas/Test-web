import { useState, useEffect } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import Footer from "../components/home/Footer";
import SidebarFilters from "../components/our-products/SidebarFilters";
import ProductGridWithPagination from "../components/our-products/ProductGrid";
import MobileFilterSheet from "../components/our-products/MobileFilterSheet";
import type { FilterOptions } from "../types/types";
import { FaFilter } from "react-icons/fa";

type LayoutContext = {
  searchQuery: string;
  addToCart: (item: any) => void;
};

const OurProducts = () => {
  const { searchQuery } = useOutletContext<LayoutContext>();
  const location = useLocation();
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    shippedFrom: [],
    shippedTo: [],
  });
  const [sheetOpen, setSheetOpen] = useState(false);

  // Apply URL filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category],
      }));
    }
  }, [location.search]);
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Tombol filter mobile - static positioning */}
      <div className="md:hidden w-full px-4 py-3 bg-white shadow-sm sticky z-40">
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm"
        >
          <FaFilter size={14} />
          Filter
        </button>
      </div>

      {/* Konten utama */}
      <div className="flex flex-1">
        <div className="hidden md:block">
          <SidebarFilters onFilterChange={setFilters} />
        </div>
        <div className="flex-1">
          <ProductGridWithPagination
            filters={filters}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      <Footer />
      
      <MobileFilterSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onFilterChange={setFilters}
      />
    </div>
  );
};

export default OurProducts;