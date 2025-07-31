import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser } from '../../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);         // Will store user info if authenticated                // Used for redirecting
  const location = useLocation();
  useEffect(() => {
    // Automatically check if token exists and fetch user
    const fetchUser = async () => {
      // if (location.pathname === '/') return;
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include', // Send cookies with request
        });

        if (res.ok) {
          const data = await res.json();
          console.log('User data:', data.user);
          setUser(data.user);

          // Redirect based on role
          if (data.user.role === 'Admin') {
            navigate('/admin-panel', { replace: true });
          } else if (data.user.role === 'Customer') {
            navigate('/customer-panel',  { replace: true });
          }
        }
      } catch (err) {
        console.log('User not logged in');
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form); // Capture response
      alert('Login successful!');
  
      const role = res.data.user.role;
      console.log("Logged in user role:", role); 
  
      // Role-based redirection
     
      if (role === 'Admin') {
        navigate('/admin-panel');
      } else if (role === 'Customer') {
        navigate('/customer-panel');
      } else {
        navigate('/');
      }
     
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth route
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500">Login to continue</p>
        </div>

        {errorMsg && (
          <p className="text-red-600 bg-red-100 text-sm p-2 rounded text-center">
            {errorMsg}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 relative">
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-purple-500"
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                📧
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-purple-500"
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                🔒
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <Link to="/register" className="text-purple-600 hover:underline">
            Sign up
          </Link>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
