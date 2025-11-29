import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import User from "@/lib/models/UserModel";

// PATCH - Update customer verification status
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const { verificationStatus } = await req.json();

        // Validate verification status
        const validStatuses = ["unverified", "pending", "verified"];
        if (!validStatuses.includes(verificationStatus)) {
            return NextResponse.json(
                { error: "Invalid verification status. Must be: unverified, pending, or verified" },
                { status: 400 }
            );
        }

        const customer = await User.findByIdAndUpdate(
            id,
            { $set: { verificationStatus } },
            { new: true, runValidators: true }
        ).select("-password");

        if (!customer) {
            return NextResponse.json(
                { error: "Customer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Verification status updated successfully",
            customer,
        });
    } catch (error) {
        console.error("Error updating verification status:", error);
        return NextResponse.json(
            { error: "Failed to update verification status" },
            { status: 500 }
        );
    }
}
