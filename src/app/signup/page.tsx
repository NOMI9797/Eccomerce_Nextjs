"use client";
import { useEffect } from "react";
import { useAuth } from "@/session/AuthContext";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/ui/signup-form";

export default function SignupPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return; // still loading; do nothing
    if (user) {
      router.push("/Homepage");
    }
  }, [user, router]);

  if (user === undefined) return null;

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}