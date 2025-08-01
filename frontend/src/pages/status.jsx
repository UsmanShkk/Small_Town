// src/pages/VendorStatus.jsx
import { useEffect, useState } from 'react';
import { fetchVendorProfile } from '../api'; // Adjust the path based on your project structure
import { useNavigate } from 'react-router-dom';


export default function VendorStatus() {
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendorProfile()
      .then((res) => {
        const vendor = res.data;
        setVendor(vendor);
  
        if (vendor.status === 'pending') {
          // Stay here
        } else if (vendor.status === 'approved') {
          navigate('/dashboard'); // Or another page
        } else if (vendor.status === 'rejected') {
          setError('Your registration has been rejected.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Could not fetch vendor profile.');
      });
  }, [navigate]);
  

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!vendor) {
    return <p>Loading vendor information...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Vendor Status</h1>
      <p><strong>Name:</strong> {vendor.name}</p>
      <p><strong>Email:</strong> {vendor.email}</p>
      <p><strong>Status:</strong> {vendor.status}</p>
      <p><strong>Address:</strong> {vendor.address}</p>
      <p><strong>Food Type:</strong> {vendor.foodType}</p>
      {vendor.status !== 'approved' && (
        <p className="mt-4 text-yellow-600 font-semibold">
          Your registration is pending approval. Please wait.
        </p>
      )}
      {vendor.status === 'approved' && (
        <p className="mt-4 text-green-600 font-semibold">
          Congratulations! Your vendor account is approved.
        </p>
      )}
    </div>
  );
}
