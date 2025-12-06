"use client";

import Link from "next/link";
import Image from "next/image";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/Components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  CreditCard,
  MessageSquare,
  BarChart2,
  Settings,
  Plus,
  Power,
} from "lucide-react";

import { logo } from "@/Assets/assets";


const mainMenu = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  // { title: "Products", icon: Package, url: "/products" },
  { title: "Order", icon: ShoppingCart, url: "/order" },
  // { title: "Deliveries", icon: Truck, url: "/deliveries" }, -- Removed for simplicity
  { title: "Payments", icon: CreditCard, url: "/payments" },
  { title: "Support", icon: MessageSquare, url: "/support" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {

  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthStore()

  const isActive = (url) => pathname === url

  const handleLogOut = async () => {
    await logout()
    router.push("/auth/login")
  }

  return (

    <Sidebar className="border-r border-gray-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl no-scrollbar">
      <SidebarContent className="no-scrollbar">

        {/* Logo */}
        <SidebarGroup className="px-6 py-6 flex flex-col items-center">
          <div className="flex justify-center items-center w-full mb-6">
            <Link href="/" className="transform hover:scale-105 transition-transform duration-300">
              <Image src={logo} width={120} alt="Logo" className="drop-shadow-sm" />
            </Link>
          </div>

          {/* MAIN MENU */}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {mainMenu.map((item) => (
                <SidebarMenuItem key={item.title}>

                  <SidebarMenuButton
                    asChild
                    className={`flex items-center gap-3 px-4 py-3 text-[15px] font-medium transition-all duration-200 rounded-xl group
                          ${isActive(item.url)
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                      }
                        `}
                  >
                    <Link href={item.url}>
                      <item.icon
                        className={`h-5 w-5 transition-colors duration-200
                              ${isActive(item.url) ? "text-white" : "text-gray-500 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"}
                            `}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>

                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>
        {/*Divicer*/}
        <div className="px-6">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent my-4"></div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="px-6 pb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Quick actions</p>

          <div className="flex flex-col gap-3">
            <button className="flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200 border border-gray-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-900 group">
              <div className="p-1 bg-white dark:bg-slate-700 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              Request product
            </button>

            <button onClick={handleLogOut} className="flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group mt-2">
              <Power className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Log out
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>


  );
}
