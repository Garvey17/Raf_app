"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Truck,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { dashboardAnalytics } from "@/lib/dummyData";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate async loading
        await new Promise(resolve => setTimeout(resolve, 300));

        setData(dashboardAnalytics);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format axis values with K, M, B suffixes
  const formatAxisValue = (value) => {
    if (value >= 1000000000) {
      return `₦${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `₦${(value / 1000).toFixed(1)}K`;
    }
    return `₦${value}`;
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-[60vh] text-red-500">
          Error: {error}
        </div>
      </DashboardLayout>
    );
  }

  // Process chart data
  const revenueChartData = data?.orders?.trend?.map((item) => {
    const date = new Date();
    date.setMonth(item._id.month - 1);
    return {
      month: date.toLocaleString("default", { month: "short" }),
      revenue: item.revenue,
    };
  }) || [];

  // Process pie chart data
  const statusColors = {
    pending: "#F59E0B", // yellow
    approved: "#3B82F6", // blue
    paid: "#10B981", // green
    shipped: "#8B5CF6", // purple
    delivered: "#10B981", // green
    cancelled: "#EF4444", // red
  };

  const orderStatusChartData = data?.orders?.byStatus?.map((item) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    color: statusColors[item._id] || "#9CA3AF",
  })) || [];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(data?.orders?.revenue)}
            icon={DollarSign}
            trend="up"
            trendValue="+0%" // TODO: Calculate trend
          />
          <StatCard
            title="Total Orders"
            value={data?.orders?.total || 0}
            icon={ShoppingCart}
            trend="up"
            trendValue="+0%"
          />
          <StatCard
            title="Active Drivers"
            value={data?.drivers?.active || 0}
            icon={Users}
            trend="up"
            trendValue={`${data?.drivers?.total || 0} Total`}
          />
          <StatCard
            title="Active Deliveries"
            value={data?.deliveries?.inTransit || 0}
            icon={Truck}
            trend="down"
            trendValue={`${data?.deliveries?.total || 0} Total`}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {revenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={formatAxisValue} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] md:h-[300px] text-muted-foreground text-center p-4">
                  No revenue data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orderStatusChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
                  <PieChart>
                    <Pie
                      data={orderStatusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props) => {
                        if (typeof window !== "undefined" && window.innerWidth < 640) {
                          return null;
                        }
                        const { name, percent } = props;
                        return `${name} ${(percent * 100).toFixed(0)}%`;
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] md:h-[300px] text-muted-foreground text-center p-4">
                  No order data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-bold">{data?.payments?.pending || 0}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dispatched</p>
                  <p className="text-2xl font-bold">
                    {data?.dispatches?.byStatus?.find(s => s._id === "dispatched")?.count || 0}
                  </p>
                </div>
                <Truck className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">
                    {data?.orders?.byStatus?.find(s => s._id === "delivered")?.count || 0}
                  </p>
                </div>
                <Package className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                  <p className="text-2xl font-bold">
                    {data?.orders?.byStatus?.find(s => s._id === "cancelled")?.count || 0}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <a href="/orders">View All</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.orders?.recent?.length > 0 ? (
                data.orders.recent.map((order) => (
                  <div
                    key={order._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <ShoppingCart className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {order.customerName}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:text-right">
                      <p className="font-medium text-sm sm:text-base">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "success"
                            : order.status === "dispatched"
                              ? "info"
                              : order.status === "approved"
                                ? "warning"
                                : order.status === "cancelled"
                                  ? "destructive"
                                  : "default"
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No recent orders
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
