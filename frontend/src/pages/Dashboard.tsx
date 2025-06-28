import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import Setup2FAModal from "../components/Setup2FA";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
  const handleDisable2FA = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/2fa/disable`,
        {
          id: user?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        if (user) {
          setUser({ ...user, twoFAEnabled: false });
        }
        setTimeout(
          () => setError("Two-Factor Authentication has been disabled."),
          1500
        );
      } else {
        setTimeout(
          () => setError("Failed to disable Two-Factor Authentication."),
          1500
        );
      }
    } catch {
      setTimeout(() => setError("2FA setup failed"), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
      <p className="text-gray-600 mt-2 mb-4">
        This is a demo page for authentication testing.
      </p>
      {user?.twoFAEnabled ? (
        <button
          onClick={handleDisable2FA}
          className="text-sm text-red-600 hover:underline mb-4"
        >
          Disable Two-Factor Authentication
        </button>
      ) : (
        <button
          onClick={() => setShow2FAModal(true)}
          disabled={loading}
          className="text-sm text-red-600 hover:underline disabled:hover:no-underline mb-4"
        >
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75 mb-4"></div>
            </div>
          ) : (
            <span>Enable Two-Factor Authentication</span>
          )}
        </button>
      )}

      {error && <p className="text-red-500 text-sm my-4">{error}</p>}

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Log Out
      </button>
      {user?._id && show2FAModal && (
        <Setup2FAModal id={user._id} onClose={() => setShow2FAModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
