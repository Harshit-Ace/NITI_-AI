import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import api from "../config/axios";

const ChatMenu = ({
  chatId,
  open,
  setOpen,
  onRenamed,
  onRequestDelete,
}) => {
  const ref = useRef(null);
  const inputRef = useRef(null);

  const [isRenaming, setIsRenaming] = useState(false);
  const [title, setTitle] = useState("");

  /* -------- Outside click -------- */
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setIsRenaming(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpen]);

  /* -------- Autofocus rename input -------- */
  useEffect(() => {
    if (isRenaming) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isRenaming]);

  /* -------- Save rename -------- */
  const saveRename = async () => {
    if (!title.trim()) {
      setIsRenaming(false);
      return;
    }

    const token = localStorage.getItem("token");

    await api.post(
      `/chats/${chatId}/rename/manual`,
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    onRenamed(title);
    setIsRenaming(false);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* 3-dot button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-1 rounded hover:bg-neutral-700"
      >
        <BsThreeDots />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg z-50 p-2">
          {/* Rename */}
          {!isRenaming ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              className="w-full text-left px-2 py-1.5 text-sm hover:bg-neutral-700 rounded"
            >
              Rename
            </button>
          ) : (
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveRename();
                if (e.key === "Escape") setIsRenaming(false);
              }}
              placeholder="New name"
              className="w-full bg-neutral-700 text-sm text-white px-2 py-1.5 rounded outline-none"
            />
          )}

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onRequestDelete();
            }}
            className="w-full text-left px-2 py-1.5 text-sm text-red-300 hover:bg-neutral-700 rounded mt-1"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatMenu;
