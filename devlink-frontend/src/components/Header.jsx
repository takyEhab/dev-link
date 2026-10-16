import {
  Bell,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Code2,
  FolderGit2,
  Users,
  MessageSquare,
} from "lucide-react";
import { io } from "socket.io-client";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import api, { SOCKET_URL } from "../services/api";
import { AvatarImage } from "./SafeImage";

const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const { user, apiLogout, loading } = useContext(UserContext);
  const hasToken =
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem("devlink_token"));
  const location = useLocation();
  const navigate = useNavigate();

  // Close menus on route change
  useEffect(() => {
    setUserMenuOpen(false);
    setNotificationOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
        setNotificationOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
    if (userMenuOpen) setUserMenuOpen(false);

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
    setUserMenuOpen((prev) => !prev);
    if (notificationOpen) setNotificationOpen(false);
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

  const isCurrentRoute = (path) => location.pathname === path;

  return (
    <header className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-500/20 group-hover:bg-indigo-500 transition-colors">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                DevLink
              </span>
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isCurrentRoute("/")
                    ? "text-white bg-zinc-900"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                }`}
              >
                Feed
              </Link>
              <Link
                to="/developers"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isCurrentRoute("/developers")
                    ? "text-white bg-zinc-900"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                }`}
              >
                Developers
              </Link>

              {loading && hasToken ? (
                <div className="px-3 py-1.5 flex items-center">
                  <div className="w-16 h-4 rounded-md bg-zinc-900 border border-zinc-800/60 animate-pulse" />
                </div>
              ) : user ? (
                <Link
                  to="/messages"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isCurrentRoute("/messages")
                      ? "text-white bg-zinc-900"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                  }`}
                >
                  Messages
                </Link>
              ) : null}
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {loading ? (
              hasToken ? (
                <div
                  className="flex items-center space-x-3"
                  aria-label="Loading profile"
                >
                  {/* Notification Bell Skeleton */}
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800/80 animate-pulse flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-zinc-800/80" />
                  </div>

                  {/* Profile Button Skeleton */}
                  <div className="flex items-center space-x-2.5 p-1.5 rounded-lg border border-transparent animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700/80 shrink-0" />
                    <div className="hidden sm:flex flex-col space-y-1.5 min-w-[70px]">
                      <div className="w-16 h-2.5 bg-zinc-800 rounded-full" />
                      <div className="w-11 h-2 bg-zinc-800/60 rounded-full" />
                    </div>
                    <div className="w-3.5 h-3.5 rounded bg-zinc-800/40 hidden sm:block" />
                  </div>
                </div>
              ) : (
                <div
                  className="w-[74px] h-[34px] rounded-lg bg-zinc-900 border border-zinc-800/80 animate-pulse"
                  aria-label="Loading action"
                />
              )
            ) : user ? (
              <>
                {/* Notifications Dropdown */}
                <div className="relative" ref={notificationRef}>
                  <button
                    type="button"
                    onClick={handleNotificationToggle}
                    aria-label="Notifications"
                    className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notificationCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-zinc-950" />
                    )}
                  </button>

                  {notificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-sm font-medium text-white">
                          Notifications
                        </span>
                        {notificationCount > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                            {notificationCount} new
                          </span>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-8 text-center text-xs text-zinc-500">
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
                              className={`w-full text-left px-4 py-3 hover:bg-zinc-800/60 transition-colors ${
                                notification.isRead ? "" : "bg-indigo-500/5"
                              }`}
                            >
                              <p className="text-xs font-semibold text-zinc-200">
                                {notification.title}
                              </p>
                              <p className="text-xs text-zinc-400 truncate mt-0.5">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-zinc-500 mt-1">
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={handleUserMenuToggle}
                    className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
                  >
                    <AvatarImage
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                      fallbackClassName="w-8 h-8 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400"
                      iconClassName="w-4 h-4 text-zinc-400"
                    />
                    <div className="hidden sm:block text-left max-w-[120px]">
                      <div className="text-xs font-medium text-zinc-200 truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate">
                        {user.title || "Developer"}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                      <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-3 bg-zinc-950/40">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full border border-zinc-700 object-cover shrink-0"
                          fallbackClassName="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center shrink-0"
                          iconClassName="w-5 h-5 text-zinc-400"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-zinc-400 truncate">
                            {user.email}
                          </div>
                          {user.title && (
                            <div className="text-[11px] text-indigo-400 truncate mt-0.5">
                              {user.title}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2.5"
                      >
                        <User className="w-4 h-4 text-zinc-400" />
                        My Profile
                      </button>

                      <div className="border-t border-zinc-800 my-1" />

                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800/80 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                isCurrentRoute("/")
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <FolderGit2 className="w-4 h-4" /> Feed
            </Link>
            <Link
              to="/developers"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                isCurrentRoute("/developers")
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <Users className="w-4 h-4" /> Developers
            </Link>
            {loading && hasToken ? (
              <div className="flex items-center gap-3 px-3 py-2 animate-pulse">
                <div className="w-4 h-4 rounded bg-zinc-800" />
                <div className="w-20 h-4 rounded bg-zinc-800/60" />
              </div>
            ) : user ? (
              <Link
                to="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isCurrentRoute("/messages")
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Messages
              </Link>
            ) : null}
            {!loading && !user && (
              <div className="pt-2">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center w-full py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Sign In / Register
                </Link>
              </div>
            )}
            {loading && !hasToken && (
              <div className="pt-2 px-1">
                <div className="w-full h-8 rounded-lg bg-zinc-900 border border-zinc-800/80 animate-pulse" />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
