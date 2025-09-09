import React, { createContext, useContext, useState, useEffect } from "react";  
import { v4 as uuidv4 } from "uuid";  
  
export interface CartItem {  
  cartId: string;  
  id: string;  
  name: string;  
  variation?: string;           // variant yang sedang dipilih  
  variationOptions?: string[];  // semua opsi variant  
  price: number;  
  quantity: number;  
  imageUrl: string;  
  productType: "frame";  
  attributes?: {  
    faceCount?: number;  
    backgroundType?: string;  
  };  
}  
  
interface CartContextType {  
  cart: CartItem[];  
  addToCart: (item: Omit<CartItem, "cartId">) => void;  
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
      const parsed = saved ? JSON.parse(saved) : [];  
      return parsed.map((item: CartItem) => ({  
        ...item,  
        variationOptions: item.variationOptions || ["Default Frame"],  
        variation: item.variation || (item.variationOptions?.[0] || "Default Frame"),  
      }));  
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
  
  const addToCart = (item: Omit<CartItem, "cartId">) => {  
    setCart((prev) => {  
      // cek apakah sudah ada item dengan id + variation + faceCount sama  
      const existingItem = prev.find(  
        (p) =>  
          p.id === item.id &&  
          (p.attributes?.faceCount || 0) === (item.attributes?.faceCount || 0) &&  
          (p.variation || "") === (item.variation || (item.variationOptions?.[0] || "Default Frame"))  
      );  
  
      if (existingItem) {  
        // jika sudah ada, cukup tambah quantity  
        return prev.map((p) =>  
          p.cartId === existingItem.cartId  
            ? { ...p, quantity: (p.quantity || 1) + (item.quantity || 1) }  
            : p  
        );  
      }  
  
      // jika belum ada, buat item baru  
      return [  
        ...prev,  
        {  
          ...item,  
          cartId: uuidv4(),  
          variation: item.variation || (item.variationOptions?.[0] || "Default Frame"),  
          variationOptions: item.variationOptions || ["Default Frame"],  
          productType: "frame",  
          quantity: item.quantity || 1,  
          attributes: {  
            faceCount: item.attributes?.faceCount,  
            backgroundType: item.attributes?.backgroundType,  
          },  
        },  
      ];  
    });  
  };  
  
  const updateQuantity = (cartId: string, delta: number) => {  
    setCart((prev) =>  
      prev  
        .map((p) =>  
          p.cartId === cartId  
            ? { ...p, quantity: Math.max(0, (p.quantity ?? 1) + delta) }  
            : p  
        )  
        .filter((p) => p.quantity > 0)  
    );  
  };  
  
  const deleteItem = (cartId: string) => {  
    setCart((prev) => prev.filter((p) => p.cartId !== cartId));  
  };  
  
  const clearCart = () => setCart([]);  
  
  const getProductGroup = (productId: string): CartItem[] =>  
    cart.filter((item) => item.id === productId);  
  
  const updateItemVariant = (cartId: string, newVariation: string) => {  
    setCart((prev) =>  
      prev.map((p) =>  
        p.cartId === cartId ? { ...p, variation: newVariation } : p  
      )  
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