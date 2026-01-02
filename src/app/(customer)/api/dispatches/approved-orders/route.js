import { NextResponse } from "next/server";
import { Order, Dispatch } from "@/lib/services/dataService";

// GET approved orders ready for dispatch (not yet in dispatch system)
export async function GET(req) {
    try {
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
        const orderIds = orders.map(order => order._id);
        const existingDispatches = await Dispatch.find({
            order: { $in: orderIds }
        });

        const dispatchedOrderIds = new Set(
            existingDispatches.map(d => (typeof d.order === 'object' ? d.order._id : d.order).toString())
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
