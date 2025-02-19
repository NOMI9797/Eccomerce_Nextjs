// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/session/AuthContext";

export default function Header() {
  const { user, logout, isUserAdmin } = useAuth();

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              KharedLo
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/Homepage" className="text-sm font-medium">
                  Home
                </Link>
                {isUserAdmin && (
                  <Link href="/Dashboard" className="text-sm font-medium">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-sm font-medium text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium">
                  Login
                </Link>
                <Link href="/signup" className="text-sm font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
