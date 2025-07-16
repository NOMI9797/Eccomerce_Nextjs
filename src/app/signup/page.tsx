"use client";
import { useEffect } from "react";
import { useAuth } from "@/session/AuthContext";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/ui/signup-form";

const SignupPage = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-pink-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Join Styleora
          </h1>
          <p className="text-gray-200">Create your account</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;