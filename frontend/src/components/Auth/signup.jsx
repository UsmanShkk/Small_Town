import { useState } from 'react';
import { registerUser } from '../../api';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, UserCheck } from 'lucide-react';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Customer', 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear specific error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

      // Email validation using regular expression
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!form.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!emailRegex.test(form.email)) {
    newErrors.email = 'Please enter a valid Gmail address ending in @gmail.com';
  }

    // Password confirmation validation
    if (form.confirmPassword!==form.password){
      return
    }

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Password validation
    if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await registerUser(form);
      alert('Registered successfully!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth route
    window.location.href = 'http://localhost:5000/api/auth/google';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join us</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'

                  }`}
                />
                <p className='m-0 text-red-500'>{form.confirmPassword&&form.confirmPassword!==form.password?"password do not match":''}</p>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Account Type</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
                <option value="Chef">Chef</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Create Account
            </button>
          </form>
                {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-3 text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">Sign up with Google</span>
        </button>


          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={navigateToLogin}
                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-all duration-200"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}