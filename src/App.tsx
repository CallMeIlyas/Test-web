import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react"; // ✅ Tambah ini
import Layout from "./components/Layout";
import Home from "./pages/Home";
import OurProducts from "./pages/OurProducts";
import Location from "./pages/Location";
import BackgroundCatalog from "./pages/BackgroundCatalog";
import Faq from "./pages/Faq";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";
import ShoppingCart from "./pages/ShoppingCart";
import { CartProvider } from "./context/CartContext"; // ✅ Hapus useCart karena ga dipakai

const App = () => {
  const [searchQuery, setSearchQuery] = useState(""); // ✅ aman sekarang

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route element={<Layout onSearch={setSearchQuery} />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/products"
              element={<OurProducts searchQuery={searchQuery} />}
            />
            <Route path="/location" element={<Location />} />
            <Route
              path="/background-catalog"
              element={<BackgroundCatalog searchQuery={searchQuery} />}
            />
            <Route path="/faq" element={<Faq />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/shoppingcart" element={<ShoppingCart />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;