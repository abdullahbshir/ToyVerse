import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { products, categories, ageRanges } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

// Quick View Modal (moved outside)
const QuickViewModal = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  
  if (!product) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">
            <i className="fas fa-times text-xl"></i>
          </button>
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <img src={product.image} alt={product.name} className="w-full h-64 md:h-80 object-cover rounded-xl" />
            <div className="space-y-4">
              <div>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">{product.category}</span>
                <h2 className="text-2xl font-bold mt-2">{product.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                    ))}
                  </span>
                  <span className="text-sm text-gray-500">{product.rating} / 5</span>
                </div>
              </div>
              <p className="text-gray-600">{product.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">${product.price}</span>
                <span className="text-green-600 text-sm bg-green-100 px-2 py-1 rounded-full">In Stock</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-3 py-1">-</button>
                  <span className="px-4 py-1 border-x">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="px-3 py-1">+</button>
                </div>
                <button 
                  onClick={() => { onAddToCart(product, quantity); onClose(); }}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-2 rounded-lg font-semibold"
                >
                  Add to Cart
                </button>
              </div>
              <div className="border-t pt-3 text-sm text-gray-500 space-y-1">
                <p><i className="fas fa-check-circle text-green-500 mr-1"></i> Free shipping over $50</p>
                <p><i className="fas fa-undo-alt mr-1"></i> 30 days easy returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recently Viewed Hook
const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 4);
    });
  };
  
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) setRecentlyViewed(JSON.parse(stored));
  }, []);
  
  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);
  
  return { recentlyViewed, addToRecentlyViewed };
};

