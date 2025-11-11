import React, { useState, useEffect, useRef } from "react";
import {
  useParams,
  useLocation,
  Link,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import Footer from "../components/home/Footer";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { priceList } from "../data/priceList";
import { getPrice } from "../utils/getPrice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { productOptions } from "../data/productOptions";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

type LayoutContext = {
  searchQuery: string;
  addToCart: (item: any) => void;
};



// Packaging images khusus untuk 3D Frame 8R
const packagingImages = import.meta.glob(
  "../assets/3d-package-photo/8R/*.{jpg,JPG,jpeg,png}",
  { eager: true, as: "url" }
);

const getPackagingImage = (filename: string): string => {
  const entry = Object.entries(packagingImages).find(([path]) => 
    path.toUpperCase().includes(filename.toUpperCase())
  );
  return entry ? entry[1] : "https://via.placeholder.com/48";
};

// Helper untuk harga produk tambahan
const getAdditionalPrice = (name: string): number | string => {
  const additionalPrices = priceList.Additional;

  switch (name) {
    case "Additional Faces": {
      const minPrice = additionalPrices["Tambahan Wajah Karikatur 1-9 wajah"];
      const maxPrice = additionalPrices["Tambahan Wajah Karikatur diatas 10 wajah"];
      return `Rp ${minPrice.toLocaleString("id-ID")} - Rp ${maxPrice.toLocaleString("id-ID")}`;
    }
    case "Background Custom":
      return additionalPrices["Background Custom"];

    case "Additional Packing":
      return additionalPrices["Biaya Tambahan Packing untuk Order Banyak via Kargo"];

    default:
      return 0;
  }
};

// Mock fallback data
const MOCK_PRODUCT_DATA = {
  shipped: "Jakarta",
  variations: ["Frame Kaca", "Frame Acrylic"],
  details: {
    "Greeting card": "Artcarton 310gr 1 side 10x15cm",
    "Black Envelope": "Aster black 150gsm A6 11x16,2cm",
    "Frame material": "Wood, Glass, back side MDF 2-3mm",
    "Overall frame size": "Â±35x45x4cm",
    "Depth": "Â± 2.5-3cm",
    "Frame Color": "White",
    Packing: "Black Hardbox+Paperbag",
  },
  additionalProducts: [
    {
      id: "add1",
      name: "Additional Faces",
      price: getAdditionalPrice("Additional Faces"),
      imageUrl: "https://i.ibb.co/6yFbq5Y/original-palette.jpg",
      attributes: { isFace: true },
    },
    {
      id: "add2",
      name: "Background Custom",
      price: 62800,
      imageUrl: new URL(
        "../assets/bg-catalog/goverment-police/KA-MAY23-01.jpg",
        import.meta.url
      ).href,
      attributes: { isBackground: true },
    },
    {
      id: "add3",
      name: "Additional Packing",
      price: 52800,
      imageUrl: new URL(
        "../assets/list-products/3D/A0-80X110CM/PACKING AIR COLUMN BAGS.jpg",
        import.meta.url
      ).href,
    },
  ],
};

const ProductDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useOutletContext<LayoutContext>();

  const { imageUrl, name, category, size, type, price, allImages } =
    (location.state as any) || {};

  // 🧩 State utama
  const [includePacking, setIncludePacking] = useState(false);
  const [selectedAdditionalFaceOption, setSelectedAdditionalFaceOption] = useState<"1-9" | "10+" | null>(null);
  const additionalSectionRef = useRef<HTMLDivElement | null>(null);
  const [selectedVariation, setSelectedVariation] = useState(
    MOCK_PRODUCT_DATA.variations[0]
  );
  const [quantity, setQuantity] = useState<number | "">(1);
  const [faces] = useState<number | "">(1);
  const [background, setBackground] = useState<"Default" | "Custom">("Default");
  const [selectedImage, setSelectedImage] = useState(
    imageUrl || "https://i.ibb.co/z5pYtWj/1000273753.jpg"
  );
  const [selectedProductVariation, setSelectedProductVariation] =
    useState<string>("");
  const [displayedPrice, setDisplayedPrice] = useState<number>(price || getPrice(category, name) || 0);
  const [selectedShading, setSelectedShading] = useState<string>("");
  const [selectedSizeFrame, setSelectedSizeFrame] = useState<string>("");
  // Untuk "Biaya Tambahan Wajah Banyak (Design dari Customer)"
const [selectedFaceOptionCustom, setSelectedFaceOptionCustom] = useState<string>("");
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(
    null
  );
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedExpressOption, setSelectedExpressOption] = useState<string>("");
  const [selectedAcrylicOption, setSelectedAcrylicOption] = useState<string>("");

// ======== AUTO LOAD VARIATION IMAGES ========

// Frame size images
const frameSizeImages = import.meta.glob("../assets/list-products/2D/variation/frame/**/*.{jpg,png,JPG,jpeg,webp}", {
  eager: true,
  as: "url",
});

// Shading images (nested folder)
const shadingImages = import.meta.glob("../assets/list-products/2D/variation/shading/**/*.{jpg,png,JPG,jpeg,webp}", {
  eager: true,
  as: "url",
});

// Group berdasarkan nama folder (misal: "4R", "6R", dst)
const frameGroups: Record<string, string[]> = {};

Object.entries(frameSizeImages).forEach(([path, url]) => {
  const parts = path.split("/");
  const folderName = parts[parts.length - 2]; // "4R", "6R", dll
  if (!frameGroups[folderName]) frameGroups[folderName] = [];
  frameGroups[folderName].push(url as string);
});

