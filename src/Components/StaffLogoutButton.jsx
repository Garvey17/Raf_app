"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/supabaseClient";
import { useState } from "react";

export default function StaffLogoutButton({ className = "" }) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);

            // Sign out from Supabase
            await supabase.auth.signOut();

            // Clear session storage
            sessionStorage.removeItem('staff-info');

            // Redirect to staff login
            router.push('/admin/auth/staff-login');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 ${className}`}
        >
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
            </svg>
            {loading ? 'Logging out...' : 'Logout'}
        </button>
    );
}
