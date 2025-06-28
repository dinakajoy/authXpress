import React from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogout = async () => {
    if (user) {
      await axios.get(`${process.env.REACT_APP_API}/auth/logout/${user._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      window.localStorage.removeItem("token");
      return navigate("/");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Navigation Links - Grow to push logout down */}
        <ul className="mt-6 space-y-4 flex-grow">
          <li>
            <Link
              to="/dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/roles-and-permissions"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Roles & Permissions
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/users-management"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Users Management
            </Link>
          </li>
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
