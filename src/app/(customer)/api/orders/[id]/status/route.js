import { NextResponse } from "next/server";
import { Order } from "@/lib/services/dataService";
import { createOrderStatusNotification } from "@/lib/utils/notificationHelpers";

// PATCH - Update order status
export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const { status } = await req.json();

        // Validate status
        const validStatuses = ["pending", "approved", "paid", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
                { status: 400 }
            );
        }

        // Update status
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Re-fetch with population for notification context if needed
        const populatedOrder = await Order.findOne({ _id: id }).populate("user");

        // Create notification for status change if user is linked
        if (populatedOrder && populatedOrder.user) {
            await createOrderStatusNotification(
                populatedOrder.user._id.toString(),
                populatedOrder._id.toString(),
                status,
                {
                    productName: populatedOrder.items?.[0]?.productName || "Order",
                    quantity: populatedOrder.items?.[0]?.quantity || 0,
                    deliveryDate: populatedOrder.deliveryDate,
                }
            );
        }

        return NextResponse.json({
            message: "Order status updated successfully",
            order: populatedOrder || order,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json(
            { error: "Failed to update order status" },
            { status: 500 }
        );
    }
}
