import { NextResponse } from "next/server";
import { Payment } from "@/lib/services/dataService";

// GET all payments
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const verificationStatus = searchParams.get("verificationStatus"); // Filter by verification status
        const paymentMethod = searchParams.get("paymentMethod"); // Filter by payment method
        const startDate = searchParams.get("startDate"); // Filter by date range
        const endDate = searchParams.get("endDate");
        const search = searchParams.get("search"); // Search by payment number, customer name, or reference

        let query = {};

        // Build query filters
        if (verificationStatus) {
            query.verificationStatus = verificationStatus;
        }

        if (paymentMethod) {
            query.paymentMethod = paymentMethod;
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
                { paymentNumber: { $regex: search, $options: "i" } },
                { customerName: { $regex: search, $options: "i" } },
                { reference: { $regex: search, $options: "i" } },
            ];
        }

        const payments = await Payment.find(query)
            .populate("user", "name email phone")
            .populate("order", "orderNumber items deliveryDate")
            .sort({ createdAt: -1 });

        return NextResponse.json(
            { payments, count: payments.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching payments:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
