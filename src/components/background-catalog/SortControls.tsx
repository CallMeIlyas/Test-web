import type { FC } from "react";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import {useTranslation} from "react-i18next";

interface SortControlsProps {
  sortOption?: string; // default "all"
  onSortChange: (option: string) => void;
}

const SortControls: FC<SortControlsProps> = ({ sortOption = "all", onSortChange }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const options = [
    { label: t("sortBg.all"), value: "all" },
    { label: t("sortBg.asc"), value: "name-asc" },
    { label: t("sortBg.disc"), value: "name-desc" },
  ];

  const handleSelect = (value: string) => {
    onSortChange(value);
    setOpen(false);
  };

  // const handleFrequentlyUsed = () => {
  //   onSortChange("all");
  // };

  const getCurrentLabel = () => {
    const current = options.find(opt => opt.value === sortOption);
    return current ? current.label : "All";
  };

  return (
    <div className="bg-[#f0f0f0] px-4 py-2 rounded-[var(--radius)] mb-2">
      <div className="flex font-poppinsBold items-center gap-7">
        <span className="text-base text-sm text-black">{t("sortBg.sortby")}</span>

          <div className="flex gap-7 font-poppinsBold">
            {/* Frequently Used */}
            <button
              onClick={() =>
                onSortChange(sortOption === "frequently-used" ? "all" : "frequently-used")
              }
              className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                sortOption === "frequently-used"
                  ? "bg-black text-white border-black shadow-sm"
                  : "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black"
              }`}
            >
              {t("sortBg.frequentlyused")}
            </button>
          
            {/* Rarely Used */}
            <button
              onClick={() =>
                onSortChange(sortOption === "rarely-used" ? "all" : "rarely-used")
              }
              className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                sortOption === "rarely-used"
                  ? "bg-black text-white border-black shadow-sm"
                  : "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black"
              }`}
            >
              {t("sortBg.rarelyused")}
            </button>
          </div>

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