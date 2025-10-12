import { useState, type FC } from "react";
import { useOutletContext } from "react-router-dom";
import Footer from "../components/home/Footer";
import SidebarFilters from "../components/our-products/SidebarFilters";
import ProductGridWithPagination from "../components/our-products/ProductGrid";
import type { FilterOptions, CartItem } from "../types/types";

interface LayoutContext {
  searchQuery: string;
}

const OurProducts: FC = () => {
  const { searchQuery} = useOutletContext<LayoutContext>();
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    shippedFrom: [],
    shippedTo: [],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 bg-gray-50">
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