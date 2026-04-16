import { useState, useRef } from "react";
import api from "../config/axios";
import { FaArrowUp } from "react-icons/fa";

const ChatInput = ({
  chatId,
  messageCount,
  setActiveChatId,
  setSearchParams,
  onChatCreated,
  onUserMessage,
  onAIStart,
  onAIEnd,
}) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const renameAttemptedRef = useRef(false); // 🔥

  const sendMessage = async () => {

    
    if (!text.trim()) return;

    const token = localStorage.getItem("token");

    if (!token) {
    window.location.href = "/login";
    return;
  }

    const content = text.trim();

    const userMsg = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
    };

    onUserMessage?.(userMsg);
    setText("");
    setSending(true);
    onAIStart?.();

    try {
      let finalChatId = chatId;

      if (!chatId) {
        const title = content.slice(0, 50);

        const chatRes = await api.post(
          "/chats",
          { title },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        finalChatId = chatRes.data.id;
        setActiveChatId(finalChatId);
        setSearchParams({ chatId: finalChatId });
        onChatCreated?.();
      }

      const res = await api.post(
        "/messages/send",
        {
          chat_id: finalChatId,
          content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onAIEnd?.(res.data);

      // 🔥 SAFE rename (once, early, non-blocking)
      if (
        finalChatId &&
        messageCount <= 4 &&
        !renameAttemptedRef.current
      ) {
        renameAttemptedRef.current = true;

        api
          .post(
            `/chats/${finalChatId}/rename`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .catch(() => {});
      }

    } catch (err) {
      onAIEnd?.({
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Something went wrong. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl">
        <div className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-full px-5 py-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask anything"
            className="flex-1 bg-transparent outline-none text-sm text-white"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            disabled={sending || !text.trim()}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center"
          >
            <FaArrowUp className="text-neutral-900 text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
