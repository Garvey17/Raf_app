import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Payment from "@/lib/models/PaymentModel";
import Order from "@/lib/models/OrderModel";

// POST - Create a new payment
export async function POST(req) {
    try {
        await connectDB();

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

        // Populate references for response
        await payment.populate([
            { path: "user", select: "name email phone" },
            { path: "order", select: "orderNumber items deliveryDate" },
        ]);

        return NextResponse.json(
            { message: "Payment created successfully", payment },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating payment:", error);

        // Handle duplicate reference error
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Payment reference already exists" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