// Convert ke format UI
const frameSizeOptions = Object.entries(frameGroups).map(([folder, urls]) => ({
  value: folder,
  label: folder.toUpperCase(),
  image: urls[0], // tampilkan gambar pertama sebagai thumbnail
  allImages: urls, // simpan semua gambar untuk preview
}));

// Urutkan frame size sesuai urutan prioritas tertentu
const sizeOrder = ["4R", "6R", "8R", "12R", "15CM"];

frameSizeOptions.sort((a, b) => {
  const aIndex = sizeOrder.findIndex((s) => a.value.toUpperCase().includes(s));
  const bIndex = sizeOrder.findIndex((s) => b.value.toUpperCase().includes(s));

  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex; // dua-duanya ada di daftar
  if (aIndex !== -1) return -1; // a ada di daftar, b tidak
  if (bIndex !== -1) return 1; // b ada di daftar, a tidak
  return a.value.localeCompare(b.value, "en", { numeric: true }); // fallback urut alfabet
});

// Group shading berdasarkan nama folder utama (misal: "2D BOLD SHADING")
const shadingGroups: Record<string, { value: string; label: string; preview: string }> = {};

Object.entries(shadingImages).forEach(([path, url]) => {
  const parts = path.split("/");
  const folderName = parts[parts.length - 2]; // misalnya "2D BOLD SHADING"
  if (!shadingGroups[folderName]) {
    shadingGroups[folderName] = {
      value: folderName,
      label: folderName.replace(/^2D\s+/i, ""), // hilangkan prefix "2D"
      preview: url as string,
    };
  }
});

const shadingOptions = Object.values(shadingGroups);
// console.log("✅ frameSizeImages keys:", Object.keys(frameSizeImages));
// console.log("✅ shadingImages keys:", Object.keys(shadingImages));
// console.log("🧩 frameSizeOptions:", frameSizeOptions);
// console.log("🎨 shadingOptions:", shadingOptions);

  // Product data
const product = {
  id: id,
  name: name || "Default Product Name",
  imageUrl: imageUrl || "https://i.ibb.co/z5pYtWj/1000273753.jpg",
  category: category || "2D Frame", // sementara 2D
  size: size || "",
  type: type || "",
  price: price || getPrice(category, name) || 0,
  allImages: allImages || [],
  shadingOptions,
  sizeFrameOptions: frameSizeOptions,
  ...MOCK_PRODUCT_DATA,
};

  // ðŸ”¹ LOGIC DARI KODE ANDA - Auto Size & Packaging Detection
  const categoryOptions = productOptions[product.category as keyof typeof productOptions];

  // Tentukan default size berdasarkan folder/subcategory
  const defaultSize =
    categoryOptions?.sizes?.find((s) => s.label.toUpperCase().startsWith(product.name.toUpperCase()))
      ?.label || product.size || "Custom";

  // Ambil special variations jika ada
  const normalizedSizeKey = Object.keys(categoryOptions?.specialCases || {}).find((key) =>
    key.toLowerCase().includes(product.name.toLowerCase())
  );

  const specialVariations =
    product.category === "3D Frame" && normalizedSizeKey
      ? categoryOptions?.specialCases?.[normalizedSizeKey] || []
      : [];
      


// useEffect Utama

  // ðŸ”¹ Auto-select packaging option pertama jika available
  useEffect(() => {
    if (specialVariations.length > 0 && !selectedProductVariation) {
      setSelectedProductVariation(specialVariations[0].value);
    }
  }, [specialVariations, selectedProductVariation]);
  
  // 🆕 Update harga otomatis saat packaging 3D 8R diganti
  useEffect(() => {
    const categoryKey = "3D frame";
    const nameKey = product.name?.toLowerCase() || "";
    const isAcrylicAdditional =
      product.name?.toLowerCase().includes("biaya tambahan ganti frame kaca ke acrylic");
  
    // 🧱 Proteksi kuat: kalau produk ini adalah "Additional Custom BIAYA TAMBAHAN GANTI FRAME KACA KE ACRYLIC"
    if (isAcrylicAdditional) {
      if (selectedSizeFrame) {
        const acrylicPrice =
          priceList.Additional[`Biaya Tambahan Ganti Frame Kaca ke Acrylic ${selectedSizeFrame}`] ||
          priceList.Additional["Biaya Tambahan Ganti Frame Kaca ke Acrylic"] ||
          0;
  
        // ✅ Set harga acrylic murni (bukan tambah)
        setDisplayedPrice(acrylicPrice);
      } else {
        // ✅ Jika belum pilih ukuran — kembalikan ke harga base-nya
        setDisplayedPrice(product.price);
      }
  
      // 🚫 Jangan lanjut ke bawah, cegah efek 3D/variation menimpa harga
      return;
    }
  
    // 🧩 Efek khusus untuk produk kategori 3D Frame 8R (Packaging Options)
    if (product.category?.toLowerCase().includes("3d") && nameKey.includes("8r")) {
      let normalized = selectedProductVariation?.toLowerCase() || "";
      normalized = normalized
        .replace(/\s+/g, "")
        .replace(/_/g, "")
        .replace(/\+/g, "");
  
      let priceKey: string | null = null;
  
      if (normalized.includes("duskraft")) {
        priceKey = "8R duskraft";
      } else if (normalized.includes("hardbox")) {
        priceKey = "8R hardbox";
      }
  
      if (priceKey && priceList[categoryKey]?.[priceKey]) {
        setDisplayedPrice(priceList[categoryKey][priceKey]);
      } else {
        setDisplayedPrice(product.price);
      }
  
      return; // ✅ Cegah lanjut ke logika bawah
    }
  
    // 🧩 Untuk 2D / produk umum — kontrol normal
    if (
      selectedVariation === "Frame Kaca" ||
      (!selectedSizeFrame && selectedVariation !== "Frame Acrylic")
    ) {
      // Reset ke base price jika Frame Kaca atau belum pilih ukuran
      setDisplayedPrice(product.price);
    } else if (selectedVariation === "Frame Acrylic" && selectedSizeFrame) {
      // Frame Acrylic: gunakan harga acrylic (bukan tambah)
      const acrylicPrice =
        priceList.Additional[`Biaya Tambahan Ganti Frame Kaca ke Acrylic ${selectedSizeFrame}`] || 0;
      setDisplayedPrice(acrylicPrice);
    }
  }, [selectedProductVariation, product, selectedSizeFrame, selectedVariation]);
  
  // 🧠 Update harga otomatis untuk "Biaya Tambahan Wajah Banyak (Design dari Customer)"
  useEffect(() => {
    const isManyFaceProduct = product.name
      ?.toLowerCase()
      .includes("biaya tambahan wajah banyak (design dari customer)");
  
    if (!isManyFaceProduct) return;
  
    if (selectedFaceOptionCustom === "1–9 Wajah") {
      setDisplayedPrice(
        priceList.Additional["Biaya Tambahan Wajah Banyak 1-9 wajah"] || product.price
      );
    } else if (selectedFaceOptionCustom === "Di atas 10 Wajah") {
      setDisplayedPrice(
        priceList.Additional["Biaya Tambahan Wajah Banyak diatas 10 wajah"] || product.price
      );
    } else {
      setDisplayedPrice(product.price);
    }
  }, [selectedFaceOptionCustom, product]);
  
  // 🧠 Update harga otomatis untuk "Biaya Ekspress General"
