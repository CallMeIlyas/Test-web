import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./home/Header";
import { Toaster, toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";

interface LayoutProps {
  onSearch?: (query: string) => void; // opsional
}

const Layout: React.FC<LayoutProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { cart, addToCart } = useCart();

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleAddToCart = (item: Parameters<typeof addToCart>[0]) => {
    addToCart(item);
    toast.success(`${item.name} berhasil ditambahkan 🛍️`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) onSearch(query);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={cartCount} cartItems={cart} onSearch={handleSearch} />

      {/* Outlet untuk halaman anak */}
      <Outlet context={{ searchQuery, addToCart: handleAddToCart }} />

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Layout;