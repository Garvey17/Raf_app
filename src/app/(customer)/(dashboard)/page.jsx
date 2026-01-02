'use client'
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/Components/ui/card";
import { BarChart3, Users, DollarSign, Activity, ShoppingBag, ArrowRight, Download, RefreshCw, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { dangote3x } from "@/Assets/assets";
import { Bmaster } from "@/Assets/assets";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ClientAreaChart = dynamic(() => import("@/Components/Dashboard-comps/ClientAreaChart"), { ssr: false });



export default function DashboardBento() {
  const { data: session } = useSession();
  const { analytics, loading, fetchAnalytics, refreshAnalytics, exportAnalytics } = useAnalyticsStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleOrderClick = (productName) => {
    router.push(`/order?product=${encodeURIComponent(productName)}`);
  };


  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAnalytics();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = async (format) => {
    await exportAnalytics(format);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}m`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(1)}k`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  // Calculate max revenue for chart scaling
  const maxRevenue = analytics?.salesPerformance
    ? Math.max(...analytics.salesPerformance.map(d => d.revenue))
    : 1;

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-2 sm:p-6 bg-gray-50/50 dark:bg-slate-950 min-h-screen">

      <div className="flex justify-end gap-2 order-2 md:order-first">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <div className="relative group flex-1 sm:flex-none">
            <button className="w-full px-3 sm:px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </button>
            <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors rounded-t-lg"
              >
                Export as CSV
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors rounded-b-lg"
              >
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] order-1">
        {/* Big Analytics Card - Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 md:col-span-2 lg:col-span-2 row-span-2"
        >
          <Card className="h-full p-4 sm:p-6 flex flex-col justify-between rounded-3xl shadow-sm border-none bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-white/20 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 p-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

            <CardContent className="p-0 h-full flex flex-col justify-between relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-blue-100">Total Revenue</h2>
                  <p className="text-sm text-blue-200">Last 30 days</p>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="mt-4 flex-1 flex flex-col justify-end">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-12 bg-white/20 rounded w-32 mb-2"></div>
                    <div className="h-6 bg-white/20 rounded w-24"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-3xl min-[350px]:text-4xl sm:text-5xl font-bold mb-2">{formatCurrency(analytics?.revenue?.current || 0)}</p>
                    <div className="flex items-center gap-2 text-sm text-blue-100 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                      <span className={`font-bold flex items-center ${(analytics?.revenue?.percentageChange || 0) >= 0 ? 'text-emerald-300' : 'text-red-300'
                        }`}>
                        {(analytics?.revenue?.percentageChange || 0) >= 0 ? '↑' : '↓'} {Math.abs(analytics?.revenue?.percentageChange || 0).toFixed(1)}%
                      </span>
                      <span>vs last month</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Orders Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col justify-between bg-white dark:bg-slate-900 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group">
            <CardContent className="p-0 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-gray-500 dark:text-gray-400">Active Orders</h2>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 dark:bg-slate-800 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-24"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics?.orders?.active || 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Pending delivery</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Volume Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col justify-between bg-white dark:bg-slate-900 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group">
            <CardContent className="p-0 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-gray-500 dark:text-gray-400">Volume Bought</h2>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 dark:bg-slate-800 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-24"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics?.volume?.current || 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Bags this week</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart / Performance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-2 lg:col-span-2 row-span-1 md:col-span-3"
        >
          <Card className="h-full p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col justify-between bg-white dark:bg-slate-900">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sales Performance</h2>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 w-full h-[200px] px-2">
                {loading ? (
                  <div className="w-full h-full bg-gray-200 dark:bg-slate-800 rounded animate-pulse"></div>
                ) : (
                  <ClientAreaChart data={analytics?.salesPerformance || []} />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 order-3"
      >
        <Card className="md:col-span-2 lg:col-span-3 p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Popular Products</h2>
              {/* <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight size={16} />
              </button> */}
            </div>

            {/* Inner grid (2 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

              {/* Product 1 */}
              <div className="group relative rounded-2xl p-3 sm:p-6 bg-gray-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-300 flex flex-col min-[350px]:flex-row items-center gap-4 sm:gap-6">
                <div className="relative w-full h-32 min-[350px]:w-24 min-[350px]:h-24 sm:w-32 sm:h-32 bg-white dark:bg-slate-800 rounded-xl p-2 shadow-sm flex-shrink-0">
                  <Image
                    src={Bmaster}
                    alt="Product 1"
                    fill
                    className="rounded-lg object-contain"
                  />
                </div>
                <div className="flex-1 w-full text-center min-[350px]:text-left">
                  <div className="flex items-center justify-center min-[350px]:justify-start gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">Top Seller</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">Blockmaster</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    Premium industrial grade cement for heavy construction.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">₦630</span>
                    <button
                      onClick={() => handleOrderClick("Blockmaster")}
                      className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm hover:bg-blue-600 hover:text-white transition-all text-gray-900 dark:text-white"
                    >
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product 2 */}
              <div className="group relative rounded-2xl p-3 sm:p-6 bg-gray-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-300 flex flex-col min-[350px]:flex-row items-center gap-4 sm:gap-6">
                <div className="relative w-full h-32 min-[350px]:w-24 min-[350px]:h-24 sm:w-32 sm:h-32 bg-white dark:bg-slate-800 rounded-xl p-2 shadow-sm flex-shrink-0">
                  <Image
                    src={dangote3x}
                    alt="Product 2"
                    fill
                    className="rounded-lg object-contain"
                  />
                </div>
                <div className="flex-1 w-full text-center min-[350px]:text-left">
                  <div className="flex items-center justify-center min-[350px]:justify-start gap-2 mb-2">
                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">Best Value</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">Dangote 3X</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    Versatile cement perfect for all general building needs.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">₦5,800</span>
                    <button
                      onClick={() => handleOrderClick("Dangote 3X")}
                      className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm hover:bg-blue-600 hover:text-white transition-all text-gray-900 dark:text-white"
                    >
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
