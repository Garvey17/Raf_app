import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Payment from "@/lib/models/PaymentModel";

// PATCH - Verify payment (approve or reject)
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const { verificationStatus, staffNumber } = await req.json();

        // Validate verification status
        const validStatuses = ["pending", "approved", "rejected"];
        if (!validStatuses.includes(verificationStatus)) {
            return NextResponse.json(
                { error: `Invalid verification status. Must be one of: ${validStatuses.join(", ")}` },
                { status: 400 }
            );
        }

        // Validate staff number for approved/rejected status
        if ((verificationStatus === "approved" || verificationStatus === "rejected") && !staffNumber) {
            return NextResponse.json(
                { error: "Staff number is required for verification" },
                { status: 400 }
            );
        }

        const updateData = {
            verificationStatus,
        };

        // Add verification details if approving or rejecting
        if (verificationStatus === "approved" || verificationStatus === "rejected") {
            updateData.verifiedBy = staffNumber;
            updateData.verifiedAt = new Date();

            // Update legacy status field for backward compatibility
            if (verificationStatus === "approved") {
                updateData.status = "success";
                updateData.paidAt = new Date();
            } else if (verificationStatus === "rejected") {
                updateData.status = "failed";
            }
        }

        const payment = await Payment.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .populate("user", "name email phone")
            .populate("order", "orderNumber items deliveryDate");

        if (!payment) {
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: `Payment ${verificationStatus} successfully`,
            payment,
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { error: "Failed to verify payment" },
            { status: 500 }
        );
    }
}
