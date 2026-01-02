import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Staff from "@/lib/models/StaffModel";

// GET single staff member by ID
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const staff = await Staff.findById(id).select("-password");

        if (!staff) {
            return NextResponse.json(
                { error: "Staff member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ staff });
    } catch (error) {
        console.error("Error fetching staff:", error);
        return NextResponse.json(
            { error: "Failed to fetch staff member" },
            { status: 500 }
        );
    }
}

// PATCH - Update staff member
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const updates = await req.json();

        // Prevent updating certain fields
        delete updates._id;
        delete updates.staffNumber; // Staff number should not be changed
        delete updates.password; // Use separate password update endpoint
        delete updates.email; // Email changes should be handled carefully
        delete updates.createdAt;
        delete updates.updatedAt;

        const staff = await Staff.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!staff) {
            return NextResponse.json(
                { error: "Staff member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Staff member updated successfully",
            staff,
        });
    } catch (error) {
        console.error("Error updating staff:", error);
        return NextResponse.json(
            { error: "Failed to update staff member" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a staff member
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const staff = await Staff.findByIdAndDelete(id);

        if (!staff) {
            return NextResponse.json(
                { error: "Staff member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Staff member deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting staff:", error);
        return NextResponse.json(
            { error: "Failed to delete staff member" },
            { status: 500 }
        );
    }
}
