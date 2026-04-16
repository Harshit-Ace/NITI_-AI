import { useState } from "react";
import {
  FiLogOut,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SettingsModal from "./SettingsModal";

const UserMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openSettings, setOpenSettings] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <div className="absolute bottom-14 left-2 w-60 rounded-xl bg-neutral-900 shadow-xl border border-neutral-700 p-2 text-sm z-50">
        {/* Header */}
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-full bg-rose-400 flex items-center justify-center font-semibold">
            {user?.full_name?.[0] || "U"}
          </div>
          <div>
            <p className="font-medium">{user?.full_name}</p>
            <p className="text-xs text-neutral-400">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-700 my-2" />

        {/* Menu Items */}
        <MenuItem
          icon={<FiSettings />}
          text="Settings"
          onClick={() => setOpenSettings(true)}
        />

        <MenuItem
          icon={<FiHelpCircle />}
          text="Help"
        />

        <div className="border-t border-neutral-700 my-2" />

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 text-red-400"
        >
          <FiLogOut />
          Log out
        </button>
      </div>

      {/* Settings Modal */}
      {openSettings && (
        <SettingsModal onClose={() => setOpenSettings(false)} />
      )}
    </>
  );
};

export default UserMenu;

/* ---------- Menu Item ---------- */

const MenuItem = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700"
  >
    {icon}
    {text}
  </button>
);
