"use client";

import { useState } from "react";
import { logo } from "@/Assets/assets";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/supabaseClient";

export default function StaffLoginForm() {
    const router = useRouter();
    const supabase = createClient();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleStaffLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. Authenticate with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (authError) {
                setError(authError.message);
                setLoading(false);
                return;
            }

            // 2. Check if user is a staff member
            const { data: staffData, error: staffError } = await supabase
                .from('staff')
                .select('*')
                .eq('email', formData.email)
                .single();

            if (staffError || !staffData) {
                // User authenticated but not a staff member
                await supabase.auth.signOut();
                setError('Access denied. This account is not registered as staff.');
                setLoading(false);
                return;
            }

            // 3. Check if staff is active
            if (staffData.status !== 'active') {
                await supabase.auth.signOut();
                setError('Your account is not active. Please contact administrator.');
                setLoading(false);
                return;
            }

            // 4. Update last login
            await supabase
                .from('staff')
                .update({ last_login: new Date().toISOString() })
                .eq('id', staffData.id);

            // 5. Store staff info in session storage for quick access
            sessionStorage.setItem('staff-info', JSON.stringify({
                id: staffData.id,
                email: staffData.email,
                name: staffData.name,
                role: staffData.role,
                department: staffData.department,
                permissions: staffData.permissions || [],
                staffNumber: staffData.staff_number,
            }));

            // 6. Redirect to admin dashboard
            router.push('/admin');
            router.refresh();
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login');
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex flex-col justify-center items-center transition-all duration-300 hover:shadow-indigo-500/10">
            <div className="mb-2 transform hover:scale-105 transition-transform duration-300">
                <Image src={logo} width={120} alt="Logo" className="drop-shadow-md" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Staff Portal
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 text-center">
                Sign in to access the admin dashboard
            </p>

            {error && (
                <div className="w-full p-3 mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleStaffLogin} className="space-y-5 w-full">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                        Staff Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder="staff@company.com"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                        </span>
                    ) : "Sign In"}
                </button>
            </form>

            <div className="text-center mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Not a staff member?{" "}
                    <Link href={'/auth/login'} className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-all">
                        Customer Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
