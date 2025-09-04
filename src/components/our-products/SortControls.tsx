import { FC, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const SortControls: FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Price"); // state pilihan

  const options = ["Price", "Low to High", "High to Low"];

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false); // tutup dropdown setelah pilih
  };

  return (
    <div className="bg-[#f0f0f0] px-4 py-2 rounded-[var(--radius)] mb-2">
      <div className="flex items-center gap-10">
        {/* Sort Label */}
        <span className="font-poppinsBold text-base font-bold text-black">
          Sort by
        </span>

        {/* Best Selling */}
        <button className="font-poppinsBold text-base font-bold text-black">
          Best Selling
        </button>

        {/* Price Capsule */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="font-poppinsBold relative flex items-center justify-between px-4 py-2 w-40 text-base font-bold text-black bg-white rounded-full"
          >
            <span>{selected}</span>
            <FaChevronDown size={14} />
          </button>

          {open && (
            <div className="absolute mt-1 w-40 bg-white text-[var(--muted-foreground)] rounded-md shadow-lg overflow-hidden border border-[var(--border)] z-50">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`block w-full px-4 py-2 text-left hover:bg-[var(--secondary)] ${
                    selected === option ? "bg-[var(--secondary)] font-bold" : ""
                  }`}
                >
                  {option}
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