"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getCurrentUser, signOutUser } from "@/appwrite/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check localStorage first
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsLoading(false);
          return;
        }

        // If no stored user, check Appwrite session
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          setUser(null);
          // Only redirect if not already on auth pages
          const path = window.location.pathname;
          if (path !== '/signup' && path !== '/login') {
            router.push('/signup');
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
        const path = window.location.pathname;
        if (path !== '/signup' && path !== '/login') {
          router.push('/signup');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      setUser(null);
      localStorage.removeItem("user");
      router.push('/login');
    } catch (error) {
      console.error("Error during sign out:", error);
      setUser(null);
      localStorage.removeItem("user");
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // or return a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};