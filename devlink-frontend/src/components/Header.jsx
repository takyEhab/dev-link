import { Bell, Settings, User, LogOut, ChevronDown, UserRound } from "lucide-react";
import { io } from "socket.io-client";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import api, { SOCKET_URL } from "../services/api";

// Simple UI Components
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-gray-600 bg-transparent text-white hover:bg-gray-700",
    ghost: "text-gray-300 hover:bg-gray-700 hover:text-white",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 py-3 text-base",
    sm: "h-8 px-3 py-1 text-xs",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

// Dropdown Menu Component
const DropdownMenu = ({ trigger, children, isOpen, onToggle }) => {
  return (
    <div className="relative">
      <button onClick={onToggle} className="flex items-center">
        {trigger}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center ${className}`}
  >
    {children}
  </button>
);

const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, apiLogout } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUserMenuOpen(false);
    setNotificationOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return undefined;
    }

    const loadNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        setNotifications(response.data.data.notifications);
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Unable to load notifications",
        );
      }
    };

    loadNotifications();
    const token = localStorage.getItem("devlink_token");
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
    });
    socket.on("new_notification", (notification) => {
      setNotifications((current) => [notification, ...current].slice(0, 50));
    });

    const pollInterval = setInterval(() => {
      if (!socket.connected) {
        loadNotifications();
      }
    }, 30000);

    return () => {
      clearInterval(pollInterval);
      socket.disconnect();
    };
  }, [user]);

  const notificationCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const handleNotificationToggle = async () => {
    const willOpen = !notificationOpen;
    setNotificationOpen(willOpen);

    if (willOpen) {
      try {
        const response = await api.get("/notifications");
        const latestNotifications = response.data.data.notifications;
        setNotifications(latestNotifications);

        if (latestNotifications.some((notification) => !notification.isRead)) {
          await api.patch("/notifications/read");
        }
        setNotifications((current) =>
          current.map((notification) => ({ ...notification, isRead: true })),
        );
      } catch {
        toast.error("Unable to mark notifications as read");
      }
    }
  };

  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleProfileClick = () => {
    setUserMenuOpen(false);

    navigate(`/developer/${user?.id || user?._id}`);
  };

  const handleLogoutClick = async () => {
    setUserMenuOpen(false);
    await apiLogout();
    toast.success("You have been logged out successfully.");
    navigate("/");
  };

  return (
    <header className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DL</span>
                </div>
                <h1 className="text-2xl font-bold text-white">DevLink</h1>
              </div>
            </Link>

            {/* Navigation Links - Only show when logged in */}
            {user && (
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  to="/developers"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Developers
                </Link>

                <Link
                  to="/messages"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Messages
                </Link>
              </nav>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                {/* test  */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative p-2"
                    onClick={handleNotificationToggle}
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                  {notificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                        <span className="font-medium text-white">
                          Notifications
                        </span>
                        <span className="text-xs text-gray-400">
                          {notifications.length}
                        </span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-8 text-center text-sm text-gray-400">
                            No notifications yet
                          </p>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() => {
                                setNotificationOpen(false);
                                if (notification.link)
                                  navigate(notification.link);
                              }}
                              className={`w-full text-left px-4 py-3 border-b border-gray-700 hover:bg-gray-700 ${notification.isRead ? "" : "bg-blue-500/10"}`}
                            >
                              <p className="text-sm font-medium text-white">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-300 truncate">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleString()}
                              </p>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <DropdownMenu
                  isOpen={userMenuOpen}
                  onToggle={handleUserMenuToggle}
                  trigger={
                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full border-2 border-gray-600"
                        />
                      ) : (
                        <UserRound className="w-5 h-5 text-emerald-300/70" />
                      )}

                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-medium text-white">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.title}
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  }
                >
                  <div className="px-4 py-3 border-b border-gray-700">
                    <div className="text-sm font-medium text-white">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </div>

                  <DropdownItem onClick={handleProfileClick}>
                    <User className="w-4 h-4 mr-3" />
                    My Profile
                  </DropdownItem>
                  <div className="border-t border-gray-700 mt-1 pt-1">
                    <DropdownItem
                      onClick={handleLogoutClick}
                      className="text-red-400 hover:text-red-300"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </DropdownItem>
                  </div>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
