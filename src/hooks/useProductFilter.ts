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
  shippedFrom: string;
  shippedTo: string[];
  allImages?: string[];
}

const normalize = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]/g, "");

export const useProductFilter = (
  allProducts: Product[],
  filters: FilterOptions,
  searchQuery: string
) => {
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (filters.categories.length > 0) {
        const matchCategory = filters.categories.some((filterCat) => {
          const normalizedProductCategory = product.category.toLowerCase();
          const normalizedProductSub =
            product.subcategory?.toLowerCase() || "";
          const normalizedFullPath = `${normalizedProductCategory}/${normalizedProductSub}`.toLowerCase();
          const normalizedFilter = filterCat.toLowerCase();

          return (
            normalizedProductCategory === normalizedFilter ||
            normalizedProductSub === normalizedFilter ||
            normalizedFullPath === normalizedFilter
          );
        });

        if (!matchCategory) return false;
      }

      if (
        filters.shippedFrom.length > 0 &&
        !filters.shippedFrom.includes(product.shippedFrom)
      )
        return false;

      if (
        filters.shippedTo.length > 0 &&
        !product.shippedTo.some((dest) => filters.shippedTo.includes(dest))
      )
        return false;

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
  }, [filters, searchQuery, allProducts]);

  return filteredProducts;
};