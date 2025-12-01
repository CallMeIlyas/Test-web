import { useState, useEffect } from "react";
import logoFooter from "../../assets/logo/logo-amora-footer2.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();
  const currrentYear = new Date().getFullYear();
  
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
          {/* MOBILE VIEW - TETAP SAMA */}
          <div className="flex flex-row items-start justify-between px-4 py-6 gap-4 mb-16 w-full">
            <img
              src={logoFooter}
              alt="Little Amora Logo"
              className="h-[70px] w-auto object-contain"
            />
          
            <ul className="flex flex-col items-end mt-6 text-right">
              <li>
                <a
                  href="/terms"
                  className="no-underline text-black font-poppinsBold whitespace-nowrap text-sm hover:opacity-70 transition-opacity"
                >
                  {t("footer.terms")}
                </a>
              </li>
            </ul>
          </div>
        </>
      ) : (
        // DESKTOP VIEW - STYLE ASLI dengan responsive container
        <div 
          className="flex items-center justify-between mx-auto"
          style={{ 
            maxWidth: 'calc(100% - min(8vw, 160px))',
            padding: '0 min(4vw, 80px)'
          }}
        >
          <div>
            <img
              src={logoFooter}
              alt="Little Amora Logo"
              className="h-[86px] w-auto object-contain"
              style={{ 
                transform: 'translateX(calc(-1 * min(5vw, 100px)))'
              }}
            />
            <p className="font-poppinsBold text-[13px]"
              style={{ 
                transform: 'translateX(calc(-1 * min(5vw, 100px)))'
              }}
            >
              <span className="text-lg relative top-0.5">©</span> 2018-{currrentYear} Little Amora Karikatur
            </p>
          </div>
          
          <div>
            <ul className="flex flex-row text-right"
              style={{ 
                gap: 'min(3vw, 60px)',
                transform: 'translateX(calc(min(5vw, 100px)))'
              }}
            >
              <li style={{ transform: 'translateY(8px)' }}>
                <a
                  href="/terms"
                  className="no-underline text-black font-poppinsBold whitespace-nowrap text-base hover:opacity-70 transition-opacity"
                >
                  {t("footer.terms")}
                </a>
              </li>
              <li style={{ transform: 'translateY(10px)' }}>
                <a
                  href="/contact"
                  className="no-underline text-black font-poppinsBold whitespace-nowrap text-base hover:opacity-70 transition-opacity"
                >
                  {t("footer.contact")}
                </a>
              </li>
            </ul>
            <p className="font-poppinsBold ml-3 text-[13px]"
              style={{ 
                transform: 'translate(calc(min(6vw, 120px)), calc(min(2vw, 40px)))'
              }}
            >
              <span className="text-lg relative top-0.5">©</span> Created by <a href="" className="underline hover:opacity-70 transition-opacity">Muhammad Ilyas</a>
            </p>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;