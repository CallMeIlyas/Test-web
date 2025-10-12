import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../data/productDataLoader";

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log("🧠 CLICKED PRODUCT:", product);

    navigate(`/product/${product.id}`, {
      state: {
        ...product, // kirim seluruh data dari loader
        specialVariations: product.specialVariations || [],
        details: product.details || {},
      },
    });
  };

  return (
    <div
      className="cursor-pointer text-center bg-white p-[15px] rounded-[10px] shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-[5px]"
      onClick={handleCardClick}
    >
      <img
        loading="lazy"
        src={product.imageUrl}
        alt={product.name}
        className="w-full aspect-square object-cover rounded-[8px] mb-[12px]"
      />

      <div className="mt-[8px] font-bold text-[#555] text-[16px] leading-snug">
        <p>{product.name}</p>
        <p className="text-sm text-gray-500">{product.size}</p>
      </div>
    </div>
  );
};

export default ProductCard;