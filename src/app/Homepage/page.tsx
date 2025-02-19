"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Link from "next/link";
import { useAuth } from "@/session/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

export default function LandingPage() {
  const { user, logout, isUserAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user has been resolved (i.e., not undefined) and there's no logged-in user, redirect.
    if (user === null) {
      router.push("/signup");
    }
  }, [user, router]);

  // Do not render until the auth state is resolved.
  if (user === undefined) return null;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {user ? (
        <div className="relative min-h-screen flex flex-col">
          {/* Background Image */}
          <Image
            src="/images/pexels-shattha-pilabut-38930-135620.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          {/* Content */}
          <div className="relative z-10 text-white flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center text-center">
              <h1 className="text-8xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 tracking-widest shadow-lg">
                Outfitters
              </h1>
              <div className="flex space-x-6">
                <Link href="/Products">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                    Shop Now
                  </Button>
                </Link>
                {isUserAdmin && (
                  <Link href="/Dashboard">
                    <Button size="lg" className="bg-teal-500 text-white hover:bg-teal-600">
                      Dashboard
                    </Button>
                  </Link>
                )}
              </div>
              {user && (
                <div className="mt-8">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleLogout}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>
      ) : null}
    </>
  );
}