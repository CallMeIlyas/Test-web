import { useState } from "react";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import logoAmora from "../../assets/logo/logo-amora-footer2.png";
import cartIcon from "../../assets/Icons/CART.png";
import cartPopup from "../../assets/Icons/cart-popup.png";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number; // ubah dari qty -> quantity
  imageUrl: string;
}

interface HeaderProps {
  cartCount: number;
  cartItems: CartItem[];
  onSearch: (query: string) => void;
}

const Header = ({ cartCount, cartItems, onSearch }: HeaderProps) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    onSearch(searchText);
  };

  return (
    <header>
      {/* Top bar */}
      <div className="bg-[#dcbec1] py-5 flex justify-center items-center">
        <img
          src={logoAmora}
          alt="Little Amora Logo"
          className="h-24"
        />
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-3 bg-white gap-2">
        {/* Left menu */}
        <ul className="flex gap-7 p-0 m-0 mr-auto -translate-x-2">
          <li><a href="/" className="font-poppinsBold text-[15px] font-bold">Home</a></li>
          <li><a href="/products" className="font-poppinsBold text-[15px] font-bold">Our Products</a></li>
          <li><a href="/size-guide" className="font-poppinsBold text-[15px] font-bold">Size Guide</a></li>
          <li><a href="/background-catalog" className="font-poppinsBold text-[15px] font-bold">Background Catalog</a></li>
          <li><a href="/location" className="font-poppinsBold text-[15px] font-bold">Location</a></li>
        </ul>

        {/* Search bar */}
        <div className="flex border border-black rounded-[40px] px-[25px] py-[10px] items-center flex-1 max-w-[90px] min-w-[250px] mr-[29px] -translate-x-3">
          <input
            type="text"
            placeholder="Search"
            className="border-none outline-none text-sm px-2 w-full bg-transparent"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="ml-3" onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>

        {/* Right menu */}
        <ul className="flex gap-4 p-0 m-0 -ml-3 items-center">
          <li><a href="/faq" className="font-poppinsBold text-[15px] font-bold">FAQ</a></li>

          {/* Language Dropdown */}
          <li className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="font-poppinsBold flex items-center gap-2 font-bold text-[15px]"
            >
              Language
              <FaChevronDown
                size={16}
                className={`transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isLangOpen && (
              <ul className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                <li><a href="/?lang=en" className="block px-4 py-2 hover:bg-gray-100 text-sm">English</a></li>
                <li><a href="/?lang=id" className="block px-4 py-2 hover:bg-gray-100 text-sm">Indonesia</a></li>
              </ul>
            )}
          </li>

          {/* Cart */}
          <li className="relative group">
            <a href="/shoppingcart" className="block relative">
              <img
                src={cartIcon}
                alt="Cart"
                className="w-[30px] h-auto cursor-pointer"
              />
              {cartCount > 0 && (
                <span className="font-poppinsBold absolute top-[-5px] right-[-5px] text rounded-full px-[6px] py-[2px] text-[12px] translate-x-[-9px] mt-[5px]">
                  {cartCount}
                </span>
              )}
            </a>

            {/* Hover popup */}
            <div className="absolute right-0 mt-3 hidden group-hover:block z-50 w-[420px]">
              <div
                className="relative bg-no-repeat bg-contain bg-top p-6"
                style={{
                  backgroundImage: `url(${cartPopup})`,
                  width: "100%",
                  height: "300px",
                  backgroundPosition: "10px top",
                }}
              >
                <p className="font-poppinsBold ml-10 text-sm mb-3">
                  Recently Added Products ({cartCount})
                </p>

                {cartItems.length === 0 ? (
                  <div className="flex items-center justify-center h-full -translate-y-[60px] text-gray-500 text-sm">
                    Your cart is empty
                  </div>
                ) : (
                  <ul className="ml-10 space-y-3 overflow-y-auto max-h-[180px] pr-2">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            {item.quantity} × Rp{item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;