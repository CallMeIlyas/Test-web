import React, { useState } from 'react';
import Footer from '../components/home/Footer';
import Sidebar from '../components/background-catalog/SidebarFilters';
import ProductGrid from '../components/background-catalog/ProductGrid';
import type { FilterOptions } from '../types/types';

interface BackgroundCatalogProps {
  searchQuery: string; 
}

const BackgroundCatalog: React.FC<BackgroundCatalogProps> = () => {
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
          <ProductGrid filters={filters} />
        </div>
      </div>

      {/* Note Section */}
      <div className="flex items-center gap-4 max-w-4xl mx-auto my-8 px-4 mr-10">
        <img
          src="/src/assets/Icons/NOTES.png"
          alt="Note Icon"
          className="w-20 translate-x-7"
        />
        <p className="text-sm">
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