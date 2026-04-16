import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import api from "../config/axios";
import SettingsGeneral from "./SettingsGeneral";

const SettingsModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("general");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[500px] h-[600px] bg-neutral-900 rounded-xl shadow-xl flex overflow-hidden">


        {/* Right */}
        <div className="flex-1 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white"
          >
            <FiX size={18} />
          </button>

          {loading ? (
            <p className="text-neutral-400">Loading...</p>
          ) : (
            activeTab === "general" && (
              <SettingsGeneral
                profile={profile}
                setProfile={setProfile}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
