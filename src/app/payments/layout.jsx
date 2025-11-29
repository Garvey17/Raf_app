"use client";

import DashboardHeader from "@/Components/Dashboard-comps/DashHeader";
import { AppSidebar } from "@/Components/Sidebar";
import { SidebarProvider, SidebarTrigger,  } from "@/components/ui/sidebar";


export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 px-4">
        <div className="flex gap-4 items-center justify-between">
          <SidebarTrigger />
          <DashboardHeader />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}