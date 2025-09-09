import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ModalPesananProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (options: 
  { 
  qty: number;
  faces: number;
  background: string 
  }) => void;
  product:{
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

const ModalPesanan: React.FC<ModalPesananProps> = ({ isOpen, onClose, onConfirm, product }) => {
  const [qty, setQty] = useState<number | "">(1);
  const [faces, setFaces] = useState<number | "">("");
  const [background, setBackground] = useState("");
  const navigate = useNavigate(); 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">{product.name}</h2>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-32 h-32 object-cover rounded mx-auto mb-4"
        />

        {/* Jumlah Wajah */}
        <div className="mb-3">
          <label className="block font-poppinsSemiBold">Jumlah Wajah</label>
          <input
            type="number"
            min={1}
            max={9}
            value={faces}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setFaces("");
              } else {
                setFaces(Math.min(9, Math.max(1, Number(val))));
              }
            }}
            placeholder="Masukkan jumlah wajah (max 9)"
            className="font-poppinsRegular w-full border rounded px-2 py-1"
          />
        </div>

{/* Background */}
<div className="mb-3">
  <label className="font-poppinsSemiBold">Background Category</label>

  {/* Pilih dari Catalog */}
  <button
    onClick={() => {
      setBackground("Catalog");
      onClose();
      navigate("/background-catalog");
    }}
    className={`font-poppinsBold flex items-center justify-center gap-2 mx-auto mt-3 mb-3 w-fit px-10 py-2.5
      no-underline rounded-full text-center transition-all
      ${background === "Catalog"
        ? "bg-[#e8b9b8] scale-105 text-[#333]"
        : "bg-[#f5d7d6] hover:bg-[#e8b9b8] hover:scale-105 text-[#333]"}`
    }
  >

    Background Catalog
  </button>

  {/* Pilih Custom */}
  <button
    onClick={() => {
      setBackground(background === "Custom" ? "" : "Custom");
    }}
    className={`font-poppinsBold flex items-center justify-center gap-2 mx-auto mt-3 mb-3 w-fit px-10 py-2.5
      no-underline rounded-full text-center transition-all
      ${background === "Custom"
        ? "bg-[#e8b9b8] scale-105 text-[#333]"
        : "bg-[#f5d7d6] hover:bg-[#e8b9b8] hover:scale-105 text-[#333]"}`
    }
  >
    {background === "Custom" && <span className="text-xl">✓</span>}
    Background Custom
  </button>
</div>

        {/* Quantity */}
        <div className="mb-3">
          <label className="block font-poppinsSemiBold">Jumlah Produk</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setQty(""); 
              } else {
                setQty(Math.max(1, Number(val)));
              }
            }}
            placeholder="Masukkan jumlah produk"
            className="font-poppinsRegular w-full border rounded px-2 py-1"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="font-poppinsBold block mx-auto mt-3 mb-3 w-fit px-10 py-2.5 bg-[#f5d7d6] text-[#333] no-underline rounded-full font-bold text-center transition-all hover:bg-[#e8b9b8] hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm({
                qty: qty === "" ? 1 : qty,
                faces: faces === "" ? 1 : faces,
                background: background || "Catalog",
              });
              onClose();
            }}
            className="font-poppinsBold block mx-auto mt-3 mb-3 w-fit px-10 py-2.5 bg-[#f5d7d6] text-[#333] no-underline rounded-full font-bold text-center transition-all hover:bg-[#e8b9b8] hover:scale-105"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPesanan;