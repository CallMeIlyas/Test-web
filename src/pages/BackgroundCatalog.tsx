import React, { useState } from 'react';
import Footer from '../components/home/Footer';
import Sidebar from '../components/background-catalog/SidebarFilters';
import ProductGrid from '../components/background-catalog/ProductGrid';
import MobileFilterSheet from '../components/background-catalog/MobileFilterSheet';
import SortControls from '../components/background-catalog/SortControls'; // Import SortControls
import type { FilterOptions } from '../types/types';
import NoteIcon from "../assets/Icons/NOTES.png";

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
  const [sortOption, setSortOption] = useState("all"); // State untuk sort

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HAPUS tombol filter mobile statis dari sini */}

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar - hidden di mobile */}
        <div className="hidden md:block">
          <Sidebar onFilterChange={setFilters} />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Tambahkan SortControls di sini */}
          <div className="p-4">
            <SortControls 
              sortOption={sortOption}
              onSortChange={setSortOption}
              onOpenFilters={() => setSheetOpen(true)} // Tambahkan prop ini
            />
          </div>
          
          <ProductGrid 
            filters={filters} 
            searchQuery={searchQuery} 
            sortOption={sortOption} // Teruskan sortOption ke ProductGrid
          />
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