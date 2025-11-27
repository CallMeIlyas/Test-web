import { useState } from "react";
import type { FC } from "react";
import html2canvas from "html2canvas";
import { createPortal } from "react-dom";

interface ProductCardProps {
  imageUrl: string;
  name: string;
}

const ProductCard: FC<ProductCardProps> = ({ imageUrl, name }) => {
  const [openModal, setOpenModal] = useState(false);

  // ✅ Fungsi screenshot
  const handleScreenshot = async () => {
    const imgElement = document.getElementById("preview-image");
    if (!imgElement) return;

    const canvas = await html2canvas(imgElement as HTMLElement, {
      backgroundColor: null,
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = `${name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <>
      {/* CARD */}
      <div
        className="group text-center bg-white p-[15px] rounded-[10px] shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-[5px] cursor-pointer"
        onClick={() => setOpenModal(true)}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-full aspect-square object-cover rounded-[8px] mb-[12px]"
        />
      </div>

      {/* ✅ MODAL PREVIEW */}
        {openModal &&
          createPortal(
            <div
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
              onClick={() => setOpenModal(false)}
            >
            <div
              className="relative animate-fadeZoomCenter max-w-[85vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Overlay tombol dan teks DI ATAS GAMBAR */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-50">
                
                {/* Nama di dalam foto */}
                <p className="bg-white/80 px-2 py-1 rounded text-black font-bold text-[16px]">
                  {name}
                </p>
            
                {/* Tombol kanan */}
                <div className="flex gap-2">
                  <button
                    onClick={handleScreenshot}
                    className="bg-white text-black px-3 py-1 rounded-md shadow text-sm"
                  >
                    Save Picture
                  </button>
                  <button
                    onClick={() => setOpenModal(false)}
                    className="bg-white text-black px-3 py-1 rounded-md shadow text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            
              <img
                id="preview-image"
                src={imageUrl}
                alt={name}
                className="block w-auto max-w-[70vw] max-h-[75vh] mx-auto rounded-lg object-contain shadow-xl"
              />
            </div>
            </div>,
            document.body
          )}
    </>
  );
};

export default ProductCard;