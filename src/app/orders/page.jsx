"use client";

import { useEffect } from "react";
import { useOrderStore } from "@/store/orderStore";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default function OrdersPage() {
    const { orders, fetchOrders, loading, error } = useOrderStore();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
            case "approved":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
            case "paid":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
            case "shipped":
                return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300";
            case "delivered":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
            case "cancelled":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "approved":
            case "paid":
            case "delivered":
                return <CheckCircle className="w-4 h-4" />;
            case "cancelled":
                return <XCircle className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Orders
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        View and manage all your orders
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <p className="text-red-700 dark:text-red-300">{error}</p>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No orders yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Your orders will appear here once you place them
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <Package className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mb-0.5">
                                                    {order.orderNumber || `ORD-${order._id.substring(0, 8).toUpperCase()}`}
                                                </p>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {order.items[0]?.productName || "Order"}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 mb-1">Customer</p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {order.customerName}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {order.customerPhone}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 mb-1">Quantity</p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {order.items[0]?.quantity || 0} bags
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 mb-1">Delivery Date</p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    }) : "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {order.address && (
                                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Delivery Address
                                                </p>
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {order.address}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex md:flex-col items-center md:items-end gap-3">
                                        <span
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {getStatusIcon(order.status)}
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
