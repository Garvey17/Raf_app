import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Payment from "@/lib/models/PaymentModel";

// GET single payment by ID
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const payment = await Payment.findById(id)
            .populate("user", "name email phone")
            .populate("order", "orderNumber items deliveryDate address");

        if (!payment) {
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ payment });
    } catch (error) {
        console.error("Error fetching payment:", error);
        return NextResponse.json(
            { error: "Failed to fetch payment" },
            { status: 500 }
        );
    }
}

// PATCH - Update payment
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const updates = await req.json();

        // Prevent updating certain fields
        delete updates._id;
        delete updates.paymentNumber; // Payment number should not be changed
        delete updates.user;
        delete updates.order;
        delete updates.createdAt;
        delete updates.updatedAt;

        const payment = await Payment.findByIdAndUpdate(
            id,
            { $set: updates },
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
            message: "Payment updated successfully",
            payment,
        });
    } catch (error) {
        console.error("Error updating payment:", error);
        return NextResponse.json(
            { error: "Failed to update payment" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a payment
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const payment = await Payment.findByIdAndDelete(id);

        if (!payment) {
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Payment deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting payment:", error);
        return NextResponse.json(
            { error: "Failed to delete payment" },
            { status: 500 }
        );
    }
}
