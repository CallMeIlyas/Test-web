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
  displayName?: string; // ✅ tambahin untuk dukung best selling
  allImages?: string[];
}

export const useSort = (products: Product[]) => {
  const [sortOption, setSortOption] = useState("default");

  // ✅ Daftar produk Best Selling
  const bestSellingProducts = ["12R", "15cm", "10R", "Acrylic Stand 2cm"];

  const sortedProducts = useMemo(() => {
    // ✅ Filter Best Selling
    if (sortOption === "best-selling") {
      return products.filter((p) =>
        bestSellingProducts.some(
          (item) =>
            item.toLowerCase().trim() ===
            (p.displayName || p.name).toLowerCase().trim()
        )
      );
    }

    // ✅ Sorting Harga
    switch (sortOption) {
      case "price-asc":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...products].sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  }, [products, sortOption]);

  return { sortedProducts, sortOption, setSortOption };
};