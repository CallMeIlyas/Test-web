import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { priceList } from "../data/priceList";

export interface CartItem {
  cartId: string;
  id: string;
  name: string;
  variation?: string;
  variationOptions?: string[];
  price: number;
  quantity: number;
  imageUrl: string;
  image: string;
  productType: "frame" | "face" | "background" | "packing" | "additional";
  parentCartId?: string;
  attributes?: {
    isFace?: boolean;
    isBackground?: boolean;
    isPacking?: boolean;
    backgroundType?: string;
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    item: Omit<CartItem, "cartId"> & {
      attributes?: { faceCount?: string; backgroundType?: string; includePacking?: boolean };
    }
  ) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  deleteItem: (cartId: string) => void;
  clearCart: () => void;
  getProductGroup: (productId: string) => CartItem[];
  updateItemVariant: (cartId: string, newVariation: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  }, [cart]);

  const addToCart = (
    item: Omit<CartItem, "cartId"> & {
      attributes?: { faceCount?: string; backgroundType?: string; includePacking?: boolean };
    }
  ) => {
    const { attributes, ...rest } = item;
    const faceCountLabel = attributes?.faceCount || "";
    const bgSelected = attributes?.backgroundType || "BG Default";
    const includePacking = attributes?.includePacking || false;

    // === Deteksi apakah produk ini termasuk Additional Custom atau Softcopy ===
    const isAdditionalOrSoftcopy =
      rest.name?.toLowerCase().includes("additional") ||
      rest.name?.toLowerCase().includes("softcopy");

    // === AUTO DETECT VARIANT untuk produk Additional tertentu ===
    let detectedVariants: string[] = [];

    if (isAdditionalOrSoftcopy) {
      const name = rest.name.toLowerCase();

      // 1️⃣ BIAYA TAMBAHAN GANTI FRAME KACA KE ACRYLIC
      if (name.includes("ganti frame kaca ke acrylic")) {
        detectedVariants = ["A2", "A1", "A0"];
      }

      // 2️⃣ BIAYA EKSPRESS GENERAL
      else if (name.includes("ekspress general")) {
        detectedVariants = ["Option 1", "Option 2", "Option 3"];
      }

      // 3️⃣ BIAYA TAMBAHAN WAJAH BANYAK (DESIGN DARI CUSTOMER)
      else if (name.includes("wajah banyak")) {
        detectedVariants = ["1–9 Wajah", "Di atas 10 Wajah"];
      }
    }

// 🧹 Bersihkan nama produk agar tidak ada kata "Custom" tapi tetap utuh
const rawName = (rest.name || "").toString().trim();

// Hilangkan kata "Custom" di mana pun (case-insensitive)
const cleanProductName = rawName
  .replace(/\bCustom\b/gi, "")   // hapus kata Custom
  .replace(/\s{2,}/g, " ")       // rapikan spasi ganda
  .replace(/\s\/\s/g, " / ")     // pastikan jarak di tanda "/"
  .trim();

// === Produk utama (otomatis untuk 2D Frame) ===

// deteksi apakah produk 2D Frame
const is2DFrame = rest.name?.toLowerCase().includes("2d");

// ambil atribut frame size & shading style (dikirim dari ProductDetail)
const frameSize = attributes?.frameSize?.toLowerCase() || "";
const shadingStyle = attributes?.shadingStyle?.toLowerCase() || "";

// siapkan daftar harga 2D frame
const twoDPrices = Object.fromEntries(
  Object.entries(priceList["2D frame"]).map(([k, v]) => [k.toLowerCase(), v])
);

// tentukan kombinasi key (contoh: "8r bold shading")
let priceKey = `${frameSize} ${shadingStyle}`.trim();

// fallback kalau shading kosong → simple shading
if (!twoDPrices[priceKey] && frameSize) {
  priceKey = `${frameSize} simple shading`;
}

// ambil harga sesuai pricelist atau fallback ke base
const autoPrice = is2DFrame ? twoDPrices[priceKey] || rest.price || 0 : rest.price;

// buat nama produk agar jelas
const productName = is2DFrame
  ? `2D Frame ${frameSize.toUpperCase()} ${shadingStyle
      .replace(/^2d\s+/i, "")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace("Ai", "AI")
      .trim()}`
  : cleanProductName;

// buat produk utama
const mainCartItem: CartItem = {
  ...rest,
  name: productName,
  cartId: uuidv4(),
  quantity: rest.quantity || 1,
  price: autoPrice,
  productType: isAdditionalOrSoftcopy ? "additional" : "frame",
  variationOptions:
    isAdditionalOrSoftcopy && detectedVariants.length > 0
      ? detectedVariants
      : isAdditionalOrSoftcopy
      ? ["Default"]
      : ["Frame Kaca", "Frame Acrylic"],
  variation:
    isAdditionalOrSoftcopy && detectedVariants.length > 0
      ? detectedVariants[0]
      : isAdditionalOrSoftcopy
      ? "Default"
      : rest.selectedVariation ||
        rest.variation ||
        rest.attributes?.variation ||
        "Frame Kaca",
  image: rest.imageUrl,
};

    // 🧩 kalau produk Additional atau Softcopy, cuma masukin item utama
    if (isAdditionalOrSoftcopy) {
      setCart((prev) => [...prev, mainCartItem]);
      return;
    }

    // === Normal products (2D / 3D frame) ===
    const newItems: CartItem[] = [mainCartItem];

    // 👤 Additional Face
    if (faceCountLabel) {
      const isAbove10 = faceCountLabel.includes("10");
      newItems.push({
        cartId: uuidv4(),
        parentCartId: mainCartItem.cartId,
        id: `${rest.id}-face`,
        name: "Additional Faces",
        price: isAbove10 ? 62800 : 52800,
        quantity: 1,
        imageUrl: rest.imageUrl,
        image: rest.imageUrl,
        productType: "face",
        variation: isAbove10 ? "Di atas 10 wajah" : "1–9 wajah",
        variationOptions: ["1–9 wajah", "Di atas 10 wajah"],
        attributes: { isFace: true },
      });
    }

// 🎨 Background
const bgName =
  bgSelected === "BG Custom" ? "Background Custom" : "Background Default";

// 🧠 Gunakan harga berbeda untuk Default & Custom
const bgPrice =
  bgSelected === "BG Custom"
    ? priceList.Additional["Background Custom"] || 62800
    : priceList.Additional["Background Default"] || 52800;

newItems.push({
  cartId: uuidv4(),
  parentCartId: mainCartItem.cartId,
  id: `${rest.id}-bg`,
  name: bgName,
  price: bgPrice,
  quantity: 1,
  imageUrl: rest.imageUrl,
  image: rest.imageUrl,
  productType: "background",
  attributes: { isBackground: true, backgroundType: bgSelected },
  variation: bgSelected,
  variationOptions: ["BG Default", "BG Custom"],
});

    // 📦 Packing (opsional)
    if (includePacking) {
      newItems.push({
        cartId: uuidv4(),
        parentCartId: mainCartItem.cartId,
        id: `${rest.id}-packing`,
        name: "Additional Packing",
        price:
          priceList.Additional["Biaya Tambahan Packing (Biasa)"] || 52800,
        quantity: 1,
        imageUrl: rest.imageUrl,
        image: rest.imageUrl,
        productType: "packing",
        attributes: { isPacking: true },
        variation: "Additional Packing",
        variationOptions: ["Additional Packing"],
      });
    }

    setCart((prev) => [...prev, ...newItems]);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.cartId === cartId
            ? { ...p, quantity: Math.max(0, (p.quantity || 1) + delta) }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const deleteItem = (cartId: string) => {
    setCart((prev) =>
      prev.filter((p) => p.cartId !== cartId && p.parentCartId !== cartId)
    );
  };

  const clearCart = () => setCart([]);

  const getProductGroup = (productId: string) =>
    cart.filter((item) => item.id === productId);

  // 🧠 Update harga otomatis saat variant diubah
  const updateItemVariant = (cartId: string, newVariation: string) => {
    setCart((prev) =>
      prev.map((p) => {
        if (p.cartId === cartId) {
          const updated = { ...p, variation: newVariation };

          if (p.attributes?.isBackground) {
            updated.name =
              newVariation === "BG Default"
                ? "Background Default"
                : "Background Custom";
          
            // 🧠 Update harga otomatis saat ubah variant
            updated.price =
              newVariation === "BG Default"
                ? priceList.Additional["Background Default"] || 52800
                : priceList.Additional["Background Custom"] || 62800;
          }

          if (p.attributes?.isFace) {
            updated.price = newVariation.includes("10")
              ? priceList.Additional["Tambahan Wajah Karikatur diatas 10 wajah"] || 62800
              : priceList.Additional["Tambahan Wajah Karikatur 1-9 wajah"] || 52800;
          }

          // === Additional Acrylic ===
          if (p.name.toLowerCase().includes("ganti frame kaca ke acrylic")) {
            const key = `Biaya Tambahan Ganti Frame Kaca ke Acrylic ${newVariation}`;
            updated.price = priceList.Additional[key] || p.price;
          }

          // === Additional Ekspress ===
          if (p.name.toLowerCase().includes("ekspress general")) {
            const key =
              newVariation === "Option 1"
                ? "Biaya Ekspress General"
                : newVariation === "Option 2"
                ? "Biaya Ekspress General 2"
                : "Biaya Ekspress General 3";
            updated.price = priceList.Additional[key] || p.price;
          }

          // === Additional Wajah Banyak ===
          if (p.name.toLowerCase().includes("wajah banyak")) {
            const key =
              newVariation.includes("10")
                ? "Biaya Tambahan Wajah Banyak diatas 10 wajah"
                : "Biaya Tambahan Wajah Banyak 1-9 wajah";
            updated.price = priceList.Additional[key] || p.price;
          }

          return updated;
        }
        return p;
      })
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        deleteItem,
        clearCart,
        getProductGroup,
        updateItemVariant,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};