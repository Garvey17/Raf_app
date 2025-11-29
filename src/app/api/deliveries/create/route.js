import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Delivery from "@/lib/models/DeliveryModel";
import Dispatch from "@/lib/models/DispatchModel";
import Order from "@/lib/models/OrderModel";

// POST - Create delivery from dispatched order
export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { dispatchId } = body;

        if (!dispatchId) {
            return NextResponse.json(
                { error: "Dispatch ID is required" },
                { status: 400 }
            );
        }

        // Fetch the dispatch
        const dispatch = await Dispatch.findById(dispatchId).populate("order");
        if (!dispatch) {
            return NextResponse.json(
                { error: "Dispatch not found" },
                { status: 404 }
            );
        }

        // Check if dispatch has been dispatched (has driver assigned)
        if (dispatch.dispatchStatus !== "dispatched" && dispatch.dispatchStatus !== "in_transit") {
            return NextResponse.json(
                { error: "Only dispatched orders can be converted to deliveries" },
                { status: 400 }
            );
        }

        // Verify driver is assigned
        if (!dispatch.driver) {
            return NextResponse.json(
                { error: "Dispatch must have a driver assigned" },
                { status: 400 }
            );
        }

        // Check if delivery already exists for this order
        const existingDelivery = await Delivery.findOne({ order: dispatch.order._id });
        if (existingDelivery) {
            return NextResponse.json(
                { error: "Delivery already exists for this order" },
                { status: 400 }
            );
        }

        // Create delivery record
        const delivery = await Delivery.create({
            order: dispatch.order._id,
            dispatch: dispatchId,
            orderNumber: dispatch.orderNumber,
            customerName: dispatch.customerName,
            quantity: dispatch.productQuantity,
            dropLocation: dispatch.destination,
            phoneNumber: dispatch.order.customerPhone,
            deliveryDate: dispatch.deliveryDate,
            driver: dispatch.driver,
            driverPhone: dispatch.driverPhone || "",
            truckNumber: dispatch.vehicleNumber || "",
            dispatchedAt: dispatch.dispatchedAt || new Date(),
            deliveryStatus: "in_transit",
        });

        // Update dispatch status to in_transit if not already
        if (dispatch.dispatchStatus === "dispatched") {
            dispatch.dispatchStatus = "in_transit";
            await dispatch.save();
        }

        // Populate references for response
        await delivery.populate([
            { path: "order", select: "items status" },
            { path: "dispatch", select: "dispatchStatus assignedBy" },
        ]);

        return NextResponse.json(
            { message: "Delivery created successfully", delivery },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating delivery:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
