// frontend/src/pages/ChooseRole.jsx
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ChooseRole() {
  const [role, setRoleValue] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      'http://localhost:5000/api/auth/set-role',
      { token, role },
      { withCredentials: true }
    );

    if (res.data.redirectUrl) {
      window.location.href = res.data.redirectUrl;
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Select Your Role</h2>
      <form onSubmit={handleSubmit}>
        <select
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setRoleValue(e.target.value)}
          required
        >
          <option value="">-- Select Role --</option>
          <option value="Customer">Customer</option>
          <option value="Vendor">Vendor</option>
          <option value="Admin">Admin</option>
          <option value="Chef">Chef</option>
          <option value="Delivery">Delivery</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Continue
        </button>
      </form>
    </div>
  );
}
