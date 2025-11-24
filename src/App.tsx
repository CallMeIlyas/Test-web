import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, useCallback } from "react"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import OurProducts from "./pages/OurProducts"
import SizeGuide from "./pages/SizeGuide"
import Location from "./pages/Location"
import BackgroundCatalog from "./pages/BackgroundCatalog"
import Faq from "./pages/Faq"
import TermsOfService from "./pages/TermsOfService"
import ContactUs from "./pages/ContactUs"
import ShoppingCart from "./pages/ShoppingCart"
import ProductDetail from "./pages/ProductDetail"
import { CartProvider } from "./context/CartContext"
import PageTransition from "./utils/PageTransition"
import SlideUpTransition from "./utils/SlideUpTransition"
import SmoothScrollProvider from "./utils/SmoothScrollProvider"

const App = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  return (
    <CartProvider>
      <Router>
        <PageTransition>
          <Routes>

            <Route
              element={
                <SmoothScrollProvider>
                  <Layout onSearch={handleSearch} />
                </SmoothScrollProvider>
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
                path="/size-guide"
                element={
                  <SlideUpTransition>
                    <SizeGuide />
                  </SlideUpTransition>
                }
              />

              <Route
                path="/products"
                element={
                  <SlideUpTransition>
                    <OurProducts />
                  </SlideUpTransition>
                }
              />

              <Route
                path="/background-catalog"
                element={
                  <SlideUpTransition>
                    <BackgroundCatalog searchQuery={searchQuery} />
                  </SlideUpTransition>
                }
              />
            </Route>

          </Routes>
        </PageTransition>
      </Router>
    </CartProvider>
  )
}

export default App