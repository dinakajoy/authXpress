import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogout = async () => {
    if (user) {
      await axios.get(`${process.env.REACT_APP_API}/auth/logout/${user._id}`, {
        headers: { "Content-Type": "application/json" },
      });
      window.localStorage.removeItem("token");
      return navigate("/");
    }
  };
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
      <p className="text-gray-600 mt-2 mb-4">
        This is a demo page for authentication testing.
      </p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
