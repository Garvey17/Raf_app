"use client";

import { useState } from "react";
import { logo } from "@/Assets/assets";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/supabaseClient";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`
        }
      })
    } catch (err) {
      setError("Google login failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex flex-col justify-center items-center transition-all duration-300 hover:shadow-blue-500/10">
      <div className="mb-2 transform hover:scale-105 transition-transform duration-300">
        <Image src={logo} width={120} alt="Logo" className="drop-shadow-md" />
      </div>
      <h2 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Welcome Back</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 text-center">Please enter your details to sign in</p>

      {error && (
        <div className="w-full p-3 mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-center">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-5 w-full">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="name@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
          ) : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative w-full my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white dark:bg-slate-900 text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-medium py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          {googleLoading ? "Connecting..." : "Google"}
        </button>

        <div className="text-center mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href={'/auth/register'} className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
