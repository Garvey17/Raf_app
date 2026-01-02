import { NextResponse } from "next/server";
import { Delivery } from "@/lib/services/dataService";

// GET all deliveries
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const deliveryStatus = searchParams.get("deliveryStatus");
        const driver = searchParams.get("driver");
        const startDate = searchParams.get("startDate"); // Filter by delivery date range
        const endDate = searchParams.get("endDate");
        const search = searchParams.get("search"); // Search by delivery number, order number, or customer name

        let query = {};

        // Build query filters
        if (deliveryStatus) {
            query.deliveryStatus = deliveryStatus;
        }

        if (driver) {
            query.driver = { $regex: driver, $options: "i" };
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
                { deliveryNumber: { $regex: search, $options: "i" } },
                { orderNumber: { $regex: search, $options: "i" } },
                { customerName: { $regex: search, $options: "i" } },
            ];
        }

        const deliveries = await Delivery.find(query)
            .populate("order", "items status")
            .populate("dispatch", "dispatchStatus assignedBy")
            .sort({ deliveryDate: 1, createdAt: -1 });

        return NextResponse.json(
            { deliveries, count: deliveries.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching deliveries:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
