import { useState, useMemo } from "react";

interface Product {
  id: string;
  imageUrl: string;
  name: string;
  size: string;
  category: string;
  subcategory: string | null;
  fullPath: string;
  price: number;
  shippedFrom: string;
  shippedTo: string[];
  allImages?: string[];
}

export const useSort = (products: Product[]) => {
  const [sortOption, setSortOption] = useState("default"); // default: no sorting

  const sortedProducts = useMemo(() => {
    switch (sortOption) {
      case "price-asc":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...products].sort((a, b) => b.price - a.price);
      default:
        return products; // No sorting - return original order
    }
  }, [products, sortOption]);

  return { sortedProducts, sortOption, setSortOption };
};