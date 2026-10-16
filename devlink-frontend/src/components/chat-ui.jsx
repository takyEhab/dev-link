"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import {
  Send,
  Smile,
  Search,
  ArrowLeft,
  Check,
  CheckCheck,
  UserRound,
  Info,
  MessageSquare,
} from "lucide-react";
import api, { SOCKET_URL } from "../services/api";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";

const formatChatDate = (value) => {
  if (!value || ["Just now", "Yesterday"].includes(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const chatEmojis = [
  "😀",
  "😂",
  "😍",
  "😊",
  "😉",
  "🥳",
  "😎",
  "🤔",
  "😅",
  "😭",
  "👍",
  "❤️",
  "🔥",
  "🎉",
  "✨",
  "🚀",
  "💯",
  "🙏",
  "💡",
  "💻",
];

const ChatAvatar = ({ avatar, name, className }) => {
  const [imageFailed, setImageFailed] = useState(false);

  if (!avatar || imageFailed) {
    return (
      <div
        className={`${className} bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400`}
        aria-label={`${name} avatar placeholder`}
      >
        <UserRound className="w-1/2 h-1/2" />
      </div>
    );
  }

  return (
    <img
      src={avatar}
      alt={name}
      className={className}
      onError={() => setImageFailed(true)}
    />
  );
};

// Chat List Component
const ChatList = ({ chats, selectedChat, onSelectChat, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter((chat) => {
    const term = searchTerm.toLowerCase();
    return (
      chat.name?.toLowerCase().includes(term) ||
      chat.role?.toLowerCase().includes(term) ||
      chat.lastMessage?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full lg:w-80 h-full min-h-0 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1 inline" /> Back
            </button>
          )}
          <h2 className="text-base font-bold text-white tracking-tight">
            Messages
          </h2>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
            {chats.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5 pointer-events-none" />
          <input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Chat List Items */}
      <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-zinc-900">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            {searchTerm ? "No matching conversations" : "No conversations yet"}
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`p-3.5 cursor-pointer transition-colors ${
                selectedChat?.id === chat.id
                  ? "bg-zinc-900/90 border-l-2 border-indigo-500"
                  : "hover:bg-zinc-900/50"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative shrink-0">
                  <ChatAvatar
                    avatar={chat.avatar}
                    name={chat.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {chat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-xs font-semibold text-zinc-200 truncate">
                      {chat.name}
                    </h3>
                    <span className="text-[10px] text-zinc-500 shrink-0">
                      {formatChatDate(chat.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate mb-1">
                    {chat.role}
                    {chat.company ? ` at ${chat.company}` : ""}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {chat.lastMessage}
                  </p>
                </div>

                {chat.unread > 0 && (
                  <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded-full">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Message Component
const Message = ({ message, isMe }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <Check className="w-3 h-3 text-zinc-500" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-zinc-500" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-indigo-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2.5`}>
      <div
        className={`max-w-[85%] sm:max-w-md ${isMe ? "order-2" : "order-1"}`}
      >
        <div
          className={`px-3.5 py-2 text-xs leading-relaxed ${
            isMe
              ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm shadow-sm"
              : "bg-zinc-800/90 text-zinc-100 rounded-2xl rounded-bl-sm border border-zinc-700/60"
          }`}
        >
          <p className="break-words">{message.content}</p>
        </div>
        <div
          className={`flex items-center mt-1 space-x-1 ${
            isMe ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-[10px] text-zinc-500">
            {formatChatDate(message.timestamp)}
          </span>
          {isMe && getStatusIcon(message.status)}
        </div>
      </div>
    </div>
  );
};

// Chat Window Component
const ChatWindow = ({ chat, onBack, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    const content = newMessage.trim();

    if (!content || !chat) return;

    onSendMessage(content);
    setNewMessage("");
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((message) => `${message}${emoji}`);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
          <MessageSquare className="w-6 h-6 text-zinc-500" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">
          No conversation selected
        </h3>
        <p className="text-xs text-zinc-500 max-w-xs">
          Select a conversation from the left, or visit a developer's profile to
          send them a message.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-zinc-950">
      {/* Chat Header */}
      <div className="p-3.5 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={onBack}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <Link
              to={chat.otherUserId ? `/developer/${chat.otherUserId}` : "#"}
              title="Open developer profile"
              onClick={(event) => {
                if (!chat.otherUserId) event.preventDefault();
              }}
              className="shrink-0"
            >
              <div className="relative">
                <ChatAvatar
                  avatar={chat.avatar}
                  name={chat.name}
                  className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                />
                {chat.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                )}
              </div>
            </Link>
            <div className="min-w-0">
              <Link
                to={chat.otherUserId ? `/developer/${chat.otherUserId}` : "#"}
                title="Open developer profile"
                onClick={(event) => {
                  if (!chat.otherUserId) event.preventDefault();
                }}
                className="text-xs font-semibold text-white hover:text-indigo-400 transition-colors truncate block"
              >
                {chat.name}
              </Link>
              <p className="text-[11px] text-zinc-500 truncate">
                {chat.role}
                {chat.company ? ` at ${chat.company}` : ""}
                {chat.online && " • Online"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              type="button"
              title="Conversation information"
              onClick={() =>
                toast.info(`${chat.name} - ${chat.role || "Developer"}`)
              }
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-1">
        {chat.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-zinc-600">
            No messages yet. Say hello!
          </div>
        ) : (
          chat.messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isMe={message.sender === "me"}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <div className="relative shrink-0 p-3 border-t border-zinc-800 bg-zinc-900/40">
        {showEmojiPicker && (
          <div className="absolute bottom-full right-3 mb-2 w-64 rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 shadow-2xl z-20">
            <div className="grid grid-cols-5 gap-1">
              {chatEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiSelect(emoji)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-lg hover:bg-zinc-800 transition-colors"
                  aria-label={`Add ${emoji} emoji`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <div className="flex-1 relative flex items-center bg-zinc-900 rounded-lg border border-zinc-800 px-3 py-1.5 focus-within:border-indigo-500 transition-colors">
            <input
              ref={messageInputRef}
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="button"
              title="Add emoji"
              onClick={() => setShowEmojiPicker((visible) => !visible)}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-colors shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

// Main Chat UI
const ChatUI = ({ onBack }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true);
  const socketRef = useRef(null);
  const { user } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await api.get("/chats");
        setChats(
          response.data.data.conversations.map((chat) => ({
            ...chat,
            messages: [],
          })),
        );
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Unable to load conversations",
        );
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    const conversationId =
      location.state?.conversationId ||
      new URLSearchParams(location.search).get("conversation");
    const chat = chats.find(
      (item) => String(item.id) === String(conversationId),
    );
    if (chat) handleSelectChat(chat);
  }, [chats, location.search, location.state?.conversationId]);

  useEffect(() => {
    if (!user) return undefined;

    const token = localStorage.getItem("devlink_token");
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      timeout: 10000,
    });
    socketRef.current = socket;
    socket.on("new_message", (message) => {
      setChats((currentChats) =>
        currentChats.map((chat) =>
          chat.id === message.conversationId
            ? {
                ...chat,
                lastMessage: message.content,
                timestamp: "Just now",
                messages: [...chat.messages, message],
              }
            : chat,
        ),
      );
      setSelectedChat((currentChat) =>
        currentChat?.id === message.conversationId
          ? {
              ...currentChat,
              lastMessage: message.content,
              timestamp: "Just now",
              messages: [...currentChat.messages, message],
            }
          : currentChat,
      );
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket connect error (falling back to REST):", err.message);
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  // Polling fallback if Socket.IO is not connected (e.g. on serverless Vercel backend)
  useEffect(() => {
    if (!selectedChat?.id) return undefined;

    const interval = setInterval(async () => {
      if (!socketRef.current?.connected) {
        try {
          const response = await api.get(`/chats/${selectedChat.id}/messages`);
          setSelectedChat((current) =>
            current && current.id === selectedChat.id
              ? { ...current, messages: response.data.data.messages }
              : current,
          );
        } catch {
          // silent fallback
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedChat?.id]);

  const handleSelectChat = async (chat) => {
    try {
      const response = await api.get(`/chats/${chat.id}/messages`);
      const selected = { ...chat, messages: response.data.data.messages };
      setSelectedChat(selected);
      socketRef.current?.emit("join_conversation", chat.id);
      socketRef.current?.emit("mark_read", chat.id);
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to load messages");
      return;
    }
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  const handleSendMessage = async (content) => {
    if (!selectedChat) return;

    // Use Socket.io if connected
    if (socketRef.current?.connected) {
      socketRef.current.emit(
        "send_message",
        {
          conversationId: selectedChat.id,
          content,
        },
        (response) => {
          if (response?.error) toast.error(response.error);
        },
      );
      return;
    }

    // Graceful REST Fallback: sends immediately over HTTP when WebSockets are unavailable
    try {
      const response = await api.post(`/chats/${selectedChat.id}/messages`, {
        content,
      });
      const message = response.data.data.message;
      setChats((currentChats) =>
        currentChats.map((chat) =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                lastMessage: message.content,
                timestamp: "Just now",
                messages: [...chat.messages, message],
              }
            : chat,
        ),
      );
      setSelectedChat((currentChat) =>
        currentChat?.id === selectedChat.id
          ? {
              ...currentChat,
              lastMessage: message.content,
              timestamp: "Just now",
              messages: [...currentChat.messages, message],
            }
          : currentChat,
      );
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to send message");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] min-h-0 bg-zinc-950 flex overflow-hidden">
      {/* Chat List */}
      <div
        className={`${showChatList ? "block" : "hidden"} lg:block h-full min-h-0 shrink-0`}
      >
        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          onBack={onBack}
        />
      </div>

      {/* Chat Window */}
      <div
        className={`${!showChatList ? "block" : "hidden"} lg:flex flex-1 min-w-0 min-h-0`}
      >
        <ChatWindow
          chat={selectedChat}
          onBack={handleBackToList}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatUI;
