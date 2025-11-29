"use client";

import { ShoppingCart, Bell, Wallet, Menu, History, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import ThemeToggle from "../ThemeButton";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { useNotificationStore } from "@/store/notificationStore";
import Link from "next/link";
import CartBadge from "../cartBadge";
import NotificationDropdown from "../NotificationDropdown";



export default function DashboardHeader() {

  // const {data: session} = useSession()

  // const firstLetter = session?.user?.name?.[0]?.toUpperCase() || 'S'

  const pathname = usePathname()
  const cartContent = useCartStore((state) => state.totalQuantity)
  const orders = useOrderStore((state) => state.orders)
  const fetchOrders = useOrderStore((state) => state.fetchOrders)
  const { unreadCount, fetchNotifications } = useNotificationStore()
  const [pageName, setPageName] = useState("")
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  const getPageName = () => {
    const segments = pathname.split("/").filter(Boolean)

    const main = segments[0]

    const formatted = main.charAt(0).toUpperCase() + main.slice(1).toLowerCase();

    setPageName(formatted)
  }

  useEffect(() => {
    getPageName()
    fetchOrders() // Fetch orders on mount
    fetchNotifications() // Fetch notifications on mount
  }, [pathname, fetchOrders, fetchNotifications])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex items-center justify-between py-6 px-2"
    >

      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* <button className="md:hidden p-2 rounded-xl hover:bg-muted transition">
          <Menu className="w-6 h-6" />
        </button> */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">{pageName}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        {/* Search Bar (Optional - Visual only for now) */}
        <div className="hidden md:flex items-center bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 border border-gray-100 dark:border-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all w-64">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
        </div>

        {/* Balance */}
        <Card className="hidden md:flex px-5 py-2.5 rounded-2xl shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 border-none flex-row items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-200">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-none text-white">
            <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">Balance</span>
            <span className="font-bold text-base">₦2,940.00</span>
          </div>
        </Card>

        <div className="h-8 w-[1px] bg-gray-200 dark:bg-slate-700 mx-1 hidden md:block"></div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Cart */}
          <Link href={'/cart'} className="relative p-2.5 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer group">
            <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full shadow-sm ring-2 ring-white dark:ring-slate-900">
              <CartBadge />
            </span>
          </Link>

          {/* Orders */}
          <Link href={'/orders'} className="relative p-2.5 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer group">
            <History className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            {orders.length > 0 && (
              <span className="absolute top-1 right-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full shadow-sm ring-2 ring-white dark:ring-slate-900">
                {orders.length}
              </span>
            )}
          </Link>

          {/* Notifications */}
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2.5 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer group"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full shadow-sm ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Avatar */}
        <div className="cursor-pointer w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 border-2 border-white dark:border-slate-600 shadow-md flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200 hover:ring-2 hover:ring-blue-500 transition-all">
          S
        </div>
      </div>

      {/* Notification Dropdown */}
      <NotificationDropdown
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </motion.header>
  );
}