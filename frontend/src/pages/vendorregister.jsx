
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // ✅ added Link
import { loginVendor, authVendor } from './../api'; 
import { useState, useEffect } from 'react';

export default function VendorRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    foodType: '',
    location: null, // ✅ NEW
  });
  
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude],
          },
        }));
      },
      (error) => {
        console.warn('Geolocation failed or not allowed:', error.message);
        // If location is blocked, we just skip it
      }
    );
  }, []);
  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/vendor/register', formData, {
        withCredentials: true,
      });

      if (res.status === 201) {
        navigate('/vendor/status');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h1 className="text-2xl font-bold mb-4">Vendor Registration</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border p-2"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="w-full border p-2"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="foodType"
          placeholder="Food Type"
          className="w-full border p-2"
          value={formData.foodType}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>

      {/* ✅ This line was added below the form */}
      <p className="mt-4 text-sm text-center">
        Already registered?{' '}
        <Link to="/vendor-login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}
