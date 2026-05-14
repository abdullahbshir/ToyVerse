import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // ✅ import

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth(); // ✅ use auth

  // ... (empty cart return same)

  return (
    <div className="max-w-4xl mx-auto">
      {/* ... cart items ... */}
      <div className="bg-gray-50 p-6 border-t">
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total:</span>
          <span className="text-yellow-600">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition"
          >
            Clear Cart
          </button>
          
          {/* ✅ Conditional Checkout Button */}
          {isAuthenticated ? (
            <Link
              to="/checkout"
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-3 rounded-full font-bold text-lg shadow text-center transition"
            >
              Proceed to Checkout <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          ) : (
            <Link
              to="/auth"
              state={{ from: '/cart', mode: 'login' }}
              className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-full font-bold text-lg shadow text-center transition"
            >
              <i className="fas fa-sign-in-alt mr-2"></i> Login to Checkout
            </Link>
          )}
        </div>
      </div>
      {/* ... */}
    </div>
  );
};

export default Cart;