import { useMemo } from "react";  
import type { FilterOptions } from "../types/types";  
  
interface Product {  
  id: string;  
  imageUrl: string;  
  name: string;  
  size: string;  
  category: string;  
  subcategory: string | null;  
  fullPath: string;  
  price: number;  
  shippedFrom: string[];  
  shippedTo: string[];  
  allImages?: string[];  
}
  
const normalize = (str: string) =>  
  str.toLowerCase().replace(/[^a-z0-9]/g, "");  

// Daftar kategori yang tersedia di setiap lokasi pengiriman
const locationCategories: Record<string, string[]> = {
  "Bogor": ["4R", "15cm", "6R", "20cm", "8R", "10R", "12R", "A2", "A1", "A0"],
  "Jakarta": ["4R", "15cm", "6R", "8R", "10R", "12R"],
  "Worldwide": ["4R", "15cm", "6R", "20cm", "8R", "10R", "12R", "A2", "A1", "A0"]
};

// Mapping dari nama folder ke format yang konsisten
const categoryMapping: Record<string, string> = {
  // 2D & 3D Frame digabung
  "4R": "4R",
  "15cm": "15cm", 
  "6R": "6R",
  "8R": "8R",
  "10R": "10R",
  "12R": "12R",
  "12R by AI": "12R",
  "15X15CM": "15cm",
  "20X20CM": "20cm",
  "A0-80X110CM": "A0",
  "A1-55X80CM": "A1", 
  "A2-40X55CM": "A2",
  "15x15cm": "15cm",
  "20x20cm": "20cm",
  "a0-80x110cm": "A0",
  "a1-55x80cm": "A1",
  "a2-40x55cm": "A2"
};

// Normalize category name untuk matching
const normalizeCategoryForLocation = (subcategory: string | null): string => {
  if (!subcategory) return "";
  
  const mapped = categoryMapping[subcategory];
  if (mapped) {
    return mapped.toLowerCase();
  }
  
  const lowerSub = subcategory.toLowerCase();
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (key.toLowerCase() === lowerSub) {
      return value.toLowerCase();
    }
  }
  
  return lowerSub;
};

// Cek apakah produk tersedia di lokasi pengiriman yang dipilih
const isProductAvailableInLocation = (product: Product, location: string): boolean => {
  const availableCategories = locationCategories[location] || [];
  const productCategory = normalizeCategoryForLocation(product.subcategory);
  
  const isAvailable = availableCategories.some(availableCat => 
    availableCat.toLowerCase() === productCategory
  );
  
  return isAvailable;
};
  
export const useProductFilter = (  
  allProducts: Product[],  
  filters: FilterOptions,  
  searchQuery: string  
) => {  
  const filteredProducts = useMemo(() => {  
    const result = allProducts.filter((product) => {  
      // Filter Categories
      if (filters.categories.length > 0) {  
        const matchCategory = filters.categories.some((filterCat) => {  
          const normalizedProductCategory = product.category.toLowerCase();  
          const normalizedProductSub = product.subcategory?.toLowerCase() || "";  
          const normalizedFullPath = `${normalizedProductCategory}/${normalizedProductSub}`.toLowerCase();  
          const normalizedFilter = filterCat.toLowerCase();  
  
          return (  
            normalizedProductCategory === normalizedFilter ||  
            normalizedProductSub === normalizedFilter ||  
            normalizedFullPath === normalizedFilter  
          );  
        });  
  
        if (!matchCategory) {
          return false;
        }  
      }  
  
      // Filter Shipped From
      if (filters.shippedFrom.length > 0) {
        const matchShippedFrom = filters.shippedFrom.some(location => {
          const locationAvailable = product.shippedFrom.includes(location);
          const categoryAvailable = isProductAvailableInLocation(product, location);
          return locationAvailable && categoryAvailable;
        });
        
        if (!matchShippedFrom) {
          return false;
        }
      }
  
      // Filter Shipped To
      if (filters.shippedTo.length > 0) {  
        const matchShippedTo = filters.shippedTo.some(destination => {
          const destinationMatch = product.shippedTo.includes(destination);
          const categoryAvailable = isProductAvailableInLocation(product, destination);
          return destinationMatch && categoryAvailable;
        });
        
        if (!matchShippedTo) {
          return false;
        }
      }  
  
      // Filter Search Query
      if (searchQuery.trim() !== "") {  
        const query = normalize(searchQuery);  
        const nameNorm = normalize(product.name);  
        const categoryNorm = normalize(product.category);  
        const subcategoryNorm = normalize(product.subcategory || "");  
        const pathNorm = normalize(product.fullPath);  
  
        if (  
          !nameNorm.includes(query) &&  
          !categoryNorm.includes(query) &&  
          !subcategoryNorm.includes(query) &&  
          !pathNorm.includes(query)  
        ) {  
          return false;  
        }  
      }  
  
      return true;  
    });  
    
    return result;
  }, [filters, searchQuery, allProducts]);  
  
  return filteredProducts;  
};