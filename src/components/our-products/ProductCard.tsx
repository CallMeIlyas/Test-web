import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../data/productDataLoader";
import { FaStar } from "react-icons/fa";

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const bestSellingProducts = ["12R", "15cm", "10R", "Acrylic Stand 2cm"];
  const isBestSelling =
  product.displayName &&
  bestSellingProducts.some(
    (item) => item.toLowerCase().trim() === product.displayName.toLowerCase().trim()
  );

  const handleCardClick = () => {
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
      className="cursor-pointer text-center bg-white p-[15px] rounded-[10px] shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-[5px] w-[150px] h-[240px] sm:w-[180px] sm:h-[260px] md:w-[200px] md:h-[280px] flex flex-col justify-between"
      onClick={handleCardClick}
    >
      {/* WRAPPER GAMBAR */}
      <div className="relative mb-[12px] rounded-[8px] overflow-hidden">
        <img
          loading="lazy"
          src={product.imageUrl}
          alt={product.name}
          className="w-full aspect-square object-cover"
        />

        {/* BEST SELLING BADGE */}
        {isBestSelling && (
          <div className="absolute bottom-0 left-0 bg-black text-white text-[11px] font-semibold px-[10px] py-[4px] rounded-r-full flex items-center gap-[6px] shadow-md font-poppinsItalic">
            <FaStar className="text-white text-[10px]" />
            <span>Best Selling</span>
          </div>
        )}
      </div>

      {/* NAMA & HARGA */}
      <div className="mt-[8px] leading-snug">
        <p className="font-bold text-[#444] text-[15px]">
          {product.displayName || product.name}
        </p>
        <p className="text-[15px] font-semibold text-red-600">
          {product.price
            ? `Rp ${product.price.toLocaleString("id-ID")}`
            : "Harga tidak tersedia"}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;