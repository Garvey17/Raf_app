import { NextResponse } from "next/server";
import { Payment, Order } from "@/lib/services/dataService";

// POST - Create a new payment
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            orderId,
            userId,
            customerName,
            paymentMethod,
            reference,
            amount,
        } = body;

        // Validate required fields
        if (!orderId || !userId || !customerName || !paymentMethod || !reference || !amount) {
            return NextResponse.json(
                { error: "Missing required fields: orderId, userId, customerName, paymentMethod, reference, amount" },
                { status: 400 }
            );
        }

        // Verify order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Create payment
        const payment = await Payment.create({
            user: userId,
            order: orderId,
            customerName,
            paymentMethod,
            reference,
            amount,
            verificationStatus: "pending",
            status: "pending", // Legacy field
        });

        // Use findOne to return populated structure if necessary
        const populatedPayment = await Payment.findOne({ _id: payment._id })
            .populate("user")
            .populate("order");

        return NextResponse.json(
            { message: "Payment created successfully", payment: populatedPayment || payment },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating payment:", error);

        // Handle duplicate reference error? dataService doesn't throw on duplicates unless enforced.
        // But for dummy data it's likely fine.

        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
