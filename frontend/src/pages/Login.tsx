import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { IUser, LoginResponse } from "../interfaces/user";
import Setup2FAModal from "../components/Setup2FA";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSumbitting, setIsSumbitting] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [code, setCode] = useState("");
  const [show2FAInput, setShow2FAInput] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

  const submit2FACode = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API}/2fa/verify`, {
      email,
      token: code,
    });

    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    setIsSumbitting(true);
    e.preventDefault();
    setError(null);

    try {
      const { data } = await axios.post<LoginResponse>(
        `${process.env.REACT_APP_API}/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data) {
        if (data.payload.twoFAEnabled) {
          setShow2FAInput(true);
          setUser(data.payload);
          return;
        } else {
          // Save the token in local storage for authentication
          setShow2FAModal(true);
          setUser(data.payload);

          // return navigate("/dashboard");
        }
      }
    } catch (error: any) {
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

  // const handleGoogleLogin = () => {
  //   setError(null);
  //   const authWindow = window.open(
  //     `${process.env.REACT_APP_API}/auth/google/popup`,
  //     "_blank",
  //     "width=500,height=600"
  //   );

  //   const messageHandler = (event: MessageEvent) => {
  //     if (event.origin !== process.env.NEXT_PUBLIC_SERVER_URL) return;
  //     console.log("===============", event);

  //     const { token } = event.data;
  //     if (token) {
  //       console.log("Received token from popup:", token);
  //       localStorage.setItem("token", token);
  //       return navigate("/dashboard");
  //     }
  //   };

  //   window.addEventListener("message", messageHandler, false);

  //   // cleanup
  //   const cleanup = () => window.removeEventListener("message", messageHandler);
  //   authWindow?.addEventListener("beforeunload", cleanup);
  // };
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API}/auth/google`;
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-80 space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
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
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={isSumbitting}
          type="submit"
          aria-label="Login"
          onClick={handleLogin}
        >
          {isSumbitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-white">Submitting...</span>
            </div>
          ) : (
            "Login"
          )}
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-full max-w-xs border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 px-4 py-2 rounded shadow-sm transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
        <div className="text-center text-sm mt-4">
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Register here
            </Link>
          </p>
          <p>
            <Link
              to="/forgot-password"
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Forgot Password
            </Link>
          </p>
        </div>
      </form>
      {user && show2FAModal && (
        <Setup2FAModal
          email={user.email}
          onClose={() => setShow2FAModal(false)}
        />
      )}
    </div>
  );
};

export default Login;
