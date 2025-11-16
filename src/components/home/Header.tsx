import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FaSearch, FaChevronDown, FaBars, FaTimes, FaHome, FaShoppingBag, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { IoHomeOutline, IoBagHandleOutline, IoLocationOutline, IoImageOutline } from "react-icons/io5";
import logoAmora from "../../assets/logo/logo-amora-footer2.png";
import cartIcon from "../../assets/Icons/CART.png";
import cartPopup from "../../assets/Icons/cart-popup.png";
import useIsMobile from "../../hooks/useIsMobile";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

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
  const currentLang = i18n.language;
  const location = useLocation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const { t } = useTranslation();

  // ✅ Refs untuk input search
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const value = isMobile
      ? mobileSearchInputRef.current?.value || ""
      : searchInputRef.current?.value || "";
    onSearch(value);
  };

  // === Refs untuk animasi GSAP ===
  const navRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out", duration: 0.5 },
      });

      tl.from(logoRef.current, {
        opacity: 0,
        y: -40,
        scale: 0.9,
        duration: 0.8,
      });

      const allNavItems = gsap.utils.toArray([
        ".nav-item-left",
        ".nav-item-search",
        ".nav-item-right",
      ]);

      const flatItems = allNavItems.flatMap((selector) =>
        gsap.utils.toArray(selector)
      );

      tl.from(
        flatItems,
        {
          opacity: 0,
          y: -20,
          stagger: 0.1,
          duration: 0.5,
        },
        "-=0.3"
      );
    });

    return () => ctx.revert();
  }, [location.pathname]);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // ================= Desktop Layout =================
  const DesktopLayout = () => (
    <header>
      <div className="bg-[#dcbec1] flex justify-center items-center">
        <img ref={logoRef} src={logoAmora} alt="Little Amora Logo" className="h-24" />
      </div>

      <nav
        ref={navRef}
        className="flex justify-between items-center px-10 py-3 gap-4 overflow-x-visible relative z-40"
      >
        {/* === Menu kiri === */}
        <ul className="flex gap-6 p-0 m-0 mr-auto text-black font-poppinsBold text-sm flex-shrink-0 max-w-[50%] whitespace-nowrap">
          <li className="nav-item-left">
            <a href="/" className="block truncate">{t("header.nav.home")}</a>
          </li>
          <li className="nav-item-left">
            <a href="/products" className="block truncate">{t("header.nav.products")}</a>
          </li>
          <li className="nav-item-left">
            <a href="/size-guide" className="block truncate">{t("header.nav.sizeGuide")}</a>
          </li>
          <li className="nav-item-left">
            <a href="/background-catalog" className="block truncate">{t("header.nav.backgroundCatalog")}</a>
          </li>
          <li className="nav-item-left">
            <a href="/location" className="block truncate">{t("header.nav.location")}</a>
          </li>
        </ul>

        {/* === Search bar === */}
        <div className="nav-item-search flex border border-black rounded-[40px] px-[25px] py-[10px] items-center flex-1 min-w-[280px] max-w-[350px] mx-[40px]">
          <input
            ref={searchInputRef}
            type="text"
            placeholder={t("header.search") || "Search"}
            className="border-none outline-none text-sm px-2 w-full bg-transparent"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="ml-3" onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>

        {/* === Menu kanan === */}
        <ul className="flex gap-4 items-center flex-shrink-0 whitespace-nowrap">
          <li className="nav-item-right">
            <a href="/faq" className="font-poppinsBold text-sm font-bold">
              {t("header.nav.faq")}
            </a>
          </li>

          {/* Language selector */}
          <div className="relative inline-block text-left nav-item-right">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="font-poppinsBold flex items-center gap-2 font-bold text-[15px]"
            >
              {t("header.nav.language")}
              <FaChevronDown
                size={16}
                className={`transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isLangOpen && (
              <ul
                className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50"
                style={{
                  top: "100%",
                  marginTop: "8px"
                }}
              >
                {(
                  [
                    { code: "en", label: t("header.languageOptions.en") },
                    { code: "id", label: t("header.languageOptions.id") }
                  ].sort((a, b) =>
                    a.code === i18n.language ? -1 : b.code === i18n.language ? 1 : 0
                  )
                ).map((lang) => (
                  <li key={lang.code}>
                    <button
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
                        i18n.language === lang.code ? "bg-gray-100 font-semibold" : ""
                      }`}
                    >
                      {lang.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* === CART === */}
          <li className="relative group nav-item-right">
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
                  {t("header.recentlyAdded") || "Recently Added Products"} ({cartCount})
                </p>

                {cartItems.length === 0 ? (
                  <div className="flex items-center justify-center h-full -translate-y-[60px] text-gray-500 text-sm">
                    {t("header.emptyCart") || "Your cart is empty"}
                  </div>
                ) : (
                  <ul className="ml-10 space-y-3 overflow-y-auto max-h-[180px] pr-2">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            {item.quantity} × Rp {item.price.toLocaleString("id-ID")}
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
    <>
  <header
  id="mobile-header"
  className="bg-[#dcbec1] shadow-sm sticky top-0 left-0 right-0 z-50"
>
    <div className="flex items-center justify-between px-4 py-3">
  
      {/* Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-black focus:outline-none p-1 w-10 flex justify-center"
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <FaTimes size={20} strokeWidth={0.5} />
        ) : (
          <FaBars size={20} strokeWidth={0.5} />
        )}
      </button>
  
      {/* Logo */}
      <img src={logoAmora} alt="Little Amora Logo" className="h-14" />
  
      {/* Language Selector */}
      <div className="relative w-14 flex justify-end">
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="font-poppinsBold text-sm font-semibold text-black px-2 py-1 rounded hover:bg-white/30 transition-colors flex items-center gap-1"
        >
          {currentLang.toUpperCase()}
          <FaChevronDown
            size={12}
            className={`transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`}
          />
        </button>
  
        {isLangOpen && (
          <ul className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
            {[
              { code: "en", label: "EN" },
              { code: "id", label: "ID" }
            ].map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setIsLangOpen(false);
                  }}
                  className={`block w-full text-center px-4 py-2 hover:bg-gray-100 text-sm ${
                    i18n.language === lang.code ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  {lang.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
  
    </div>
  </header>

      {/* Hamburger Menu Sidebar - Minimalist Design */}
      <div
        className={`fixed top-[70px] left-0 h-[calc(100vh-70px)] w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="py-6 px-5">
          <ul className="space-y-1">
            <li>
              <a
                href="/size-guide"
                className="block py-2.5 px-3 text-gray-700 hover:bg-[#dcbec1]/20 rounded-lg font-poppins text-[15px] transition-colors"
              >
                {t("header.nav.sizeGuide")}
              </a>
            </li>
            <li>
              <a
                href="/faq"
                className="block py-2.5 px-3 text-gray-700 hover:bg-[#dcbec1]/20 rounded-lg font-poppins text-[15px] transition-colors"
              >
                {t("header.nav.faq")}
              </a>
            </li>
          </ul>

          {/* Search Bar in Hamburger */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex border border-gray-300 rounded-full px-4 py-2 items-center">
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder={t("header.search") || "Search"}
                className="border-none outline-none text-sm w-full bg-transparent"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="ml-2" onClick={handleSearch}>
                <FaSearch size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay when menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 top-[70px]"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-2 px-1">
          {/* Home */}
          <a 
            href="/" 
            className={`flex flex-col items-center gap-1 flex-1 ${
              location.pathname === '/' ? 'text-[#dcbec1]' : 'text-gray-600'
            }`}
          >
            <IoHomeOutline size={24} strokeWidth={1} />
            <span className="text-[10px] sm:text-xs font-poppinsBold">
              {t("header.nav.home")}
            </span>
          </a>

          {/* Products */}
          <a 
            href="/products" 
            className={`flex flex-col items-center gap-1 flex-1 ${
              location.pathname === '/products' ? 'text-[#dcbec1]' : 'text-gray-600'
            }`}
          >
            <IoBagHandleOutline size={24} strokeWidth={1} />
            <span className="text-[10px] sm:text-xs font-poppinsBold">
              {t("header.nav.products")}
            </span>
          </a>

{/* Cart - dengan badge */}
<a 
  href="/shoppingcart" 
  className={`flex flex-col items-center ml-4 gap-1 flex-1 relative ${
    location.pathname === '/shoppingcart' ? 'text-[#dcbec1]' : 'text-gray-600'
  }`}
>
  <div className="relative">
    <img 
      src={cartIcon} 
      alt="Cart" 
      className="w-[35px] h-auto" 
      style={{
        filter: location.pathname === '/shoppingcart' 
          ? 'brightness(0) saturate(100%) invert(81%) sepia(12%) saturate(692%) hue-rotate(304deg) brightness(93%) contrast(88%) drop-shadow(0 0 0.5px black)'
          : 'brightness(0) saturate(100%) invert(47%) sepia(8%) saturate(420%) hue-rotate(182deg) brightness(90%) contrast(88%)'
      }}
    />
    {cartCount > 0 && (
      <span className="font-poppinsBold absolute top-0 right-1.5 text-black rounded-full px-[6px] py-[2px] text-[13px]">
        {cartCount}
      </span>
    )}
  </div>
  <span className="text-[10px] sm:text-xs font-poppinsBold -translate-y-[3px]">
    {t("header.cart")}
  </span>
</a>

          {/* Location */}
          <a 
            href="/location" 
            className={`flex flex-col items-center gap-1 flex-1 ${
              location.pathname === '/location' ? 'text-[#dcbec1]' : 'text-gray-600'
            }`}
          >
            <IoLocationOutline size={24} strokeWidth={1} />
            <span className="text-[10px] sm:text-xs font-poppinsBold">
              {t("header.nav.location")}
            </span>
          </a>

          {/* Background Catalog */}
          <a 
            href="/background-catalog"
            className={`flex flex-col items-center gap-1 flex-1 ${
              location.pathname === '/background-catalog' ? 'text-[#dcbec1]' : 'text-gray-600'
            }`}
          >
            <IoImageOutline size={24} strokeWidth={1} />
            <span className="text-[10px] sm:text-xs font-poppinsBold">
              {currentLang === "id" ? "Background" : "Background"}
            </span>
          </a>
        </div>
      </nav>
      
            {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/6281380340307"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-40 bg-[#dcbec1] text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Contact WhatsApp"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </>
  );

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default Header;