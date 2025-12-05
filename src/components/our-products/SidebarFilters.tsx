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
  const [selectedShippedFrom, setSelectedShippedFrom] = useState<Set<string>>(new Set());
  const [selectedShippedTo, setSelectedShippedTo] = useState<Set<string>>(new Set());

  // Map kategori UI → nama folder backend
  const categoryFolderMap: Record<string, string> = {
    [t("side.categories.3d")]: "3D",
    [t("side.categories.2d")]: "2D",
    [t("side.categories.additional")]: "ADDITIONAL",
    [t("side.categories.acrylic")]: "ACRYLIC STAND",
    [t("side.categories.softcopy")]: "SOFTCOPY DESIGN",
  };

  // Map ukuran 3D UI → nama folder backend (untuk 3D)
  const threeDSizeMap: Record<string, string> = {
    "12R": "12R",
    "10R": "10R", 
    "8R": "8R",
    "20x20cm": "20X20CM",
    "6R": "6R",
    "15x15cm": "15X15CM",
    "4R": "4R",
    "A2": "A2-40X55CM",
    "A1": "A1-55X80CM",
    "A0": "A0-80X110CM"
  };

  // Map subkategori UI → nama folder backend BERDASARKAN STRUKTUR FOLDER
  const subcategoryFolderMap: Record<string, Record<string, string>> = {
    // ADDITIONAL subcategories
    [t("side.categories.additional")]: {
      [t("side.subcategories.backgroundCustom") || "Background Custom"]: "BACKGROUND CUSTOM",
      [t("side.subcategories.additionalFaces") || "Additional Faces"]: "BIAYA TAMBAHAN WAJAH KARIKATUR",
      // Jika ada lebih banyak jenis Additional Faces, bisa ditambahkan:
      // "Additional Face (by AI)": "BIAYA TAMBAHAN WAJAH by AI",
      // "Additional Face (Caricature)": "BIAYA TAMBAHAN WAJAH KARIKATUR",
    },
    
    // ACRYLIC STAND subcategories
    [t("side.categories.acrylic")]: {
      [t("side.subcategories.2cm") || "2CM"]: "2CM",
      [t("side.subcategories.3mm") || "3MM"]: "3MM",
    },
    
    // SOFTCOPY DESIGN subcategories
    [t("side.categories.softcopy")]: {
      [t("side.subcategories.backgroundCatalog") || "With Background Catalog"]: "WITH BACKGROUND CATALOG",
      [t("side.subcategories.backgroundCustomSoftcopy") || "With Background Custom"]: "WITH BACKGROUND CUSTOM", 
      [t("side.subcategories.withoutBackground") || "Without Background"]: "WITHOUT BACKGROUND"
    }
  };

  // Struktur kategori sesuai gambar
  const customCategories = {
    [t("side.categories.3d")]: [
      "12R",
      "10R", 
      "8R",
      "20x20cm",
      "6R",
      "15x15cm",
      "4R",
      "A2",
      "A1",
      "A0"
    ],
    [t("side.categories.2d")]: [], // 2D Frame tidak ada subkategori di UI
    [t("side.categories.additional")]: [
      t("side.subcategories.backgroundCustom") || "Background Custom",
      t("side.subcategories.additionalFaces") || "Additional Faces"
    ],
    [t("side.categories.acrylic")]: [
      t("side.subcategories.2cm") || "2CM",
      t("side.subcategories.3mm") || "3MM"
    ],
    [t("side.categories.softcopy")]: [
      t("side.subcategories.backgroundCatalog") || "With Background Catalog",
      t("side.subcategories.backgroundCustomSoftcopy") || "With Background Custom",
      t("side.subcategories.withoutBackground") || "Without Background"
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

  // Handle kategori utama (checkbox di kategori utama)
  const handleMainCategoryChange = (category: string, isChecked: boolean) => {
    const folderName = categoryFolderMap[category] || category;
  
    setSelectedMainCategories((prev) => {
      const newSet = new Set(prev);
      isChecked ? newSet.add(category) : newSet.delete(category);
      return newSet;
    });
  
    onFilterChange((prev) => {
      const newCategories = isChecked
        ? [...prev.categories, folderName]
        : prev.categories.filter((cat) => cat !== folderName);
      return { ...prev, categories: newCategories };
    });
  };

  // Handle subkategori
  const handleSubcategoryChange = (
    mainCategory: string,
    subcategory: string,
    isChecked: boolean
  ) => {
    const mainFolderName = categoryFolderMap[mainCategory] || mainCategory;
    
    // Tentukan nama folder untuk subkategori
    let subFolderName: string;
    
    if (mainFolderName === "3D") {
      // Untuk 3D, gunakan mapping ukuran
      subFolderName = threeDSizeMap[subcategory] || subcategory;
    } else if (mainFolderName === "2D") {
      // Untuk 2D, saat ini tidak ada subkategori di UI
      subFolderName = subcategory;
    } else {
      // Untuk kategori lain, gunakan mapping berdasarkan kategori utama
      const categoryMap = subcategoryFolderMap[mainCategory];
      if (categoryMap) {
        subFolderName = categoryMap[subcategory] || subcategory;
      } else {
        subFolderName = subcategory;
      }
    }
    
    const fullKey = `${mainFolderName}/${subFolderName}`;

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

  // Handle Shipped From
  const handleShippedFromChange = (location: string, isChecked: boolean) => {
    setSelectedShippedFrom((prev) => {
      const newSet = new Set(prev);
      isChecked ? newSet.add(location) : newSet.delete(location);
      return newSet;
    });

    onFilterChange((prev) => {
      const newShippedFrom = isChecked
        ? [...prev.shippedFrom, location]
        : prev.shippedFrom.filter((loc) => loc !== location);
      return { ...prev, shippedFrom: newShippedFrom };
    });
  };

  // Handle Shipped To
  const handleShippedToChange = (destination: string, isChecked: boolean) => {
    setSelectedShippedTo((prev) => {
      const newSet = new Set(prev);
      isChecked ? newSet.add(destination) : newSet.delete(destination);
      return newSet;
    });

    onFilterChange((prev) => {
      const newShippedTo = isChecked
        ? [...prev.shippedTo, destination]
        : prev.shippedTo.filter((dest) => dest !== destination);
      return { ...prev, shippedTo: newShippedTo };
    });
  };

  // Layout Desktop
  const DesktopLayout = () => (
    <aside className="hidden md:block w-64 p-6 bg-white rounded-xl">
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
                  id={`desktop-${mainCategory.toLowerCase().replace(/\s+/g, "-")}`}
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
                {/* Label dengan event click langsung */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMainCategoryChange(mainCategory, !selectedMainCategories.has(mainCategory));
                  }}
                  className="text-sm cursor-pointer hover:text-primary flex-1"
                >
                  {mainCategory}
                </div>

                {!is2D && subcategories.length > 0 && (
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
              {isExpanded && subcategories.length > 0 && (
                <div className="ml-10 space-y-2">
                  {subcategories.map((subcat) => {
                    const mainFolderName = categoryFolderMap[mainCategory] || mainCategory;
                    
                    // Tentukan nama folder untuk subkategori
                    let subFolderName: string;
                    
                    if (mainFolderName === "3D") {
                      subFolderName = threeDSizeMap[subcat] || subcat;
                    } else {
                      const categoryMap = subcategoryFolderMap[mainCategory];
                      if (categoryMap) {
                        subFolderName = categoryMap[subcat] || subcat;
                      } else {
                        subFolderName = subcat;
                      }
                    }
                    
                    const fullKey = `${mainFolderName}/${subFolderName}`;
                    const isChecked = selectedSubcategories.has(fullKey);

                    return (
                      <div key={fullKey} className="font-poppinsRegular flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`desktop-${fullKey.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-")}`}
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
                        {/* Label subkategori dengan event click langsung */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubcategoryChange(mainCategory, subcat, !isChecked);
                          }}
                          className="text-sm cursor-pointer hover:text-primary"
                        >
                          {subcat}
                        </div>
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
              id={`desktop-from-${item.toLowerCase()}`}
              checked={selectedShippedFrom.has(item)}
              onChange={(e) => handleShippedFromChange(item, e.target.checked)}
              className="appearance-none w-4 h-4 border border-black rounded-sm
                         cursor-pointer transition-all duration-200 relative
                         checked:bg-white checked:border-black
                         after:content-[''] after:absolute after:hidden checked:after:block
                         after:w-[6px] after:h-[10px]
                         after:border-r-[2px] after:border-b-[2px]
                         after:border-black after:top-[0px] after:left-[5px]
                         after:rotate-45"
            />
            {/* Label Shipped From dengan event click langsung */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleShippedFromChange(item, !selectedShippedFrom.has(item));
              }}
              className="text-sm cursor-pointer hover:text-primary"
            >
              {item}
            </div>
          </div>
        ))}
      </div>

      {/* Shipped To */}
      <SplitBorder />
      <div className="mb-8">
        <h3 className="font-nataliecaydence text-xl font-light mb-4 ml-4">
          {t("side.shippedTo")}
        </h3>
        {["Worldwide"].map((dest) => (
          <div
            key={dest}
            className="font-poppinsRegular flex items-center gap-2 mb-3 ml-6"
          >
            <input
              type="checkbox"
              id={`desktop-to-${dest.toLowerCase()}`}
              checked={selectedShippedTo.has(dest)}
              onChange={(e) => handleShippedToChange(dest, e.target.checked)}
              className="appearance-none w-4 h-4 border border-black rounded-sm
                         cursor-pointer transition-all duration-200 relative
                         checked:bg-white checked:border-black
                         after:content-[''] after:absolute after:hidden checked:after:block
                         after:w-[6px] after:h-[10px]
                         after:border-r-[2px] after:border-b-[2px]
                         after:border-black after:top-[0px] after:left-[5px]
                         after:rotate-45"
            />
            {/* Label Shipped To dengan event click langsung */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleShippedToChange(dest, !selectedShippedTo.has(dest));
              }}
              className="text-sm cursor-pointer hover:text-primary"
            >
              {t(`side.to.${dest.toLowerCase()}`)}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );

  // Layout Mobile (tidak berubah)
  const MobileLayout = () => (
    <aside className="block md:hidden w-full p-4 bg-white rounded-xl">
      {/* Category - Mobile */}
      <SplitBorder />
      <div className="mb-6">
        <h3 className="font-nataliecaydence text-lg font-light mb-4 ml-2">
          {t("side.category")}
        </h3>

        {Object.entries(customCategories).map(([mainCategory, subcategories]) => {
          return (
            <div key={mainCategory} className="mb-2">
              {/* Kategori utama - Mobile: tanpa panah dan subkategori */}
              <div className="font-poppinsRegular flex items-center gap-2 mb-2 ml-4">
                <input
                  type="checkbox"
                  id={`mobile-${mainCategory.toLowerCase().replace(/\s+/g, "-")}`}
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
                  htmlFor={`mobile-${mainCategory.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm cursor-pointer hover:text-primary flex-1"
                >
                  {mainCategory}
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shipped To - Mobile */}
      <SplitBorder />
      <div className="mb-6">
        <h3 className="font-nataliecaydence text-lg font-light mb-4 ml-2">
          {t("side.shippedTo")}
        </h3>
        {["Worldwide"].map((dest) => (
          <div
            key={dest}
            className="font-poppinsRegular flex items-center gap-2 mb-3 ml-4"
          >
            <input
              type="checkbox"
              id={`mobile-to-${dest.toLowerCase()}`}
              checked={selectedShippedTo.has(dest)}
              onChange={(e) => handleShippedToChange(dest, e.target.checked)}
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
              htmlFor={`mobile-to-${dest.toLowerCase()}`}
              className="text-sm cursor-pointer hover:text-primary"
            >
              {t(`side.to.${dest.toLowerCase()}`)}
            </label>
          </div>
        ))}
      </div>
    </aside>
  );

  return (
    <>
      <DesktopLayout />
      <MobileLayout />
    </>
  );
};

export default SidebarFilters;