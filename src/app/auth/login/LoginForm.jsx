"use client";

import { useState } from "react";
import { logo } from "@/Assets/assets";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function LoginForm() {
  const router = useRouter()
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

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push('/dashboard'); // redirect after login
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      setError("Google login failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow flex flex-col justify-center items-center ">
        <div>
            <Image src={logo} width={150} alt="" />
        </div>
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleEmailLogin} className="space-y-4 w-full max-w-md p-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center ">
        <div className="flex-grow h-[1px] bg-gray-300"></div>
        <span className="px-3 text-sm text-gray-500">OR</span>
        <div className="flex-grow h-[1px] bg-gray-300"></div>
      </div>

    <div className="flex flex-col gap-3">
      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full border py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        {googleLoading ? "Connecting..." : "Login with Google"}
      </button>
      <div>
        <p>No account yet? <Link href={'/auth/register'} className="text-blue-500 cursor-pointer">Register</Link> </p> 
      </div>
    </div>
    </div>
  );
}
