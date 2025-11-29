import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Delivery from "@/lib/models/DeliveryModel";
import Dispatch from "@/lib/models/DispatchModel";
import Order from "@/lib/models/OrderModel";
import Driver from "@/lib/models/DriverModel";

// PATCH - Confirm delivery
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const { receivedBy, deliveryNotes, proofOfDelivery } = await req.json();

        const delivery = await Delivery.findById(id);
        if (!delivery) {
            return NextResponse.json(
                { error: "Delivery not found" },
                { status: 404 }
            );
        }

        // Check if already delivered
        if (delivery.deliveryStatus === "delivered") {
            return NextResponse.json(
                { error: "Delivery has already been confirmed" },
                { status: 400 }
            );
        }

        // Update delivery
        delivery.deliveryStatus = "delivered";
        delivery.deliveredAt = new Date();
        delivery.receivedBy = receivedBy || delivery.customerName; // Default to customer name if not provided

        if (deliveryNotes) {
            delivery.deliveryNotes = deliveryNotes;
        }

        if (proofOfDelivery) {
            delivery.proofOfDelivery = proofOfDelivery;
        }

        await delivery.save();

        // Update related dispatch status
        if (delivery.dispatch) {
            await Dispatch.findByIdAndUpdate(
                delivery.dispatch,
                {
                    dispatchStatus: "delivered",
                    deliveredAt: new Date()
                }
            );
        }

        // Update order status
        if (delivery.order) {
            await Order.findByIdAndUpdate(
                delivery.order,
                { status: "delivered" }
            );
        }

        // Update driver's total deliveries count
        if (delivery.driver) {
            await Driver.findOneAndUpdate(
                { name: { $regex: delivery.driver, $options: "i" } },
                {
                    $inc: { totalDeliveries: 1 },
                    $set: { lastDeliveryDate: new Date() }
                }
            );
        }

        await delivery.populate([
            { path: "order", select: "items status" },
            { path: "dispatch", select: "dispatchStatus" },
        ]);

        return NextResponse.json({
            message: "Delivery confirmed successfully",
            delivery,
        });
    } catch (error) {
        console.error("Error confirming delivery:", error);
        return NextResponse.json(
            { error: "Failed to confirm delivery" },
            { status: 500 }
        );
    }
}

