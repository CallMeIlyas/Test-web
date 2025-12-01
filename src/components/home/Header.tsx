import { useState, useEffect, useRef } from "react";    
import { useLocation } from "react-router-dom";    
import { FaSearch, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";    
import { IoHomeOutline, IoBagHandleOutline, IoLocationOutline, IoImageOutline } from "react-icons/io5";    
import { CiRuler } from "react-icons/ci";
import logoAmora from "../../assets/logo/logo-amora-footer2.png";    
import cartIcon from "../../assets/Icons/CART.png";    
import cartPopup from "../../assets/Icons/cart-popup.png";    
import useIsMobile from "../../hooks/useIsMobile";    
import gsap from "gsap";    
import { useTranslation } from "react-i18next";    
import i18n from "../../i18n";    
import WhatsAppFloatingButton from "./WhatsAppFloatingButton";

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
  const location = useLocation();    
  const [isLangOpen, setIsLangOpen] = useState(false);    
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);    
  const isMobile = useIsMobile();    

  const { t } = useTranslation();    
    
  // Refs untuk input search    
  const searchInputRef = useRef<HTMLInputElement>(null);    
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);    
    
  const handleSearch = () => {    
    const value = isMobile    
      ? mobileSearchInputRef.current?.value || ""    
      : searchInputRef.current?.value || "";    
    onSearch(value);    
  };    

  // Handler untuk mengganti bahasa
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
    localStorage.setItem("i18nextLng", langCode);
    localStorage.setItem("i18n-manual-change", "true");
    setIsLangOpen(false);
  };

  // Update currentLang saat i18n.language berubah
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLang(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);
    
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
    <header className="w-full">    
      <div className="bg-[#dcbec1] flex justify-center items-center w-full">    
        <img ref={logoRef} src={logoAmora} alt="Little Amora Logo" className="h-24 w-auto object-contain" />    
      </div>    
    
<nav
  ref={navRef}
  className="flex items-center justify-between px-6 lg:px-10 xl:px-12 2xl:px-16 py-3 gap-4 lg:gap-6 overflow-x-visible relative z-40 w-full mx-auto"
  style={{ maxWidth: '1920px' }}
>
  {/* === Menu kiri - Fixed Width === */}
  <div className="flex-shrink-0">
    <ul className="flex p-0 m-0 text-black font-poppinsBold whitespace-nowrap gap-4 lg:gap-6 xl:gap-7 2xl:gap-8 text-[11px] lg:text-xs xl:text-[13px]">
      <li className="nav-item-left">
        <a href="/" className="block truncate hover:opacity-70 transition-opacity">{t("header.nav.home")}</a>
      </li>
      <li className="nav-item-left">
        <a href="/products" className="block truncate hover:opacity-70 transition-opacity">{t("header.nav.products")}</a>
      </li>
      <li className="nav-item-left">
        <a href="/size-guide" className="block truncate hover:opacity-70 transition-opacity">{t("header.nav.sizeGuide")}</a>
      </li>
      <li className="nav-item-left">
        <a href="/background-catalog" className="block truncate hover:opacity-70 transition-opacity">{t("header.nav.backgroundCatalog")}</a>
      </li>
      <li className="nav-item-left">
        <a href="/location" className="block truncate hover:opacity-70 transition-opacity">{t("header.nav.location")}</a>
      </li>
    </ul>
  </div>

  {/* === Search bar - Ultra Flexible === */}
  <div className="nav-item-search flex border border-black rounded-[40px] px-4 lg:px-6 py-2 items-center flex-1 min-w-[200px] max-w-[50vw] mx-4 lg:mx-8 xl:mx-12">
    <input
      ref={searchInputRef}
      type="text"
      placeholder={t("header.search") || "Search"}
      className="border-none outline-none px-2 w-full bg-transparent text-xs lg:text-sm"
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
    />
    <button className="ml-2 lg:ml-3 flex-shrink-0" onClick={handleSearch}>
      <FaSearch className="text-sm lg:text-base" />
    </button>
  </div>

  {/* === Menu kanan - Fixed Width === */}
  <div className="flex-shrink-0">
    <ul className="flex items-center whitespace-nowrap gap-4 lg:gap-6 xl:gap-7 2xl:gap-8">
      <li className="nav-item-right">
        <a href="/faq" className="font-poppinsBold font-bold hover:opacity-70 transition-opacity text-[11px] lg:text-xs xl:text-[13px]">
          {t("header.nav.faq")}
        </a>
      </li>

      {/* Language selector */}
      <div className="relative inline-block nav-item-right font-poppinsBold">
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="font-poppinsBold translate-y-0.5 flex items-center gap-1 lg:gap-2 hover:opacity-70 transition-opacity text-[11px] lg:text-xs xl:text-[13px]"
        >
          {t("header.nav.language")}
          <FaChevronDown
            size={14}
            className={`lg:w-4 lg:h-4 transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isLangOpen && (
          <ul
            className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 w-32 lg:w-40"
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
                a.code === currentLang ? -1 : b.code === currentLang ? 1 : 0
              )
            ).map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs lg:text-sm ${currentLang === lang.code ? "bg-gray-100 font-semibold" : ""}`}
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
            className="w-[26px] lg:w-[30px] xl:w-[32px] h-auto cursor-pointer hover:opacity-70 transition-opacity"
          />
          {cartCount > 0 && (
            <span className="font-poppinsBold absolute top-[-5px] right-[-5px] text rounded-full px-[6px] py-[2px] translate-x-[-9px] mt-[5px] text-[11px] lg:text-[12px]">
              {cartCount}
            </span>
          )}
        </a>

        {/* Hover popup */}
        <div className="absolute right-0 mt-3 hidden group-hover:block z-50" style={{ width: 'min(450px, 90vw)' }}>
          <div
            className="relative bg-no-repeat bg-contain bg-top p-5 lg:p-6"
            style={{
              backgroundImage: `url(${cartPopup})`,
              width: "100%",
              height: "300px",
              backgroundPosition: "10px top",
            }}
          >
            <p className="font-poppinsBold ml-8 lg:ml-10 mb-3 text-xs lg:text-sm">
              {t("header.recentlyAdded") || "Recently Added Products"} ({cartCount})
            </p>

            {cartItems.length === 0 ? (
              <div className="flex items-center justify-center h-full -translate-y-[60px] text-gray-500 text-xs lg:text-sm">
                {t("header.emptyCart") || "Your cart is empty"}
              </div>
            ) : (
              <ul className="ml-8 lg:ml-10 space-y-3 overflow-y-auto max-h-[180px] pr-2">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.name} className="rounded w-10 h-10 lg:w-12 lg:h-12 object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs lg:text-sm truncate">{item.name}</p>
                      <p className="text-gray-600 text-[10px] lg:text-xs">
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
  </div>
</nav>    
    </header>    
  );
    
