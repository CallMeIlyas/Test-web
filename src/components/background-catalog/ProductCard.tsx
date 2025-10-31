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
        <p className="mt-[8px] font-bold text-[#555] text-[16px] hidden group-hover:block">
          {name}
        </p>
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
                <div className="absolute top-3 right-3 flex gap-2 z-50">
                  <button
                    onClick={handleScreenshot}
                    className="bg-white text-black px-3 py-1 rounded-md shadow hover:bg-gray-200 text-sm"
                  >
                    Save Picture
                  </button>
                  <button
                    onClick={() => setOpenModal(false)}
                    className="bg-white text-black px-3 py-1 rounded-md shadow hover:bg-gray-200 text-sm"
                  >
                    ✕
                  </button>
                </div>
        
              <img
                id="preview-image"
                src={imageUrl}
                alt={name}
                className="block w-auto max-w-[70vw] max-h-[75vh] mx-auto rounded-lg object-contain shadow-xl transition-transform duration-300 hover:scale-[1.02]"
              />
              </div>
            </div>,
            document.body
          )}
    </>
  );
};

export default ProductCard;