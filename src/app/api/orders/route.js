import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Order from "@/lib/models/OrderModel";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status"); // Filter by status
        const startDate = searchParams.get("startDate"); // Filter by date range
        const endDate = searchParams.get("endDate");
        const search = searchParams.get("search"); // Search by order number or customer name

        let query = {};

        // Build query filters
        if (status) {
            query.status = status;
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: "i" } },
                { customerName: { $regex: search, $options: "i" } },
                { customerPhone: { $regex: search, $options: "i" } },
            ];
        }

        const orders = await Order.find(query)
            .populate("user", "name email") // Populate user details if needed
            .sort({ createdAt: -1 });

        return NextResponse.json(
            { orders, count: orders.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
