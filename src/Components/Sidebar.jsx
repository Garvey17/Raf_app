"use client";

import Link from "next/link";
import Image from "next/image";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  CreditCard,
  FileText,
  MessageSquare,
  BarChart2,
  Bell,
  User,
  Settings,
  Plus,
  LogOut
} from "lucide-react";

import { logo } from "@/Assets/assets";
import {miriokuLogo} from "@/Assets/assets"; // <--- your logo

const mainMenu = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
  { title: "Products", icon: Package, url: "/products" },
  { title: "Orders", icon: ShoppingCart, url: "/orders" },
  { title: "Deliveries", icon: Truck, url: "/deliveries" },
  { title: "Payments", icon: CreditCard, url: "/payments" },
  { title: "Support", icon: MessageSquare, url: "/support" },
  { title: "Analytics", icon: BarChart2, url: "/analytics" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {

  const pathname = usePathname()

  const isActive = (url) => pathname === url
  return (

        <Sidebar className="border-r bg-white">
          <SidebarContent>

            {/* Logo */}
            <SidebarGroup className="px-6 py-4 flex flex-col items-center">
              <div>
                <Link href="/">
                  <Image src={logo} width={100} alt="Logo" className="mb-8" />
                </Link>
              </div>

              {/* MAIN MENU */}
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2 font-semibold ">
                  {mainMenu.map((item) => (
                    <SidebarMenuItem key={item.title}>

                      <SidebarMenuButton
                        asChild
                        className={`flex items-center gap-3 py-3 text-[15px] transition duration-200 rounded-lg
                          ${
                            isActive(item.url)
                              ? "bg-[#2664FE] text-white shadow-sm"
                              : "hover:bg-[#2664FE]/80 hover:text-white text-gray-700"
                          }
                        `}
                      >
                        <Link href={item.url}>
                          <item.icon
                            className={`h-5 w-5 transition
                              ${isActive(item.url) ? "text-white" : "text-gray-700 group-hover:text-white"}
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
            <div className="h-[1px] w-full bg-gray-200 my-4"></div>
          </div>
  
          {/* QUICK ACTIONS */}
          <div className="px-6">
            <p className="text-sm text-gray-400 mb-3">Quick actions</p>
  
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-3 text-[15px]">
                <Plus className="h-5 w-5" />
                Request product
              </button>
  
              <button className="flex items-center gap-3 text-[15px]">
                <Plus className="h-5 w-5" />
                Add member
              </button>
            </div>
          </div>
  
          {/* LAST ORDERS */}
          {/* <div className="px-6 mt-8">
            <p className="text-sm text-gray-400 mb-3">Last orders 37</p>
  
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Image src="/shoe.png" width={40} height={40} alt="" className="rounded-md" />
                <div>
                  <p className="text-[14px] font-medium">DXC Nike…</p>
                  <Link href="/orders/1" className="text-blue-600 text-sm">View order</Link>
                </div>
              </div>
  
              <div className="flex items-center gap-3">
                <Image src="/jacket.png" width={40} height={40} alt="" className="rounded-md" />
                <div>
                  <p className="text-[14px] font-medium">Outerwear…</p>
                  <Link href="/orders/2" className="text-blue-600 text-sm">View order</Link>
                </div>
              </div>
  
              <Link href="/orders" className="text-blue-600 text-sm">See all</Link>
            </div>
          </div> */}
  
          {/* LOGOUT */}
          {/* <div className="px-6 absolute bottom-6">
            <button className="flex items-center gap-3 text-red-500 text-[15px]">
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </div> */}
          </SidebarContent>
        </Sidebar>

     
  );
}
