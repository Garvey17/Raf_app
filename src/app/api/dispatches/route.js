import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Dispatch from "@/lib/models/DispatchModel";

// GET all dispatches
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const dispatchStatus = searchParams.get("dispatchStatus");
        const startDate = searchParams.get("startDate"); // Filter by delivery date range
        const endDate = searchParams.get("endDate");
        const search = searchParams.get("search"); // Search by order number or customer name
        const driver = searchParams.get("driver"); // Filter by driver

        let query = {};

        // Build query filters
        if (dispatchStatus) {
            query.dispatchStatus = dispatchStatus;
        }

        if (driver) {
            query.driver = driver;
        }

        if (startDate || endDate) {
            query.deliveryDate = {};
            if (startDate) {
                query.deliveryDate.$gte = new Date(startDate);
            }
            if (endDate) {
                query.deliveryDate.$lte = new Date(endDate);
            }
        }

        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: "i" } },
                { customerName: { $regex: search, $options: "i" } },
                { driver: { $regex: search, $options: "i" } },
            ];
        }

        const dispatches = await Dispatch.find(query)
            .populate("order", "items status")
            .sort({ deliveryDate: 1, createdAt: -1 }); // Sort by delivery date, then creation

        return NextResponse.json(
            { dispatches, count: dispatches.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching dispatches:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
