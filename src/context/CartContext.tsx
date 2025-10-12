import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

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
  productType: "frame" | "face" | "background";
  parentCartId?: string;
  attributes?: {
    isFace?: boolean;
    isBackground?: boolean;
    backgroundType?: string;
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    item: Omit<CartItem, "cartId"> & {
      attributes?: { faceCount?: number; backgroundType?: string };
    }
  ) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  deleteItem: (cartId: string) => void;
  clearCart: () => void;
  getProductGroup: (productId: string) => CartItem[];
  updateItemVariant: (cartId: string, newVariation: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
      attributes?: { faceCount?: number; backgroundType?: string };
    }
  ) => {
    const { attributes, ...rest } = item;
    const faceCount = attributes?.faceCount || 0;

    // Produk utama (frame)
    const mainCartItem: CartItem = {
      ...rest,
      cartId: uuidv4(),
      quantity: rest.quantity || 1,
      productType: "frame",
      variationOptions: ["Wood Frame", "Metal Frame", "No Frame"],
      variation: "Wood Frame",
      image: rest.imageUrl, 
    };
    setCart((prev) => [...prev, mainCartItem]);

    // Additional Face
    if (faceCount > 0) {
      const faceOptions = Array.from({ length: 9 }, (_, i) => `${i + 1} Face`);
      const faceItem: CartItem = {
        cartId: uuidv4(),
        parentCartId: mainCartItem.cartId,
        id: `${rest.id}-face`,
        name: "Additional Faces",
        price: 52800,
        quantity: faceCount,
        imageUrl: rest.imageUrl,
        image: rest.imageUrl, 
        productType: "face",
        variation: faceOptions[faceCount - 1] || faceOptions[0],
        variationOptions: faceOptions,
        attributes: { isFace: true },
      };
      setCart((prev) => [...prev, faceItem]);
    }

    // Background
    const bgSelected = attributes?.backgroundType || "BG Default";
    const bgName =
      bgSelected === "BG Custom" ? "Background Custom" : "Background Default";

    const bgItem: CartItem = {
      cartId: uuidv4(),
      parentCartId: mainCartItem.cartId,
      id: `${rest.id}-bg`,
      name: bgName,
      price: 52800,
      quantity: 1,
      imageUrl: rest.imageUrl,
      image: rest.imageUrl, 
      productType: "background",
      attributes: { isBackground: true, backgroundType: bgSelected },
      variation: bgSelected,
      variationOptions: ["BG Default", "BG Custom"],
    };

    setCart((prev) => [...prev, bgItem]);
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