import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../config/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const res = await api.post(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Login response:", res.data);

    const token = res.data.access_token;

    if (!token) {
      throw new Error("No access token received");
    }

    localStorage.setItem("token", token);

    console.log("Token stored:", token);

    await refreshUser();

    toast.success("Login successful");
    navigate("/");
  } catch (err) {
    console.error("Login Error:", err);
    console.error("Response:", err.response?.data);

    if (err.response?.status === 401) {
      toast.error("Invalid credentials");
    } else {
      toast.error(
        err.response?.data?.detail || "Login failed"
      );
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-950 overflow-hidden">
      <div className="w-full h-2/3 max-w-sm p-8 rounded-xl bg-neutral-950 border border-neutral-700 text-white">
        <div className="flex flex-col justify-center h-full">
          <h2 className="text-2xl font-semibold mb-1 text-center">
            Welcome Back!
          </h2>

          <p className="text-sm text-neutral-400 mb-6 text-center">
            Enter your personal data to access your account.
          </p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <Input
              label="Email"
              placeholder="eg. johnfrank@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <label className="text-xs text-neutral-400">
                Password
              </label>

              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 pr-10 rounded-md bg-neutral-800 border border-neutral-700 text-sm focus:outline-none focus:border-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-white text-black py-2 rounded-md font-medium hover:bg-neutral-200 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-xs text-neutral-400 mt-5 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-white underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

/* ---------- Input ---------- */

const Input = ({ label, placeholder, value, onChange }) => (
  <div>
    <label className="text-xs text-neutral-400">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full mt-1 px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-sm focus:outline-none focus:border-white"
    />
  </div>
);
