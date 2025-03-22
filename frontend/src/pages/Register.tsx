import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { SuccessResponse } from "../interfaces/user";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSumbitting, setIsSumbitting] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent) => {
    setIsSumbitting(true);
    e.preventDefault();
    setError(null);

    try {
      setError(null);
      const { data } = await axios.post<SuccessResponse>(
        `${process.env.REACT_APP_API}/auth/register`,
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.message) {
        navigate("/");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Unexpected error occurred";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSumbitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-80 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
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
            "Sign Up"
          )}
        </button>
        <div className="text-center text-sm mt-4">
          <p>
            Already have an account?{" "}
            <Link
              to="/"
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
