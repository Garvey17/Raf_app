import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Order from "@/lib/models/OrderModel";
import User from "@/lib/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createOrderStatusNotification } from "@/lib/utils/notificationHelpers";

export async function POST(req) {
    try {
        await connectDB();

        // Get session to link notification to user
        const session = await getServerSession(authOptions);

        const body = await req.json();
        const { product, quantity, name, phone, location, deliveryDate, instructions } = body;

        // Basic validation
        if (!product || !quantity || !name || !phone || !location || !deliveryDate) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Convert deliveryDate string to Date object if needed
        const deliveryDateObj = deliveryDate instanceof Date
            ? deliveryDate
            : new Date(deliveryDate);

        // Create the order
        const newOrder = await Order.create({
            user: session?.user?.id, // Link to logged-in user if available
            customerName: name,
            customerPhone: phone,
            address: location,
            deliveryDate: deliveryDateObj,
            instructions,
            items: [
                {
                    productName: product,
                    quantity: Number(quantity),
                    priceAtPurchase: 0, // You might want to look up price from a Product model if available
                },
            ],
            totalAmount: 0, // Calculate this if you have prices
            status: "pending",
        });

        // Update user's lastPurchaseDate if logged in
        if (session?.user?.id) {
            await User.findByIdAndUpdate(
                session.user.id,
                { $set: { lastPurchaseDate: new Date() } }
            );

            // Create success notification for the user
            await createOrderStatusNotification(
                session.user.id,
                newOrder._id.toString(),
                "pending",
                {
                    productName: product,
                    quantity: quantity,
                    deliveryDate: deliveryDate,
                }
            );
        }

        return NextResponse.json(
            { message: "Order created successfully", order: newOrder },
            { status: 201 }
        );
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


