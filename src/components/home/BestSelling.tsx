import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { allProducts } from "../../data/productDataLoader";
import type { Product } from "../../data/productDataLoader";
import { useScrollFloat } from "../../utils/scrollFloat"; 

// 🖼️ Import gambar best selling
import img10R from "../../assets/karya/10R.jpg";
import img12R from "../../assets/karya/12R-6.jpg";
import imgA2 from "../../assets/karya/55x80cm.jpg";
import imgA1 from "../../assets/karya/80x110cm.jpeg";

const BestSelling = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Jalankan animasi scroll halus
  useScrollFloat(".scroll-float");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🗺️ Data best selling
  const bestSellingMap = [
    {
      displayName: "10R / A4 25x30cm",
      match: "10R",
      target3D: "10R",
      imageUrl: img10R,
    },
    {
      displayName: "12R / A3 30x40cm",
      match: "12R",
      target3D: "12R",
      imageUrl: img12R,
    },
    {
      displayName: "A2 40x55cm",
      match: "A2-40X55CM",
      target3D: "A1-55X80CM",
      imageUrl: imgA2,
    },
    {
      displayName: "A1 55x80cm",
      match: "A1-55X80CM",
      target3D: "A0-80X110CM",
      imageUrl: imgA1,
    },
  ];

  // 🎯 Ambil produk yang sesuai di allProducts (khusus kategori 3D Frame)
  const bestSellingProducts = bestSellingMap
    .map((b) => {
      const found = allProducts.find(
        (p) =>
          p.category === "3D Frame" &&
          p.name.toLowerCase().includes(b.match.toLowerCase())
      );
      return found
        ? {
            ...found,
            displayName: b.displayName,
            target3D: b.target3D,
            imageUrl: b.imageUrl,
          }
        : null;
    })
    .filter(Boolean) as (Product & {
      displayName: string;
      target3D: string;
      imageUrl: string;
    })[];

  const handleCardClick = (product: Product & { target3D: string }) => {
    const targetName = product.target3D.trim().toLowerCase();
    const targetProduct = allProducts.find(
      (p) =>
        p.category === "3D Frame" &&
        p.name.trim().toLowerCase() === targetName
    );

    if (targetProduct) {
      navigate(`/product/${targetProduct.id}`, {
        state: {
          ...targetProduct,
          specialVariations: targetProduct.specialVariations || [],
          details: targetProduct.details || {},
        },
      });
    }
  };

  return (
    <>
      <div className="relative my-10 text-center h-[1px]">
        <div className="absolute top-0 left-0 w-1/4 border-t-[5px] border-black"></div>
        <div className="absolute top-0 right-0 w-1/4 border-t-[5px] border-black"></div>
      </div>

      <section
        className={`bg-white ${isMobile ? "py-8" : "py-16"} scroll-float`}
      >
        <h2
          className={`font-nataliecaydence text-center text-black ${
            isMobile ? "text-3xl mb-6" : "text-[46px] text-4xl mb-10"
          } scroll-float`}
        >
          Best Selling Frames
        </h2>

        <div
          className={`grid ${
            isMobile
              ? "grid-cols-1 gap-4 px-4 max-w-md mx-auto"
              : "grid-cols-4 gap-5 px-10 max-w-6xl mx-auto"
          }`}
        >
          {bestSellingProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleCardClick(product)}
              className="cursor-pointer text-center bg-white p-5 rounded-xl shadow-md hover:shadow-hover hover:-translate-y-1 transform transition-all duration-500 scroll-float group"
            >
              <img
                src={product.imageUrl}
                alt={product.displayName}
                className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-110 transition-transform duration-500"
              />
              <p className="m-2.5 font-bold text-gray-600 text-base">
                {product.displayName}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default BestSelling;