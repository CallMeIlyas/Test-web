import React, { useState, useMemo } from "react";
import Footer from "../components/home/Footer";
import { useCart } from "../context/CartContext";

// Komponen modular
const ProductImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img src={src} alt={alt} className="w-16 h-16 rounded-md object-cover" />
);

const ProductName: React.FC<{ name: string }> = ({ name }) => (
  <h3 className="font-poppinsRegular">{name}</h3>
);

const ProductPrice: React.FC<{ price: number }> = ({ price }) => (
  <span className="font-poppinsSemiBold">Rp{price.toLocaleString("id-ID")}</span>
);

const ShoppingCart: React.FC = () => {
  const { cart, updateQuantity, deleteItem, updateItemVariant } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Group items by parentCartId atau id
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    cart.forEach((item) => {
      const key = item.parentCartId || item.cartId;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [cart]);

  const allSelected = cart.length > 0 && selectedItems.length === cart.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelectedItems([]);
    else setSelectedItems(cart.map((item) => item.cartId));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 px-6 md:px-16 py-10">
        <div className="rounded-[30px] border border-black p-6 bg-white shadow-sm">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Cart is empty</p>
          ) : (
            <>
              {/* Select All */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
                <span className="font-semibold">Select All ({cart.length})</span>
              </div>

              {/* Grouped items */}
              {Object.values(groupedItems).map((group: any[], idx) => (
                <div key={idx} className="mb-6 border-b pb-6 last:border-b-0">
                  {group.map((item) => (
                    <div
                      key={item.cartId}
                      className={`flex items-center justify-between py-3 ${
                        item.attributes?.isFace ? "" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        className="mr-3"
                        checked={selectedItems.includes(item.cartId)}
                        onChange={(e) => {
                          if (e.target.checked)
                            setSelectedItems([...selectedItems, item.cartId]);
                          else
                            setSelectedItems(
                              selectedItems.filter((id) => id !== item.cartId)
                            );
                        }}
                      />

                      {/* Konten utama */}
                      <div className="flex items-center gap-3 flex-1">
                        <ProductImage src={item.imageUrl} alt={item.name} />
                        <ProductName name={item.name} />

{/* Dropdown variant */}
<div className="flex-1 mr-10 translate-x-10">
  <p className="font-poppinsRegular text-[15px]">
    Variant:
  </p>
<select
  className="bg-white"
  value={item.variation || ""}
  onChange={(e) => updateItemVariant(item.cartId, e.target.value)}
>
  {(
    item.variationOptions && item.variationOptions.length > 0
      ? item.variationOptions
      : item.attributes?.isFace
      ? Array.from({ length: 9 }, (_, i) => `${i + 1} Face`)
      : item.attributes?.isBackground
      ? ["BG Default", "BG Custom"] // ⚡ hanya dua pilihan
      : ["Wood Frame", "Metal Frame", "No Frame"]
  ).map((opt) => (
    <option key={opt} value={opt}>
      {opt}
    </option>
  ))}
</select>
</div>

                        {/* Harga */}
                        <div className="flex-shrink-0 -translate-x-7">
                          <ProductPrice price={item.price} />
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          className="px-2 rounded border"
                          onClick={() => updateQuantity(item.cartId, -1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="px-2 rounded border"
                          onClick={() => updateQuantity(item.cartId, 1)}
                        >
                          +
                        </button>
                        <p className="w-28 text-right font-bold text-red-600">
                          Rp{(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                        <button
                          className="font-poppinsRegular"
                          onClick={() => deleteItem(item.cartId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShoppingCart;