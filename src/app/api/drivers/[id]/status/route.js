import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Driver from "@/lib/models/DriverModel";

// PATCH - Update driver status
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const { status } = await req.json();

        // Validate status
        const validStatuses = ["active", "inactive", "on_leave", "suspended"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
                { status: 400 }
            );
        }

        const driver = await Driver.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true, runValidators: true }
        ).select("-password");

        if (!driver) {
            return NextResponse.json(
                { error: "Driver not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: `Driver status updated to ${status}`,
            driver,
        });
    } catch (error) {
        console.error("Error updating driver status:", error);
        return NextResponse.json(
            { error: "Failed to update driver status" },
            { status: 500 }
        );
    }
}
