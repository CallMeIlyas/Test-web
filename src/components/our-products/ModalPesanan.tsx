import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

interface ModalPesananProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    variationOptions?: string[];
  };
}

const ModalPesanan: React.FC<ModalPesananProps> = ({ isOpen, onClose, product }) => {
  const { addToCart } = useCart();
  const [qty, setQty] = useState<number>(1);
  const [faces, setFaces] = useState<number>(1);
  const [background, setBackground] = useState("Catalog");
  const [selectedVariant, setSelectedVariant] = useState<string>(product.variationOptions?.[0] || "Default Frame");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: qty,
      variation: selectedVariant,
      variationOptions: product.variationOptions || ["Default Frame"],
      attributes: {
        faceCount: faces,
        backgroundType: background,
      },
      productType: "frame",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">{product.name}</h2>
        <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover rounded mx-auto mb-4" />

        {/* Variant */}
        {product.variationOptions && product.variationOptions.length > 0 && (
          <div className="mb-3">
            <label className="block font-poppinsSemiBold">Variant</label>
            <select
              className="w-full border rounded px-2 py-1 mt-1 bg-white"
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
            >
              {product.variationOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Jumlah Wajah */}
        <div className="mb-3">
          <label className="block font-poppinsSemiBold">Jumlah Wajah</label>
          <input
            type="number"
            min={1}
            max={9}
            value={faces}
            onChange={(e) => setFaces(Math.min(9, Math.max(1, Number(e.target.value))))}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>

        {/* Background */}
        <div className="mb-3">
          <label className="block font-poppinsSemiBold">Background</label>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => { setBackground("Catalog"); navigate("/background-catalog"); }}
              className={`px-4 py-2 rounded-full ${background === "Catalog" ? "bg-[#e8b9b8]" : "bg-[#f5d7d6] hover:bg-[#e8b9b8]"}`}
            >
              Catalog
            </button>
            <button
              onClick={() => setBackground(background === "Custom" ? "Catalog" : "Custom")}
              className={`px-4 py-2 rounded-full ${background === "Custom" ? "bg-[#e8b9b8]" : "bg-[#f5d7d6] hover:bg-[#e8b9b8]"}`}
            >
              {background === "Custom" && "✓ "}Custom
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-3">
          <label className="block font-poppinsSemiBold">Jumlah Produk</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#f5d7d6] rounded-full hover:bg-[#e8b9b8] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            className="px-6 py-2 bg-[#f5d7d6] rounded-full hover:bg-[#e8b9b8] transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPesanan;