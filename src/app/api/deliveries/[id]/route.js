import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Delivery from "@/lib/models/DeliveryModel";

// GET single delivery by ID
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const delivery = await Delivery.findById(id)
            .populate("order", "items status customerPhone")
            .populate("dispatch", "dispatchStatus assignedBy");

        if (!delivery) {
            return NextResponse.json(
                { error: "Delivery not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ delivery });
    } catch (error) {
        console.error("Error fetching delivery:", error);
        return NextResponse.json(
            { error: "Failed to fetch delivery" },
            { status: 500 }
        );
    }
}

// PATCH - Update delivery
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const updates = await req.json();

        // Prevent updating certain fields
        delete updates._id;
        delete updates.order;
        delete updates.dispatch;
        delete updates.orderNumber;
        delete updates.deliveryNumber;
        delete updates.createdAt;
        delete updates.updatedAt;

        const delivery = await Delivery.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        )
            .populate("order", "items status")
            .populate("dispatch", "dispatchStatus");

        if (!delivery) {
            return NextResponse.json(
                { error: "Delivery not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Delivery updated successfully",
            delivery,
        });
    } catch (error) {
        console.error("Error updating delivery:", error);
        return NextResponse.json(
            { error: "Failed to update delivery" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a delivery
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const delivery = await Delivery.findByIdAndDelete(id);

        if (!delivery) {
            return NextResponse.json(
                { error: "Delivery not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Delivery deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting delivery:", error);
        return NextResponse.json(
            { error: "Failed to delete delivery" },
            { status: 500 }
        );
    }
}