// ================= Mobile Layout =================    
const MobileLayout = () => (    
  <>    
    <header    
      id="mobile-header"    
      className="bg-[#dcbec1] shadow-sm sticky top-0 left-0 right-0 z-50 w-full"    
    >    
      <div className="flex items-center justify-between px-4 py-3 w-full" style={{ maxWidth: '640px', margin: '0 auto' }}>    
        
        {/* Hamburger */}    
        <button    
          onClick={() => setMenuOpen(!menuOpen)}    
          className="text-black focus:outline-none p-1 flex justify-center items-center"
          style={{ minWidth: '2.5rem' }}    
          aria-label="Toggle menu"    
        >    
          {menuOpen ? (    
            <FaTimes size={20} strokeWidth={0.5} />    
          ) : (    
            <FaBars size={20} strokeWidth={0.5} />    
          )}    
        </button>    
        
        {/* Logo */}    
        <img src={logoAmora} alt="Little Amora Logo" className="h-12 sm:h-14 w-auto object-contain" style={{ maxWidth: '50%' }} />    
        
        {/* Right Section - Language + Cart */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Selector */}
          <div className="relative font-poppinsBold">
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
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`block w-full text-center px-4 py-2 hover:bg-gray-100 text-sm ${
                        currentLang === lang.code ? "bg-gray-100 font-semibold" : ""
                      }`}
                    >
                      {lang.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        
          {/* Cart */}
          <a 
            href="/shoppingcart" 
            className="relative flex items-center"
            style={{ minWidth: '2rem' }}
          >
            <div className="relative">
              <img 
                src={cartIcon} 
                alt="Cart" 
                className="w-[28px] sm:w-[30px] h-auto" 
                style={{
                  filter: 'brightness(0) saturate(100%)'
                }}
              />
              {cartCount > 0 && (
                <span className="font-poppinsBold absolute -top-0.5 right-1 text-black rounded-full px-[6px] py-[2px] text-[12px] sm:text-[13px]">
                  {cartCount}
                </span>
              )}
            </div>
          </a>
        </div>
      </div>    
    </header>    
    
{/* Hamburger Menu Sidebar - Minimalist Design */}    
<div    
  className={`fixed top-[64px] sm:top-[70px] left-0 h-[calc(100vh-64px)] sm:h-[calc(100vh-70px)] w-64 sm:w-72 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${    
    menuOpen ? "translate-x-0" : "-translate-x-full"    
  }`}    
>    
  <nav className="py-6 px-5">    
    <ul className="space-y-1">    
      <li>    
        <a    
          href="/faq"    
          className="block py-2.5 px-3 text-gray-700 hover:bg-[#dcbec1]/20 rounded-lg font-poppinsBold text-[15px] transition-colors"    
        >    
          {t("header.nav.faq")}    
        </a>    
      </li>    
      {/* Menu Contact */}
      <li>    
        <a    
          href="/contact"    
          className="block py-2.5 px-3 text-gray-700 hover:bg-[#dcbec1]/20 rounded-lg font-poppinsBold text-[15px] transition-colors"    
        >    
          {t("footer.contact")}    
        </a>    
      </li>    
    </ul>    

    {/* Search Bar in Hamburger */}    
    <div className="mt-6 pt-6 border-t border-gray-200 font-poppinsBold">    
      <div className="flex border border-gray-300 rounded-full px-4 py-2 items-center">    
        <input    
          ref={mobileSearchInputRef}    
          type="text"    
          placeholder={t("header.search") || "Search"}    
          className="border-none outline-none text-sm w-full bg-transparent"    
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}    
        />    
        <button className="ml-2 flex-shrink-0" onClick={handleSearch}>    
          <FaSearch size={16} className="text-gray-600" />    
        </button>    
      </div>    
    </div>    
  </nav>    
