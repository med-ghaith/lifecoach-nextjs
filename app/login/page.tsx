import LoginPage from "@/components/login/login";
import { Sparkles } from "lucide-react";
export default function Login() {
  return (
    <div className="min-h-screen  via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold ">Bienvenue</h1>
          <p className="text-gray-400">
            Connectez-vous à votre espace personnel
          </p>
        </div>

        {/* Login Form */}
        <div>
          <LoginPage />
        </div>
      </div>
    </div>
  );
}
