"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem("veda_session_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      const publicRoutes = ["/login", "/signup"];
      const isPublicRoute = publicRoutes.includes(pathname);

      if (!user && !isPublicRoute) {
        router.push("/login");
      } else if (user && isPublicRoute) {
        router.push("/create"); 
      }
    }
  }, [user, pathname, loading, router]);

  const login = (email: string, name?: string) => {
    const sessionUser = { name: name || email.split("@")[0], email };
    localStorage.setItem("veda_session_user", JSON.stringify(sessionUser));
    setUser(sessionUser);
    router.push("/create");
  };

  const logout = () => {
    localStorage.removeItem("veda_session_user");
    setUser(null);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center">
        <div className="h-5 w-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be mounted within an AuthProvider");
  return context;
};