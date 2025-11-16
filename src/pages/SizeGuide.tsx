import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/home/Footer";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";

// 🖼️ Import semua gambar
import mainImage1 from "../assets/size-guide/main-image1.png";
import mainImage2 from "../assets/size-guide/main-image2.png";
import mainImage3 from "../assets/size-guide/main-image3.png";
import onHand1 from "../assets/size-guide/1.png";
import onHand2 from "../assets/size-guide/2.png";
import onHand3 from "../assets/size-guide/3.png";
import onHand4 from "../assets/size-guide/4.png";
import onHand5 from "../assets/size-guide/5.png";
import onHand6 from "../assets/size-guide/6.png";

const SizeGuide: React.FC = () => {
  const { t } = useTranslation();
  const images = [onHand1, onHand2, onHand3, onHand4, onHand5, onHand6];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // ✨ Fade-in observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-5");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((el) => el && observer.observe(el));
    setTimeout(() => window.dispatchEvent(new Event("resize")), 500);
    return () => observer.disconnect();
  }, []);

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="relative my-6 mb-8 md:my-8 md:mb-10 text-center w-screen left-1/2 -translate-x-1/2">
      <h1 className="inline-block px-4 text-2xl md:text-4xl lg:text-5xl font-nataliecaydence relative z-10">
        {title}
      </h1>
      <div className="absolute top-1/2 left-0 w-[15%] md:w-[20%] border-t-2 md:border-t-4 border-black transform -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-[15%] md:w-[20%] border-t-2 md:border-t-4 border-black transform -translate-y-1/2"></div>
    </div>
  );

  // 🧭 Navigasi carousel
  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // 🚫 Nonaktifkan scroll saat fullscreen aktif
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedImage]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* ========== FRAME SIZE ========== */}
        <section
          ref={(el) => (sectionsRef.current[0] = el)}
          className="transition-all duration-700 opacity-0 translate-y-5 max-w-7xl mx-auto px-4 md:px-10"
        >
          <SectionTitle title={t("size.frameSize")} />
          <div className="relative flex justify-center items-center">
            <img
              src={mainImage1}
              alt="Frame Size Base"
              className="w-full md:w-4/5 lg:w-3/4 object-contain"
            />
            <img
              src={mainImage2}
              alt="Frame Size Overlay"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-4/5 lg:w-3/4 object-contain pointer-events-none"
            />
          </div>
        </section>

        {/* ========== SIZE COMPARISON ========== */}
        <section
          ref={(el) => (sectionsRef.current[1] = el)}
          className="transition-all duration-700 opacity-0 translate-y-5 max-w-7xl mx-auto px-4 md:px-10 mt-12 md:mt-20"
        >
          <SectionTitle title={t("size.sizeComparison")} />
          <div className="flex justify-center">
            <img
              src={mainImage3}
              alt="Size Comparison"
              className="w-full md:w-4/5 lg:w-3/4 object-contain"
            />
          </div>
        </section>

        {/* ========== SIZE ON HAND (Carousel) ========== */}
        <section
          ref={(el) => (sectionsRef.current[2] = el)}
          className="transition-all duration-700 opacity-0 translate-y-5 w-full mt-12 md:mt-20 mb-16 md:mb-24 relative"
        >
          <SectionTitle title={t("size.sizeOnHand")} />

          <div className="relative flex justify-center items-center overflow-visible px-4 md:px-10">
            <div className="flex items-center justify-center w-full relative min-h-[300px] md:min-h-[400px] mt-6 md:mt-10">
              {images.map((img, index) => {
                const isActive = index === currentIndex;
                const isNext = index === (currentIndex + 1) % images.length;
                const isPrev =
                  index ===
                  (currentIndex === 0
                    ? images.length - 1
                    : currentIndex - 1);

                const position = isActive
                  ? "scale-100 opacity-100 z-20"
                  : isNext
                  ? "translate-x-[20%] md:translate-x-[15%] scale-90 opacity-70 z-10"
                  : isPrev
                  ? "-translate-x-[20%] md:-translate-x-[15%] scale-90 opacity-70 z-10"
                  : "opacity-0 pointer-events-none";

                return (
                  <img
                    key={index}
                    src={img}
                    alt={`On Hand ${index + 1}`}
                    className={`absolute transition-all duration-700 ease-in-out rounded-lg md:rounded-xl shadow-lg md:shadow-xl cursor-pointer w-[90vw] md:w-[55vw] lg:w-[40vw] object-cover ${position}`}
                    onClick={() => setSelectedImage(img)}
                  />
                );
              })}
            </div>

            {/* Tombol navigasi */}
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-10 bg-white/70 hover:bg-white text-black p-1 md:p-2 rounded-full shadow-md z-30"
            >
              <ChevronLeft className="w-8 h-8 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 md:right-10 bg-white/70 hover:bg-white text-black p-1 md:p-2 rounded-full shadow-md z-30"
            >
              <ChevronRight className="w-8 h-8 md:w-6 md:h-6" />
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* ✅ Fullscreen Preview */}
      {selectedImage &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center animate-fadeIn"
            onClick={() => setSelectedImage(null)}
          >
            {/* Tombol close */}
            <button
              className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/60 hover:bg-black/80 text-white text-xl md:text-3xl font-bold w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center z-[1000]"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>

            {/* Gambar tengah */}
            <div
              className="relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Full view"
                className="
                  object-contain rounded-lg md:rounded-xl shadow-xl md:shadow-2xl
                  max-w-[90vw] max-h-[80vh]
                  md:max-w-[70vw] md:max-h-[80vh]
                  transition-transform duration-300 ease-out
                  scale-100 hover:scale-[1.02] md:hover:scale-[1.03]
                "
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default SizeGuide;