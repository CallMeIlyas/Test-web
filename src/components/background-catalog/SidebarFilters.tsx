import { FC } from "react";
import SplitBorder from "./SplitBorder";
import type { FilterOptions } from "../../types/types";

interface SidebarFiltersProps {
  onFilterChange: React.Dispatch<React.SetStateAction<FilterOptions>>;
}

const SidebarFilters: FC<SidebarFiltersProps> = ({ onFilterChange }) => {
  const handleCheckboxChange = (
    type: keyof FilterOptions,
    value: string,
    isChecked: boolean
  ) => {
    onFilterChange((prev) => {
      const newFilters = { ...prev };

      if (isChecked) {
        newFilters[type] = [...newFilters[type], value];
      } else {
        newFilters[type] = newFilters[type].filter((item) => item !== value);
      }

      return newFilters;
    });
  };

  const categories = [
    "Company/Office/Brand",
    "Goverment/Police",
    "Oil/Construction/Ship",
    "Hospital/Medical",
    "Graduation/School/Children",
    "Couple/Wedding/Birthday",
    "Travel/Place/Country/Culture",
    "Indoor/Cafe/Kitchen",
    "Sport",
    "Others",
    "Pop Up Photos",
    "Acrylic Stand"
  ];

  return (
    <aside className="w-64 p-6 bg-white rounded-xl">
      {/* Category */}
      <SplitBorder />
      <div className="mb-8">
        <h3 className="font-nataliecaydence text-xl font-light mb-4 ml-4">Category</h3>
        {categories.map((item) => (
          <div key={item} className="font-poppinsRegular flex items-center gap-2 mb-3 ml-6">
            <input
              type="checkbox"
              id={item.toLowerCase().replace(/\s+/g, "-")}
              className="w-4 h-4 border rounded"
              onChange={(e) =>
                handleCheckboxChange("categories", item, e.target.checked)
              }
            />
            <label
              htmlFor={item.toLowerCase().replace(/\s+/g, "-")}
              className="text-sm cursor-pointer hover:text-primary"
            >
              {item}
            </label>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarFilters;