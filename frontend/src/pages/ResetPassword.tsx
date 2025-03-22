import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { SuccessResponse } from "../interfaces/user";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [isSumbitting, setIsSumbitting] = useState<boolean>(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    setIsSumbitting(true);
    e.preventDefault();
    setError(null);
    setAlert(null);

    try {
      setError(null);
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");
      const { data } = await axios.put<SuccessResponse>(
        `${process.env.REACT_APP_API}/auth/reset-password`,
        { token, password },
        { headers: { "Content-Type": "application/json" } }
      );
      setAlert(`${data.message}! You will be redirected to login in 3 seconds`);
      setIsSumbitting(false);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      setAlert(null);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Unexpected error occurred";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred");
      }
      setIsSumbitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleResetPassword}
        className="bg-white p-6 rounded shadow-md w-80 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        {alert && <p className="text-center text-green-500 text-sm">{alert}</p>}
        {error && <p className="text-center text-red-500 text-sm">{error}</p>}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={isSumbitting}
        >
          {isSumbitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-white">Submitting...</span>
            </div>
          ) : (
            "Reset Password"
          )}
        </button>
        <div className="text-right text-sm mt-4">
          <Link to="/" className="text-blue-500 cursor-pointer hover:underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
