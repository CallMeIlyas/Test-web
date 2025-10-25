import type { FC } from "react";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface SortControlsProps {
  sortOption: string;
  onSortChange: (option: string) => void;
}

const SortControls: FC<SortControlsProps> = ({ sortOption, onSortChange }) => {
  const [open, setOpen] = useState(false);

  // 🔹 Daftar opsi sorting harga
  const options = [
    { label: "Price", value: "price" },
    { label: "Low to High", value: "price-asc" },
    { label: "High to Low", value: "price-desc" },
  ];

  // 🔹 Ganti opsi sort & tutup dropdown
  const handleSelect = (value: string) => {
    onSortChange(value);
    setOpen(false);
  };

  // 🔹 Ambil label aktif
  const getCurrentLabel = () => {
    const current = options.find((opt) => opt.value === sortOption);
    return current ? current.label : "Price";
  };

  return (
    <div className="bg-[#f0f0f0] px-4 py-2 rounded-[var(--radius)] mb-2">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 text-sm font-poppinsBold text-black">
        {/* Label */}
        <span className="whitespace-nowrap">Sort by</span>

        {/* 🔹 Tombol Best Selling */}
        <button
          onClick={() =>
            onSortChange(sortOption === "best-selling" ? "" : "best-selling")
          }
          className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
            sortOption === "best-selling"
              ? "bg-black text-white border-black shadow-sm"
              : "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black"
          }`}
        >
          Best Selling
        </button>

        {/* 🔹 Tombol All Products */}
        <button
          onClick={() => onSortChange("")}
          className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
            sortOption === ""
              ? "bg-black text-white border-black shadow-sm"
              : "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black"
          }`}
        >
          All Products
        </button>

        {/* 🔹 Dropdown Sort by Price */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="font-poppinsBold flex items-center justify-between px-4 py-2 w-40 text-sm text-black bg-white rounded-full border border-gray-300 hover:border-black transition"
          >
            <span>{getCurrentLabel()}</span>
            <FaChevronDown
              size={14}
              className={`ml-2 transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {open && (
            <div className="absolute mt-1 w-40 bg-white text-[var(--muted-foreground)] rounded-md shadow-lg border border-[var(--border)] overflow-hidden z-50">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`block w-full px-4 py-2 text-left hover:bg-[var(--secondary)] transition ${
                    sortOption === option.value
                      ? "bg-[var(--secondary)] font-bold"
                      : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortControls;