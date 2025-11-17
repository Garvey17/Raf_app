'use client'
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Users, DollarSign, Activity,  ShoppingBag, ArrowRight} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";


export default function DashboardBento() {
  return (
    <div className="flex flex-col gap-6">

    <div className="w-full grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px]">
      {/* Big Analytics Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:col-span-2 lg:col-span-2 row-span-2"
      >
        <Card className=" h-full p-4 flex flex-col justify-between rounded-2xl shadow-md bg-gradient-to-br from-white to-[#667eea]
">
          <CardContent className="p-0 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Overall Analytics</h2>
              <Activity className="w-6 h-6" />
            </div>
            <div className="mt-4 flex-1 flex flex-col justify-center">
              <p className="text-4xl font-bold">12.4k</p>
              <p className="text-sm opacity-70">Total engagement this month</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="h-full p-4 rounded-2xl shadow-md flex flex-col justify-between bg-gradient-to-br from-emerald-400/20 to-yellow-200
">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Recent Orders</h2>
              <Users className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">200 Bags</p>
              <p className="text-sm opacity-70">Last 30 days</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Revenue Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="h-full p-4 rounded-2xl shadow-md flex flex-col justify-between bg-gradient-to-br from-blue-400 to-red-400
">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Volume Bought</h2>
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">$84.2k</p>
              <p className="text-sm opacity-70">This quarter</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Chart / Performance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 row-span-1 md:col-span-3"
      >
        <Card className="h-full p-4 rounded-2xl shadow-md flex flex-col justify-between bg-gradient-to-br from-green-300 via-green-400 to-green-600
">
          <CardContent className="p-0 h-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">Performance</h2>
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-center h-full opacity-60 text-sm italic">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="md:col-span-2 lg:col-span-2 row-span-2"
    >
      <Card className="h-full p-4 rounded-2xl shadow-md bg-gradient-to-br from-[#fdfbfb] to-[#ebedee]">
        <CardContent className="p-0 h-full flex flex-col justify-between">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Popular Products</h2>
            <ShoppingBag className="w-6 h-6" />
          </div>

          {/* Inner grid (2 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">

            {/* Product 1 */}
            <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-500/20 to-blue-300/40 shadow-sm flex flex-col">
              <Image
                src="/products/product1.png"
                alt="Product 1"
                width={500}
                height={300}
                className="rounded-xl object-cover h-32 w-full mb-3"
              />
              <h3 className="font-semibold text-base">Premium Dashboard Template</h3>
              <p className="text-xs opacity-70 mb-3">
                Modern UI for your web applications.
              </p>
              <button className="mt-auto px-4 py-2 bg-black text-white rounded-xl text-sm flex items-center gap-2 hover:bg-gray-800 transition">
                Buy Now <ArrowRight size={14} />
              </button>
            </div>

            {/* Product 2 */}
            <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-500/20 to-purple-300/40 shadow-sm flex flex-col">
              <Image
                src="/products/product2.png"
                alt="Product 2"
                width={500}
                height={300}
                className="rounded-xl object-cover h-32 w-full mb-3"
              />
              <h3 className="font-semibold text-base">E-commerce UI Kit</h3>
              <p className="text-xs opacity-70 mb-3">
                Components for fast storefront building.
              </p>
              <button className="mt-auto px-4 py-2 bg-black text-white rounded-xl text-sm flex items-center gap-2 hover:bg-gray-800 transition">
                View Details <ArrowRight size={14} />
              </button>
            </div>

          </div>

          {/* CTA */}
          <div className="mt-6">
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
              Browse All Products
              <ArrowRight size={16} />
            </button>
          </div>

        </CardContent>
      </Card>
    </motion.div>
    </div>
  );
}
