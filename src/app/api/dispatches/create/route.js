import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Dispatch from "@/lib/models/DispatchModel";
import Order from "@/lib/models/OrderModel";

// POST - Create dispatch from approved order
export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json(
                { error: "Order ID is required" },
                { status: 400 }
            );
        }

        // Fetch the order
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Check if order is approved/paid (ready for dispatch)
        if (order.status !== "approved" && order.status !== "paid") {
            return NextResponse.json(
                { error: "Only approved or paid orders can be dispatched" },
                { status: 400 }
            );
        }

        // Check if dispatch already exists for this order
        const existingDispatch = await Dispatch.findOne({ order: orderId });
        if (existingDispatch) {
            return NextResponse.json(
                { error: "Dispatch already exists for this order" },
                { status: 400 }
            );
        }

        // Calculate total product quantity
        const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

        // Create dispatch record
        const dispatch = await Dispatch.create({
            order: orderId,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            productQuantity: totalQuantity,
            deliveryDate: order.deliveryDate,
            destination: order.address,
            totalAmount: order.totalAmount,
            dispatchStatus: "ready_for_dispatch",
        });

        // Populate order details for response
        await dispatch.populate("order", "items status");

        return NextResponse.json(
            { message: "Dispatch created successfully", dispatch },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating dispatch:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
