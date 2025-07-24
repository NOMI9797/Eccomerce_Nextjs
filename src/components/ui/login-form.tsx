"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { useState } from "react"
import { signIn, getCurrentUser, handleGoogleSignIn } from "@/appwrite/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/session/AuthContext"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { session } = await signIn(email, password)
      if (session) {
        // Fetch current user and persist in localStorage and context
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          localStorage.setItem("user", JSON.stringify(currentUser))
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
        router.push('/Homepage')
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleClick = async () => {
    try {
      await handleGoogleSignIn()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Google login failed")
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="grid gap-6">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
            <a
              href="#"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium underline-offset-2 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <Input 
            name="password" 
            id="password" 
            type="password" 
            placeholder="Enter your password"
            required 
            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
          />
        </div>
        
        <Button 
          disabled={isLoading} 
          type="submit" 
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
        
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
          className="w-full border-gray-300 hover:bg-gray-50 rounded-xl py-3 flex items-center justify-center gap-2"
          onClick={handleGoogleClick}
        >
          <div className="rounded-full bg-white p-1 transition-transform hover:scale-110">
            <FcGoogle className="h-5 w-5" />
          </div>
          <span>Sign in with Google</span>
        </Button>
      </div>
      
      <div className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-2">
          Sign up
        </Link>
      </div>
    </form>
  )
}
