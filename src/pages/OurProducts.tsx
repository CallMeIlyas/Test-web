import { useState, useEffect } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import Footer from "../components/home/Footer";
import SidebarFilters from "../components/our-products/SidebarFilters";
import ProductGridWithPagination from "../components/our-products/ProductGrid";
import MobileFilterSheet from "../components/our-products/MobileFilterSheet";
import SortControls from "../components/our-products/SortControls"; 
import type { FilterOptions } from "../types/types";

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
  const [sortOption, setSortOption] = useState(""); // State untuk sort

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
      {/* Konten utama */}
      <div className="flex flex-1">
        <div className="hidden md:block">
          <SidebarFilters onFilterChange={setFilters} />
        </div>
        
        <div className="flex-1">
          {/* Tambahkan SortControls di sini */}
          <div className="p-4">
            <SortControls 
              sortOption={sortOption}
              onSortChange={setSortOption}
              onOpenFilters={() => setSheetOpen(true)}
            />
          </div>
          
          <ProductGridWithPagination
            filters={filters}
            searchQuery={searchQuery}
            sortOption={sortOption} 
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