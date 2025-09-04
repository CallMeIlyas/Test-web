import { FC, useState } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import SortControl from "./SortControls";
import type { FilterOptions } from "../../types/types";

// CartItem dari Layout
interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface Product {
  imageUrl: string;
  name: string;
  size: string;
  category: string;
  shippedFrom: string;
  shippedTo: string[];
  price: number; // ✅ tambahin harga di product
}

const allImages = import.meta.glob(
  "/src/assets/bg-catalog/*/*.{jpg,JPG,jpeg,png}",
  { eager: true, import: "default" }
) as Record<string, string>;

// Harga dummy per kategori
const categoryPrices: Record<string, number> = {
  "3D Frame": 250000,
  "2D Frame": 200000,
  Additional: 75000,
  "Acrylic Plaque": 300000,
  "Softcopy Design": 50000,
};

// Bikin dummy products dari hasil glob
const allProducts: Product[] = Object.keys(allImages).map((path, index) => {
  const fileName = path.split("/").pop() || `Produk ${index + 1}`;
  const category = [
    "3D Frame",
    "2D Frame",
    "Additional",
    "Acrylic Plaque",
    "Softcopy Design",
  ][index % 5];

  return {
    imageUrl: allImages[path],
    name: fileName.replace(/\.[^/.]+$/, ""),
    size: `${50 + (index % 10)}x${70 + (index % 10)}cm`,
    category,
    shippedFrom: ["Bogor", "Jakarta"][index % 2],
    shippedTo: ["Worldwide"],
    price: categoryPrices[category] || 100000, // ✅ dummy harga sesuai kategori
  };
});

interface ProductGridWithPaginationProps {
  filters: FilterOptions;
  searchQuery: string;
  onAddToCart: (item: CartItem) => void; // ✅ langsung CartItem
}

// 🔧 Fungsi normalize buat bikin search lebih fleksibel
const normalize = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]/g, "");

const ProductGridWithPagination: FC<ProductGridWithPaginationProps> = ({
  filters,
  searchQuery,
  onAddToCart,
}) => {
  const PRODUCTS_PER_PAGE = 16;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("name-asc");

  // ✅ Filtering
  const filteredProducts = allProducts.filter((product) => {
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category)
    )
      return false;

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
      const urlNorm = normalize(product.imageUrl);

      if (!nameNorm.includes(query) && !urlNorm.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "size-asc") return a.size.localeCompare(b.size);
    if (sortOption === "size-desc") return b.size.localeCompare(a.size);
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);

  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="pb-10 bg-white">
      {/* SortControl */}
      <div className="flex justify-start w-full px-5 max-w-7xl mx-auto mb-5">
        <div className="w-full">
          <SortControl sortOption={sortOption} onSortChange={setSortOption} />
        </div>
      </div>

      {/* Produk Grid */}
      <div className="grid grid-cols-4 gap-5 px-10 max-w-[1230px] mx-auto">
        {currentProducts.map((product, index) => (
          <ProductCard
            key={`${product.name}-${index}`}
            imageUrl={product.imageUrl}
            name={product.name}
            size={product.size}
            onAddToCart={() =>
              onAddToCart({
                id: `${product.name}-${index}`, // ID unik
                name: product.name,
                price: product.price, // ✅ harga dummy per kategori
                qty: 1,
                image: product.imageUrl,
              })
            }
          />
        ))}

        {/* ✅ Kalau tidak ada produk */}
        {currentProducts.length === 0 && (
          <p className="col-span-4 text-center text-gray-500 py-10">
            No products found
          </p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProductGridWithPagination;