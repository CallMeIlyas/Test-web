import { useState } from "react";
import { FaSearch, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import logoAmora from "../../assets/logo/logo-amora-footer2.png";
import cartIcon from "../../assets/Icons/CART.png";
import cartPopup from "../../assets/Icons/cart-popup.png";
import useIsMobile from "../../hooks/useIsMobile"; // gunakan hook baru

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
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
  const [menuOpen, setMenuOpen] = useState(false);

  const isMobile = useIsMobile(); // deteksi device

  const handleSearch = () => {
    onSearch(searchText);
  };

  // ================= Desktop Layout =================
  const DesktopLayout = () => (
    <header>
      {/* Top Logo */}
      <div className="bg-[#dcbec1] py-5 flex justify-center items-center">
        <img src={logoAmora} alt="Little Amora Logo" className="h-24" />
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-3 bg-white gap-2 overflow-x-visible relative z-40">
        {/* Menu kiri */}
        <ul className="flex gap-7 p-0 m-0 mr-auto -translate-x-2 no-underline text-black font-poppinsBold whitespace-nowrap text-sm">
          <li><a href="/">Home</a></li>
          <li><a href="/products">Our Products</a></li>
          <li><a href="/size-guide">Size Guide</a></li>
          <li><a href="/background-catalog">Background Catalog</a></li>
          <li><a href="/location">Location</a></li>
        </ul>

        {/* Search bar */}
        <div className="flex border border-black rounded-[40px] px-[25px] py-[10px] items-center flex-1 max-w-[90px] min-w-[250px] mr-[29px] -translate-x-7">
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

        {/* Menu kanan */}
        <ul className="flex gap-4 p-0 m-0 -ml-3 items-center">
          <li><a href="/faq" className="font-poppinsBold text-sm font-bold">FAQ</a></li>

          {/* Dropdown language */}
          <li className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="font-poppinsBold flex items-center gap-2 font-bold text-sm"
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

          {/* Cart + Popup */}
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

            {/* === HOVER POPUP === */}
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

  // ================= Mobile Layout =================
  const MobileLayout = () => (
    <header className="bg-white shadow">
      {/* Logo tengah + hamburger kanan */}
      <div className="relative flex items-center justify-center px-4 py-3 bg-[#dcbec1]">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="absolute right-4 text-xl"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <img
          src={logoAmora}
          alt="Little Amora Logo"
          className="h-16 mx-auto"
        />
      </div>

      {/* Menu dropdown */}
      {menuOpen && (
        <nav className="flex flex-col bg-white p-4 border-t border-gray-200 space-y-4">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-400 rounded-full px-4 py-2 text-sm outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <a href="/" className="font-poppinsBold text-[15px] font-bold">Home</a>
          <a href="/products" className="font-poppinsBold text-[15px] font-bold">Our Products</a>
          <a href="/size-guide" className="font-poppinsBold text-[15px] font-bold">Size Guide</a>
          <a href="/background-catalog" className="font-poppinsBold text-[15px] font-bold">Background Catalog</a>
          <a href="/location" className="font-poppinsBold text-[15px] font-bold">Location</a>
          <a href="/faq" className="font-poppinsBold text-[15px] font-bold">FAQ</a>

          {/* Language selector */}
          <div>
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
              <ul className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <li><a href="/?lang=en" className="block px-4 py-2 hover:bg-gray-100 text-sm">English</a></li>
                <li><a href="/?lang=id" className="block px-4 py-2 hover:bg-gray-100 text-sm">Indonesia</a></li>
              </ul>
            )}
          </div>

          {/* Cart */}
          <a href="/shoppingcart" className="flex items-center gap-3">
            <img src={cartIcon} alt="Cart" className="w-6 h-auto" />
            <span className="font-poppinsBold text-[15px] font-bold">
              Cart ({cartCount})
            </span>
          </a>
        </nav>
      )}
    </header>
  );

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default Header;