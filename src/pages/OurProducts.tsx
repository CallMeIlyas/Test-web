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
  const [sortOption, setSortOption] = useState("");
  
  // State untuk track apakah ada URL parameters
  const [hasUrlParams, setHasUrlParams] = useState(false);

  // Debug info
  useEffect(() => {
    console.log("=== OurProducts Debug ===");
    console.log("Current URL:", location.search);
    console.log("SearchQuery from context:", searchQuery);
    console.log("Current filters:", filters);
    
    const params = new URLSearchParams(location.search);
    console.log("URL params:", {
      category: params.get("category"),
      search: params.get("search"),
      type: params.get("type"),
      size: params.get("size"),
      exclude: params.get("exclude")
    });
    
    // Cek apakah ada URL parameters
    const hasParams = params.toString() !== '';
    setHasUrlParams(hasParams);
  }, [location.search, searchQuery, filters]);

  // **PERBAIKAN: HANYA reset filters jika URL berubah dari yang sebelumnya ada parameters**
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Jika ada URL parameters, reset UI filters
    if (params.toString() !== '') {
      console.log("URL has parameters, resetting UI filters");
      setFilters({
        categories: [],
        shippedFrom: [],
        shippedTo: [],
      });
    }
  }, [location.search]);

  // Reset sort ketika URL berubah (untuk consistency)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.toString() !== '') {
      setSortOption("");
    }
  }, [location.search]);
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Konten utama */}
      <div className="flex flex-1">
        <div className="hidden md:block">
          <SidebarFilters 
            onFilterChange={setFilters} 
            // Beri tahu SidebarFilters bahwa ada URL params
            isDisabled={hasUrlParams}
          />
        </div>
        
        <div className="flex-1">
          {/* Tambahkan SortControls di sini */}
          <div className="p-4">
            <SortControls 
              sortOption={sortOption}
              onSortChange={setSortOption}
              onOpenFilters={() => setSheetOpen(true)}
              showReset={hasUrlParams}
              onReset={() => {
                // Reset ke URL kosong
                window.history.pushState({}, '', '/products');
                setHasUrlParams(false);
              }}
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
        isDisabled={hasUrlParams}
      />
    </div>
  );
};

export default OurProducts;