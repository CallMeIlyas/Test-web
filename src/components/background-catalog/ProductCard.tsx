import { useState, FC } from "react";
import html2canvas from "html2canvas";

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
      {openModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="relative animate-zoomIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Close + Screenshot */}
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

            {/* Gambar */}
            <img
              id="preview-image"
              src={imageUrl}
              alt={name}
              className="max-w-[80vw] max-h-[85vh] rounded-lg object-contain shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;