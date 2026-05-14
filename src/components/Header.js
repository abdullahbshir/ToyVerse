import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => location.pathname === path ? 'text-yellow-600 border-b-2 border-yellow-400' : '';

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  // ✅ Navigate to Auth with mode
  const goToAuth = (mode) => {
    navigate('/auth', { state: { mode } });
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-30 border-b-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-yellow-400 p-2 rounded-2xl shadow-sm">
            <i className="fas fa-puzzle-piece text-2xl text-white"></i>
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-800">
            Toy<span className="text-yellow-500">Verse</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-6 font-semibold">
          <Link to="/" className={`hover:text-yellow-600 transition ${isActive('/')}`}>Home</Link>
          <Link to="/shop" className={`hover:text-yellow-600 transition ${isActive('/shop')}`}>Shop</Link>
          <Link to="/about" className={`hover:text-yellow-600 transition ${isActive('/about')}`}>About</Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/cart" className="relative p-2 hover:bg-yellow-100 rounded-full transition">
            <i className="fas fa-shopping-cart text-2xl text-gray-700"></i>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* ✅ User Menu or Login/Signup Buttons */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 hover:bg-yellow-100 rounded-full transition"
              >
                <img
                  src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=fbbf24&color=fff'}
                  alt={user?.name}
                  className="w-9 h-9 rounded-full border-2 border-yellow-400"
                />
                <span className="hidden lg:inline font-medium text-sm">{user?.name}</span>
                <i className={`fas fa-chevron-down text-xs transition ${showUserMenu ? 'rotate-180' : ''}`}></i>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50 text-sm">
                    <i className="fas fa-user mr-2"></i> Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-50 text-sm">
                    <i className="fas fa-box mr-2"></i> Orders
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ✅ Two separate buttons for Login and Signup
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToAuth('login')}
                className="hidden sm:flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-semibold transition"
              >
                <i className="fas fa-sign-in-alt"></i> Login
              </button>
              <button
                onClick={() => goToAuth('signup')}
                className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-full text-sm font-semibold transition shadow-sm"
              >
                <i className="fas fa-user-plus"></i> Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden flex justify-around bg-white border-t py-2 text-sm font-medium">
        <Link to="/" className="flex flex-col items-center"><i className="fas fa-home"></i><span>Home</span></Link>
        <Link to="/shop" className="flex flex-col items-center"><i className="fas fa-store"></i><span>Shop</span></Link>
        <Link to="/cart" className="flex flex-col items-center"><i className="fas fa-shopping-bag"></i><span>Cart</span></Link>
        {isAuthenticated ? (
          <Link to="/profile" className="flex flex-col items-center">
            <i className="fas fa-user"></i><span>Profile</span>
          </Link>
        ) : (
          // ✅ Mobile: Two options? Limited space, so we can show "Account" that goes to auth.
          // Alternatively, we can add both but they'd be small. Here's a simple approach:
          <button
            onClick={() => goToAuth('login')}
            className="flex flex-col items-center"
          >
            <i className="fas fa-user-circle"></i><span>Account</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;  