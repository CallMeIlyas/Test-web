import React, { useState } from 'react';
import Footer from '../components/home/Footer';
import Sidebar from '../components/background-catalog/SidebarFilters';
import ProductGrid from '../components/background-catalog/ProductGrid';
import type { FilterOptions } from '../types/types';
import NoteIcon from "../assets/Icons/NOTES.png";

interface BackgroundCatalogProps {
  searchQuery?: string; // ✅ Terima sebagai props dengan optional
}

const BackgroundCatalog: React.FC<BackgroundCatalogProps> = ({ searchQuery = "" }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    shippedFrom: [],
    shippedTo: []
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar onFilterChange={setFilters} />

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid filters={filters} searchQuery={searchQuery} />
        </div>
      </div>

      {/* Note Section */}
      <div className="flex text-justify items-start gap-4 my-8 px-24 max-w-[969px] ml-[150px]">
        <img src={NoteIcon} alt="Note Icon" className="w-[110px] -translate-y-3 translate-x-7" />
        <p className="text-md font-poppinsRegular">
          Customers are free to use the background from this catalog, the logo, products, plant or any
          elements can be replaced as requested. Please note, customers must purchase additional fee for
          background custom. From image to illustration count as background custom.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default BackgroundCatalog;