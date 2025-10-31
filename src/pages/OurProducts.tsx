import { useState, useEffect } from "react";
import { useLocation, useOutletContext } from "react-router-dom"; 
import Footer from "../components/home/Footer";
import SidebarFilters from "../components/our-products/SidebarFilters";
import ProductGridWithPagination from "../components/our-products/ProductGrid";
import type { FilterOptions } from "../types/types";

type LayoutContext = {
  searchQuery: string;
  addToCart: (item: any) => void;
};

const OurProducts = () => {
  const { searchQuery } = useOutletContext<LayoutContext>(); // ✅ AMBIL DARI CONTEXT
  const location = useLocation();

  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    shippedFrom: [],
    shippedTo: [],
  });

  // ✅ AUTO FILTER dari ?category= di URL
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
            searchQuery={searchQuery} // ✅ nilai context sekarang nyambung
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OurProducts;