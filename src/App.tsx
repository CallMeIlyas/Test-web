import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import OurProducts from './pages/OurProducts';
import Location from './pages/Location';
import BackgroundCatalog from './pages/BackgroundCatalog';
import Faq from './pages/Faq';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';


const App = () => {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // 🔹 state search

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <Router>


      <Routes>
        <Route element={<Layout cartCount={cartCount} onSearch={setSearchQuery} />}>
          <Route path="/" element={<Home />} />
          <Route 
            path="/products" 
            element={<OurProducts onAddToCart={handleAddToCart} searchQuery={searchQuery} />} 
          />
          <Route path="/location" element={<Location />} />
          <Route 
            path="/background-catalog" 
            element={<BackgroundCatalog searchQuery={searchQuery} />} 
          />
          <Route path="/faq" element={<Faq />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<ContactUs />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;