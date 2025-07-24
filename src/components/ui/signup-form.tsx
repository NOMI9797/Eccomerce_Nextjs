"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { FcGoogle } from "react-icons/fc"
import { useState, useEffect } from "react"
import { registerUser, handleGoogleSignIn } from "@/appwrite/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/session/AuthContext"

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  // Declare all hooks first
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const name = formData.get('username') as string;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Validate password length and complexity
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (!email || !password || !confirmPassword || !name) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const user = await registerUser(name.trim(), email.trim().toLowerCase(), password);
      if (user) {
        setUser(user);
        toast.success("Account created successfully!", {
          style: {
            background: '#10B981',
            color: '#fff',
            border: 'none',
          },
          duration: 4000,
        });
        router.push('/Homepage');
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);
      if (error instanceof Error && error.message.includes('already exists')) {
        toast.error("Account Already Exists", {
          description: "An account with this email already exists. Would you like to log in instead?",
          action: {
            label: "Login",
            onClick: () => router.push('/login')
          },
          style: {
            background: '#1e293b',
            color: '#fff',
            border: 'none',
          },
          icon: '⚠️',
          duration: 5000,
        });
      } else {
        toast.error("Registration Failed", {
          description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
          style: {
            background: '#991b1b',
            color: '#fff',
            border: 'none',
          },
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    try {
      await handleGoogleSignIn();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Google sign in failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username" className="text-gray-700 font-semibold">Username</Label>
          <Input 
            name="username" 
            id="username" 
            placeholder="Enter your username" 
            required 
            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
          <Input 
            name="email" 
            id="email" 
            type="email" 
            placeholder="you@example.com" 
            required 
            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
          <Input 
            name="password" 
            id="password" 
            type="password" 
            placeholder="Create a strong password" 
            required 
            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">Confirm Password</Label>
          <Input 
            name="confirmPassword" 
            id="confirmPassword" 
            type="password" 
            placeholder="Confirm your password" 
            required 
            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
          />
        </div>
        
        <div className="relative text-center text-sm my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full border-gray-300 hover:bg-gray-50 rounded-xl py-3" 
          onClick={handleGoogleClick}
        >
          <div className="rounded-full bg-white p-1 transition-transform hover:scale-110 mr-2">
            <FcGoogle className="h-5 w-5" />
          </div>
          Sign up with Google
        </Button>
        
        <Button 
          disabled={isLoading} 
          type="submit" 
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
      
      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-2">
          Log in
        </Link>
      </div>
    </form>
  );
} 