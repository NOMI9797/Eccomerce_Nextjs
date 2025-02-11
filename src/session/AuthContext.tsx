"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getCurrentUser, signOutUser } from "@/appwrite/auth";
// Define the shape of our auth context
interface AuthContextType {
user: any;
setUser: (user: any) => void;
logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
// initial state is undefined so we know it's loading
const [user, setUser] = useState<any>(undefined);
// Load current user on provider mount
useEffect(() => {
async function loadUser() {
try {
const storedUser = localStorage.getItem("user");
if (storedUser) {
setUser(JSON.parse(storedUser));
} else {
try {
const currentUser = await getCurrentUser();
if (currentUser) {
setUser(currentUser);
localStorage.setItem("user", JSON.stringify(currentUser));
} else {
setUser(null);
}
} catch (error: any) {
if (error.message && error.message.includes("missing scope")) {
console.warn("Current user cannot be loaded due to missing scope. Using stored user if available.");
} else {
console.error("Error loading current user:", error);
}
setUser(null);
}
}
} catch (error) {
console.error("Error during loadUser:", error);
setUser(null);
}
}
loadUser();
}, []);
const logout = async () => {
try {
await signOutUser();
} catch (error) {
console.error("Error during sign out:", error);
}
setUser(null);
localStorage.removeItem("user");
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