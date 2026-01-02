import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Staff from "@/lib/models/StaffModel";

// PATCH - Update staff status
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const { status } = await req.json();

        // Validate status
        const validStatuses = ["active", "inactive", "suspended"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
                { status: 400 }
            );
        }

        const staff = await Staff.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true, runValidators: true }
        ).select("-password");

        if (!staff) {
            return NextResponse.json(
                { error: "Staff member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: `Staff status updated to ${status}`,
            staff,
        });
    } catch (error) {
        console.error("Error updating staff status:", error);
        return NextResponse.json(
            { error: "Failed to update staff status" },
            { status: 500 }
        );
    }
}
