"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/api.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, role }

  useEffect(() => {
    const checkAuth = async () => {
      const token =
        typeof window !== "undefined" && localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await get("/auth/me");
        if (res.data.user) setUser(res.data.user);
        else logout()
      } catch (err) {
        logout()
        console.error("User verification failed", err);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.reload()
  };

  return (
    <AuthContext.Provider value={{ user, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
