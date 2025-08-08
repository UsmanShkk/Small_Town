
import { useState } from "react";
import { FaUsers, FaStore, FaUtensils, FaShoppingCart, FaBars, FaHome } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const menuItems = [
    { label: "Home", icon: <FaHome />, path: "/" },
    { label: "Dashboard", icon: <FaBars />, path: "/admin-panel" },
    { label: "Users", icon: <FaUsers />, path: "/admin-panel/users" },
    { label: "Vendors", icon: <FaStore />, path: "/admin-panel/vendors" },
    { label: "Meals", icon: <FaUtensils />, path: "/admin-panel/meals" },
    { label: "Orders", icon: <FaShoppingCart />, path: "/admin-panel/orders" },
  ];

  return (
    <div className={`bg-gray-800 text-white h-screen p-5 pt-8 duration-300 ${open ? "w-64" : "w-20"}`}>
      <div className="flex justify-between items-center mb-10">
        <h1 className={`text-2xl font-bold ${!open && "hidden"}`}>Admin</h1>
        <FaBars className="cursor-pointer" onClick={() => setOpen(!open)} />
      </div>
      <ul className="space-y-6">
        {menuItems.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 p-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700 font-semibold" : ""
                }`
              }
            >
              <span>{item.icon}</span>
              {open && <span>{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
