import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Dispatch from "@/lib/models/DispatchModel";

// PATCH - Update dispatch status
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const { dispatchStatus } = await req.json();

        // Validate status
        const validStatuses = ["ready_for_dispatch", "dispatched", "in_transit", "delivered", "cancelled"];
        if (!validStatuses.includes(dispatchStatus)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
                { status: 400 }
            );
        }

        const updateData = { dispatchStatus };

        // Set timestamps based on status
        if (dispatchStatus === "dispatched" && !updateData.dispatchedAt) {
            updateData.dispatchedAt = new Date();
        } else if (dispatchStatus === "delivered") {
            updateData.deliveredAt = new Date();
        }

        const dispatch = await Dispatch.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate("order", "items status");

        if (!dispatch) {
            return NextResponse.json(
                { error: "Dispatch not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: `Dispatch status updated to ${dispatchStatus}`,
            dispatch,
        });
    } catch (error) {
        console.error("Error updating dispatch status:", error);
        return NextResponse.json(
            { error: "Failed to update dispatch status" },
            { status: 500 }
        );
    }
}
