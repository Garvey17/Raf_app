import { NextResponse } from "next/server";
import { Order } from "@/lib/services/dataService";

// GET single order by ID
export async function GET(req, { params }) {
    try {
        const { id } = params;

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Populate logic if helper supports it or if it's already populated in dummy data (dummy data orders often have simple ID refs)
        // Ideally we should populate user.
        // For simplicity in dummy data, let's assume helper handles basic population or we can skip if not critical for UI details view
        // But let's try to mimic the populate call pattern supported by dataService

        let populatedOrder = order;
        // Mock populate user
        // Note: dataService.findById doesn't return a "thenable" with populate unless chained from find(), but our helper implementation might differ.
        // If we look at dataService implementation: findById returns a promise of item.
        // So we might need to manually populate if we want to mimic Mongoose fully or rely on dataService structure.
        // dataService implementation:
        // findById(id) -> returns item.
        // Helper `populate` function exists but is internal or used in chain for `find`.
        // Let's rely on finding raw order. If frontend needs populated user, we might need to enhance dataService or just return raw.
        // The previous code had .populate("user").
        // Our dataService `findById` returns the object. We can't chain populate on the result of `await Order.findById(id)`.
        // We might need `Order.findOne({_id: id}).populate(...)` to use the chainable method.

        populatedOrder = await Order.findOne({ _id: id }).populate("user");

        return NextResponse.json({ order: populatedOrder || order });
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
        const { id } = params;
        const updates = await req.json();

        // Prevent updating certain fields
        delete updates._id;
        delete updates.orderNumber; // Order number should not be changed
        delete updates.createdAt;
        delete updates.updatedAt;

        const order = await Order.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        // Note: dataService findByIdAndUpdate returns object directly.
        // If we need configured population, we might do separate find.

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Populate user for response consistency
        const populatedOrder = await Order.findOne({ _id: id }).populate("user");

        return NextResponse.json({
            message: "Order updated successfully",
            order: populatedOrder || order,
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
