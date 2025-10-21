import type { FC } from "react";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface SortControlsProps {
    sortOption: string;
    onSortChange: (option: string) => void;
}

const SortControls: FC<SortControlsProps> = ({ sortOption, onSortChange }) => {
    const [open, setOpen] = useState(false);

    // Map display labels to actual sort values
    const options = [
        { label: "Price", value: "price" },
        { label: "Low to High", value: "price-asc" },
        { label: "High to Low", value: "price-desc" }
    ];

    const handleSelect = (value: string) => {
        onSortChange(value); // kirim value ke parent (ProductGrid)
        setOpen(false);
    };

    // Get current label based on sortOption value
    const getCurrentLabel = () => {
        const current = options.find(opt => opt.value === sortOption);
        return current ? current.label : "Price";
    };

    return (
        <div className="bg-[#f0f0f0] px-4 py-2 rounded-[var(--radius)] mb-2">
            <div className="flex p-0 m-0 mr-auto no-underline text-black font-poppinsBold whitespace-nowrap text-sm flex items-center gap-7">
                {/* Sort Label */}
                <span>Sort by</span>

                {/* Best Selling */}
                <button
                  onClick={() =>
                    onSortChange(sortOption === "best-selling" ? "" : "best-selling")
                  }
                  className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                    sortOption === "best-selling"
                      ? "bg-black text-white border-black shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black"
                  }`}
                >
                  Best Selling
                </button>
                
                {/* All Products */}
                <button
                  onClick={() => onSortChange("")}
                  className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                    sortOption === ""
                      ? "bg-black text-white border-black shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black"
                  }`}
                >
                  All Products
                </button>

                {/* Price Capsule */}
                <div className="relative">
                    <button
                        onClick={() => setOpen(!open)}
                        className="font-poppinsBold relative flex items-center justify-between px-4 py-2 w-40 text-sm text-black bg-white rounded-full"
                    >
                        <span>{getCurrentLabel()}</span>
                        <FaChevronDown size={14} />
                    </button>

                    {open && (
                        <div className="absolute mt-1 w-40 bg-white text-[var(--muted-foreground)] rounded-md shadow-lg overflow-hidden border border-[var(--border)] z-50">
                            {options.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`block w-full px-4 py-2 text-left hover:bg-[var(--secondary)] ${
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