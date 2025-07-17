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
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create Your Account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Fill in the details below to get started
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input name="username" id="username" placeholder="Your username" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input name="email" id="email" type="email" placeholder="you@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input name="password" id="password" type="password" placeholder="Enter your password" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input name="confirmPassword" id="confirmPassword" type="password" placeholder="Confirm your password" required />
        </div>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={handleGoogleClick}>
          <div className="rounded-full bg-white p-1 transition-transform hover:scale-110">
            <FcGoogle className="h-5 w-5" />
          </div>
          Sign up with Google
        </Button>
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Log in
        </Link>
      </div>
    </form>
  );
} 