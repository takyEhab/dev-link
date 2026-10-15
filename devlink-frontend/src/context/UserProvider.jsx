import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { checkAuth, login, logout } from "../services/auth";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth when app loads
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await checkAuth();
        setUser(data.user);
      } catch {
        localStorage.removeItem("devlink_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Optional: login and logout helpers
  const apiLogin = async (email, password) => {
    const data = await login(email, password);
    if (data.data?.token) {
      localStorage.setItem("devlink_token", data.data.token);
    }
    setUser(data.data.user);
    return data;
  };

  const apiLogout = async () => {
    await logout();
    localStorage.removeItem("devlink_token");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, apiLogin, apiLogout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};
