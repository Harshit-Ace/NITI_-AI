import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar1";
import ChatHeader from "../components/ChatHeader";
import ChatArea from "../components/ChatArea";

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

  const [activeChatId, setActiveChatId] = useState(searchParams.get("chatId"));

  useEffect(() => {
    const chatIdFromUrl = searchParams.get("chatId");
    if (chatIdFromUrl !== activeChatId) {
      setActiveChatId(chatIdFromUrl);
    }
  }, [searchParams]);

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setSearchParams({ chatId });
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setSearchParams({});
  };

  return (
    <div className="h-screen flex bg-neutral-900 text-white overflow-hidden">
      <Sidebar
        key={sidebarRefreshKey}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <ChatArea
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          setSearchParams={setSearchParams}
          onChatCreated={() => setSidebarRefreshKey((k) => k + 1)}
        />
      </div>
    </div>
  );
};

export default Home;
