import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Order from "@/lib/models/OrderModel";
import { createOrderStatusNotification } from "@/lib/utils/notificationHelpers";

// PATCH - Update order status
export async function PATCH(req, { params }) {
    try {
        await connectDB();
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

        const order = await Order.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true, runValidators: true }
        ).populate("user", "name email");

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Create notification for status change if user is linked
        if (order.user) {
            await createOrderStatusNotification(
                order.user._id.toString(),
                order._id.toString(),
                status,
                {
                    productName: order.items[0]?.productName || "Order",
                    quantity: order.items[0]?.quantity || 0,
                    deliveryDate: order.deliveryDate,
                }
            );
        }

        return NextResponse.json({
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json(
            { error: "Failed to update order status" },
            { status: 500 }
        );
    }
}
