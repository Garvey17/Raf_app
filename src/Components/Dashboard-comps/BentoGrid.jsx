import { Card, CardContent } from "@/Components/ui/card";
import { BarChart3, Users, DollarSign, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardBento() {
  return (
    <div className="w-full grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px]">
      {/* Big Analytics Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:col-span-2 lg:col-span-2 row-span-2"
      >
        <Card className="h-full p-4 flex flex-col justify-between rounded-2xl shadow-md">
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
        <Card className="h-full p-4 rounded-2xl shadow-md flex flex-col justify-between">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">New Users</h2>
              <Users className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">1,230</p>
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
        <Card className="h-full p-4 rounded-2xl shadow-md flex flex-col justify-between">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Revenue</h2>
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
        <Card className="h-full p-4 rounded-2xl shadow-md flex flex-col justify-between">
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
  );
}
