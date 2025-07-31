import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Landing from './pages/landingpage';
import Login from './components/Auth/login';
import Signup from './components/Auth/signup';
import CustomerPanel from './pages/customerpanel';

import AdminLayout from './pages/adminlayout';       // <-- New layout wrapper
import AdminDashboard from './pages/adminpanel';       // Your existing dashboard page
import Users from './pages/userspage';                 // Your users management page

function AppWrapper() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Optional: your auth check logic
  //   useEffect(() => {
    //   // Automatically check if token exists and fetch user
    //   const fetchUser = async () => {
    //     try {
    //       const res = await fetch('http://localhost:5000/api/auth/me', {
    //         credentials: 'include', // Send cookies with request
    //       });
  
    //       if (res.ok) {
    //         const data = await res.json();
    //         console.log('User data:', data.user);
    //         setUser(data.user);
  
    //         // Redirect based on role
    //         if (data.user.role === 'Admin') {
    //           navigate('/admin-panel');
    //         } else if (data.user.role === 'Customer') {
    //           navigate('/customer-panel');
    //         }
    //       }
    //     } catch (err) {
    //       console.log('User not logged in.');
    //     }
    //   };
  
    //   fetchUser();
    // }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />

      {/* Admin panel routes wrapped inside AdminLayout */}
      <Route path="/admin-panel" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />   {/* /admin-panel */}
        <Route path="users" element={<Users />} />     {/* /admin-panel/users */}
      </Route>

      <Route path="/customer-panel" element={<CustomerPanel />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
