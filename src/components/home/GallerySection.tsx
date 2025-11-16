import { useState, useEffect, type FC } from "react";
import type { VideoItem } from "../../types/types";
import useScrollFloat from "../../utils/scrollFloat"; 
import { useNavigate } from "react-router-dom";
import { allProducts } from "../../data/productDataLoader";
import { useTranslation } from "react-i18next";

import IGIcon from "../../assets/Icons/IG.png";
import TikTokIcon from "../../assets/Icons/TIKTOD2.png";

import video1 from "../../assets/karya/vid-1.mp4";
import video2 from "../../assets/karya/vid-2.mp4";
import video3 from "../../assets/karya/vid-3.mp4";

import foto1 from "../../assets/karya/foto/foto1.jpeg";
import foto2 from "../../assets/karya/foto/foto2.jpeg";
import foto3 from "../../assets/karya/foto/foto3.jpeg";
import foto4 from "../../assets/karya/foto/foto4.jpeg";
import foto5 from "../../assets/karya/foto/foto5.jpeg";

const GallerySection: FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

const handleLabelClick = (label: string, e: React.MouseEvent) => {
  e.stopPropagation();

  // Ambil bagian ukuran utama (misal "12R / A3 30x40cm" -> "12R")
  const cleanLabel = label.split(/[\/\s(]/)[0].trim().toLowerCase();

  // Ambil semua produk 3D Frame
  const frameProducts = allProducts.filter(
    (p) => p.category?.toLowerCase() === "3d frame"
  );

  // Cari produk 3D Frame yang cocok banget dengan ukuran
  const strictMatch = frameProducts.find((p) => {
    const name = p.name.trim().toLowerCase();
    // nama mengandung ukuran, tapi tidak ada kata "ai"
    return (
      name.includes(cleanLabel) &&
      !name.includes("ai") &&
      !name.includes("artificial") &&
      !name.includes("preview")
    );
  });

  if (strictMatch) {
    navigate(`/product/${strictMatch.id}`, {
      state: {
        ...strictMatch,
        specialVariations: strictMatch.specialVariations || [],
        details: strictMatch.details || {},
      },
    });
    return;
  }

  // fallback ke versi biasa kalau gak ketemu
  const fallback = frameProducts.find((p) =>
    p.name.trim().toLowerCase().includes(cleanLabel)
  );

  if (fallback) {
    navigate(`/product/${fallback.id}`, {
      state: {
        ...fallback,
        specialVariations: fallback.specialVariations || [],
        details: fallback.details || {},
      },
    });
  } else {
    console.warn("❌ Produk tidak ditemukan untuk label:", cleanLabel);
  }
};

  useScrollFloat(".scroll-float", {
    yIn: 50,
    yOut: 40,
    blurOut: 6,
    inDuration: 1.1,
    outDuration: 0.7,
    stagger: 0.15,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const videos: VideoItem[] = [
    { id: 1, video: video1 },
    { id: 2, video: video2 },
    { id: 3, video: video3 },
  ];

  const photos = [
    { id: 1, image: foto1, label: "A2 (40×55CM)" },
    { id: 2, image: foto2, label: "10R / A4 25x30cm" },
    { id: 3, image: foto3, label: "12R / A3 30x40cm" },
    { id: 4, image: foto4, label: "12R / A3 30x40cm" },
    { id: 5, image: foto5, label: "A0 (80×110 cm)" },
  ];

  return (
    <>
    <div className = "font-poppinsSemiBold">
      {/* Border */}
      <div className="relative my-10 text-center h-[1px]">
        <div className="absolute top-0 left-0 w-1/4 border-t-[5px] border-black"></div>
        <div className="absolute top-0 right-0 w-1/4 border-t-[5px] border-black"></div>
      </div>

      <section className={`bg-white ${isMobile ? "py-8 px-4" : "py-16 px-5"}`}>
        <h2
          className={`scroll-float font-nataliecaydence text-center text-black ${
            isMobile ? "text-3xl mb-6" : "text-[46px] mb-10"
          }`}
        >
          {t("gallery.title")}
        </h2>

        {isMobile ? (
          <div
            data-scroll-group="true"
            className="scroll-float flex flex-col gap-6 max-w-md mx-auto"
          >
            {/* Instagram Button */}
            <div className="float-item social-wrapper">
              <span className="social-title">Photo Gallery</span>
              <a
                href="https://www.instagram.com/alittleamora"
                className="social-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={IGIcon}
                  alt="Instagram"
                  className="w-full h-full object-contain"
                />
              </a>
            </div>

            {/* Video Grid */}
            <div className="float-item grid grid-cols-1 gap-4 w-full">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="aspect-[9/16] overflow-hidden rounded-xl shadow-md bg-black"
                >
                  <video controls className="w-full h-full object-cover">
                    <source src={video.video} type="video/mp4" />
                  </video>
                </div>
              ))}
            </div>

            {/* TikTok Button */}
            <div className="float-item social-wrapper">
              <span className="social-title">Video Gallery</span>
              <a
                href="https://www.tiktok.com/@alittleamora"
                className="social-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={TikTokIcon}
                  alt="TikTok"
                  className="w-full h-full object-contain"
                />
              </a>
            </div>

            {/* Photo Grid Section (desktop) */}
            <div className="scroll-float mt-16 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative float-item aspect-[9/16] overflow-hidden rounded-xl shadow-md transition-transform duration-300 bg-gray-100 scale-90 hover:scale-100 cursor-pointer group"
                onClick={() => setSelectedImage(photo.image)}
              >
                <img
                  src={photo.image}
                  alt={`Gallery photo ${photo.id}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
            
                {/* 🔖 Tombol ukuran di tengah bawah */}
                {photo.label && (
  <button
    onClick={(e) => handleLabelClick(photo.label, e)}
    className="
      absolute bottom-4 left-4
      flex items-center gap-2
      bg-white/20 backdrop-blur-lg
      text-white font-semibold text-sm md:text-[15px]
      px-4 py-[6px] md:py-2
      rounded-full shadow-lg border border-white/30
      whitespace-nowrap
      transition-all duration-300
      hover:scale-105 hover:shadow-xl hover:bg-white/30
    "
  >
    <span className="w-2.5 h-2.5 rounded-full bg-white/80 shadow-sm"></span>
    {photo.label}
  </button>
)}
              </div>
            ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              data-scroll-group="true"
              className="scroll-float flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto"
            >
              {/* Instagram Button */}
              <div className="float-item social-wrapper">
                <span className="social-title">{t("gallery.photo")}</span>
                <a
                  href="https://www.instagram.com/alittleamora"
                  className="social-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={IGIcon}
                    alt="Instagram"
                    className="w-full h-full object-contain"
                  />
                </a>
              </div>

              {/* Video Grid */}
              <div className="float-item grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="aspect-[9/16] overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 bg-black hover:scale-[1.03]"
                  >
                    <video controls className="w-full h-full object-cover">
                      <source src={video.video} type="video/mp4" />
                    </video>
                  </div>
                ))}
              </div>

              {/* TikTok Button */}
              <div className="float-item social-wrapper">
                <span className="social-title">{t("gallery.video")}</span>
                <a
                  href="https://www.tiktok.com/@alittleamora"
                  className="social-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={TikTokIcon}
                    alt="TikTok"
                    className="w-full h-full object-contain"
                  />
                </a>
              </div>
            </div>

            {/* Photo Grid Section */}
            <div
              data-scroll-group="true"
              className="scroll-float mt-16 max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative float-item aspect-[9/16] overflow-hidden rounded-xl shadow-md transition-transform duration-300 bg-gray-100 scale-90 hover:scale-100 cursor-pointer group"
                onClick={() => setSelectedImage(photo.image)}
              >
                <img
                  src={photo.image}
                  alt={`Gallery photo ${photo.id}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
            
                {/* Tombol ukuran di tengah bawah */}
               {photo.label && (
  <button
    onClick={(e) => handleLabelClick(photo.label, e)}
    className="
      absolute bottom-4 left-4
      flex items-center gap-2
      bg-white/20 backdrop-blur-lg
      text-white font-semibold text-sm md:text-[15px]
      px-4 py-[6px] md:py-2
      rounded-full shadow-lg border border-white/30
      whitespace-nowrap
      transition-all duration-300
      hover:scale-105 hover:shadow-xl hover:bg-white/30
    "
  >
    <span className="w-2.5 h-2.5 rounded-full bg-white/80 shadow-sm"></span>
    {photo.label}
  </button>
)}
              </div>
            ))}
              </div>
            </div>
          </>
        )}
      </section>

      {/* Fullscreen */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full view"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
          <button
            className="absolute top-5 right-5 text-white text-3xl font-bold"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}
      </div>
    </>
  );
};

export default GallerySection
