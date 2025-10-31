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
import PageTransition from "./utils/PageTransition";
import SlideUpTransition from "./utils/SlideUpTransition";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle pencarian global
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route
            element={
              <PageTransition>
                <Layout onSearch={handleSearch} />
              </PageTransition>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/location" element={<Location />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/shoppingcart" element={<ShoppingCart />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            <Route
              path="/products"
              element={
                <SlideUpTransition>
                  <OurProducts />
                </SlideUpTransition>
              }
            />
          </Route>

          <Route
            path="/background-catalog"
            element={
              <SlideUpTransition>
                <Layout onSearch={handleSearch}>
                  <BackgroundCatalog searchQuery={searchQuery} />
                </Layout>
              </SlideUpTransition>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;