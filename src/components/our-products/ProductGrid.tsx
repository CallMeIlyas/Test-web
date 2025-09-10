import {useState } from "react";
import type {fc} from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import SortControl from "./SortControls";
import ModalPesanan from "./ModalPesanan";
import type { FilterOptions } from "../../types/types";

interface Product {
  imageUrl: string;
  name: string;
  size: string;
  category: string;
  shippedFrom: string;
  shippedTo: string[];
  price: number;
}

const allImages = import.meta.glob(
  "/src/assets/bg-catalog/*/*.{jpg,JPG,jpeg,png}",
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
    imageUrl: allImages[path],
    name: fileName.replace(/\.[^/.]+$/, ""),
    size: `${50 + (index % 10)}x${70 + (index % 10)}cm`,
    category,
    shippedFrom: ["Bogor", "Jakarta"][index % 2],
    shippedTo: ["Worldwide"],
    price: categoryPrices[category] || 100000,
  };
});

interface ProductGridWithPaginationProps {
  filters: FilterOptions;
  searchQuery: string;
  onAddToCart: (item: {
    id: string;
    name: string;
    variation?: string;
    price: number;
    quantity: number;
    imageUrl: string;
    productType: "frame";
    attributes?: {
      faceCount?: number;
      backgroundType?: string;
    };
  }) => void;
}

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
  const [selectedProduct, setSelectedProduct] = useState<null | {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  }>(null);

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
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

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "size-asc") return a.size.localeCompare(b.size);
    if (sortOption === "size-desc") return b.size.localeCompare(a.size);
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = sortedProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

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
              setSelectedProduct({
                id: `${product.name}-${index}`,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
              })
            }
          />
        ))}

        {currentProducts.length === 0 && (
          <p className="col-span-4 text-center text-gray-500 py-10">
            No products found
          </p>
        )}
      </div>

      {/* Modal Pesanan */}
      {selectedProduct && (
        <ModalPesanan
          isOpen={!!selectedProduct}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={({ qty, faces, background }) => {
            const framePrice = selectedProduct.price;
            const additionalFacePrice = 52800;
            const backgroundCustomPrice = 52800;

            const attributes: CartItem["attributes"] = {};
            if (faces > 1) attributes.faceCount = faces;
            if (background === "Custom") attributes.backgroundType = "Custom";
            else attributes.backgroundType = background; // untuk background default/other

            onAddToCart({
              id: selectedProduct.id,
              name: selectedProduct.name,
              variation: "", // frame variant sudah dipisah atau kosongkan
              price: framePrice,
              quantity: qty,
              imageUrl: selectedProduct.imageUrl,
              productType: "frame",
              attributes, // faceCount & backgroundType
            });
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