import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BsLayoutSidebar } from "react-icons/bs";

import api from "../config/axios";
import { useAuth } from "../context/AuthContext";
import SidebarUser from "./SidebarUser";
import ChatMenu from "./ChatMenu";
import DeleteChatModal from "./DeleteChatModal";

const Sidebar = ({
  collapsed,
  setCollapsed,
  activeChatId,
  onSelectChat,
  onNewChat,
}) => {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);


  const [chats, setChats] = useState([]);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteChatId, setDeleteChatId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) =>
  (chat.title || "")
    .toLowerCase()
    .includes(searchQuery.toLowerCase())
);

  const truncate = (text, maxLength = 22) =>
    text && text.length > maxLength
      ? text.slice(0, maxLength).trim() + "..."
      : text || "";

  /* -------- Fetch chats -------- */
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/chats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.warn("Backend not running, skipping chat fetch.");
        setChats([]);
      }
    };

    fetchChats();
  }, []);

  /* -------- Delete confirmed -------- */
  const confirmDelete = async () => {
    if (!deleteChatId) return;

    const token = localStorage.getItem("token");
    await api.delete(`/chats/${deleteChatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setChats((prev) => prev.filter((c) => c.id !== deleteChatId));

    if (activeChatId === deleteChatId) {
      onNewChat();
    }

    setDeleteChatId(null);
  };

  return (
    <>
    {isLoggedIn && (<div
      className={`h-full bg-neutral-900 border-r border-neutral-800 transition-all duration-300 flex flex-col z-10 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        {!collapsed && (
          <img src="/logo.png" alt="NITI AI" className="w-6 h-6 ml-2" />
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hover:text-white text-xl p-2 rounded-md hover:bg-neutral-800 transition"
        >
          <BsLayoutSidebar />
        </button>
      </div>

      {/* New Chat */}
      <div className="px-2.5">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-1 px-2 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800/90 text-sm text-neutral-400"
        >
          <HiOutlinePencilAlt className="text-2xl text-white" />
          {!collapsed && "New chat"}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-2.5 mt-1">
          <div className="flex items-center bg-neutral-900 rounded-lg px-2 py-2">
            <FiSearch className="text-2xl" />
            <input
  placeholder="Search chats"
  className="bg-transparent text-sm ml-1 outline-none w-full"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

          </div>
        </div>
      )}

      {/* Chats */}
      <div className="flex-1 mt-3 px-2.5 overflow-y-auto">
        <p className="px-2 py-2 text-sm text-neutral-500">
          {!collapsed && "Your chats"}
        </p>

        {!collapsed &&
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-sm cursor-pointer
                ${
                  activeChatId === chat.id
                    ? "bg-neutral-800/50 text-white"
                    : "text-neutral-300 hover:bg-neutral-700"
                }`}
            >
              <span className="truncate">
                {truncate(chat.title || "New chat")}
              </span>

              {/* MENU (click-safe) */}
              <div onClick={(e) => e.stopPropagation()}>
                <ChatMenu
                  chatId={chat.id}
                  open={menuOpenId === chat.id}
                  setOpen={(v) =>
                    setMenuOpenId(v ? chat.id : null)
                  }
                  onRenamed={(title) =>
                    setChats((prev) =>
                      prev.map((c) =>
                        c.id === chat.id ? { ...c, title } : c
                      )
                    )
                  }
                  onRequestDelete={() =>
                    setDeleteChatId(chat.id)
                  }
                />
              </div>
            </div>
          ))}
      </div>

      <SidebarUser collapsed={collapsed} />

      <DeleteChatModal
        open={!!deleteChatId}
        onClose={() => setDeleteChatId(null)}
        onConfirm={confirmDelete}
      />
    </div>)}
  </>

  );
};

export default Sidebar;
