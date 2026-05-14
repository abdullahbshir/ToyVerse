import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';     // ✅ import
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Auth from './pages/Auth';                           // ✅ import combined auth page
import Checkout from './pages/Checkout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>      {/* ✅ wrap with AuthProvider */}
        <CartProvider>
          <div className="bg-amber-50 min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/auth" element={<Auth />} />       {/* ✅ new route */}
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;