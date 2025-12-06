"use client";

import { ShoppingCart, Bell, Wallet, Menu, History, Search, Box, FileText, ChevronRight } from "lucide-react";
import { Card } from "@/Components/ui/card";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
// import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { useAuthStore } from "@/store/Auth";
import { useNotificationStore } from "@/store/notificationStore";
import Link from "next/link";
import CartBadge from "../cartBadge";
import NotificationDropdown from "../NotificationDropdown";
import { useSidebar } from "@/Components/ui/sidebar";




export default function DashboardHeader() {

  // const {data: session} = useSession()

  // const firstLetter = session?.user?.name?.[0]?.toUpperCase() || 'S'

  const pathname = usePathname()
  const router = useRouter()
  const cartContent = useCartStore((state) => state.totalQuantity)
  const orders = useOrderStore((state) => state.orders)
  const products = useOrderStore((state) => state.products)
  const fetchOrders = useOrderStore((state) => state.fetchOrders)
  const fetchProducts = useOrderStore((state) => state.fetchProducts)
  const { unreadCount, fetchNotifications } = useNotificationStore()
  const { state, isMobile } = useSidebar();
  const { user } = useAuthStore() // Get user from store
  const [pageName, setPageName] = useState("")
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  // Search State
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState({ orders: [], products: [] })
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchRef = useRef(null)

  const getPageName = () => {
    const segments = pathname.split("/").filter(Boolean)

    const main = segments[0]
    if (!main) return; // Handle root path

    const formatted = main.charAt(0).toUpperCase() + main.slice(1).toLowerCase();

    setPageName(formatted)
  }

  useEffect(() => {
    getPageName()
    fetchOrders()
    fetchNotifications()
    fetchProducts() // Fetch products for search
  }, [pathname, fetchOrders, fetchNotifications, fetchProducts])

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults({ orders: [], products: [] });
      setIsSearchOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase();

    // Search Orders (ID, Customer Name, Status)
    const filteredOrders = orders.filter(order =>
      order._id.toLowerCase().includes(lowerQuery) ||
      order.name?.toLowerCase().includes(lowerQuery) ||
      order.status?.toLowerCase().includes(lowerQuery)
    ).slice(0, 3); // Limit to 3

    // Search Products (Title)
    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(lowerQuery)
    ).slice(0, 3); // Limit to 3

    setSearchResults({ orders: filteredOrders, products: filteredProducts });
    setIsSearchOpen(true);
  };

  const handleResultClick = (type, item) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    if (type === 'order') {
      // Navigate to orders page (or potentially a detail modal/page if implemented)
      // For now, filtering the order list via URL param would be ideal, but let's just go to Orders page
      router.push('/orders');
    } else if (type === 'product') {
      router.push(`/order?product=${encodeURIComponent(item.title)}`);
    }
  };


  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex items-center justify-between py-3 px-2 relative z-50"
    >

      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1 md:flex-none">

        {/* Mobile Search Bar */}
        <div className="md:hidden flex flex-1 items-center bg-gray-100 dark:bg-slate-800/50 rounded-xl px-3 py-2 border border-transparent focus-within:border-blue-500/20 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all w-full sm:w-64 relative" ref={searchRef}>
          <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search orders, products..."
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => { if (searchQuery) setIsSearchOpen(true) }}
          />
          {/* Mobile Search Dropdown */}
          <AnimatePresence>
            {isSearchOpen && (searchResults.orders.length > 0 || searchResults.products.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden"
              >
                {/* Orders Result */}
                {searchResults.orders.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 mb-1">Orders</h3>
                    {searchResults.orders.map(order => (
                      <div key={order._id} onClick={() => handleResultClick('order', order)} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                        <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                          <FileText size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Order #{order._id.slice(-6)}</p>
                          <p className="text-xs text-gray-500 truncate">{order.name} • {order.status}</p>
                        </div>
                        <ChevronRight size={14} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.orders.length > 0 && searchResults.products.length > 0 && <div className="h-px bg-gray-100 dark:bg-slate-800 mx-2"></div>}

                {/* Products Result */}
                {searchResults.products.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 mb-1">Products</h3>
                    {searchResults.products.map(product => (
                      <div key={product._id} onClick={() => handleResultClick('product', product)} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                          <Box size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.title}</p>
                          <p className="text-xs text-gray-500 truncate">₦{product.price.toLocaleString()}</p>
                        </div>
                        <ChevronRight size={14} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Bar (Desktop) - Moved Here */}
        <div className="hidden md:flex items-center bg-white dark:bg-slate-800 rounded-xl px-4 py-2 border border-gray-100 dark:border-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all w-80 relative" ref={searchRef}>
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search orders, products..."
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => { if (searchQuery) setIsSearchOpen(true) }}
          />

          {/* Desktop Search Dropdown */}
          <AnimatePresence>
            {isSearchOpen && (searchResults.orders.length > 0 || searchResults.products.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50"
              >
                {/* Orders Result */}
                {searchResults.orders.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 mb-1">Orders</h3>
                    {searchResults.orders.map(order => (
                      <div key={order._id} onClick={() => handleResultClick('order', order)} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                        <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                          <FileText size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Order #{order._id.slice(-6)}</p>
                          <p className="text-xs text-gray-500 truncate">{order.name} • {order.status}</p>
                        </div>
                        <ChevronRight size={14} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.orders.length > 0 && searchResults.products.length > 0 && <div className="h-px bg-gray-100 dark:bg-slate-800 mx-2"></div>}

                {/* Products Result */}
                {searchResults.products.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 mb-1">Products</h3>
                    {searchResults.products.map(product => (
                      <div key={product._id} onClick={() => handleResultClick('product', product)} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                          <Box size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.title}</p>
                          <p className="text-xs text-gray-500 truncate">₦{product.price.toLocaleString()}</p>
                        </div>
                        <ChevronRight size={14} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        {/* Balance Card */}
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
        <div className="cursor-pointer w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 border-2 border-white dark:border-slate-600 shadow-md flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200 hover:ring-2 hover:ring-blue-500 transition-all uppercase">
          {user?.email?.[0] || 'S'}
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