</div>       
    
    {/* Overlay when menu is open */}    
    {menuOpen && (    
      <div    
        className="fixed inset-0 bg-black/30 z-30 top-[64px] sm:top-[70px]"    
        onClick={() => setMenuOpen(false)}    
      ></div>    
    )}    
    
    {/* Bottom Navigation */}    
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">    
      <div className="flex justify-around items-center py-2 px-1 w-full" style={{ maxWidth: '640px', margin: '0 auto' }}>    
        {/* Home */}    
        <a     
          href="/"     
          className={`flex flex-col items-center gap-1 flex-1 min-w-0 ${    
            location.pathname === '/' ? 'text-[#dcbec1]' : 'text-gray-600'    
          }`}    
        >    
          <IoHomeOutline size={24} strokeWidth={1} className="sm:w-6 sm:h-6" />    
          <span className="text-[8px] sm:text-xs font-poppinsBold">    
            {t("header.nav.home")}    
          </span>    
        </a>    
    
        {/* Products */}    
        <a     
          href="/products"     
          className={`flex flex-col items-center gap-1 flex-1 min-w-0 ${    
            location.pathname === '/products' ? 'text-[#dcbec1]' : 'text-gray-600'    
          }`}    
        >    
          <IoBagHandleOutline size={24} strokeWidth={1} className="sm:w-6 sm:h-6" />    
          <span className="text-[8px] sm:text-xs font-poppinsBold">    
            {t("header.nav.products")}    
          </span>    
        </a>    
    
        {/* Size Guide */}    
        <a     
          href="/size-guide"
          className={`flex flex-col items-center gap-1 flex-1 min-w-0 translate-x-1.5 ${    
            location.pathname === '/size-guide' ? 'text-[#dcbec1]' : 'text-gray-600'    
          }`}    
        >    
          <CiRuler size={24} strokeWidth={0.5} className="sm:w-6 sm:h-6" />    
          <span className="text-[8px] font-poppinsBold">    
            {t("header.nav.sizeGuide")}    
          </span>    
        </a>    
    
        {/* Location */}    
        <a     
          href="/location"     
          className={`flex flex-col items-center gap-1 flex-1 min-w-0 ${    
            location.pathname === '/location' ? 'text-[#dcbec1]' : 'text-gray-600'    
          }`}    
        >    
          <IoLocationOutline size={24} strokeWidth={1} className="sm:w-6 sm:h-6" />    
          <span className="text-[8px] sm:text-xs font-poppinsBold">    
            {t("header.nav.location")}    
          </span>    
        </a>    
    
        {/* Background Catalog */}    
        <a     
          href="/background-catalog"    
          className={`flex flex-col items-center gap-1 flex-1 min-w-0 ${    
            location.pathname === '/background-catalog' ? 'text-[#dcbec1]' : 'text-gray-600'    
          }`}    
        >    
          <IoImageOutline size={24} strokeWidth={1} className="sm:w-6 sm:h-6" />    
          <span className="text-[8px] sm:text-xs font-poppinsBold">    
            {currentLang === "id" ? "Background" : "Background"}    
          </span>    
        </a>    
      </div>    
    </nav>    
        
    {/* WhatsApp Floating Button */}
    <WhatsAppFloatingButton />
  </>    
);    
    
  return isMobile ? <MobileLayout /> : <DesktopLayout />;    
};    
    
export default Header;