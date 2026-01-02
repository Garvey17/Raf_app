import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Dispatch from "@/lib/models/DispatchModel";

// GET dispatched orders ready for delivery tracking
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const driver = searchParams.get("driver");

        // Query for dispatched orders
        let query = {
            dispatchStatus: { $in: ["dispatched", "in_transit"] },
            driver: { $ne: null }, // Must have driver assigned
        };

        // Filter by driver if provided
        if (driver) {
            query.driver = { $regex: driver, $options: "i" };
        }

        const dispatches = await Dispatch.find(query)
            .sort({ deliveryDate: 1 })
            .populate("order", "items status customerPhone");

        // Check which dispatches already have deliveries
        const Delivery = (await import("@/lib/models/DeliveryModel")).default;
        const dispatchIds = dispatches.map(dispatch => dispatch._id);
        const existingDeliveries = await Delivery.find({
            dispatch: { $in: dispatchIds }
        }).select("dispatch");

        const deliveryDispatchIds = new Set(
            existingDeliveries.map(d => d.dispatch.toString())
        );

        // Filter out dispatches that already have deliveries
        const availableDispatches = dispatches.filter(
            dispatch => !deliveryDispatchIds.has(dispatch._id.toString())
        );

        return NextResponse.json({
            dispatches: availableDispatches,
            count: availableDispatches.length,
        });
    } catch (error) {
        console.error("Error fetching dispatched orders:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
