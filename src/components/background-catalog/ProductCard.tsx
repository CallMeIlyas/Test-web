import { FC, useState } from 'react';

interface ProductCardProps {
  imageUrl: string;
  name: string;
  size: string;
}

const ProductCard: FC<ProductCardProps> = ({ imageUrl, name, size }) => {
  const [showName, setShowName] = useState(false);

  return (
    <div
      className="group text-center bg-white p-[15px] rounded-[10px] shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-[5px] cursor-pointer"
      onClick={() => setShowName((prev) => !prev)} // toggle kalau diklik
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-full aspect-square object-cover rounded-[8px] mb-[12px]"
      />
      {/* Muncul saat hover (desktop) klik (mobile) */}
      <p
        className={`mt-[8px] font-bold text-[#555] text-[16px] ${
          showName ? "block" : "hidden group-hover:block"
        }`}
      >
        {name}
      </p>
    </div>
  );
};

export default ProductCard;