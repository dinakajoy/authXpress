import React from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white p-6 flex flex-col h-screen">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Navigation Links - Grow to push logout down */}
        <ul className="mt-6 space-y-4 flex-grow">
          <li>
            <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/dashboard/roles-and-permissions" className="block px-4 py-2 rounded hover:bg-gray-700">
              Roles & Permissions
            </Link>
          </li>
          <li>
            <Link to="/dashboard/users-management" className="block px-4 py-2 rounded hover:bg-gray-700">
              Users Management
            </Link>
          </li>
        </ul>

        {/* Logout Button - Sticks to Bottom */}
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </nav>

      {/* Main Content (Dynamic Content Will Be Rendered Here) */}
      <div className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