useEffect(() => {
  const isExpressProduct = product.name
    ?.toLowerCase()
    .includes("biaya ekspress general");

  if (!isExpressProduct) return;

  if (selectedExpressOption === "Option 1") {
    setDisplayedPrice(priceList.Additional["Biaya Ekspress General"] || product.price);
  } else if (selectedExpressOption === "Option 2") {
    setDisplayedPrice(priceList.Additional["Biaya Ekspress General 2"] || product.price);
  } else if (selectedExpressOption === "Option 3") {
    setDisplayedPrice(priceList.Additional["Biaya Ekspress General 3"] || product.price);
  } else {
    setDisplayedPrice(product.price);
  }
}, [selectedExpressOption, product]);
  
  // 🖼️ Update harga otomatis untuk produk kategori 2D Frame
  useEffect(() => {
    const is2DFrame = product.category?.toLowerCase().includes("2d");
    if (!is2DFrame) return;
  
    if (selectedSizeFrame && selectedShading) {
      const size = selectedSizeFrame.toLowerCase();
  
      // 🧠 Normalisasi shading agar cocok
      const shadingRaw = selectedShading.toLowerCase().replace(/^2d\s+/i, "").trim();
  
      const shadingMap: Record<string, string> = {
        "simple shading": "simple shading",
        "background catalog": "background catalog",
        "bold shading": "bold shading",
        "by ai": "ai",
        "ai": "ai",
      };
  
      const shadingKey =
        shadingMap[shadingRaw] ||
        shadingMap[shadingRaw.replace("shading", "").trim()] ||
        "simple shading";
  
      const key = `${size} ${shadingKey}`; // contoh: "6r ai"
  
      // 🧩 Buat versi lowercase dari semua key di priceList["2D frame"]
      const twoDFramePriceList = Object.fromEntries(
        Object.entries(priceList["2D frame"]).map(([k, v]) => [k.toLowerCase(), v])
      );
  
      const twoDPrice =
        twoDFramePriceList[key] ||
        twoDFramePriceList[`${size} simple shading`] ||
        product.price;
  
      // console.log("🎨 Checking 2D price key:", key, "→", twoDFramePriceList[key]);
  
      setDisplayedPrice(twoDPrice);
    } else if (selectedSizeFrame && !selectedShading) {
      const key = `${selectedSizeFrame.toLowerCase()} simple shading`;
  
      const twoDFramePriceList = Object.fromEntries(
        Object.entries(priceList["2D frame"]).map(([k, v]) => [k.toLowerCase(), v])
      );
  
      const twoDPrice = twoDFramePriceList[key] || product.price;
      setDisplayedPrice(twoDPrice);
    } else {
      setDisplayedPrice(product.price);
    }
  }, [selectedSizeFrame, selectedShading, product]);
  
  // 🧠 Auto-select "Simple Shading" by default untuk produk 2D Frame
  useEffect(() => {
    if (product.category?.toLowerCase().includes("2d") && !selectedShading) {
      // cari shading dengan nama "Simple Shading"
      const simpleOption = product.shadingOptions.find((opt) =>
        opt.label.toLowerCase().includes("simple shading")
      );
  
      if (simpleOption) {
        setSelectedShading(simpleOption.value);
      }
    }
  }, [product, selectedShading]);
  
