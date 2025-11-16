import { useState, useEffect } from "react";
import logoFooter from "../../assets/logo/logo-amora-footer2.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer className="w-full bg-[#dcbec1] overflow-hidden">
      {isMobile ? (
      <>
    {/* MOBILE VIEW */}
    <div className="flex flex-row items-start justify-between px-4 py-6 gap-4 mb-16 w-full">
    
      {/* Logo kiri */}
      <img
        src={logoFooter}
        alt="Little Amora Logo"
        className="h-[70px]"
      />
    
      <ul className="flex flex-col items-end mt-4 text-right">
        <li>
          <a
            href="/terms"
            className="no-underline text-black font-poppinsBold whitespace-nowrap text-sm hover:opacity-70 transition-opacity"
          >
            {t("footer.terms")}
          </a>
        </li>
        <li>
          <a
            href="/contact"
            className="no-underline text-black font-poppinsBold whitespace-nowrap text-sm hover:opacity-70 transition-opacity"
          >
            {t("footer.contact")}
          </a>
        </li>
      </ul>
    
    </div>
      </>
      ) : (
        //  DESKTOP VIEW
        <div className="flex items-center justify-between max-w-6xl mx-auto px-10">
          <img
            src={logoFooter}
            alt="Little Amora Logo"
            className="h-[86px] -translate-x-20"
          />
          {/* ubah ke flex-row */}
          <ul className="flex flex-row gap-x-8 p-0 m-0 text-right translate-x-20">
            <li>
              <a
                href="/terms"
                className="no-underline text-black font-poppinsBold whitespace-nowrap text-base"
              >
                {t("footer.terms")}
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="no-underline text-black font-poppinsBold whitespace-nowrap text-base"
              >
                {t("footer.contact")}
              </a>
            </li>
          </ul>
        </div>
      )}
    </footer>
  );
};

export default Footer;