// Main Shop Component
const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('viewMode') || 'grid');
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist')) || []);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // ✅ defined
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  
  const productsPerPage = 6;

  // Sync from URL
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) setSelectedCategory(catParam);
  }, [searchParams]);

  // Filter and sort logic
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = [...products];
      
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      if (selectedAge !== 'all') {
        filtered = filtered.filter(p => p.age === selectedAge);
      }
      filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
      if (ratingFilter > 0) {
        filtered = filtered.filter(p => p.rating >= ratingFilter);
      }
      if (searchQuery.trim()) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      switch (sortBy) {
        case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
        case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
        case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
        default: break;
      }
      
      setFilteredProducts(filtered);
      setCurrentPage(1); // reset to first page
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedAge, priceRange, sortBy, searchQuery, ratingFilter]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedAge('all');
    setPriceRange([0, 100]);
    setSortBy('featured');
    setSearchQuery('');
    setRatingFilter(0);
    setSearchParams({});
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const handleViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };

  const handleAddToCart = (product, qty = 1) => {
    for (let i = 0; i < qty; i++) addToCart(product);
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const trendingProducts = useMemo(() => {
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, []);

  return (
    <div className="pb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-yellow-600">Home</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <span className="text-gray-900 font-medium">Shop</span>
      </nav>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-2xl p-6 md:p-8 mb-8 overflow-hidden">
        <div className="absolute right-0 top-0 text-8xl opacity-20">🧸🎁</div>
        <div className="relative z-10 flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <i className="fas fa-store text-yellow-500"></i> Toy Shop
            </h1>
            <p className="text-gray-700 mt-2 max-w-xl">
              Discover our magical collection — quality toys for every age. 
              <span className="block mt-1 font-semibold">🎉 Free shipping on orders over $50!</span>
            </p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="bg-white/70 backdrop-blur-sm px-5 py-3 rounded-xl text-center">
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-sm">Products</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm px-5 py-3 rounded-xl text-center">
              <p className="text-2xl font-bold">4.8 ⭐</p>
              <p className="text-sm">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Now */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <i className="fas fa-fire text-orange-500"></i> Trending Now
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {trendingProducts.map(p => (
            <Link 
              key={p.id} 
              to={`/product/${p.id}`}
              onClick={() => addToRecentlyViewed(p)}
              className="flex-shrink-0 bg-white rounded-xl p-2 shadow-sm border w-36 hover:shadow-md transition"
            >
              <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded-lg" />
              <p className="font-medium text-sm mt-1 truncate">{p.name}</p>
              <span className="text-yellow-600 text-sm font-bold">${p.price}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search toys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 focus:ring-2 focus:ring-yellow-300 shadow-sm"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-full bg-white border border-gray-200 shadow-sm cursor-pointer"
          >
            <option value="featured">✨ Featured</option>
            <option value="price-low">💰 Price: Low to High</option>
            <option value="price-high">💎 Price: High to Low</option>
            <option value="rating">⭐ Top Rated</option>
          </select>
          <div className="hidden sm:flex bg-white rounded-full border p-1">
            <button 
              onClick={() => handleViewMode('grid')}
              className={`px-3 py-1 rounded-full ${viewMode === 'grid' ? 'bg-yellow-200' : ''}`}
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button 
              onClick={() => handleViewMode('list')}
              className={`px-3 py-1 rounded-full ${viewMode === 'list' ? 'bg-yellow-200' : ''}`}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="lg:hidden bg-yellow-400 px-5 py-3 rounded-full font-semibold shadow-sm flex items-center gap-2"
          >
            <i className="fas fa-sliders-h"></i> Filter
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`lg:w-72 ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-100 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <i className="fas fa-filter text-yellow-600"></i> Filters
              </h3>
              <button onClick={clearFilters} className="text-sm text-red-500 hover:underline">
                Clear All
              </button>
            </div>

            {/* Category */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-700">Category</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="category" value={cat} checked={selectedCategory === cat}
                      onChange={(e) => setSelectedCategory(e.target.value)} className="accent-yellow-500 w-4 h-4" />
                    <span className="capitalize">{cat === 'all' ? 'All Categories' : cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-700">Age Range</h4>
              <div className="space-y-2">
                {ageRanges.map(age => (
                  <label key={age} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="age" value={age} checked={selectedAge === age}
                      onChange={(e) => setSelectedAge(e.target.value)} className="accent-yellow-500 w-4 h-4" />
                    <span>{age === 'all' ? 'All Ages' : `${age} years`}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-700">Price Range</h4>
              <div className="px-2">
                <input type="range" min="0" max="100" value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-yellow-500" />
                <div className="flex justify-between text-sm mt-1">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-700">Minimum Rating</h4>
              <div className="space-y-1">
                {[4, 3, 2, 1].map(r => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="rating" checked={ratingFilter === r}
                      onChange={() => setRatingFilter(r)} className="accent-yellow-500" />
                    <span className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star text-sm ${i < r ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                      ))} <span className="ml-1">& up</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-700">Popular Tags</h4>
              <div className="flex flex-wrap gap-2">
                {['teddy', 'rc car', 'puzzle', 'doll', 'robot'].map(tag => (
                  <button key={tag} onClick={() => setSearchQuery(tag)}
                    className="bg-gray-100 hover:bg-yellow-200 px-3 py-1 rounded-full text-sm transition">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Results bar */}
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> products
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedCategory !== 'all' && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}><i className="fas fa-times-circle"></i></button>
                </span>
              )}
              {selectedAge !== 'all' && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Age: {selectedAge}
                  <button onClick={() => setSelectedAge('all')}><i className="fas fa-times-circle"></i></button>
                </span>
              )}
              {ratingFilter > 0 && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {ratingFilter}+ Stars
                  <button onClick={() => setRatingFilter(0)}><i className="fas fa-times-circle"></i></button>
                </span>
              )}
            </div>
          </div>

          {/* Product Grid with Loading Skeleton */}
          {isLoading ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="bg-gray-200 h-40 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-2xl font-bold mb-2">No toys found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search term.</p>
              <button onClick={clearFilters} className="bg-yellow-400 px-6 py-2 rounded-full font-semibold">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {paginatedProducts.map(product => (
                  <div key={product.id} className="relative group">
                    {viewMode === 'grid' ? (
                      <ProductCard 
                        product={product} 
                        isWishlisted={wishlist.includes(product.id)}
                        onToggleWishlist={toggleWishlist}
                        onQuickView={() => setQuickViewProduct(product)}
                        onAddToCart={() => handleAddToCart(product)}
                      />
                    ) : (
                      <div className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center">
                        <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
                        <div className="flex-grow">
                          <h3 className="font-bold">{product.name}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold">${product.price}</span>
                            <span className="text-yellow-500 text-sm">⭐ {product.rating}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleAddToCart(product)} className="bg-yellow-400 p-2 rounded-full">
                            <i className="fas fa-cart-plus"></i>
                          </button>
                          <button onClick={() => toggleWishlist(product.id)} className="p-2">
                            <i className={`${wishlist.includes(product.id) ? 'fas text-red-500' : 'far'} fa-heart`}></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex gap-1">
                    <button onClick={() => handlePageChange(currentPage-1)} disabled={currentPage===1}
                      className="w-10 h-10 rounded-full border disabled:opacity-50">«</button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => handlePageChange(i+1)}
                        className={`w-10 h-10 rounded-full ${currentPage===i+1 ? 'bg-yellow-400 text-white' : 'border'}`}>
                        {i+1}
                      </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage+1)} disabled={currentPage===totalPages}
                      className="w-10 h-10 rounded-full border disabled:opacity-50">»</button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-history text-gray-500"></i> Recently Viewed
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyViewed.map(p => (
              <Link to={`/product/${p.id}`} key={p.id} className="bg-white p-3 rounded-xl shadow-sm hover:shadow">
                <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-lg" />
                <p className="font-medium mt-2 truncate">{p.name}</p>
                <span className="text-yellow-600">${p.price}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default Shop;