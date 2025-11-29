import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Order from "@/lib/models/OrderModel";

// GET single order by ID
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const order = await Order.findById(id).populate("user", "name email phone");

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json(
            { error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}

// PATCH - Update order (mainly for status updates)
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const updates = await req.json();

        // Prevent updating certain fields
        delete updates._id;
        delete updates.orderNumber; // Order number should not be changed
        delete updates.createdAt;
        delete updates.updatedAt;

        const order = await Order.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate("user", "name email phone");

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Order updated successfully",
            order,
        });
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 }
        );
    }
}

// DELETE - Delete an order
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const order = await Order.findByIdAndDelete(id);

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Order deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting order:", error);
        return NextResponse.json(
            { error: "Failed to delete order" },
            { status: 500 }
        );
    }
}
