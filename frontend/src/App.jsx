import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Landing from './pages/landingpage';
import Login from './components/Auth/login';
import Signup from './components/Auth/signup';
import CustomerPanel from './pages/customerpanel';

import AdminLayout from './pages/adminlayout';       // Layout wrapper for admin panel
import AdminDashboard from './pages/adminpanel';    // Admin dashboard page
import Users from './pages/userspage';               // Users management page
import AdminVendorList from './pages/adminvendorlist'; // <-- Import vendor list page

import VendorRegister from './pages/vendorregister';
import VendorStatus from './pages/status';
import ChooseRole from './components/chooserole';

function AppWrapper() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Optional auth check logic (commented out)

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/register-vendor" element={<VendorRegister />} />
      <Route path="/vendor/status" element={<VendorStatus />} />
      <Route path="/choose-role" element={<ChooseRole />} />

      {/* Admin panel routes wrapped inside AdminLayout */}
      <Route path="/admin-panel" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />   {/* /admin-panel */}
        <Route path="users" element={<Users />} />     {/* /admin-panel/users */}
        <Route path="vendors" element={<AdminVendorList />} /> {/* /admin-panel/vendors */}
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
