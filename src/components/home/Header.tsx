import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FaSearch, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
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

    // Animasi logo dulu
    tl.from(logoRef.current, {
      opacity: 0,
      y: -40,
      scale: 0.9,
      duration: 0.8,
    });

    // Ambil semua elemen di urutan kiri → tengah → kanan
    const allNavItems = gsap.utils.toArray([
      ".nav-item-left",
      ".nav-item-search",
      ".nav-item-right",
    ]);

    // Flatten array (karena tiap selector bisa punya beberapa elemen)
    const flatItems = allNavItems.flatMap((selector) =>
      gsap.utils.toArray(selector)
    );

    // Animasi dari kiri ke kanan
    tl.from(
      flatItems,
      {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        duration: 0.5,
      },
      "-=0.3" // sedikit overlap dengan logo
    );
  });

  return () => ctx.revert();
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
        {/* === CART (dipertahankan 100%) === */}
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
    <header className="bg-white shadow">
      <div className="relative flex items-center justify-center px-4 py-3 bg-[#dcbec1]">
        <button onClick={() => setMenuOpen(!menuOpen)} className="absolute right-4 text-xl">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <img src={logoAmora} alt="Little Amora Logo" className="h-16 mx-auto" />
      </div>

      {menuOpen && (
        <nav className="flex flex-col bg-white p-4 border-t border-gray-200 space-y-4">
          <input
            ref={mobileSearchInputRef}
            type="text"
            placeholder={t("header.search") || "Search"}
            className="border border-gray-400 rounded-full px-4 py-2 text-sm outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <a href="/" className="font-poppinsBold text-[15px] font-bold">
            {t("header.nav.home")}
          </a>
          <a href="/products" className="font-poppinsBold text-[15px] font-bold">
            {t("header.nav.products")}
          </a>
          <a href="/size-guide" className="font-poppinsBold text-[15px] font-bold">
            {t("header.nav.sizeGuide")}
          </a>
          <a href="/background-catalog" className="font-poppinsBold text-[15px] font-bold">
            {t("header.nav.backgroundCatalog")}
          </a>
          <a href="/location" className="font-poppinsBold text-[15px] font-bold">
            {t("header.nav.location")}
          </a>
          <a href="/faq" className="font-poppinsBold text-[15px] font-bold">
            {t("header.nav.faq")}
          </a>
{/* Language selector */}
<div className="relative inline-block text-left">
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

          {/* Cart */}
          <a href="/shoppingcart" className="flex items-center gap-3">
            <img src={cartIcon} alt="Cart" className="w-6 h-auto" />
            <span className="font-poppinsBold text-[15px] font-bold">
              {t("header.cart")} ({cartCount})
            </span>
          </a>
        </nav>
      )}
    </header>
  );

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default Header;