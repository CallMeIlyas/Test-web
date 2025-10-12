import type { FC } from "react";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface SortControlsProps {
  sortOption?: string; // default "all"
  onSortChange: (option: string) => void;
}

const SortControls: FC<SortControlsProps> = ({ sortOption = "all", onSortChange }) => {
  const [open, setOpen] = useState(false);

  const options = [
    { label: "All", value: "all" },
    { label: "Name A-Z", value: "name-asc" },
    { label: "Name Z-A", value: "name-desc" },
  ];

  const handleSelect = (value: string) => {
    onSortChange(value);
    setOpen(false);
  };

  const handleFrequentlyUsed = () => {
    onSortChange("all");
  };

  const getCurrentLabel = () => {
    const current = options.find(opt => opt.value === sortOption);
    return current ? current.label : "All";
  };

  return (
    <div className="bg-[#f0f0f0] px-4 py-2 rounded-[var(--radius)] mb-2">
      <div className="flex items-center gap-10">
        <span className="font-poppinsBold text-base font-bold text-black">Sort by</span>

        <button 
          onClick={handleFrequentlyUsed}
          className="font-poppinsBold text-base font-bold text-black hover:text-gray-600 transition-colors"
        >
          Frequently Used
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="font-poppinsBold relative flex items-center justify-between px-4 py-2 w-40 text-base font-bold text-black bg-white rounded-full hover:bg-gray-50 transition-colors"
          >
            <span>{getCurrentLabel()}</span>
            <FaChevronDown 
              size={14} 
              className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {open && (
            <div className="absolute mt-1 w-40 bg-white text-[var(--muted-foreground)] rounded-md shadow-lg overflow-hidden border border-[var(--border)] z-50">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`block w-full px-4 py-2 text-left hover:bg-[var(--secondary)] transition-colors ${
                    sortOption === option.value ? "bg-[var(--secondary)] font-bold" : ""
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