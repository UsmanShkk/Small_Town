import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerVendor, fetchVendorProfile } from './../api';

export default function VendorRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    foodType: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if vendor already registered on mount
  useEffect(() => {
    async function checkExistingVendor() {
      try {
        const response = await fetchVendorProfile();
        const vendor = response.data.vendor;  // Get the actual vendor object
       

        if (vendor) {
          setFormData({
            name: vendor.name || '',
            email: vendor.email || '',
            password: '',  // don't prefill password
            address: vendor.address || '',
            foodType: vendor.foodType || '',
          });

          if (vendor.status === 'pending') {
            navigate('/vendor/status', { replace: true });
          } else if (vendor.status === 'approved') {
            navigate('/login', { replace: true });
  // Or wherever approved vendors should go
          } else if (vendor.status === 'rejected') {
            setError('Your registration has been rejected by admin.');
          }
        }
      } catch (err) {
        console.log('No vendor profile found or error:', err.message);
        // Show registration form if no vendor found or error occurs
      }
    }

    checkExistingVendor();
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Registering vendor with data:', formData);
      await registerVendor(formData);
      console.log('Registration successful, redirecting to /vendor/status');
      navigate('/vendor/status');  // Redirect after registration
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-10 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Vendor Registration</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          name="address"
          type="text"
          placeholder="Business Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          name="foodType"
          type="text"
          placeholder="Food Type (e.g., Pizza, Biryani)"
          value={formData.foodType}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Register as Vendor
        </button>
      </form>
    </div>
  );
}
