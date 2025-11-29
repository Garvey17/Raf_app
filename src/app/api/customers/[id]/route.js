import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import User from "@/lib/models/UserModel";

// GET single customer by ID
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const customer = await User.findById(id).select("-password");

        if (!customer) {
            return NextResponse.json(
                { error: "Customer not found" },
                { status: 404 }
            );
        }

        // Calculate status
        let status = "inactive";
        if (customer.lastPurchaseDate) {
            const daysSinceLastPurchase = Math.floor(
                (Date.now() - customer.lastPurchaseDate.getTime()) /
                (1000 * 60 * 60 * 24)
            );
            status = daysSinceLastPurchase <= 90 ? "active" : "inactive";
        }

        return NextResponse.json({
            customer: { ...customer.toObject(), status },
        });
    } catch (error) {
        console.error("Error fetching customer:", error);
        return NextResponse.json(
            { error: "Failed to fetch customer" },
            { status: 500 }
        );
    }
}

// PATCH - Update customer information
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const updates = await req.json();

        // Prevent updating sensitive fields directly
        delete updates.password;
        delete updates.email; // Email changes should go through a separate verification process
        delete updates._id;
        delete updates.createdAt;
        delete updates.updatedAt;

        const customer = await User.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!customer) {
            return NextResponse.json(
                { error: "Customer not found" },
                { status: 404 }
            );
        }

        // Calculate status
        let status = "inactive";
        if (customer.lastPurchaseDate) {
            const daysSinceLastPurchase = Math.floor(
                (Date.now() - customer.lastPurchaseDate.getTime()) /
                (1000 * 60 * 60 * 24)
            );
            status = daysSinceLastPurchase <= 90 ? "active" : "inactive";
        }

        return NextResponse.json({
            message: "Customer updated successfully",
            customer: { ...customer.toObject(), status },
        });
    } catch (error) {
        console.error("Error updating customer:", error);
        return NextResponse.json(
            { error: "Failed to update customer" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a customer
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const customer = await User.findByIdAndDelete(id);

        if (!customer) {
            return NextResponse.json(
                { error: "Customer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Customer deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting customer:", error);
        return NextResponse.json(
            { error: "Failed to delete customer" },
            { status: 500 }
        );
    }
}
