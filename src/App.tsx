import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useCallback } from "react"; 
import Layout from "./components/Layout";
import Home from "./pages/Home";
import OurProducts from "./pages/OurProducts";
import Location from "./pages/Location";
import BackgroundCatalog from "./pages/BackgroundCatalog";
import Faq from "./pages/Faq";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";
import ShoppingCart from "./pages/ShoppingCart";
import { CartProvider } from "./context/CartContext"; 
import ProductDetail from "./pages/ProductDetail"; 

const App = () => {
  const [searchQuery, setSearchQuery] = useState(""); 

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route element={<Layout onSearch={handleSearch} />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<OurProducts />} />
            <Route path="/location" element={<Location />} />
            <Route
              path="/background-catalog"
              element={<BackgroundCatalog searchQuery={searchQuery} />}
            />
            <Route path="/faq" element={<Faq />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/shoppingcart" element={<ShoppingCart />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;