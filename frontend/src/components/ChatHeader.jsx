import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ChatHeader = () => {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  return (
    <div className="h-11 my-1 flex items-center justify-between px-6 border-b border-neutral-800 bg-neutral-900">
      
      {/* Left: Brand (always visible) */}
      <div className="flex items-center gap-2">
        {!isLoggedIn && (
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="NITI AI"
              className="w-6 h-6"
            />
          </Link>
        )}

        <h1 className="text-2xl font-semibold tracking-wider font-red mt-1 text-white">
          NITI AI
        </h1>
      </div>

      {/* Right: Auth Buttons (only when logged out) */}
      {!isLoggedIn && (
        <div className="flex items-center gap-2">
          <Link to="/login">
            <button
              className="text-sm px-3 py-1.5 rounded-md
              text-white bg-neutral-800 border border-neutral-700
              hover:bg-neutral-700 transition"
            >
              Sign in
            </button>
          </Link>

          <Link to="/signup">
            <button
              className="text-sm px-3 py-1.5 rounded-md
              text-black bg-white hover:bg-neutral-200 transition"
            >
              Sign up
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
