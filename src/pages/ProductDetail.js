import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

// Toast notification component
const Toast = ({ message, show }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-in slide-in-from-bottom-5 duration-300">
      <i className="fas fa-check-circle text-green-400 mr-2"></i>
      {message}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showToast, setShowToast] = useState(false);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist')) || []);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Scroll to top on page load / id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Find product & related data
  useEffect(() => {
    const found = products.find(p => p.id === parseInt(id));
    if (found) {
      setProduct(found);

      // Related products (same category)
      const related = products.filter(p => p.category === found.category && p.id !== found.id).slice(0, 4);
      setRelatedProducts(related);

      // Recently viewed
      const stored = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      const filtered = stored.filter(p => p.id !== found.id);
      const newRecent = [found, ...filtered].slice(0, 4);
      localStorage.setItem('recentlyViewed', JSON.stringify(newRecent));
      setRecentlyViewed(newRecent);
    }
  }, [id]);

  const toggleWishlist = () => {
    if (!product) return;
    setWishlist(prev => {
      const newWishlist = prev.includes(product.id)
        ? prev.filter(pid => pid !== product.id)
        : [...prev, product.id];
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const isWishlisted = product ? wishlist.includes(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <Link to="/shop" className="text-yellow-600 hover:underline">Return to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <Toast message={`${quantity} item(s) added to cart!`} show={showToast} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-yellow-600">Home</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <Link to="/shop" className="hover:text-yellow-600">Shop</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* SIMPLE IMAGE - NO ZOOM, NO MAGNIFIER */}
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 md:h-96 object-contain rounded-xl"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm capitalize">
                  {product.category}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Age: {product.age} years
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${
                        i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    ></i>
                  ))}
                </div>
                <span className="text-gray-600 font-medium">{product.rating} / 5</span>
                <span className="text-gray-400 text-sm">(128 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-y py-4">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              <span className="text-green-600 ml-3 text-sm bg-green-100 px-2 py-1 rounded-full">
                In Stock
              </span>
              <p className="text-gray-500 text-sm mt-2">
                <i className="fas fa-truck mr-1"></i> Free shipping on orders over $50
              </p>
            </div>

            {/* Short Description */}
            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 text-xl hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 border-x font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-2 text-xl hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-full transition shadow-md flex items-center justify-center gap-2"
                >
                  <i className="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full transition shadow-md flex items-center justify-center gap-2"
                >
                  <i className="fas fa-bolt"></i> Buy Now
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`p-3 rounded-full border-2 transition ${
                    isWishlisted
                      ? 'bg-red-50 border-red-300 text-red-500'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart text-xl`}></i>
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex gap-4 text-sm text-gray-500 pt-2">
                <span>
                  <i className="fas fa-shield-alt text-green-600 mr-1"></i> Secure Checkout
                </span>
                <span>
                  <i className="fas fa-undo-alt mr-1"></i> 30-Day Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-10">
        <div className="border-b flex gap-6">
          {['description', 'specifications', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-medium capitalize transition ${
                activeTab === tab
                  ? 'text-yellow-600 border-b-2 border-yellow-400'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              <p className="mt-4 text-gray-700">
                This premium quality toy is designed to spark imagination and provide hours of fun.
                Made from child-safe materials, it meets all international safety standards.
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold mb-2">Product Details</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="text-gray-500">Category:</span>{' '}
                    <span className="capitalize">{product.category}</span>
                  </li>
                  <li>
                    <span className="text-gray-500">Age Range:</span> {product.age} years
                  </li>
                  <li>
                    <span className="text-gray-500">Material:</span> BPA-free Plastic / Soft Fabric
                  </li>
                  <li>
                    <span className="text-gray-500">Weight:</span> 0.8 kg
                  </li>
                  <li>
                    <span className="text-gray-500">Dimensions:</span> 12 x 8 x 5 inches
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold mb-2">Safety & Care</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <i className="fas fa-check-circle text-green-500 mr-1"></i> ASTM F963 Certified
                  </li>
                  <li>
                    <i className="fas fa-check-circle text-green-500 mr-1"></i> Non-toxic materials
                  </li>
                  <li>
                    <i className="fas fa-check-circle text-green-500 mr-1"></i> Wipe clean with damp cloth
                  </li>
                  <li>
                    <i className="fas fa-check-circle text-green-500 mr-1"></i> Choking hazard: Small parts
                    (for 3+)
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <span className="text-5xl font-bold">{product.rating}</span>
                  <span className="text-gray-400 text-lg">/5</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xl">★★★★★</span>
                    <span className="text-sm text-gray-500">Based on 128 reviews</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Sarah M.</span>
                    <span className="text-yellow-400">★★★★★</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    My daughter absolutely loves this! Great quality and fast shipping.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">John D.</span>
                    <span className="text-yellow-400">★★★★☆</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Nice toy, but the box was slightly damaged during delivery.
                  </p>
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Emily R.</span>
                    <span className="text-yellow-400">★★★★★</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Perfect gift for my nephew. He plays with it every day!
                  </p>
                </div>
              </div>
              {!isAuthenticated && (
                <div className="mt-6 bg-amber-50 p-4 rounded-xl text-center">
                  <p className="text-sm">
                    <Link
                      to="/auth"
                      state={{ mode: 'login' }}
                      className="text-yellow-600 font-medium hover:underline"
                    >
                      Login
                    </Link>{' '}
                    to write a review
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-tags text-yellow-500"></i> You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                isWishlisted={wishlist.includes(prod.id)}
                onToggleWishlist={id => {
                  const newWishlist = wishlist.includes(id)
                    ? wishlist.filter(pid => pid !== id)
                    : [...wishlist, id];
                  localStorage.setItem('wishlist', JSON.stringify(newWishlist));
                  setWishlist(newWishlist);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-history text-gray-500"></i> Recently Viewed
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyViewed.map(p => (
              <Link
                to={`/product/${p.id}`}
                key={p.id}
                className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="font-medium text-sm truncate">{p.name}</p>
                <span className="text-yellow-600 font-bold">${p.price}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;