import { useEffect, useRef, useState } from "react";
import api from "../config/axios";
import ChatInput from "./ChatInput";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";
import remarkGfm from "remark-gfm";


const ChatArea = ({
  activeChatId,
  setActiveChatId,
  setSearchParams,
  onChatCreated,
  
}) => {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNewChat, setIsNewChat] = useState(!activeChatId);

  const scrollRef = useRef(null);

  useEffect(() => {
    setIsNewChat(!activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get(`/messages/${activeChatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data || []);
    };

    fetchMessages();
  }, [activeChatId]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* ---------- NEW CHAT LANDING ---------- */
  if (isNewChat) {
    return (
      <div className="flex flex-col flex-1 bg-neutral-900">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-3xl font-semibold text-white mb-20">
             {user?.full_name
    ? `Hi ${user.full_name.split(" ")[0]}, what can I help you with?`
    : "What can I help you with?"}
          </h1>
          <div className="w-full max-w-2xl transition-all duration-1000">
            <ChatInput
              chatId={null}
              messageCount={messages.length}   
              setActiveChatId={(id) => {
                setIsNewChat(false);
                setActiveChatId(id);
              }}
              setSearchParams={setSearchParams}
              onChatCreated={onChatCreated}
              onUserMessage={(msg) =>
                setMessages((prev) => [...prev, msg])
              }
              onAIStart={() => setLoading(true)}
              onAIEnd={(aiMsg) => {
                setMessages((prev) => [...prev, aiMsg]);
                setLoading(false);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ---------- NORMAL CHAT ---------- */
  return (
    <div className="flex flex-col flex-1 bg-neutral-900 min-h-0">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0 pt-8 pb-32"
      >
        <div className="mx-auto max-w-3xl px-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {loading && (
            <div className="flex justify-start mt-4">
              <div className="bg-neutral-900 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-5 bg-linear-to-t from-neutral-900 via-neutral-900 to-neutral-900/50 pt-4">
        <div className="mx-auto max-w-2xl px-4 pb-6 pt-3 transition-all duration-500">
          <ChatInput
            chatId={activeChatId}
            messageCount={messages.length}   
            setActiveChatId={setActiveChatId}
            setSearchParams={setSearchParams}
            onUserMessage={(msg) =>
              setMessages((prev) => [...prev, msg])
            }
            onAIStart={() => setLoading(true)}
            onAIEnd={(aiMsg) => {
              setMessages((prev) => [...prev, aiMsg]);
              setLoading(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatArea;

/* ---------- Message bubble unchanged ---------- */

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-base leading-relaxed
          ${
            isUser
              ? "bg-neutral-800 text-white rounded-tr-none"
              : "bg-neutral-900 text-white/80 rounded-tl-none"
          }`}
      >
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    p: ({ children }) => (
      <p className="mb-2 last:mb-0">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc ml-4 mb-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal ml-4 mb-2">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="mb-1">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-white">
        {children}
      </strong>
    ),
    code: ({ children }) => (
      <code className="bg-neutral-800 px-1 py-0.5 rounded text-xs">
        {children}
      </code>
    ),

    /* 🔥 TABLE SUPPORT */
    table: ({ children }) => (
      <div className="overflow-x-auto my-3">
        <table className="border border-neutral-700 rounded-lg border-collapse w-full text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-neutral-800 text-white">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-neutral-700">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="align-top">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="border border-neutral-700 px-3 py-2 font-semibold text-left">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-neutral-700 px-3 py-2">
        {children}
      </td>
    ),
  }}
>
  {message.content}
</ReactMarkdown>

      </div>
    </div>
  );
};