// 🧠 Update harga otomatis untuk Acrylic Stand 3mm
useEffect(() => {
  const name = product.name?.toLowerCase() || "";
  const category = product.category?.toLowerCase() || "";

  // Pastikan ini produk acrylic 3mm
  const isAcrylic3mm =
    category.includes("acrylic") && name.includes("3mm");

  if (!isAcrylic3mm) return;

  // Ambil daftar harga dari kategori Acrylic Stand
  const acrylicPriceList = priceList["Acrylic Stand"] || {};

  let newPrice = product.price;

  if (selectedAcrylicOption === "15x15cm 1 sisi") {
    newPrice =
      acrylicPriceList["Acrylic Stand 3mm size 15x15cm 1 sisi"] ||
      product.price;
  } else if (selectedAcrylicOption === "A4 2 sisi") {
    newPrice =
      acrylicPriceList["Acrylic Stand 3mm size A4 2 sisi"] ||
      product.price;
  } else if (selectedAcrylicOption === "A3 2 sisi") {
    newPrice =
      acrylicPriceList["Acrylic Stand 3mm size A3 2 sisi"] ||
      product.price;
  }

  setDisplayedPrice(newPrice);
}, [selectedAcrylicOption, product]);



const handleAddToCart = () => {
  const finalQty = quantity === "" ? 1 : quantity;

  const faceCountLabel =
    selectedAdditionalFaceOption === "1-9"
      ? "1–9 wajah"
      : selectedAdditionalFaceOption === "10+"
      ? "Di atas 10 wajah"
      : "";

  addToCart({
    id: product.id || "p1",
    name: product.category, // cukup category (nama lengkap nanti dirakit di CartContext)
    price: displayedPrice,
    quantity: finalQty,
    imageUrl: product.imageUrl,
    variation: selectedVariation,
    productType: "frame",
    attributes: {
      faceCount: faceCountLabel,
      backgroundType: background === "Custom" ? "BG Custom" : "BG Default",
      includePacking,
      frameSize: selectedSizeFrame,        // 🆕 kirim frame size
      shadingStyle: selectedShading,       // 🆕 kirim shading style
    },
  });
};

  // console.log("DEBUG PRODUCT:", {
  //   category: product.category,
  //   size: defaultSize,
  //   specialVariations,
  // });
  
const [variationImages, setVariationImages] = useState<string[]>([]);


