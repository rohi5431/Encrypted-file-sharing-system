import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/profile");

      const fetchedUser = res.data.user; // backend already correct
      setUser(fetchedUser);

      return fetchedUser; // ✅ IMPORTANT FIX
    } catch (err) {
      console.error("loadUser error:", err?.response?.data || err.message);
      setUser(null);
      return null; // ✅ IMPORTANT FIX
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, loadUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
