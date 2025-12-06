"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Package, CheckCircle, AlertCircle, TruckIcon, Clock, DollarSign, Box } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Icon mapping based on category
const iconMap = {
    order: Package,
    shipment: TruckIcon,
    payment: DollarSign,
    stock: Box,
    system: AlertCircle,
    company: CheckCircle,
};

export default function NotificationDropdown({ isOpen, onClose }) {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

    const getNotificationColor = (type) => {
        switch (type) {
            case "success":
                return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
            case "info":
                return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
            case "warning":
                return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400";
            case "alert":
                return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
            default:
                return "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400";
        }
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const notificationDate = new Date(timestamp);
        const diffInMs = now - notificationDate;
        const diffInMinutes = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    };

    const router = useRouter(); // Import useRouter

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await markAsRead(notification._id || notification.id);
        }

        // Navigation logic
        if (notification.metadata?.link) {
            router.push(notification.metadata.link);
            onClose(); // Close dropdown
        } else if (notification.category === 'order') {
            router.push('/orders');
            onClose();
        }
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
                    />

                    {/* Dropdown Menu */}
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-20 right-6 w-96 max-h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-4">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <Package className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                                    {notifications.map((notification) => {
                                        const Icon = iconMap[notification.category] || AlertCircle;
                                        return (
                                            <motion.div
                                                key={notification.id || notification._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                onClick={() => handleNotificationClick(notification)}
                                                className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notification.read ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                                                    }`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)} flex-shrink-0 h-fit`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                                                                {notification.title}
                                                            </h4>
                                                            {!notification.read && (
                                                                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                                            {getTimeAgo(notification.created_at || notification.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && unreadCount > 0 && (
                            <div className="p-3 border-t border-gray-200 dark:border-slate-700">
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                    Mark all as read
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
