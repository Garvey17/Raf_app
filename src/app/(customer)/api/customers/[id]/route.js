import { NextResponse } from "next/server";
import { User } from "@/lib/services/dataService";

// GET single customer
export async function GET(req, { params }) {
    try {
        const { id } = params;
        const customer = await User.findById(id);

        if (!customer) {
            return NextResponse.json(
                { error: "Customer not found" },
                { status: 404 }
            );
        }

        // Calculate status (same logic as list)
        let status = "inactive";
        if (customer.lastPurchaseDate) {
            const daysSinceLastPurchase = Math.floor(
                (Date.now() - new Date(customer.lastPurchaseDate).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            status = daysSinceLastPurchase <= 90 ? "active" : "inactive";
        }

        return NextResponse.json(
            { customer: { ...customer, status } },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching customer:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// UPDATE customer
export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();

        const customer = await User.findByIdAndUpdate(
            id,
            body,
            { new: true } // Return updated document
        );

        if (!customer) {
            return NextResponse.json(
                { error: "Customer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Customer updated successfully", customer },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating customer:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE customer
export async function DELETE(req, { params }) {
    try {
        const { id } = params;

        const customer = await User.findByIdAndDelete(id);

        if (!customer) {
            return NextResponse.json(
                { error: "Customer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Customer deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting customer:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
