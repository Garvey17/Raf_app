import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Order from "@/lib/models/OrderModel";

// GET approved orders ready for dispatch (not yet in dispatch system)
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // Query for approved or paid orders
        let query = {
            status: { $in: ["approved", "paid"] },
        };

        // Filter by delivery date if provided
        if (startDate || endDate) {
            query.deliveryDate = {};
            if (startDate) {
                query.deliveryDate.$gte = new Date(startDate);
            }
            if (endDate) {
                query.deliveryDate.$lte = new Date(endDate);
            }
        }

        const orders = await Order.find(query)
            .sort({ deliveryDate: 1 })
            .populate("user", "name email phone");

        // Check which orders already have dispatches
        const Dispatch = (await import("@/lib/models/DispatchModel")).default;
        const orderIds = orders.map(order => order._id);
        const existingDispatches = await Dispatch.find({
            order: { $in: orderIds }
        }).select("order");

        const dispatchedOrderIds = new Set(
            existingDispatches.map(d => d.order.toString())
        );

        // Filter out orders that already have dispatches
        const availableOrders = orders.filter(
            order => !dispatchedOrderIds.has(order._id.toString())
        );

        return NextResponse.json({
            orders: availableOrders,
            count: availableOrders.length,
        });
    } catch (error) {
        console.error("Error fetching approved orders:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
