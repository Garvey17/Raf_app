import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Dispatch from "@/lib/models/DispatchModel";

// GET single dispatch by ID
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const dispatch = await Dispatch.findById(id).populate("order", "items status customerPhone");

        if (!dispatch) {
            return NextResponse.json(
                { error: "Dispatch not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ dispatch });
    } catch (error) {
        console.error("Error fetching dispatch:", error);
        return NextResponse.json(
            { error: "Failed to fetch dispatch" },
            { status: 500 }
        );
    }
}

// PATCH - Update dispatch
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const updates = await req.json();

        // Prevent updating certain fields
        delete updates._id;
        delete updates.order;
        delete updates.orderNumber;
        delete updates.createdAt;
        delete updates.updatedAt;

        const dispatch = await Dispatch.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate("order", "items status");

        if (!dispatch) {
            return NextResponse.json(
                { error: "Dispatch not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Dispatch updated successfully",
            dispatch,
        });
    } catch (error) {
        console.error("Error updating dispatch:", error);
        return NextResponse.json(
            { error: "Failed to update dispatch" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a dispatch
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const dispatch = await Dispatch.findByIdAndDelete(id);

        if (!dispatch) {
            return NextResponse.json(
                { error: "Dispatch not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Dispatch deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting dispatch:", error);
        return NextResponse.json(
            { error: "Failed to delete dispatch" },
            { status: 500 }
        );
    }
}
