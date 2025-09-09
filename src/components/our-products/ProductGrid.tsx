import { FC, useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import SortControl from "./SortControls";
import ModalPesanan from "./ModalPesanan";
import type { FilterOptions } from "../../types/types";
import { CartItem } from "../../context/CartContext";

interface Product {
  id: string;
  name: string;
  size: string;
  imageUrl: string;
  category: string;
  shippedFrom: string;
  shippedTo: string[];
  price: number;
  variationOptions?: string[];
}

const allImages = import.meta.glob(
  "./../../assets/bg-catalog/*/*.{jpg,JPG,jpeg,png}",
  { eager: true, import: "default" }
) as Record<string, string>;

const categoryPrices: Record<string, number> = {
  "3D Frame": 250000,
  "2D Frame": 200000,
  Additional: 75000,
  "Acrylic Plaque": 300000,
  "Softcopy Design": 50000,
};

const allProducts: Product[] = Object.keys(allImages).map((path, index) => {
  const fileName = path.split("/").pop() || `Produk ${index + 1}`;
  const category = ["3D Frame", "2D Frame", "Additional", "Acrylic Plaque", "Softcopy Design"][index % 5];

  return {
    id: `${fileName}-${index}`,
    imageUrl: allImages[path],
    name: fileName.replace(/\.[^/.]+$/, ""),
    size: `${50 + (index % 10)}x${70 + (index % 10)}cm`,
    category,
    shippedFrom: ["Bogor", "Jakarta"][index % 2],
    shippedTo: ["Worldwide"],
    price: categoryPrices[category] || 100000,
    variationOptions: ["Default Frame", "Premium Frame"], // contoh variant
  };
});

interface ProductGridWithPaginationProps {
  filters: FilterOptions;
  searchQuery: string;
  onAddToCart: (item: Omit<CartItem, "cartId">) => void;
}

const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

const ProductGridWithPagination: FC<ProductGridWithPaginationProps> = ({
  filters,
  searchQuery,
  onAddToCart,
}) => {
  const PRODUCTS_PER_PAGE = 16;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("name-asc");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (filters.categories.length && !filters.categories.includes(product.category)) return false;
      if (filters.shippedFrom.length && !filters.shippedFrom.includes(product.shippedFrom)) return false;
      if (filters.shippedTo.length && !product.shippedTo.some(dest => filters.shippedTo.includes(dest))) return false;

      if (searchQuery.trim() !== "") {
        const query = normalize(searchQuery);
        const nameNorm = normalize(product.name);
        const urlNorm = normalize(product.imageUrl);
        if (!nameNorm.includes(query) && !urlNorm.includes(query)) return false;
      }

      return true;
    });
  }, [filters, searchQuery]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "size-asc":
          return a.size.localeCompare(b.size);
        case "size-desc":
          return b.size.localeCompare(a.size);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="pb-10 bg-white">
      {/* SortControl */}
      <div className="flex justify-start w-full px-5 max-w-7xl mx-auto mb-5">
        <SortControl sortOption={sortOption} onSortChange={setSortOption} />
      </div>

      {/* Produk Grid */}
      <div className="grid grid-cols-4 gap-5 px-10 max-w-[1230px] mx-auto">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              imageUrl={product.imageUrl}
              name={product.name}
              size={product.size}
              onAddToCart={() => setSelectedProduct(product)}
            />
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500 py-10">No products found</p>
        )}
      </div>

      {/* Modal Pesanan */}
      {selectedProduct && (
        <ModalPesanan
          isOpen={!!selectedProduct}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={({ qty, faces, background }) => {
            onAddToCart({
              id: selectedProduct.id,
              name: selectedProduct.name,
              variation: selectedProduct.variationOptions?.[0] || "Default Frame",
              variationOptions: selectedProduct.variationOptions || ["Default Frame"],
              price: selectedProduct.price,
              quantity: qty,
              imageUrl: selectedProduct.imageUrl,
              productType: "frame",
              attributes: {
                faceCount: faces > 1 ? faces : undefined,
                backgroundType: background,
              },
            });
            setSelectedProduct(null);
          }}
        />
      )}

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