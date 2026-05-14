import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

// Custom Hook for Countdown Timer (24-hour cycle, auto-reset)
const useCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const difference = tomorrow - now;
      
      if (difference <= 0) {
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        const newDiff = nextDay - now;
        return {
          hours: Math.floor((newDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((newDiff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((newDiff % (1000 * 60)) / 1000)
        };
      }
      
      return {
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return timeLeft;
};

// Animated Counter Hook
const useCountUp = (target, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (target - start) + start));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, start]);
  
  return count;
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  const timeLeft = useCountdown();
  const happyCustomers = useCountUp(5000, 2500);
  const avgRating = 4.9;
  const reviewCount = useCountUp(2000, 2000);

  useEffect(() => {
    setFeaturedProducts(products.slice(0, 4));
    setNewArrivals(products.slice(2, 6));
    setBestSellers(products.slice(1, 5));
    setTrendingProducts(products.sort((a, b) => b.rating - a.rating).slice(0, 4));
  }, []);

  // ✅ Fixed cleanup – no warning
  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, []);

  const goToAuth = (mode) => {
    navigate('/auth', { state: { mode } });
  };

  const categories = [
    { name: 'Action Figures', icon: 'fa-robot', color: 'from-blue-400 to-cyan-500', bg: 'bg-gradient-to-br from-blue-50 to-cyan-50' },
    { name: 'Stuffed Toys', icon: 'fa-bear', color: 'from-pink-400 to-rose-500', bg: 'bg-gradient-to-br from-pink-50 to-rose-50' },
    { name: 'Educational', icon: 'fa-puzzle-piece', color: 'from-green-400 to-emerald-500', bg: 'bg-gradient-to-br from-green-50 to-emerald-50' },
    { name: 'Vehicles', icon: 'fa-car', color: 'from-red-400 to-orange-500', bg: 'bg-gradient-to-br from-red-50 to-orange-50' },
    { name: 'Dolls', icon: 'fa-crown', color: 'from-purple-400 to-fuchsia-500', bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50' },
    { name: 'Outdoor', icon: 'fa-futbol', color: 'from-yellow-400 to-amber-500', bg: 'bg-gradient-to-br from-yellow-50 to-amber-50' },
  ];

  const testimonials = [
    { name: 'Priya S.', text: 'Best toy store ever! My kids love every single item.', rating: 5, avatar: 'https://ui-avatars.com/api/?name=Priya+S&background=fbbf24&color=fff' },
    { name: 'Rahul M.', text: 'Quality is top-notch. Fast delivery and great packaging.', rating: 5, avatar: 'https://ui-avatars.com/api/?name=Rahul+M&background=fbbf24&color=fff' },
    { name: 'Anjali K.', text: 'Zero se hero – truly! Amazing collection.', rating: 4, avatar: 'https://ui-avatars.com/api/?name=Anjali+K&background=fbbf24&color=fff' },
  ];

  return (
    <div className="space-y-20">
      {/* ========== HERO SECTION ========== */}
     <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-yellow-200/90 via-amber-100/80 to-pink-100/90 backdrop-blur-sm shadow-2xl">
  {/* Animated background blobs */}
  <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-300/30 rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-3xl"></div>
  
  <div className="relative z-10 flex flex-col lg:flex-row items-center p-6 md:p-8 lg:p-10 gap-6">
    <div className="flex-1 space-y-5">
      <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/50">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-xs font-bold text-gray-800 tracking-wide">ZERO TO HERO! 🚀</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.2]">
        <span className="text-gray-800 block">The World of Toys,</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-pink-500 to-purple-600">
          Pure Joy!
        </span>
        <span className="text-gray-800 block">Where Play Begins</span>
      </h1>
      
      <p className="text-base text-gray-700 max-w-xl leading-relaxed backdrop-blur-sm bg-white/30 p-3 rounded-xl border border-white/40">
        ✨ Premium toys that spark creativity and joy. 
        <span className="font-semibold block mt-1">Handpicked with love for your little stars.</span>
      </p>
      
      <div className="flex flex-wrap gap-3">
        {!isAuthenticated ? (
          <>
            <button
              onClick={() => goToAuth('login')}
              className="group relative px-6 py-2.5 bg-gray-900 text-white rounded-full text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <i className="fas fa-sign-in-alt group-hover:translate-x-1 transition"></i> Login
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
            <button
              onClick={() => goToAuth('signup')}
              className="px-6 py-2.5 bg-white/80 backdrop-blur-sm text-gray-900 rounded-full text-base font-bold shadow-xl hover:shadow-2xl border-2 border-white/50 hover:bg-white transition-all duration-300 flex items-center gap-2"
            >
              <i className="fas fa-user-plus text-yellow-600"></i> Sign Up
            </button>
          </>
        ) : (
          <Link
            to="/shop"
            className="group relative px-6 py-2.5 bg-gray-900 text-white rounded-full text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <i className="fas fa-gift group-hover:rotate-12 transition"></i> Explore Toys
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </Link>
        )}
        <Link to="/about" className="px-6 py-2.5 bg-white/60 backdrop-blur-sm rounded-full text-base font-semibold shadow-lg hover:shadow-xl border border-white/40 hover:bg-white transition flex items-center gap-2">
          <i className="fas fa-play-circle text-yellow-600"></i> Our Story
        </Link>
      </div>

      <div ref={statsRef} className="flex items-center gap-6 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-9 h-9 rounded-full border-3 border-white bg-gradient-to-br from-yellow-200 to-pink-200 flex items-center justify-center text-sm font-bold shadow-md">
                <i className="fas fa-user text-gray-600 text-xs"></i>
              </div>
            ))}
          </div>
          <div className="ml-1">
            <p className="text-2xl font-bold text-gray-800">{isStatsVisible ? happyCustomers.toLocaleString() : '0'}+</p>
            <p className="text-xs text-gray-600 font-medium">Happy Families</p>
          </div>
        </div>
        <div className="h-10 w-px bg-gray-300"></div>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-gray-800">{avgRating}</span>
            <i className="fas fa-star text-yellow-500 text-base"></i>
          </div>
          <p className="text-xs text-gray-600 font-medium">From {isStatsVisible ? reviewCount.toLocaleString() : '0'}+ reviews</p>
        </div>
      </div>
    </div>
    
    <div className="flex-1 relative flex justify-center">
      <div className="relative w-60 h-60 md:w-72 md:h-72">
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-yellow-400/60 animate-spin-slow"></div>
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-200/40 to-pink-200/40 backdrop-blur-sm flex items-center justify-center">
          <span className="text-7xl md:text-8xl absolute animate-float">🧸</span>
          <span className="text-6xl md:text-7xl absolute -top-6 -right-6 animate-bounce">🎮</span>
        </div>
      </div>
      <div className="absolute -top-5 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-0.5 rounded-full font-bold text-base shadow-2xl animate-bounce">
        🔥 -30% OFF
      </div>
    </div>
  </div>
  
  <div className="relative h-12">
    <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
      <path fill="#fef3c7" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
    </svg>
  </div>
</section>

      {/* ========== TRENDING NOW ========== */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <i className="fas fa-fire text-orange-500"></i> Trending Now
            </h2>
            <p className="text-gray-600 mt-1">Most popular toys this week</p>
          </div>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
          {trendingProducts.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="snap-start flex-shrink-0 w-44 group"
            >
              <div className="bg-white rounded-2xl p-3 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="relative overflow-hidden rounded-xl">
                  <img src={product.image} alt={product.name} className="w-full h-36 object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">🔥 Hot</div>
                </div>
                <h4 className="font-semibold mt-2 truncate">{product.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-yellow-600 font-bold">${product.price}</span>
                  <span className="text-yellow-500 text-sm"><i className="fas fa-star"></i> {product.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========== FEATURES BANNER ========== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: 'fa-truck-fast', title: 'Free Shipping', desc: 'On orders over $50', gradient: 'from-blue-500 to-cyan-500' },
          { icon: 'fa-shield-halved', title: 'Secure Payment', desc: '100% protected', gradient: 'from-green-500 to-emerald-500' },
          { icon: 'fa-rotate-left', title: '30 Days Return', desc: 'Easy refund', gradient: 'from-orange-500 to-amber-500' },
          { icon: 'fa-headset', title: '24/7 Support', desc: 'Dedicated help', gradient: 'from-purple-500 to-pink-500' },
        ].map((item, idx) => (
          <div key={idx} className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-white/50 hover:-translate-y-1">
            <div className={`bg-gradient-to-br ${item.gradient} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white mb-4 shadow-lg group-hover:scale-110 transition`}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <h3 className="font-bold text-xl mb-1">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* ========== CATEGORIES ========== */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-3">✨ Shop by Category</h2>
          <p className="text-gray-600 text-lg">Find the perfect toy for every age and interest</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={`/shop?category=${cat.name.toLowerCase()}`}
              className="group"
            >
              <div className={`${cat.bg} p-5 rounded-2xl text-center hover:shadow-2xl transition-all duration-300 border border-white/50 hover:-translate-y-2`}>
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl text-white shadow-lg group-hover:scale-110 transition`}>
                  <i className={`fas ${cat.icon}`}></i>
                </div>
                <h3 className="font-bold mt-3 text-gray-800">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-700">Shop now →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========== FLASH SALE ========== */}
      <section className="relative bg-gradient-to-r from-pink-300 via-purple-200 to-yellow-200 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute -right-20 -top-20 text-[200px] opacity-20 rotate-12">🎁</div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 bg-black/80 backdrop-blur-sm text-yellow-300 px-5 py-2 rounded-full text-sm font-bold border border-yellow-400/50">
              <i className="fas fa-hourglass-half"></i> LIMITED TIME
            </span>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900">Flash Sale – Up to 50% Off!</h3>
            <p className="text-gray-800 text-lg max-w-lg">Grab the best deals on premium toys before they're gone.</p>
            <div className="flex gap-5">
              <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl text-center min-w-[90px] border border-white/50">
                <span className="text-4xl font-mono font-bold text-gray-900">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="block text-xs text-gray-600 uppercase tracking-wider mt-1">Hours</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl text-center min-w-[90px] border border-white/50">
                <span className="text-4xl font-mono font-bold text-gray-900">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="block text-xs text-gray-600 uppercase tracking-wider mt-1">Minutes</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl text-center min-w-[90px] border border-white/50">
                <span className="text-4xl font-mono font-bold text-gray-900">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="block text-xs text-gray-600 uppercase tracking-wider mt-1">Seconds</span>
              </div>
            </div>
          </div>
          <Link to="/shop" className="group bg-gray-900 hover:bg-gray-800 text-white px-10 py-5 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 hover:gap-5 border border-white/20">
            Shop Sale <i className="fas fa-arrow-right group-hover:translate-x-1 transition"></i>
          </Link>
        </div>
      </section>

      {/* ========== FEATURED PRODUCTS ========== */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <i className="fas fa-star text-yellow-500"></i> Featured Toys
            </h2>
            <p className="text-gray-600 mt-1">Handpicked favorites for your little ones</p>
          </div>
          <Link to="/shop" className="text-yellow-600 font-semibold hover:underline hidden sm:block">
            View All <i className="fas fa-arrow-right ml-1"></i>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ========== NEW ARRIVALS & BEST SELLERS ========== */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-2xl text-white shadow-lg">
              <i className="fas fa-clock text-xl"></i>
            </div>
            <h3 className="text-2xl font-bold">New Arrivals</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-2xl text-white shadow-lg">
              <i className="fas fa-fire text-xl"></i>
            </div>
            <h3 className="text-2xl font-bold">Best Sellers</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="bg-gradient-to-br from-amber-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-inner">
        <h2 className="text-4xl font-bold text-center mb-3">❤️ Loved by Parents</h2>
        <p className="text-gray-600 text-center mb-12 text-lg">See what our happy customers say</p>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full border-3 border-yellow-400" />
                <div>
                  <p className="font-bold text-lg">{t.name}</p>
                  <div className="flex text-yellow-400">
                    {[...Array(t.rating)].map((_, j) => <i key={j} className="fas fa-star text-sm"></i>)}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">"{t.text}"</p>
              <div className="mt-4 text-yellow-500">
                <i className="fas fa-quote-right text-2xl opacity-50"></i>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== NEWSLETTER ========== */}
      <section className="relative bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-10 md:p-14 text-center text-gray-900 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <i className="fas fa-envelope-open-text text-6xl mb-5 text-white drop-shadow-lg"></i>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">Stay in the loop!</h2>
          <p className="text-xl mb-8 text-white/90">Subscribe for exclusive deals, new arrivals, and toy tips.</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-6 py-5 rounded-full border-0 focus:ring-4 focus:ring-yellow-300 text-gray-800 text-lg shadow-inner bg-white/90 backdrop-blur-sm"
            />
            <button className="bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-800 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5">
              Subscribe <i className="fas fa-paper-plane ml-2"></i>
            </button>
          </form>
          <p className="text-sm mt-5 text-white/80">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;