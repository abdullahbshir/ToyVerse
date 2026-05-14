import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thanks for subscribing, ${email}!`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 text-white mt-16">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-yellow-400 p-2 rounded-xl">
                <i className="fas fa-puzzle-piece text-2xl text-gray-900"></i>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Toy<span className="text-yellow-400">Verse</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Bringing joy, creativity, and learning to children through carefully curated toys. 
              From zero to hero – every toy tells a story.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <i className="fas fa-map-marker-alt text-yellow-400"></i>
              <span>123 Toy Street, Playland, PL 56789</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
              <i className="fas fa-phone-alt text-yellow-400"></i>
              <span>+1 (800) 555-TOYS</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
              <i className="fas fa-envelope text-yellow-400"></i>
              <span>hello@toyverse.com</span>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Shop</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/shop?category=action figures" className="hover:text-yellow-400 transition">Action Figures</Link></li>
              <li><Link to="/shop?category=stuffed" className="hover:text-yellow-400 transition">Stuffed Toys</Link></li>
              <li><Link to="/shop?category=educational" className="hover:text-yellow-400 transition">Educational</Link></li>
              <li><Link to="/shop?category=vehicles" className="hover:text-yellow-400 transition">Vehicles</Link></li>
              <li><Link to="/shop?category=dolls" className="hover:text-yellow-400 transition">Dolls</Link></li>
              <li><Link to="/shop" className="hover:text-yellow-400 transition font-medium">All Products →</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/faq" className="hover:text-yellow-400 transition">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-yellow-400 transition">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-yellow-400 transition">Returns & Refunds</Link></li>
              <li><Link to="/track-order" className="hover:text-yellow-400 transition">Track Order</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Stay Connected</h4>
            <p className="text-gray-400 text-sm mb-3">Subscribe for exclusive offers and new arrivals.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded-lg transition text-sm"
              >
                Subscribe
              </button>
            </form>
            <div className="flex gap-4 mt-5 text-xl">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition"><i className="fab fa-pinterest-p"></i></a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>

        {/* Payment Methods & Badges */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-gray-400 text-2xl">
            <i className="fab fa-cc-visa hover:text-white transition"></i>
            <i className="fab fa-cc-mastercard hover:text-white transition"></i>
            <i className="fab fa-cc-paypal hover:text-white transition"></i>
            <i className="fab fa-cc-amex hover:text-white transition"></i>
            <i className="fab fa-cc-apple-pay hover:text-white transition"></i>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span><i className="fas fa-lock mr-1"></i> Secure Checkout</span>
            <span><i className="fas fa-shield-alt mr-1"></i> SSL Secured</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 pt-6 flex flex-wrap justify-between items-center text-sm text-gray-500">
          <p>© 2025 ToyVerse. All rights reserved. Built with ❤️ for kids.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-yellow-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-yellow-400 transition">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-yellow-400 transition">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;