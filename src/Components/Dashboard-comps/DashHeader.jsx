"use client";

import { ShoppingCart, Bell, Wallet, Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import ThemeToggle from "../ThemeButton";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";



export default function DashboardHeader() {
    const pathname = usePathname()
    const [pageName, setPageName] = useState("")
    const getPageName = () => {
        const segments = pathname.split("/").filter(Boolean)

        const main = segments[0]

        const formatted = main.charAt(0).toUpperCase() + main.slice(1).toLowerCase();

        setPageName(formatted)
    }

    useEffect(() => {
        getPageName()
    },[pathname])
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex items-center justify-between py-4"
    >
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* <button className="md:hidden p-2 rounded-xl hover:bg-muted transition">
          <Menu className="w-6 h-6" />
        </button> */}
        <h1 className="text-2xl font-bold">{pageName}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Balance */}
        <Card className="px-4 py-2 rounded-2xl shadow flex flex-row items-center gap-2 cursor-pointer">
          <Wallet className="w-5 h-5" />
          <div className="flex flex-col leading-tight">
            <span className="text-xs opacity-70">Balance</span>
            <span className="font-semibold text-sm">$2,940.00</span>
          </div>
        </Card>

        <ThemeToggle />

        {/* Cart */}
        <button className="relative p-2 hover:bg-muted rounded-xl transition cursor-pointer">
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-[1px] rounded-full">
            3
          </span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-muted rounded-xl transition cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] px-1.5 py-[1px] rounded-full">
            1
          </span>
        </button>

        {/* Avatar */}
        <div className=" cursor-pointer w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
          S
        </div>
      </div>
    </motion.header>
  );
}