import Notification from "@/lib/models/NotificationModel";

/**
 * Create a notification for a user
 * @param {Object} params - Notification parameters
 * @param {String} params.userId - User ID (null for broadcast)
 * @param {String} params.type - Notification type: success, info, warning, alert
 * @param {String} params.category - Category: order, shipment, payment, stock, system, company
 * @param {String} params.title - Notification title
 * @param {String} params.message - Notification message
 * @param {Object} params.metadata - Additional metadata
 * @param {Date} params.expiresAt - Optional expiration date
 */
export async function createNotification({
    userId,
    type = "info",
    category = "system",
    title,
    message,
    metadata = {},
    expiresAt = null,
}) {
    try {
        const notification = await Notification.create({
            userId: userId || null,
            type,
            category,
            title,
            message,
            metadata,
            expiresAt,
        });

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
}

/**
 * Create order status notification
 * @param {String} userId - User ID
 * @param {String} orderId - Order ID
 * @param {String} status - Order status
 * @param {Object} orderDetails - Additional order details
 */
export async function createOrderStatusNotification(userId, orderId, status, orderDetails = {}) {
    const statusMessages = {
        pending: {
            type: "success",
            title: "Order Received",
            message: `Your order has been received and is pending approval. We'll notify you once it's confirmed.`,
        },
        approved: {
            type: "success",
            title: "Order Approved",
            message: `Great news! Your order has been approved and will be processed soon.`,
        },
        paid: {
            type: "success",
            title: "Payment Confirmed",
            message: `Payment received! Your order is being prepared for shipment.`,
        },
        shipped: {
            type: "info",
            title: "Order Shipped",
            message: `Your order is on its way! Expected delivery: ${orderDetails.deliveryDate || "Soon"}`,
        },
        delivered: {
            type: "success",
            title: "Order Delivered",
            message: `Your order has been successfully delivered. Thank you for your business!`,
        },
        cancelled: {
            type: "alert",
            title: "Order Cancelled",
            message: `Your order has been cancelled. If you have any questions, please contact support.`,
        },
    };

    const config = statusMessages[status] || {
        type: "info",
        title: "Order Update",
        message: `Your order status has been updated to: ${status}`,
    };

    return await createNotification({
        userId,
        type: config.type,
        category: "order",
        title: config.title,
        message: config.message,
        metadata: {
            orderId,
            orderStatus: status,
            ...orderDetails,
        },
    });
}

/**
 * Create payment notification
 * @param {String} userId - User ID
 * @param {String} orderId - Order ID
 * @param {String} status - Payment status
 * @param {Number} amount - Payment amount
 */
export async function createPaymentNotification(userId, orderId, status, amount) {
    const statusMessages = {
        pending: {
            type: "warning",
            title: "Payment Pending",
            message: `Payment of ₦${amount.toLocaleString()} is pending for your order. Please complete payment to proceed.`,
        },
        completed: {
            type: "success",
            title: "Payment Successful",
            message: `Payment of ₦${amount.toLocaleString()} has been received successfully.`,
        },
        failed: {
            type: "alert",
            title: "Payment Failed",
            message: `Payment of ₦${amount.toLocaleString()} failed. Please try again or contact support.`,
        },
    };

    const config = statusMessages[status] || {
        type: "info",
        title: "Payment Update",
        message: `Payment status: ${status}`,
    };

    return await createNotification({
        userId,
        type: config.type,
        category: "payment",
        title: config.title,
        message: config.message,
        metadata: {
            orderId,
            paymentStatus: status,
            amount,
        },
    });
}

/**
 * Create stock alert notification
 * @param {String} productName - Product name
 * @param {Number} remainingStock - Remaining stock count
 * @param {Boolean} broadcast - Send to all users or just admins
 */
export async function createStockAlertNotification(productName, remainingStock, broadcast = false) {
    return await createNotification({
        userId: broadcast ? null : undefined, // null for broadcast, undefined for admin-only
        type: "alert",
        category: "stock",
        title: "Low Stock Alert",
        message: `${productName} is running low. Only ${remainingStock} units remaining.`,
        metadata: {
            productName,
            remainingStock,
        },
    });
}

/**
 * Create company broadcast notification
 * @param {String} title - Notification title
 * @param {String} message - Notification message
 * @param {Object} metadata - Additional metadata
 */
export async function createBroadcastNotification(title, message, metadata = {}) {
    return await createNotification({
        userId: null, // Broadcast to all users
        type: "info",
        category: "company",
        title,
        message,
        metadata,
    });
}
