import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginVendor, authVendor } from '../../api';
import { ChefHat, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function VendorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check auth on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authVendor();
        if (res.data) {
          navigate('/vendor-panel/meals');
        }
      } catch (err) {
        // Not logged in, stay on login
      }
    };
    checkAuth();
  }, [navigate]);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // On login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await loginVendor(formData);
      console.log("RES :", formData);
      
      if (res) {
        navigate('/vendor-panel/meals');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-4 shadow-lg">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, Chef!</h1>
          <p className="text-gray-600">Sign in to manage your delicious offerings</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
          {/* Card Header */}
          <div className="text-center p-6 pb-4 bg-gradient-to-r from-orange-500/5 to-amber-500/5">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Vendor Login</h2>
            <p className="text-gray-600 text-sm">Access your kitchen dashboard</p>
          </div>
          
          {/* Card Content */}
          <div className="p-6 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-500" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="w-full h-12 px-4 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 hover:underline transition-colors">
                  Forgot your password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Access Kitchen
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                New to our platform?{' '}
                <Link to="/register-vendor" className="font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors">
                  Join our kitchen network
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
            <div className="text-orange-500 text-lg font-semibold">24/7</div>
            <div className="text-xs text-gray-600">Support</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
            <div className="text-orange-500 text-lg font-semibold">0%</div>
            <div className="text-xs text-gray-600">Setup Fee</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
            <div className="text-orange-500 text-lg font-semibold">Fast</div>
            <div className="text-xs text-gray-600">Payouts</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          Secure login protected by industry-standard encryption
        </div>
      </div>
    </div>
  );
}
