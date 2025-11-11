import { useState } from "react";
import type { FC } from "react";
import { FaChevronDown } from "react-icons/fa";
import SplitBorder from "./SplitBorder";
import type { FilterOptions } from "../../types/types";
import { useTranslation } from "react-i18next";

interface SidebarFiltersProps {
  onFilterChange: React.Dispatch<React.SetStateAction<FilterOptions>>;
}

const SidebarFilters: FC<SidebarFiltersProps> = ({ onFilterChange }) => {
  const { t } = useTranslation();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedMainCategories, setSelectedMainCategories] = useState<Set<string>>(new Set());
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set());

  // Map kategori terjemahan → nama asli
  const translationMap: Record<string, string> = {
    [t("side.categories.3d")]: "3D Frame",
    [t("side.categories.2d")]: "2D Frame",
    [t("side.categories.additional")]: "Additional",
    [t("side.categories.acrylic")]: "Acrylic Stand",
    [t("side.categories.softcopy")]: "Softcopy Design",
  };

  // Map subkategori terjemahan → nama asli
  const subcategoryTranslationMap: Record<string, string> = {
    [t("side.subcategories.backgroundCustom")]: "Background Custom",
    [t("side.subcategories.boldShading")]: "Additional Face (Bold Shading)",
    [t("side.subcategories.byAI")]: "Additional Face (by AI)",
    [t("side.subcategories.caricature")]: "Additional Face (Caricature)",
    [t("side.subcategories.acrylic2cm")]: "Acrylic Stand 2CM",
    [t("side.subcategories.acrylic3mm")]: "Acrylic Stand 3MM",
    [t("side.subcategories.withBackgroundCatalog")]: "With Background Catalog",
    [t("side.subcategories.withBackgroundCustom")]: "With Background Custom",
    [t("side.subcategories.withoutBackground")]: "Without Background",
  };

  // Map subkategori → nama folder backend
  const folderMap: Record<string, string> = {
    "Background Custom": "BACKGROUND CUSTOM",
    "Additional Face (Bold Shading)": "BIAYA TAMBAHAN WAJAH BOLD SHADING",
    "Additional Face (by AI)": "BIAYA TAMBAHAN WAJAH by AI",
    "Additional Face (Caricature)": "BIAYA TAMBAHAN WAJAH KARIKATUR",
  };
  
  const customCategories = {
    [t("side.categories.3d")]: [
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
      "A2-40X55CM"
    ],
    [t("side.categories.2d")]: [],
    [t("side.categories.additional")]: [
      t("side.subcategories.backgroundCustom"),
      t("side.subcategories.boldShading"),
      t("side.subcategories.byAI"),
      t("side.subcategories.caricature")
    ],
    [t("side.categories.acrylic")]: [
      t("side.subcategories.acrylic2cm"),
      t("side.subcategories.acrylic3mm")
    ],
    [t("side.categories.softcopy")]: [
      t("side.subcategories.withBackgroundCatalog"),
      t("side.subcategories.withBackgroundCustom"),
      t("side.subcategories.withoutBackground")
    ]
  };

  // Toggle buka/tutup kategori
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      newSet.has(category) ? newSet.delete(category) : newSet.add(category);
      return newSet;
    });
  };

  // Handle kategori utama
  const handleMainCategoryChange = (category: string, isChecked: boolean) => {
    const originalCategory = translationMap[category] || category;
  
    setSelectedMainCategories((prev) => {
      const newSet = new Set(prev);
      isChecked ? newSet.add(category) : newSet.delete(category);
      return newSet;
    });
  
    onFilterChange((prev) => {
      const newCategories = isChecked
        ? [...prev.categories, originalCategory]
        : prev.categories.filter((cat) => cat !== originalCategory);
      return { ...prev, categories: newCategories };
    });
  };

  // Handle subkategori
  const handleSubcategoryChange = (
    mainCategory: string,
    subcategory: string,
    isChecked: boolean
  ) => {
    const canonicalMain = translationMap[mainCategory] || mainCategory;
    const canonicalSub = subcategoryTranslationMap[subcategory] || subcategory;
    
    // Untuk kategori "Additional", gunakan folder mapping
    const finalSub = canonicalMain === "Additional" 
      ? (folderMap[canonicalSub] || canonicalSub)
      : canonicalSub;
    
    const fullKey = `${canonicalMain}/${finalSub}`;

    setSelectedSubcategories((prev) => {
      const newSet = new Set(prev);
      isChecked ? newSet.add(fullKey) : newSet.delete(fullKey);
      return newSet;
    });

    onFilterChange((prev) => {
      const newCategories = isChecked
        ? [...prev.categories, fullKey]
        : prev.categories.filter((cat) => cat !== fullKey);
      return { ...prev, categories: newCategories };
    });
  };

  // Checkbox filter umum
  const handleCheckboxChange = (
    type: keyof FilterOptions,
    value: string,
    isChecked: boolean
  ) => {
    onFilterChange((prev) => {
      const newFilters = { ...prev };
      if (isChecked) newFilters[type] = [...newFilters[type], value];
      else newFilters[type] = newFilters[type].filter((item) => item !== value);
      return newFilters;
    });
  };

  return (
    <aside className="w-64 p-6 bg-white rounded-xl">
      {/* Category */}
      <SplitBorder />
      <div className="mb-8">
        <h3 className="font-nataliecaydence text-xl font-light mb-4 ml-4">
          {t("side.category")}
        </h3>

        {Object.entries(customCategories).map(([mainCategory, subcategories]) => {
          const is2D = mainCategory === t("side.categories.2d");
          const isExpanded = expandedCategories.has(mainCategory) || is2D;

          return (
            <div key={mainCategory} className="mb-2">
              {/* Kategori utama */}
              <div className="font-poppinsRegular flex items-center gap-2 mb-2 ml-6">
                <input
                  type="checkbox"
                  id={mainCategory.toLowerCase().replace(/\s+/g, "-")}
                  checked={selectedMainCategories.has(mainCategory)}
                  onChange={(e) =>
                    handleMainCategoryChange(mainCategory, e.target.checked)
                  }
                  className="appearance-none w-4 h-4 border border-black rounded-sm
                             cursor-pointer transition-all duration-200 relative
                             checked:bg-white checked:border-black
                             after:content-[''] after:absolute after:hidden checked:after:block
                             after:w-[6px] after:h-[10px]
                             after:border-r-[2px] after:border-b-[2px]
                             after:border-black after:top-[0px] after:left-[5px]
                             after:rotate-45"
                />
                <label
                  htmlFor={mainCategory.toLowerCase().replace(/\s+/g, "-")}
                  className="text-sm cursor-pointer hover:text-primary flex-1"
                  onClick={() => !is2D && toggleCategory(mainCategory)}
                >
                  {mainCategory}
                </label>

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

              {/* Subkategori */}
              {isExpanded && (
                <div className="ml-10 space-y-2">
                  {subcategories.map((subcat) => {
                    const canonicalMain = translationMap[mainCategory] || mainCategory;
                    const canonicalSub = subcategoryTranslationMap[subcat] || subcat;
                    
                    // Untuk kategori "Additional", gunakan folder mapping
                    const finalSub = canonicalMain === "Additional" 
                      ? (folderMap[canonicalSub] || canonicalSub)
                      : canonicalSub;
                    
                    const fullKey = `${canonicalMain}/${finalSub}`;
                    const isChecked = selectedSubcategories.has(fullKey);

                    return (
                      <div key={fullKey} className="font-poppinsRegular flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={fullKey.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-")}
                          checked={isChecked}
                          onChange={(e) =>
                            handleSubcategoryChange(mainCategory, subcat, e.target.checked)
                          }
                          className="appearance-none relative w-4 h-4 min-w-[16px] min-h-[16px] aspect-square 
                                     border border-black rounded-[3px] cursor-pointer flex-shrink-0
                                     checked:bg-white checked:border-black transition-all duration-200
                                     after:content-[''] after:absolute after:hidden checked:after:block
                                     after:w-[5px] after:h-[9px]
                                     after:border-r-[2px] after:border-b-[2px]
                                     after:border-black after:top-[1px] after:left-[4px] after:rotate-45"
                        />
                        <label
                          htmlFor={fullKey.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-")}
                          className="text-sm cursor-pointer hover:text-primary"
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
          {t("side.shippedFrom")}
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
          {t("side.shippedTo")}
        </h3>
        {["worldwide"].map((dest) => (
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
              {t(`side.to.${dest.toLowerCase()}`)}
            </label>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarFilters;