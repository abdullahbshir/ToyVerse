// ✅ Pakistan ke hisaab se modified Checkout.js
// - Default country: Pakistan
// - Province field (with placeholder)
// - Postal Code placeholder
// - City placeholder updated
// - Improved error handling – agar backend HTML bheje to clearly error dikhega

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',            // Province ke liye
    zipCode: '',
    country: 'Pakistan',  // default Pakistan
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    paymentMethod: 'credit',
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: location.pathname, mode: 'login' } });
    }
  }, [isAuthenticated, navigate, location]);

  // Redirect to cart if empty
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some toys to your cart before checkout.</p>
        <Link to="/shop" className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-full font-semibold transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // --- Card input handlers -----
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(.{4})/g, '$1 ').trim();
    setFormData({ ...formData, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setFormData({ ...formData, cardExpiry: value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ----- Validation ----------
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'Province is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Postal code is required';
    
    if (formData.paymentMethod === 'credit') {
      if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Valid card number required';
      }
      if (!formData.cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Use MM/YY format';
      }
      if (!formData.cardCvc.trim() || formData.cardCvc.length < 3) {
        newErrors.cardCvc = 'CVC required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ----- Real API submit (with robust error handling) ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    
    try {
      const totalAmount = totalPrice + totalPrice * 0.08;   // tax included
      const response = await fetch('http://localhost:5000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,      // Province
          zipCode: formData.zipCode,
          country: formData.country,
          paymentMethod: formData.paymentMethod,
          totalAmount,
          userId: user ? user.id : null,
        }),
      });

      // 🛡️ Safe JSON parsing – agar backend ne HTML error page bheja to turant pata chalega
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // HTML ya text aaya – uska beginning dikhao
        const text = await response.text();
        throw new Error(`Server returned invalid response (status ${response.status}): ${text.substring(0, 300)}`);
      }

      if (!response.ok) throw new Error(data.error || 'Failed to place order');

      setOrderPlaced(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert('Checkout failed: ' + error.message +
            '\n\n🔧 Debug: Open http://localhost:5000/checkout in browser. If you see "Cannot GET /checkout" it means the backend route exists but accepts POST only.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ----- Order placed screen -------
  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-green-200">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-check-circle text-5xl text-green-500"></i>
          </div>
          <h1 className="text-3xl font-bold mb-3">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase. Your order #{Math.floor(Math.random() * 1000000)} has been received.</p>
          <p className="text-sm text-gray-500 mb-8">A confirmation email has been sent to {formData.email}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-full font-semibold transition">
              Continue Shopping
            </Link>
            <Link to="/" className="bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-full font-semibold transition">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----- Main checkout form (same UI as before) -----
  return (
    <div className="max-w-7xl mx-auto pb-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-yellow-600">Home</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <Link to="/cart" className="hover:text-yellow-600">Cart</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <span className="text-gray-900 font-medium">Checkout</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Billing Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-yellow-500"></i> Billing Address
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-300 ${errors.firstName ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-300 ${errors.lastName ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-300 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-300 ${errors.address ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="House No, Street, Area"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-300 ${errors.city ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="e.g., Lahore, Karachi"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Province *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-300 ${errors.state ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="e.g., Punjab, Sindh"
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-300 ${errors.zipCode ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="e.g., 54000"
                  />
                  {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., Pakistan, India"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-300"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mt-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-credit-card text-yellow-500"></i> Payment Method
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit"
                    checked={formData.paymentMethod === 'credit'}
                    onChange={handleChange}
                    className="accent-yellow-500 w-5 h-5"
                  />
                  <span className="font-medium">Credit / Debit Card</span>
                  <div className="ml-auto flex gap-2 text-2xl text-gray-400">
                    <i className="fab fa-cc-visa"></i>
                    <i className="fab fa-cc-mastercard"></i>
                    <i className="fab fa-cc-amex"></i>
                  </div>
                </label>

                {formData.paymentMethod === 'credit' && (
                  <div className="pl-8 space-y-4 pt-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Card Number</label>
                      <div className="relative">
                        <i className="fas fa-credit-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-300 ${errors.cardNumber ? 'border-red-400' : 'border-gray-200'}`}
                        />
                      </div>
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-300 ${errors.cardExpiry ? 'border-red-400' : 'border-gray-200'}`}
                        />
                        {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CVC</label>
                        <input
                          type="text"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          placeholder="123"
                          className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-300 ${errors.cardCvc ? 'border-red-400' : 'border-gray-200'}`}
                        />
                        {errors.cardCvc && <p className="text-red-500 text-xs mt-1">{errors.cardCvc}</p>}
                      </div>
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                    className="accent-yellow-500 w-5 h-5"
                  />
                  <span className="font-medium">PayPal</span>
                  <i className="fab fa-paypal ml-auto text-2xl text-blue-600"></i>
                </label>
              </div>
            </div>

            {/* Place Order Button (Mobile) */}
            <div className="lg:hidden mt-6">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 rounded-full text-lg shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                ) : (
                  <><i className="fas fa-lock"></i> Place Order • Rs. {(totalPrice + totalPrice * 0.08).toFixed(2)}</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-shopping-bag text-yellow-500"></i> Order Summary
            </h2>
            
            <div className="max-h-80 overflow-y-auto mb-4 divide-y">
              {items.map(item => (
                <div key={item.id} className="py-3 flex gap-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-grow">
                    <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    <p className="text-yellow-600 font-bold text-sm">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rs. {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (estimated)</span>
                <span>Rs. {(totalPrice * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-yellow-600">Rs. {(totalPrice + totalPrice * 0.08).toFixed(2)}</span>
            </div>

            {/* Place Order Button (Desktop) */}
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="hidden lg:flex w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 rounded-full text-lg shadow-md transition disabled:opacity-50 items-center justify-center gap-2"
            >
              {isProcessing ? (
                <><i className="fas fa-spinner fa-spin"></i> Processing...</>
              ) : (
                <><i className="fas fa-lock"></i> Place Order</>
              )}
            </button>

            <div className="mt-4 text-xs text-gray-400 text-center space-y-1">
              <p><i className="fas fa-shield-alt mr-1"></i> Secure SSL encrypted checkout</p>
              <p>Demo mode – no actual charges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;