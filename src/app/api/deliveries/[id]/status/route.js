import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Delivery from "@/lib/models/DeliveryModel";

// PATCH - Update delivery status
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const { deliveryStatus, deliveryNotes } = await req.json();

        // Validate status
        const validStatuses = ["in_transit", "delivered", "failed", "returned"];
        if (!validStatuses.includes(deliveryStatus)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
                { status: 400 }
            );
        }

        const updateData = { deliveryStatus };

        // Set deliveredAt timestamp if status is delivered
        if (deliveryStatus === "delivered" && !updateData.deliveredAt) {
            updateData.deliveredAt = new Date();
        }

        if (deliveryNotes) {
            updateData.deliveryNotes = deliveryNotes;
        }

        const delivery = await Delivery.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .populate("order", "items status")
            .populate("dispatch", "dispatchStatus");

        if (!delivery) {
            return NextResponse.json(
                { error: "Delivery not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: `Delivery status updated to ${deliveryStatus}`,
            delivery,
        });
    } catch (error) {
        console.error("Error updating delivery status:", error);
        return NextResponse.json(
            { error: "Failed to update delivery status" },
            { status: 500 }
        );
    }
}
