import React from 'react'
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
      <p className="text-gray-600 mt-2 mb-4">This is a demo page for authentication testing.</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  )
}

export default Dashboard