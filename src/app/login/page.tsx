import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/ui/login-form"

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-pink-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Styleora
          </h1>
          <p className="text-gray-200">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
