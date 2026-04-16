import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../config/axios";

const Signup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    // 🔒 Frontend validation
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        name: fullName,
        email,
        password,
      });

      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("Account already exists");
      } else {
        toast.error("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="max-w-6xl min-h-screen p-5 grid grid-cols-1 sm:grid-cols-2 rounded-xl overflow-hidden">

        {/* LEFT PANEL */}
        <div
          className="hidden sm:flex flex-col justify-end p-5 text-white rounded-2xl bg-cover bg-no-repeat bg-blend-overlay bg-neutral-950/30"
          style={{
            backgroundImage: "url('/image.png')",
            backgroundPosition: "center 100%",
          }}
        >
          <div className="mb-10">
            <h1 className="text-4xl font-bold font-red leading-tight">
              Get Started <br /> with Us
            </h1>
          </div>

          <div className="flex gap-2">
            <Step active text="Sign up" />
            <Step text="Set up your profile" />
            <Step text="Find a scheme that suits you" />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col justify-center px-8 md:px-14 bg-neutral-950 text-white">
          <h2 className="text-2xl font-semibold mb-1">
            Create your Account
          </h2>

          <p className="text-sm text-neutral-400 mb-6">
            Signup and explore 4500+ government schemes
          </p>

          <form className="space-y-4" onSubmit={handleSignup}>
            <Input
              label="Full Name"
              placeholder="eg. John Franklin"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="Email"
              placeholder="eg. johnfrank@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              helper="Must be at least 8 characters."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              show={showConfirmPassword}
              toggle={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-white text-black py-2 rounded-md font-medium hover:bg-neutral-200 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-xs text-neutral-400 mt-5 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-white underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

/* ---------- Reusable Components ---------- */

const Input = ({ label, placeholder, value, onChange }) => (
  <div>
    <label className="text-xs text-neutral-400">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full mt-1 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-sm focus:outline-none focus:border-white"
    />
  </div>
);

const PasswordInput = ({
  label,
  placeholder,
  helper,
  value,
  onChange,
  show,
  toggle,
}) => (
  <div>
    <label className="text-xs text-neutral-400">{label}</label>

    <div className="relative mt-1">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 pr-10 rounded-md bg-neutral-900 border border-neutral-700 text-sm focus:outline-none focus:border-white"
      />

      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>

    {helper && (
      <p className="text-[11px] text-neutral-500 mt-1">
        {helper}
      </p>
    )}
  </div>
);

const Step = ({ text, active }) => (
  <div
    className={`flex-1 p-3 md:p-8 rounded-lg font-light text-md ${
      active
        ? "bg-neutral-950/80 text-white"
        : "bg-neutral-950/30 text-white"
    }`}
  >
    {text}
  </div>
);
