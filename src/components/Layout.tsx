import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./home/Header";
import { Toaster, toast } from "react-hot-toast"; // ⬅️ import

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // fungsi untuk nambah produk ke cart
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        toast.success(`${item.name} ditambah 🛒`); // ✅ toast saat update qty
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + item.qty } : p
        );
      }
      toast.success(`${item.name} berhasil ditambahkan 🛍️`); // ✅ toast saat item baru
      return [...prev, item];
    });
  };

  // 🔹 total semua qty
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div>
      <Header
        cartCount={cartCount}
        cartItems={cartItems}
        onSearch={setSearchQuery}
      />

      {/* ⬇️ lempar searchQuery dan addToCart ke semua children */}
      <Outlet context={{ searchQuery, addToCart }} />

      {/* ⬅️ ini harus dipasang sekali di root layout */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Layout;