import { useState, useEffect } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { loginVendor, authVendor } from '../../api'; // adjust path as needed

export default function VendorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // ✅ Check auth on load
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
  }, []);

  // ✅ Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ On login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginVendor(formData);
      console.log("RES :", formData)  
      if (res) {
        navigate('/vendor-panel/meals');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Vendor Login</h2>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="block w-full mb-2 p-2 border"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="block w-full mb-2 p-2 border"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
