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
    } catch (error: any) {
      toast.error(error.message || "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleClick = async () => {
    try {
      await handleGoogleSignIn()
    } catch (error: any) {
      toast.error(error.message || "Google login failed")
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input name="email" id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input name="password" id="password" type="password" required />
        </div>
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleClick}
        >
          <div className="rounded-full bg-white p-1 transition-transform hover:scale-110">
            <FcGoogle className="h-5 w-5" />
          </div>
          <span>Login with Google</span>
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  )
}
