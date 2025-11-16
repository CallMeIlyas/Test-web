import React, { useState } from 'react';
import Footer from '../components/home/Footer';
import Sidebar from '../components/background-catalog/SidebarFilters';
import ProductGrid from '../components/background-catalog/ProductGrid';
import MobileFilterSheet from '../components/background-catalog/MobileFilterSheet';
import type { FilterOptions } from '../types/types';
import NoteIcon from "../assets/Icons/NOTES.png";
import { FaFilter } from "react-icons/fa";

interface BackgroundCatalogProps {
  searchQuery?: string; 
}

const BackgroundCatalog: React.FC<BackgroundCatalogProps> = ({ searchQuery = "" }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    shippedFrom: [],
    shippedTo: []
  });
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Tombol filter mobile - static positioning */}
      <div className="md:hidden w-full px-4 py-3 bg-white shadow-sm sticky top-0 z-40">
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm"
        >
          <FaFilter size={14} />
          Filter
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar - hidden di mobile */}
        <div className="hidden md:block">
          <Sidebar onFilterChange={setFilters} />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid filters={filters} searchQuery={searchQuery} />
        </div>
      </div>

      {/* Note Section */}
      <div className="flex text-justify items-start gap-4 my-6 md:my-8 px-4 md:px-24 max-w-full md:max-w-[969px] md:ml-[150px]">
        <img 
          src={NoteIcon} 
          alt="Note Icon" 
          className="hidden md:block w-[110px] -translate-y-3 translate-x-7" 
        />
        <img 
          src={NoteIcon} 
          alt="Note Icon" 
          className="block md:hidden w-16 -translate-y-1" 
        />
        <p className="text-sm md:text-md font-poppinsRegular">
          Customers are free to use the background from this catalog, the logo, products, plant or any
          elements can be replaced as requested. Please note, customers must purchase additional fee for
          background custom. From image to illustration count as background custom.
        </p>
      </div>

      <Footer />
      
      {/* Mobile Filter Sheet */}
      <MobileFilterSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onFilterChange={setFilters}
      />
    </div>
  );
};

export default BackgroundCatalog;