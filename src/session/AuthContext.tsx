"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getCurrentUser, signOutUser } from "@/appwrite/auth";
import { useRouter } from "next/navigation";
// Define the shape of our auth context
interface AuthContextType {
user: any;
setUser: (user: any) => void;
logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
// initial state is undefined so we know it's loading
const [user, setUser] = useState<any>(null);
const router = useRouter();
// Load current user on provider mount
useEffect(() => {
async function loadUser() {
try {
// First try to get user from localStorage
const storedUser = localStorage.getItem("user");
if (storedUser) {
setUser(JSON.parse(storedUser));
return;
}
// If no stored user, try to get current user from Appwrite
try {
const currentUser = await getCurrentUser();
if (currentUser) {
setUser(currentUser);
localStorage.setItem("user", JSON.stringify(currentUser));
} else {
setUser(null);
router.push('/signup');
}
} catch (error: any) {
console.error("Error loading current user:", error);
setUser(null);
router.push('/signup');
}
} catch (error) {
console.error("Error during loadUser:", error);
setUser(null);
router.push('/signup');
}
}
loadUser();
}, [router]);
const logout = async () => {
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
  }
};
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