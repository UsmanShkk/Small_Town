import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authcustomer } from './../api';

export default function CustomerPanel() {
  const navigate = useNavigate();
  const [isAuthChecked, setIsAuthChecked] = useState(false); // wait until check is done

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authcustomer();
        if (!res.data.success || res.data.user?.role !== 'customer') {
          navigate('/login');
        } else {
          setIsAuthChecked(true); // now show dashboard
        }
      } catch (err) {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (!isAuthChecked) {
    // Show nothing (or loading) while checking auth
    return null; // or <LoadingSpinner />
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-600">Customer Panel</h1>
      <p>Welcome, Customer! This is your dashboard.</p>
    </div>
  );
}
