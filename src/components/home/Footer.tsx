import { useState, useEffect } from "react";
import logoFooter from "../../assets/logo/logo-amora-footer2.png";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer className="w-full py-3 bg-[#dcbec1]">
      {isMobile ? (
        <div className="flex flex-col items-center justify-center px-4 gap-4">
          <img
            src={logoFooter}
            alt="Little Amora Logo"
            className="h-[70px]"
          />
          <ul className="flex flex-col gap-3 p-0 m-0 text-center">
            <li>
              <a
                href="/terms"
                className="no-underline text-black font-poppinsBold whitespace-nowrap text-sm"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="no-underline text-black font-poppinsBold whitespace-nowrap text-sm"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      ) : (
        <div className="flex items-center justify-between max-w-6xl mx-auto px-10">
          <img
            src={logoFooter}
            alt="Little Amora Logo"
            className="h-[86px]"
          />
          <ul className="flex flex-col gap-3 p-0 m-0 text-right">
            <li>
              <a
                href="/terms"
                className="no-underline text-black font-poppinsBold whitespace-nowrap text-base"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="no-underline text-black font-poppinsBold whitespace-nowrap text-base"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      )}
    </footer>
  );
};

export default Footer;