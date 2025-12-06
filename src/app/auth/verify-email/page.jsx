"use client";

import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import Image from "next/image";
import { logo } from "@/Assets/assets";

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 flex flex-col items-center text-center">

                <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
                    <Image src={logo} width={100} alt="Logo" className="drop-shadow-md" />
                </div>

                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                    <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>

                <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Check your email</h1>

                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    We've sent a verification link to your email address. Please click the link to verify your account and access the dashboard.
                </p>

                <div className="w-full space-y-3">
                    <Link
                        href="/auth/login"
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200"
                    >
                        Go to Login
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Didn't receive the email? <span className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">Click to resend</span>
                    </p>
                </div>

            </div>
        </div>
    );
}
