import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  
  // ✅ Read mode from location state, default 'login'
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');

  const from = location.state?.from?.pathname || '/';

  // ✅ Set active tab based on location state
  useEffect(() => {
    if (location.state?.mode) {
      setActiveTab(location.state.mode);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (signupPassword !== signupConfirm) {
      return setError('Passwords do not match');
    }
    if (signupPassword.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await signup(signupName, signupEmail, signupPassword);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 py-4 text-lg font-bold transition ${
              activeTab === 'login'
                ? 'bg-yellow-50 text-yellow-600 border-b-4 border-yellow-500'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-sign-in-alt mr-2"></i> Login
          </button>
          <button
            onClick={() => switchTab('signup')}
            className={`flex-1 py-4 text-lg font-bold transition ${
              activeTab === 'signup'
                ? 'bg-yellow-50 text-yellow-600 border-b-4 border-yellow-500'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-user-plus mr-2"></i> Sign Up
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex bg-yellow-100 p-3 rounded-full text-3xl mb-2">
              <i className="fas fa-puzzle-piece text-yellow-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === 'login' ? 'Welcome Back!' : 'Join ToyVerse'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {activeTab === 'login' 
                ? 'Sign in to access your account' 
                : 'Create an account to start shopping'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-300 bg-gray-50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-300 bg-gray-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Logging in...</>
                ) : (
                  <><i className="fas fa-sign-in-alt"></i> Login</>
                )}
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-300 bg-gray-50"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-300 bg-gray-50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-300 bg-gray-50"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="password"
                    required
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-300 bg-gray-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Creating account...</>
                ) : (
                  <><i className="fas fa-user-plus"></i> Sign Up</>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t text-xs text-gray-400 text-center">
            {activeTab === 'login' 
              ? 'Demo: any email, password min 6 chars' 
              : 'Use any email & password (min 6 chars)'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;