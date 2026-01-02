import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Driver from "@/lib/models/DriverModel";

// GET single driver by ID
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const driver = await Driver.findById(id).select("-password");

        if (!driver) {
            return NextResponse.json(
                { error: "Driver not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ driver });
    } catch (error) {
        console.error("Error fetching driver:", error);
        return NextResponse.json(
            { error: "Failed to fetch driver" },
            { status: 500 }
        );
    }
}

// PATCH - Update driver
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const updates = await req.json();

        // Prevent updating certain fields
        delete updates._id;
        delete updates.driverNumber; // Driver number should not be changed
        delete updates.password; // Use separate password update endpoint
        delete updates.email; // Email changes should be handled carefully
        delete updates.totalDeliveries; // Updated automatically
        delete updates.createdAt;
        delete updates.updatedAt;

        const driver = await Driver.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!driver) {
            return NextResponse.json(
                { error: "Driver not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Driver updated successfully",
            driver,
        });
    } catch (error) {
        console.error("Error updating driver:", error);
        return NextResponse.json(
            { error: "Failed to update driver" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a driver
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const driver = await Driver.findByIdAndDelete(id);

        if (!driver) {
            return NextResponse.json(
                { error: "Driver not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Driver deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting driver:", error);
        return NextResponse.json(
            { error: "Failed to delete driver" },
            { status: 500 }
        );
    }
}
