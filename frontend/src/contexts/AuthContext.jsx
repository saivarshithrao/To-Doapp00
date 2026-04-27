import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      localStorage.removeItem("access_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMe(); }, [loadMe]);

  const setSession = (token, userData) => {
    localStorage.setItem("access_token", token);
    setUser(userData);
  };

  const signup = async (email, password, name) => {
    const { data } = await api.post("/auth/signup", { email, password, name });
    setSession(data.access_token, data.user);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.requires_mfa) return { requires_mfa: true, mfa_token: data.mfa_token };
    setSession(data.access_token, data.user);
    return { requires_mfa: false, user: data.user };
  };

  const verifyMfa = async (mfa_token, otp) => {
    const { data } = await api.post("/auth/mfa/verify", { mfa_token, otp });
    setSession(data.access_token, data.user);
    return data;
  };

  const googleSession = async (session_id) => {
    const { data } = await api.post("/auth/google/session", { session_id });
    setSession(data.access_token, data.user);
    return data;
  };

  const toggleMfa = async (enabled) => {
    const { data } = await api.post("/auth/mfa/toggle", { enabled });
    setUser((u) => ({ ...u, mfa_enabled: data.mfa_enabled }));
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, verifyMfa, googleSession, toggleMfa, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
