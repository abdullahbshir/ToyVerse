import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, isWishlisted, onToggleWishlist, onQuickView, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-amber-100 flex flex-col h-full group">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-52 object-cover" />
        </Link>
        <button 
          onClick={() => onToggleWishlist?.(product.id)}
          className="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-white"
        >
          <i className={`${isWishlisted ? 'fas text-red-500' : 'far'} fa-heart`}></i>
        </button>
        <button 
          onClick={() => onQuickView?.()}
          className="absolute bottom-2 left-2 bg-white/80 px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition"
        >
          <i className="fas fa-eye mr-1"></i> Quick View
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{product.age} yrs</span>
        </div>
        <div className="flex items-center mt-1 text-yellow-500 text-sm">
          <i className="fas fa-star"></i> {product.rating}
        </div>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-800">${product.price}</span>
          <button
            onClick={() => onAddToCart?.()}
            className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1"
          >
            <i className="fas fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;