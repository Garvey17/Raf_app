"use client";

import DashboardHeader from "@/Components/Dashboard-comps/DashHeader";
import { AppSidebar } from "@/Components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";


export default function DashboardLayout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 px-4">
                <div className="sticky top-0 z-50 flex gap-4 items-center justify-between bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60 dark:supports-[backdrop-filter]:bg-slate-950/60 pb-2 pt-2 -mx-4 px-4 transition-colors">
                    <SidebarTrigger />
                    <DashboardHeader />
                </div>
                {children}
            </main>
        </SidebarProvider>
    );
}
