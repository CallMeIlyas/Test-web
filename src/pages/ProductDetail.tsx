import React, { useState, useEffect } from "react";
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

type LayoutContext = {
  searchQuery: string;
  addToCart: (item: any) => void;
};

const mediaFiles = import.meta.glob("../assets/images/**/*.{jpg,jpeg,png,webp,mp4,webm,mov}", {
  eager: true,
  as: "url",
});

const getMediaUrl = (filename: string): string => {
  const key = Object.keys(mediaFiles).find((path) => path.includes(filename));
  return key ? mediaFiles[key] : "https://via.placeholder.com/48";
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

  if (name === "Additional Faces") {
    const minPrice = additionalPrices["Tambahan Wajah Karikatur 1-9 wajah"];
    const maxPrice = additionalPrices["Tambahan Wajah Karikatur diatas 10 wajah"];
    return `Rp ${minPrice.toLocaleString("id-ID")} - Rp ${maxPrice.toLocaleString(
      "id-ID"
    )}`;
  }

  if (name === "Background Custom") {
    return additionalPrices["Background Custom"];
  }

  if (name === "Additional Packing") {
    return additionalPrices["Biaya Tambahan Packing untuk Order...."];
  }

  return 0;
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
      price: getAdditionalPrice("Background Custom"),
      imageUrl: "https://i.ibb.co/8DBVHH1/background-custom.jpg",
      attributes: { isBackground: true },
    },
    {
      id: "add3",
      name: "Additional Packing",
      price: getAdditionalPrice("Additional Packing"),
      imageUrl: "https://i.ibb.co/hZ2vXfQ/additional-packing.jpg",
      attributes: {},
    },
  ],
};

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useOutletContext<LayoutContext>();

  const { imageUrl, name, category, size, type, price, allImages } = (location.state as any) || {};

  // State untuk product variations
  const [selectedVariation, setSelectedVariation] = useState(MOCK_PRODUCT_DATA.variations[0]);
  const [quantity, setQuantity] = useState<number | "">(1);
  const [faces, setFaces] = useState<number | "">(1);
  const [background, setBackground] = useState<"Default" | "Custom">("Default");
  const [selectedImage, setSelectedImage] = useState(imageUrl || "https://i.ibb.co/z5pYtWj/1000273753.jpg");
  const [selectedProductVariation, setSelectedProductVariation] = useState<string>("");

  // Product data
  const product = {
    id: id,
    name: name || "Default Product Name",
    imageUrl: imageUrl || "https://i.ibb.co/z5pYtWj/1000273753.jpg",
    category: category || "3D Frame",
    size: size || "",
    type: type || "",
    price: price || getPrice(category, name) || 0,
    allImages: allImages || [],
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

  // ðŸ”¹ Auto-select packaging option pertama jika available
  useEffect(() => {
    if (specialVariations.length > 0 && !selectedProductVariation) {
      setSelectedProductVariation(specialVariations[0].value);
    }
  }, [specialVariations, selectedProductVariation]);

  const handleAddToCart = () => {
    const finalQty = quantity === "" ? 1 : quantity;
    const finalFaces = faces === "" ? 1 : faces;

    addToCart({
      id: product.id || "p1",
      name: [product.category, defaultSize, product.type, product.name].filter(Boolean).join(" "),
      price: product.price,
      quantity: finalQty,
      imageUrl: product.imageUrl,
      variation: selectedVariation,
      productType: "frame",
      attributes: {
        faceCount: finalFaces > 1 ? finalFaces - 1 : 0,
        backgroundType: background === "Custom" ? "BG Custom" : "BG Default",
        selectedProductVariation,
      },
    });
  };

  console.log("DEBUG PRODUCT:", {
    category: product.category,
    size: defaultSize,
    specialVariations,
  });

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
            Our Products
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
          {/* Left: Gallery */}
          <div>
            {selectedImage.endsWith(".mp4") || selectedImage.endsWith(".webm") ? (
              <video
                src={selectedImage}
                ols
                className="w-full h-auto rounded-lg border border-gray-200 mb-4"
              />
            ) : (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg border border-gray-200 mb-4"
              />
            )}

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
                    const isVideo = media.endsWith(".mp4") || media.endsWith(".webm") || media.endsWith(".mov");
                  
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
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <h1 className="text-[25px] font-poppinsMedium">
              {[product.category, defaultSize, product.type, product.name].filter(Boolean).join(" ")}
            </h1>
            <div className="flex items-center space-x-2 text-yellow-500 px-3 py-1 rounded-full text-[15px] font-poppinsMediumItalic w-fit">
              <FaStar /> <span>Best Selling for The Most Fitting Size</span>
            </div>
            <p className="text-[30px] font-poppinsMedium text-red-600">
              Rp {product.price.toLocaleString("id-ID")}
            </p>

            {/* SPECIAL VARIATIONS - Packaging Options */}
            {specialVariations.length > 0 && (
            <div className="mt-6 mb-4">
              <label className="block text-[18px] font-poppinsSemiBold mb-3">
                Packaging Option
              </label>
              <div className="flex gap-4 flex-wrap"> {/* horizontal */}
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
                      className="w-20 h-20 object-cover rounded-xl" // persegi
                    />
                    <span className="text-base font-medium text-gray-800 text-center">
                      {opt.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

            {/* Variation */}
            <div className="flex items-start justify-between mt-4">
              <label className="block text-[18px] font-poppinsSemiBold translate-y-3">
                Variation
              </label>
              <div className="flex flex-col space-y-1 -translate-x-[160px] font-poppinsRegular">
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

            {/* Quantity */}
            <div className="flex items-center justify-between mt-10">
              <label className="text-[18px] font-poppinsSemiBold">
                Quantity
              </label>
              <div className="flex items-center -translate-x-[160px] font-poppinsRegular border border-gray-300 rounded-md w-fit">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) => Math.max(1, Number(prev) - 1))
                  }
                  className="w-[36px] h-[36px] text-lg font-bold text-gray-700 hover:bg-gray-100"
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
                  className="w-16 text-center font-poppinsRegular border-x border-gray-300 focus:outline-none"
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
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-3 border bg-[#dcbec1] font-bold rounded-lg hover:bg-[#c7a9ac] transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  className="flex-1 px-6 py-3 bg-[#E2DAD8] font-bold rounded-lg hover:bg-[#D3C7C4] transition-colors"
                >
                  Buy Now
                </button>
              </div>
            
              {/* Info Price */}
              <p className="mt-[17%] text-[16px] font-poppinsSemiBoldItalic text-black">
                • All price for 1 face caricature & 1 pcs frame
              </p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-16 pt-10">
          <h2 className="text-[24px] font-poppinsSemiBold mb-4">
            Product Details:
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
            Packing bubblewrap inside and outside, generally it's safe for Instant or
            Regular Shipping, for Cargo to different island or country, please
            checkout for additional packing fee.
            <br />
            <br />
            <span className="font-bold font-poppinsRegular">
              Price for 1 pcs frame, 1 face caricature
            </span>
          </p>
        </div>

        {/* Additional Products */}
        <div className="mt-16 pt-10">
          <h2 className="text-xl font-bold font-poppinsRegular mb-6">
            Additional for this products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {product.additionalProducts.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-3 text-center hover:shadow-md transition-shadow"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
                <h3 className="text-sm font-semibold text-gray-700">
                  {item.name}
                </h3>
                <p className="text-sm font-bold text-pink-600 mt-1">
                  {typeof item.price === "string"
                    ? item.price
                    : item.price > 0
                    ? `Rp ${item.price.toLocaleString("id-ID")}`
                    : "Custom"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;