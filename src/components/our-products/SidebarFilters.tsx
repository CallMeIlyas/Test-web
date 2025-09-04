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

  return (
    <aside className="w-64 p-6 bg-white  rounded-xl">
      {/* Category */}
      <SplitBorder />
      <div className="mb-8">
        <h3 className="font-nataliecaydence text-xl font-light mb-4 ml-4">Category</h3>
        {["3D Frame", "2D Frame", "Additional", "Acrylic Stand", "Softcopy Design"].map(
          (item) => (
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
          )
        )}
      </div>

      {/* Shipped From */}
      <SplitBorder />
      <div className="mb-8">
        <h3 className="font-nataliecaydence text-xl font-light mb-4 ml-4">Shipped from</h3>
        {["Bogor", "Jakarta"].map((item) => (
          <div key={item} className="font-poppinsRegular flex items-center gap-2 mb-3 ml-6">
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
        <h3 className="font-nataliecaydence text-xl font-light mb-4 ml-4">Shipped to</h3>
        {["Worldwide"].map((dest) => (
          <div key={dest} className="font-poppinsRegular flex items-center gap-2 mb-3 ml-6">
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