import { useState, useRef, useEffect } from "react";
import UserMenu from "./UserMenu";
import { useAuth } from "../context/AuthContext";

const SidebarUser = ({ collapsed }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const initials =
    user?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* User Row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full border-t border-neutral-800 p-3 flex items-center gap-3 hover:bg-neutral-800 transition"
      >
        <div className="w-9 h-9 rounded-full bg-rose-400 flex items-center justify-center font-medium text-white text-lg">
          {initials}
        </div>

        {!collapsed && (
          <div className="text-sm text-left">
            <p className="font-medium">{user?.full_name}</p>
          </div>
        )}
      </button>

      {/* Popover */}
      {open && <UserMenu />}
    </div>
  );
};

export default SidebarUser;
