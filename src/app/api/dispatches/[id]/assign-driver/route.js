import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Dispatch from "@/lib/models/DispatchModel";

// PATCH - Assign driver to dispatch
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const { driver, driverPhone, vehicleNumber, assignedBy } = await req.json();

        // Validate required fields
        if (!driver || !assignedBy) {
            return NextResponse.json(
                { error: "Driver name and assignedBy (transport officer) are required" },
                { status: 400 }
            );
        }

        const dispatch = await Dispatch.findById(id);
        if (!dispatch) {
            return NextResponse.json(
                { error: "Dispatch not found" },
                { status: 404 }
            );
        }

        // Check if dispatch is in correct status
        if (dispatch.dispatchStatus !== "ready_for_dispatch") {
            return NextResponse.json(
                { error: "Can only assign driver to dispatches with 'ready_for_dispatch' status" },
                { status: 400 }
            );
        }

        // Update dispatch with driver details
        dispatch.driver = driver;
        dispatch.driverPhone = driverPhone || null;
        dispatch.vehicleNumber = vehicleNumber || null;
        dispatch.assignedBy = assignedBy;
        dispatch.assignedAt = new Date();
        dispatch.dispatchStatus = "dispatched";
        dispatch.dispatchedAt = new Date();

        await dispatch.save();
        await dispatch.populate("order", "items status");

        return NextResponse.json({
            message: "Driver assigned successfully",
            dispatch,
        });
    } catch (error) {
        console.error("Error assigning driver:", error);
        return NextResponse.json(
            { error: "Failed to assign driver" },
            { status: 500 }
        );
    }
}
