import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/home/Footer";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const images = [onHand1, onHand2, onHand3, onHand4, onHand5, onHand6];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomed, setZoomed] = useState<string | null>(null);

  // ✨ Fade-in on scroll
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

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
      { threshold: 0.2 }
    );

    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

      const SectionTitle = ({ title }: { title: string }) => (
        <div className="relative my-8 mb-10 text-center w-screen left-1/2 -translate-x-1/2">
          <h1 className="inline-block px-5 text-4xl md:text-5xl font-nataliecaydence relative z-10">
            {title}
          </h1>
          <div className="absolute top-1/2 left-0 w-[20%] border-t-4 border-black transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-0 w-[20%] border-t-4 border-black transform -translate-y-1/2"></div>
        </div>
      );

  // 🧭 Navigasi carousel
  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };


  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* ========== FRAME SIZE ========== */}
        <section
          ref={(el) => (sectionsRef.current[0] = el)}
          className="transition-all duration-700 opacity-0 translate-y-5 max-w-7xl mx-auto px-5 md:px-10"
        >
          <SectionTitle title="Frame Size" />
          <div className="relative flex justify-center items-center">
            <img
              src={mainImage1}
              alt="Frame Size Base"
              className="rounded-lg shadow-lg w-full md:w-4/5 lg:w-3/4 object-contain"
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
          className="transition-all duration-700 opacity-0 translate-y-5 max-w-7xl mx-auto px-5 md:px-10 mt-20"
        >
          <SectionTitle title="Size Comparison" />
          <div className="flex justify-center">
            <img
              src={mainImage3}
              alt="Size Comparison"
              className="rounded-lg shadow-lg w-full md:w-4/5 lg:w-3/4 object-contain"
            />
          </div>
        </section>

        {/* ========== SIZE ON HAND (Carousel) ========== */}
        <section
          ref={(el) => (sectionsRef.current[2] = el)}
          className="transition-all duration-700 opacity-0 translate-y-5 w-full mt-20 mb-24 relative"
        >
          <SectionTitle title="Size on Hand" />

          <div className="relative flex justify-center items-center overflow-hidden px-10">
            {/* Gambar kiri & kanan sebagai preview */}
            <div className="flex items-center justify-center w-full">
              {images.map((img, index) => {
                const position =
                  index === currentIndex
                    ? "scale-100 opacity-100 z-20"
                    : index === (currentIndex + 1) % images.length ||
                      (currentIndex === images.length - 1 && index === 0)
                    ? "scale-90 opacity-70 translate-x-[5%] z-10"
                    : index ===
                        (currentIndex === 0
                          ? images.length - 1
                          : currentIndex - 1)
                    ? "-translate-x-[5%] scale-90 opacity-70 z-10"
                    : "hidden";

                return (
                  <img
                    key={index}
                    src={img}
                    alt={`On Hand ${index + 1}`}
                    className={`absolute transition-all duration-700 ease-in-out rounded-xl shadow-xl cursor-pointer w-[85vw] md:w-[55vw] lg:w-[40vw] object-cover ${position}`}
                    onClick={() => setZoomed(img)}
                  />
                );
              })}
            </div>

            {/* Tombol navigasi kiri-kanan */}
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-10 bg-white/70 hover:bg-white text-black p-2 rounded-full shadow-md z-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 md:right-10 bg-white/70 hover:bg-white text-black p-2 rounded-full shadow-md z-30"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* ========== MODAL ZOOMED IMAGE ========== */}
      {zoomed && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <button
            onClick={() => setZoomed(null)}
            className="absolute top-5 right-5 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
          >
            <X className="w-6 h-6 text-black" />
          </button>
          <img
            src={zoomed}
            alt="Zoomed"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transition-transform duration-500"
          />
        </div>
      )}
    </div>
  );
};

export default SizeGuide;