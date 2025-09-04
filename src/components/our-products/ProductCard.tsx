import { FC } from 'react';

interface ProductCardProps {
  imageUrl: string;
  name: string;
  size: string;
  onAddToCart?: () => void;
}

const ProductCard: FC<ProductCardProps> = ({ imageUrl, name, size, onAddToCart }) => {
  return (
    <div className="text-center bg-white p-[15px] rounded-[10px] shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-[5px]">
      <img
        src={imageUrl}
        alt={name}
        className="w-full aspect-square object-cover rounded-[8px] mb-[12px]"
      />
      <p className="mt-[8px] font-bold text-[#555] text-[16px]">
        {name}<br />{size}
      </p>
      {/* cart Button */}
      <button
        onClick={onAddToCart}
        className="mt-3 px-4 py-2 bg-[#f5d7d6] text-black text-sm rounded-lg shadow hover:bg-[#e8b9b8] transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;