// tambahkan kedua baris ini:
const [showPreview, setShowPreview] = useState<boolean>(false);
const previewRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-[14px] font-poppinsSemiBold mb-6">
          <Link to="/" className="hover:underline">
            Little Amora
          </Link>{" "}
          &gt;
          <Link to="/products" className="mx-1">
              {t("product.breadcrumbProducts")}
          </Link>{" "}
          &gt;
          <span
            className="mx-1 cursor-pointer"
            onClick={() => {
              if (product.category.toLowerCase().includes("3d")) {
                // Hanya kalau kategori 3D, baru filter
                navigate(`/products?category=${encodeURIComponent(product.category)}`);
              } else {
                // Kalau kategori lain (misal 2D), cuma pindah tanpa filter
                navigate("/products");
              }
            }}
          >
            {product.category} &gt;
          </span>
          
          <span className="mx-1">{product.name}</span>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
{/* === Gallery Utama === */}
{/* === Gallery Utama === */}
<div>
  {selectedImage.endsWith(".mp4") || selectedImage.endsWith(".webm") ? (
    <video
      src={selectedImage}
      controls
      className="w-full h-auto rounded-lg border border-gray-200 mb-4"
    />
  ) : (
    <img
      src={selectedImage}
      alt={product.name}
      className="w-full h-auto object-cover rounded-lg border border-gray-200 mb-4"
    />
  )}

  {/* Thumbnail utama */}
  {product.allImages.length > 1 && (
    <div className="relative mt-4">
      <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-600 rounded-full shadow p-2">
        <FaChevronLeft size={18} />
      </button>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        slidesPerView={4}
        spaceBetween={10}
        grabCursor={true}
        className="!px-8"
        breakpoints={{
          0: { slidesPerView: 3 },
          640: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
      >
        {product.allImages.map((media: string, idx: number) => {
          const isVideo =
            media.endsWith(".mp4") ||
            media.endsWith(".webm") ||
            media.endsWith(".mov");

          return (
            <SwiperSlide key={idx}>
              {isVideo ? (
                <video
                  src={media}
                  muted
                  playsInline
                  onClick={() => setSelectedImage(media)}
                  className={`w-full h-24 object-cover rounded-md border-2 cursor-pointer transition-all duration-200 ${
                    selectedImage === media
                      ? "border-pink-500 scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                />
              ) : (
                <img
                  src={media}
                  alt={`${product.name} ${idx + 1}`}
                  onClick={() => setSelectedImage(media)}
                  className={`w-full h-24 object-cover rounded-md border-2 cursor-pointer transition-all duration-200 ${
                    selectedImage === media
                      ? "border-pink-500 scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-600 rounded-full shadow p-2">
        <FaChevronRight size={18} />
      </button>
    </div>
  )}

{/* 🆕 PREVIEW FRAME SIZE - Langsung di bawah thumbnail scroll */}
{variationImages.length > 0 && (
  <div
    ref={previewRef}
    className="mt-8"
    style={{
      opacity: showPreview ? 1 : 0,
      transform: showPreview ? "translateY(0)" : "translateY(-10px)",
      transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
    }}
  >
    <h3 className="text-[18px] font-poppinsSemiBold mb-4">
        {t("product.preview")} {selectedSizeFrame}
    </h3>

    {/* 🖼️ Gambar besar preview */}
{selectedPreviewImage && (
  <img
    src={selectedPreviewImage}
    alt={`Preview ${selectedSizeFrame}`}
    onClick={() => setIsZoomOpen(true)} // 🟢 buka zoom modal
    className="w-full h-auto object-contain rounded-lg border border-gray-300 mb-4 transition-all duration-300 cursor-zoom-in hover:scale-[1.02]"
  />
)}

    {/* Grid thumbnail kecil */}
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
      {variationImages.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`${selectedSizeFrame} ${i + 1}`}
          onClick={() => setSelectedPreviewImage(img)} // 🟢 klik ubah preview besar
          className={`w-full aspect-square object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            selectedPreviewImage === img
              ? "border-blue-500 scale-105"
              : "border-gray-200 hover:border-blue-400 hover:shadow-lg"
          }`}
        />
      ))}
    </div>
  </div>
)}
</div>

{/* 🖼️ Fullscreen Zoom Modal */}
{isZoomOpen && selectedPreviewImage && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] animate-fadeIn"
    onClick={() => setIsZoomOpen(false)} // klik luar = tutup
  >
    {/* Tombol Close */}
    <button
      onClick={(e) => {
        e.stopPropagation(); // biar gak tutup pas klik tombol
        setIsZoomOpen(false);
      }}
      className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-gray-300 transition"
    >
      ✕
    </button>

    {/* Gambar besar zoom */}
    <img
      src={selectedPreviewImage}
      alt="Zoomed preview"
      className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-lg border border-gray-400 cursor-zoom-out transition-transform duration-300"
      onClick={(e) => e.stopPropagation()} // klik gambar gak nutup
    />
  </div>
)}

{/* Right: Info */}
<div className="flex flex-col">
  <h1 className="text-[25px] font-poppinsMedium">
    {[product.category, defaultSize, product.type, product.name]
      .filter(Boolean)
      .join(" ")}
  </h1>

  {/* ⭐ Best Selling label */}
  {(() => {
    const category = product.category?.toLowerCase() || "";
    const name = product.name?.toLowerCase() || "";

    // ✅ 3D Frame 12R → Best Selling for The Most Fitting Size
    if (category.includes("3d") && /\b12r\b/.test(name)) {
      return (
        <div className="flex items-center space-x-2 text-yellow-600 px-3 py-1 rounded-full text-[15px] font-poppinsMediumItalic w-fit">
          <FaStar />
          <span>{t("product.bestSellingSize")}</span>
        </div>
      );
    }

    // ✅ Semua produk 2D Frame → Best Selling for The Most Affordable Gift
    if (category.includes("2d")) {
      return (
        <div className="flex items-center space-x-2 text-yellow-600 px-3 py-1 rounded-full text-[15px] font-poppinsMediumItalic w-fit">
          <FaStar />
          <span>{t("product.bestSellingGift")}</span>
        </div>
      );
    }

    // 🚫 Produk lain (3D selain 12R, Acrylic, Softcopy, dst) → tidak tampil
    return null;
  })()}

<p className="text-[30px] font-poppinsMedium text-red-600">
  Rp {displayedPrice.toLocaleString("id-ID")}
</p>
            {/* SPECIAL VARIATIONS - Packaging Options */}
            {specialVariations.length > 0 && (
  <div className="mt-6 mb-4">
    <label className="block text-[18px] font-poppinsSemiBold mb-3">
        {t("product.packagingOption")}
    </label>
    <div className="flex gap-4 flex-wrap">
      {specialVariations.map((opt) => (
        <div
          key={opt.value}
          onClick={() => setSelectedProductVariation(opt.value)}
          className={`cursor-pointer border rounded-xl flex flex-col items-center justify-center gap-2 p-3 w-36 h-36 transition-all duration-150 ${
            selectedProductVariation === opt.value
              ? "border-2 border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:shadow-sm"
          }`}
        >
          <img
            src={getPackagingImage(
              opt.value === "dus_kraft_paperbag"
                ? "PACKING DUS KRAFT.jpg"
                : "PACKING HARDBOX.jpg"
            )}
            alt={opt.label}
            className="w-20 h-20 object-cover rounded-xl"
          />
          <span className="text-base font-medium text-gray-800 text-center">
            {opt.label}
          </span>
        </div>
      ))}
    </div>
  </div>
)}
          
{/* 🔹 2D FRAME - Shading & Frame Size Options */}
{product.category === "2D Frame" && (
  <>
    {/* Frame Size Options */}
    {product.sizeFrameOptions.length > 0 && (
      <div className="mt-6 mb-4">
        <label className="block text-[18px] font-poppinsSemiBold mb-3">
         {t("product.frameSize")}
        </label>
        <div className="flex gap-4 flex-wrap">
          {product.sizeFrameOptions.map((opt) => (
            <div
              key={opt.value}
onClick={() => {
  setSelectedSizeFrame(opt.value);
  if (opt.allImages?.length > 0) {
    setVariationImages(opt.allImages);
    setSelectedPreviewImage(opt.allImages[0]); // 🆕 otomatis tampilkan gambar pertama
    setShowPreview(false);
    setTimeout(() => setShowPreview(true), 50);
  } else {
    setVariationImages([]);
    setSelectedPreviewImage(null); // 🧹 reset preview
    setShowPreview(false);
  }
}}
              className={`cursor-pointer border rounded-xl flex flex-col items-center justify-center gap-2 p-3 w-36 h-36 transition-all duration-150 ${
                selectedSizeFrame === opt.value
                  ? "border-2 border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:shadow-sm"
              }`}
            >
              <img
                src={opt.image}
                alt={opt.label}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <span className="text-base font-medium text-gray-800 text-center">
                {opt.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Shading Options */}
    {product.shadingOptions.length > 0 && (
      <div className="mt-6 mb-4">
        <label className="block text-[18px] font-poppinsSemiBold mb-3">
        {t("product.shadingStyle")}
        </label>
        <div className="flex gap-4 flex-wrap">
          {product.shadingOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => setSelectedShading(opt.value)}
              className={`cursor-pointer border rounded-xl flex flex-col items-center justify-center gap-2 p-3 w-36 h-36 transition-all duration-150 ${
                selectedShading === opt.value
                  ? "border-2 border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:shadow-sm"
              }`}
            >
              {opt.preview && (
                <img
                  src={opt.preview}
                  alt={opt.label}
                  className="w-20 h-20 object-cover rounded-xl"
                />
              )}
              <span className="text-base font-medium text-gray-800 text-center">
                {opt.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </>
)}

{/* Variation — tampil hanya jika bukan Additional atau Softcopy Design */}
{!["Additional", "Softcopy Design"].includes(product.category) && (
  <div className="flex items-start justify-between mt-4">
    <label className="block text-[18px] font-poppinsSemiBold translate-y-3">
        {t("product.variation")}
    </label>
    <div className="flex flex-row flex-wrap gap-2 -translate-x-[25px] translate-y-2 font-poppinsRegular">
      {product.variations.map((variation) => (
        <button
          key={variation}
          onClick={() => setSelectedVariation(variation)}
          className={`px-6 py-2 border rounded-md text-sm transition-colors ${
            selectedVariation === variation
              ? "bg-[#dcbec1] border-[#bfa4a6]"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
          }`}
        >
          {variation}
        </button>
      ))}
    </div>
  </div>
)}
            
{/* 🧩 Additional Custom - Biaya Tambahan Ganti Frame Kaca ke Acrylic */}
{product.name?.toLowerCase().includes("biaya tambahan ganti frame kaca ke acrylic") && (
  <div className="mt-6 mb-4">
    <p className="text-[15px] font-poppinsRegular text-gray-700 mb-3">
        {t("product.chooseAcrylicSize")}
    </p>

    <div className="flex gap-4 flex-wrap">
      {["A2", "A1", "A0"].map((size) => {
        const acrylicPrice =
          priceList.Additional[`Biaya Tambahan Ganti Frame Kaca ke Acrylic ${size}`] ||
          priceList.Additional["Biaya Tambahan Ganti Frame Kaca ke Acrylic"] ||
          0;

        return (
          <div
            key={size}
            onClick={() => {
              // console.log("🖱️ Clicked size:", size);

              setSelectedSizeFrame((prev) => {
                const isSame = prev === size;
                // kalau klik ulang ukuran sama → reset ke harga default
                const newPrice = isSame ? product.price : product.price + acrylicPrice;
                setDisplayedPrice(newPrice);
                // console.log("✅ displayedPrice changed to:", newPrice);
                return isSame ? "" : size;
              });
            }}
            className={`cursor-pointer border rounded-xl flex flex-col items-center justify-center gap-2 p-3 w-36 h-36 transition-all duration-150 ${
              selectedSizeFrame === size
                ? "border-2 border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:shadow-sm"
            }`}
          >
            <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-xl">
              <span className="text-4xl font-bold text-gray-400">{size}</span>
            </div>
            <span className="text-base font-medium text-gray-800 text-center">{size}</span>
          </div>
        );
      })}
    </div>
  </div>
)}

{/* 🧩 Additional Custom - Biaya Tambahan Wajah Banyak (Design dari Customer) */}
{product.name
  ?.toLowerCase()
  .includes("biaya tambahan wajah banyak (design dari customer)") && (
  <div className="mt-6 mb-4">
    <label className="block text-[18px] font-poppinsSemiBold mb-3">
        {t("product.additionalCustomManyFaces")}
    </label>

    <p className="text-[15px] font-poppinsRegular text-gray-700 mb-3">
        {t("product.chooseFaceCount")}
    </p>

    <div className="flex gap-4 flex-wrap">
      {["1–9 Wajah", "Di atas 10 Wajah"].map((option) => (
        <div
          key={option}
          onClick={() =>
            setSelectedFaceOptionCustom((prev) =>
              prev === option ? "" : option
            )
          }
          className={`cursor-pointer border rounded-xl flex flex-col items-center justify-center gap-2 p-3 w-36 h-36 transition-all duration-150 ${
            selectedFaceOptionCustom === option
              ? "border-2 border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:shadow-sm"
          }`}
        >
          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-xl">
            <span className="text-lg font-semibold text-gray-800 text-center leading-tight">
              {option}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{/* 🧩 Additional Custom - Biaya Ekspress General */}
{product.name?.toLowerCase().includes("biaya ekspress general") && (
  <div className="mt-6 mb-4">
    <label className="block text-[18px] font-poppinsSemiBold mb-3">
        {t("product.additionalCustomExpress")}
    </label>

    <p className="text-[15px] font-poppinsRegular text-gray-700 mb-3">
        {t("product.chooseExpress")}
    </p>

    <div className="flex gap-4 flex-wrap">
      {[
        { label: "Option 1", price: priceList.Additional["Biaya Ekspress General"] },
        { label: "Option 2", price: priceList.Additional["Biaya Ekspress General 2"] },
        { label: "Option 3", price: priceList.Additional["Biaya Ekspress General 3"] },
      ].map((option) => (
        <div
          key={option.label}
          onClick={() =>
            setSelectedExpressOption((prev) =>
              prev === option.label ? "" : option.label
            )
          }
          className={`cursor-pointer border rounded-xl flex flex-col items-center justify-center gap-2 p-3 w-36 h-36 transition-all duration-150 ${
            selectedExpressOption === option.label
              ? "border-2 border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:shadow-sm"
          }`}
        >
          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-xl">
            <span className="text-[15px] font-semibold text-gray-800 text-center leading-tight">
              {option.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{/* 🧩 Acrylic Stand 3mm Options */}
{product.name?.toLowerCase().includes("acrylic stand 3mm") && (
  <div className="mt-6 mb-4">
    <label className="block text-[18px] font-poppinsSemiBold mb-3">
        {t("product.chooseSizeAndSides")}
    </label>

    <div className="flex gap-4 flex-wrap">
      {[
        { label: "15x15cm 1 sisi", key: "15x15cm 1 sisi" },
        { label: "A4 2 sisi", key: "A4 2 sisi" },
        { label: "A3 2 sisi", key: "A3 2 sisi" },
      ].map((option) => (
        <div
          key={option.key}
          onClick={() =>
            setSelectedAcrylicOption((prev) =>
              prev === option.key ? "" : option.key
            )
          }
          className={`cursor-pointer border rounded-xl flex flex-col items-center justify-center gap-2 p-3 w-36 h-36 transition-all duration-150 ${
            selectedAcrylicOption === option.key
              ? "border-2 border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:shadow-sm"
          }`}
        >
          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-xl">
            <span className="text-[15px] font-semibold text-gray-800 text-center leading-tight">
              {option.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
            {/* Quantity */}
            <div className="flex items-center justify-between mt-10">
              <label className="text-[18px] font-poppinsSemiBold">
                {t("product.quantity")}
              </label>
              <div className="flex items-center -translate-x-[160px] font-poppinsRegular border border-gray-300 rounded-md w-fit">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) => Math.max(1, Number(prev) - 1))
                  }
                  className="px-4 py-2 text-lg font-bold text-gray-700 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuantity(val === "" ? "" : Math.max(1, Number(val)));
                  }}
                  className="w-16 text-center font-poppinsRegular border-x border-gray-300 focus:outline-none pl-[15px]"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Number(prev) + 1)}
                  className="px-4 py-2 text-lg font-bold text-gray-700 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons + Info Price */}
            <div className="flex flex-col pt-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    const category = product.category?.toLowerCase() || "";
                
                    // Kalau produk Additional atau Softcopy → langsung Add to Cart
                    if (category.includes("additional") || category.includes("softcopy")) {
                      handleAddToCart();
                      return;
                    }
                
                    // Kalau produk utama (2D atau 3D) → scroll halus ke bawah
                    additionalSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="flex-1 px-6 py-3 border bg-[#dcbec1] font-bold rounded-lg hover:bg-[#c7a9ac] transition-colors"
                >
                    {t("product.addToCart")}
                </button>
                <button
                  className="flex-1 px-6 py-3 bg-[#E2DAD8] font-bold rounded-lg hover:bg-[#D3C7C4] transition-colors"
                >
                    {t("product.buyNow")}
                </button>
              </div>
            
              {/* Info Price */}
              <p className="mt-[17%] text-[16px] font-poppinsSemiBoldItalic text-black">
                • {t("product.priceInfo")}
              </p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-16 pt-10">
          <h2 className="text-[24px] font-poppinsSemiBold mb-4">
              {t("product.details")}
          </h2>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-[15px]">
            {Object.entries(product.details).map(([key, value]) => (
              <React.Fragment key={key}>
                <span className="font-poppinsSemiBold">{key}</span>
                <span className="font-poppinsRegular font-bold">: {value}</span>
              </React.Fragment>
            ))}
          </div>
          <p className="font-poppinsRegular mt-6">
            {t("product.packingInfo")}
            <br />
            <br />
          </p>
        </div>

{/* 🧩 Additional Products — tampil hanya jika bukan Softcopy atau Additional */}
{!["Additional", "Softcopy Design"].includes(product.category) && (
  <div ref={additionalSectionRef}>
    <h2 className="text-xl font-bold font-poppinsRegular mb-6">
        {t("product.additionalProducts")}
    </h2>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {product.additionalProducts.map((item) => {
        const isFaceProduct = item.name.toLowerCase().includes("faces");
        const isPackingProduct = item.name.toLowerCase().includes("packing");
        const [selectedFaceOption, setSelectedFaceOption] =
          useState<"1-9" | "10+" | null>(null);
        const [showPopup, setShowPopup] = useState(false);
        const [isSelected, setIsSelected] = useState(false);

        // Harga default & aktif
        const baseFacePrice =
          priceList.Additional["Tambahan Wajah Karikatur 1-9 wajah"] || 0;
        const activeFacePrice =
          selectedFaceOption === "10+"
            ? priceList.Additional["Tambahan Wajah Karikatur diatas 10 wajah"]
            : baseFacePrice;

        return (
          <div key={item.id} className="relative">
            {/* ✅ Centang kalau dipilih */}
            {isSelected && (
              <div className="absolute top-2 right-2 z-10">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#dcbec1] flex-shrink-0">
                  <Check size={16} className="text-black" strokeWidth={3} />
                </div>
              </div>
            )}

            {/* 🖼️ CARD */}
            <div
              onClick={() => {
                if (isFaceProduct) {
                  setShowPopup(true);
                  return;
                }

                if (item.attributes?.isBackground) {
                  setBackground((prev) =>
                    prev === "Custom" ? "Default" : "Custom"
                  );
                  setIsSelected((prev) => !prev);
                  return;
                }

                if (isPackingProduct) {
                  setIncludePacking((prev) => !prev);
                  setIsSelected((prev) => !prev);
                  return;
                }

                setIsSelected((prev) => !prev);
              }}
              className={`border rounded-xl overflow-hidden text-center hover:shadow-md transition-all bg-white cursor-pointer flex flex-col items-center justify-between ${
                isSelected ? "ring-2 ring-[#dcbec1]" : ""
              } w-full h-[360px]`}
            >
              <div className="relative w-full aspect-square overflow-hidden">
                <img
                  src={
                    item.name.toLowerCase().includes("faces")
                      ? new URL(
                          "../assets/list-products/ADDITIONAL/BIAYA TAMBAHAN WAJAH KARIKATUR/TAMBAHAN WAJAH 1.jpg",
                          import.meta.url
                        ).href
                      : item.imageUrl
                  }
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                />
              </div>

              {/* 🧩 Info Produk */}
              <div className="p-3 flex flex-col flex-grow justify-between">
                <h3 className="text-sm font-semibold text-gray-700 line-clamp-2">
                  {item.name}
                </h3>

                {isFaceProduct ? (
                  <>
                    {selectedFaceOption ? (
                      <p className="text-xs font-poppinsMedium text-pink-600 mt-1">
                          {t("product.selected")}{" "}
                        {selectedFaceOption === "1-9"
                          ? "1–9 wajah"
                          : "Di atas 10 wajah"}
                      </p>
                    ) : (
                      <p className="text-xs font-poppinsRegular text-gray-500 mt-1 italic">
                          {t("product.clickToChooseFace")}
                      </p>
                    )}

                    <p className="text-sm font-bold text-pink-600 mt-1">
                      {selectedFaceOption
                        ? `Rp ${activeFacePrice.toLocaleString("id-ID")}`
                        : `Rp ${baseFacePrice.toLocaleString(
                            "id-ID"
                          )} - Rp ${priceList.Additional[
                            "Tambahan Wajah Karikatur diatas 10 wajah"
                          ].toLocaleString("id-ID")}`}
                    </p>
                  </>
                ) : (
                <p className="text-sm font-bold text-pink-600 mt-1">
                  {typeof item.price === "string"
                    ? item.price
                    : item.price > 0
                    ? `Rp ${item.price.toLocaleString("id-ID")}`
                    : t("product.customPrice")}
                </p>
                )}
              </div>
            </div>

            {/* Pop-up pilihan wajah */}
            {showPopup && isFaceProduct && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
                <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center animate-fadeIn">
                  <h3 className="text-lg font-poppinsSemiBold mb-4">
                      {t("product.selectFaceCountPopup")}
                  </h3>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setSelectedFaceOption("1-9");
                        setSelectedAdditionalFaceOption("1-9");
                        setIsSelected(true);
                        setDisplayedPrice(
                          priceList.Additional[
                            "Tambahan Wajah Karikatur 1-9 wajah"
                          ]
                        );
                        setShowPopup(false);
                      }}
                      className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedFaceOption === "1-9"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-blue-400 text-gray-700"
                      }`}
                    >
                      1–9 Wajah — Rp{" "}
                      {priceList.Additional[
                        "Tambahan Wajah Karikatur 1-9 wajah"
                      ].toLocaleString("id-ID")}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedFaceOption("10+");
                        setSelectedAdditionalFaceOption("10+");
                        setIsSelected(true);
                        setDisplayedPrice(
                          priceList.Additional[
                            "Tambahan Wajah Karikatur diatas 10 wajah"
                          ]
                        );
                        setShowPopup(false);
                      }}
                      className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedFaceOption === "10+"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-blue-400 text-gray-700"
                      }`}
                    >
                      Di atas 10 Wajah — Rp{" "}
                      {priceList.Additional[
                        "Tambahan Wajah Karikatur diatas 10 wajah"
                      ].toLocaleString("id-ID")}
                    </button>
                  </div>

                  <button
                    onClick={() => setShowPopup(false)}
                    className="mt-5 text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                      {t("product.close")}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>

    {/* 🆕 Tombol Add to Cart Baru */}
    <div className="flex justify-center mt-8">
      <button
        onClick={() => {
          const finalQty = quantity === "" ? 1 : quantity;

          const faceCountLabel =
            selectedAdditionalFaceOption === "10+"
              ? "Di atas 10 wajah"
              : "1–9 wajah";

          const backgroundType =
            background === "Custom" ? "BG Custom" : "BG Default";

          const packingIncluded = includePacking;

          addToCart({
            id: product.id || "p1",
            name: [product.category, product.size, product.type, product.name]
              .filter(Boolean)
              .join(" "),
            price: displayedPrice,
            quantity: finalQty,
            imageUrl: product.imageUrl,
            variation: selectedVariation,
            productType: "frame",
            attributes: {
              faceCount: faceCountLabel,
              backgroundType: backgroundType,
              includePacking: packingIncluded,
              frameSize: selectedSizeFrame,
              shadingStyle: selectedShading,
            },
          });
        }}
        className="flex-1 max-w-xs px-6 py-3 border bg-[#dcbec1] font-bold rounded-lg hover:bg-[#c7a9ac] transition-colors"
      >
          {t("product.addToCart")}
      </button>
    </div>
  </div>
)}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;