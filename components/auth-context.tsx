"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; email: string; name?: string } | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backend}/api/auth/me`, { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user ?? null);
    } catch (err) {
      console.error("auth: fetchMe error", err);
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchMe();
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backend}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { ok: false, error: data?.error || "Login failed" };
      }
      const data = await res.json();
      // Immediately set the user from login response
      if (data.user) {
        setUser(data.user);
      }
      return { ok: true };
    } catch (err) {
      console.error(err);
      return { ok: false, error: "Network error" };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backend}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { ok: false, error: data?.error || "Signup failed" };
      }
      const data = await res.json();
      // Immediately set the user from signup response
      if (data.user) {
        setUser(data.user);
      }
      return { ok: true };
    } catch (err) {
      console.error(err);
      return { ok: false, error: "Network error" };
    }
  };

  const logout = async () => {
    try {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      await fetch(`${backend}/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("logout error", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refresh: fetchMe, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
