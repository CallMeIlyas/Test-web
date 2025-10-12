import { useState } from "react";
import type { FC } from "react";
import { FaChevronDown } from "react-icons/fa";
import SplitBorder from "./SplitBorder";
import type { FilterOptions } from "../../types/types";

interface SidebarFiltersProps {
  onFilterChange: React.Dispatch<React.SetStateAction<FilterOptions>>;
}

const customCategories = {
  "3D Frame": [
    "10R",
    "12R",
    "12R by AI",
    "15X15CM",
    "20X20CM",
    "4R",
    "6R",
    "8R",
    "A0-80X110CM",
    "A1-55X80CM",
    "A2-40X55CM",
  ],
  "2D Frame": [

  ],
  Additional: [
    "Background Custom",
    "Tambahan Wajah Bold Shading",
    "Tambahan Wajah by AI",
    "Tambahan Wajah Karikatur",
  ],
  "Acrylic Stand": ["Acrylic Stand 2CM", "Acrylic Stand 3MM"],
  "Softcopy Design": [
    "With Background Catalog",
    "With Background Custom",
    "Without Background",
  ],
};

const SidebarFilters: FC<SidebarFiltersProps> = ({ onFilterChange }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [selectedMainCategories, setSelectedMainCategories] = useState<
    Set<string>
  >(new Set());
  const [selectedSubcategories, setSelectedSubcategories] = useState<
    Set<string>
  >(new Set());

  // Toggle buka/tutup kategori
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) newSet.delete(category);
      else newSet.add(category);
      return newSet;
    });
  };

  // Ketika kategori utama di-check
  const handleMainCategoryChange = (category: string, isChecked: boolean) => {
    setSelectedMainCategories((prev) => {
      const newSet = new Set(prev);
      if (isChecked) newSet.add(category);
      else newSet.delete(category);
      return newSet;
    });

    onFilterChange((prev) => {
      const newCategories = isChecked
        ? [...prev.categories, category]
        : prev.categories.filter((cat) => cat !== category);

      return { ...prev, categories: newCategories };
    });
  };

  // Ketika subkategori di-check
  const handleSubcategoryChange = (
    mainCategory: string,
    subcategory: string,
    isChecked: boolean
  ) => {
    setSelectedSubcategories((prev) => {
      const newSet = new Set(prev);
      const fullName = `${mainCategory}/${subcategory}`;
      if (isChecked) newSet.add(fullName);
      else newSet.delete(fullName);
      return newSet;
    });

    // Pastikan parent category tidak ikut aktif jika sub aktif
    setSelectedMainCategories((prevMain) => {
      const newMain = new Set(prevMain);
      if (isChecked) newMain.delete(mainCategory);
      return newMain;
    });

    onFilterChange((prev) => {
      const fullName = `${mainCategory}/${subcategory}`;
      const newCategories = isChecked
        ? [...prev.categories, fullName]
        : prev.categories.filter((cat) => cat !== fullName);

      return { ...prev, categories: newCategories };
    });
  };

  const handleCheckboxChange = (
    type: keyof FilterOptions,
    value: string,
    isChecked: boolean
  ) => {
    onFilterChange((prev) => {
      const newFilters = { ...prev };
      if (isChecked) newFilters[type] = [...newFilters[type], value];
      else
        newFilters[type] = newFilters[type].filter((item) => item !== value);
      return newFilters;
    });
  };

  return (
    <aside className="w-64 p-6 bg-white rounded-xl">
      {/* Category */}
      <SplitBorder />
      <div className="mb-8">
        <h3 className="font-nataliecaydence text-xl font-light mb-4 ml-4">
          Category
        </h3>
        {Object.entries(customCategories).map(([mainCategory, subcategories]) => {
          const is2D = mainCategory === "2D Frame";
          const isExpanded = expandedCategories.has(mainCategory) || is2D;
        
          return (
            <div key={mainCategory} className="mb-2">
              {/* Kategori utama */}
              <div className="font-poppinsRegular flex items-center gap-2 mb-2 ml-6">
                <input
                  type="checkbox"
                  id={mainCategory.toLowerCase().replace(/\s+/g, "-")}
                  className="w-4 h-4 border rounded"
                  checked={selectedMainCategories.has(mainCategory)}
                  onChange={(e) =>
                    handleMainCategoryChange(mainCategory, e.target.checked)
                  }
                />
                <label
                  htmlFor={mainCategory.toLowerCase().replace(/\s+/g, "-")}
                  className="text-sm cursor-pointer hover:text-primary flex-1"
                  onClick={() => !is2D && toggleCategory(mainCategory)} // jangan toggle untuk 2D
                >
                  {mainCategory}
                </label>
        
                {/* Hanya tampilkan tombol panah kalau bukan 2D */}
                {!is2D && (
                  <button
                    onClick={() => toggleCategory(mainCategory)}
                    className="text-gray-500 hover:text-primary"
                  >
                    <FaChevronDown
                      size={12}
                      className={`transition-transform duration-300 ${
                        expandedCategories.has(mainCategory) ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
        
              {/* Subkategori — 2D selalu tampil tanpa dropdown */}
              {isExpanded && (
                <div className="ml-10 space-y-2">
                  {subcategories.map((subcat) => {
                    const fullName = `${mainCategory}/${subcat}`;
                    return (
                      <div
                        key={subcat}
                        className="font-poppinsRegular flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id={fullName.toLowerCase().replace(/\s+/g, "-")}
                          className="w-3 h-3 border rounded"
                          checked={selectedSubcategories.has(fullName)}
                          onChange={(e) =>
                            handleSubcategoryChange(
                              mainCategory,
                              subcat,
                              e.target.checked
                            )
                          }
                        />
                        <label
                          htmlFor={fullName.toLowerCase().replace(/\s+/g, "-")}
                          className="text-xs cursor-pointer hover:text-primary"
                        >
                          {subcat}
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Shipped From */}
      <SplitBorder />
      <div className="mb-8">
        <h3 className="font-nataliecaydence text-xl font-light mb-4 ml-4">
          Shipped from
        </h3>
        {["Bogor", "Jakarta"].map((item) => (
          <div
            key={item}
            className="font-poppinsRegular flex items-center gap-2 mb-3 ml-6"
          >
            <input
              type="checkbox"
              id={item.toLowerCase()}
              className="w-4 h-4 border rounded"
              onChange={(e) =>
                handleCheckboxChange("shippedFrom", item, e.target.checked)
              }
            />
            <label
              htmlFor={item.toLowerCase()}
              className="text-sm cursor-pointer hover:text-primary"
            >
              {item}
            </label>
          </div>
        ))}
      </div>

      {/* Shipped To */}
      <SplitBorder />
      <div className="mb-8">
        <h3 className="font-nataliecaydence text-xl font-light mb-4 ml-4">
          Shipped to
        </h3>
        {["Worldwide"].map((dest) => (
          <div
            key={dest}
            className="font-poppinsRegular flex items-center gap-2 mb-3 ml-6"
          >
            <input
              type="checkbox"
              id={dest.toLowerCase()}
              className="w-4 h-4 border rounded"
              onChange={(e) =>
                handleCheckboxChange("shippedTo", dest, e.target.checked)
              }
            />
            <label
              htmlFor={dest.toLowerCase()}
              className="text-sm cursor-pointer hover:text-primary"
            >
              {dest}
            </label>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarFilters;