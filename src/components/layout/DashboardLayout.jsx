"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children, title = "Dashboard" }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />

            <div className="lg:pl-64">
                <Header title={title} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div
                        className="fixed inset-y-0 left-0 w-64"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Sidebar isMobile={true} onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
