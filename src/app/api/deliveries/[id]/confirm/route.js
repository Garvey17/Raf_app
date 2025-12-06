import { NextResponse } from "next/server";
import { Delivery, Dispatch, Order, Driver } from "@/lib/services/dataService";

// PATCH - Confirm delivery
export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const { receivedBy, deliveryNotes, proofOfDelivery } = await req.json();

        const delivery = await Delivery.findById(id);
        if (!delivery) {
            return NextResponse.json(
                { error: "Delivery not found" },
                { status: 404 }
            );
        }

        // Check if already delivered
        if (delivery.deliveryStatus === "delivered") {
            return NextResponse.json(
                { error: "Delivery has already been confirmed" },
                { status: 400 }
            );
        }

        // Update delivery
        const deliveryUpdates = {
            deliveryStatus: "delivered",
            deliveredAt: new Date(),
            receivedBy: receivedBy || delivery.customerName // Default to customer name
        };

        if (deliveryNotes) {
            deliveryUpdates.deliveryNotes = deliveryNotes;
        }

        if (proofOfDelivery) {
            deliveryUpdates.proofOfDelivery = proofOfDelivery;
        }

        await Delivery.findByIdAndUpdate(id, deliveryUpdates);
        // Note: data service modify in place but we use findByIdAndUpdate to mimic persistence for good measure.
        // Actually, previous code used `delivery.save()`. 
        // With dataService, modifying `delivery` (if it's a reference) works locally but better to use explicit update.
        // But wait, findById returns clone. So we MUST use findByIdAndUpdate.

        // Update related dispatch status
        if (delivery.dispatch) {
            await Dispatch.findByIdAndUpdate(
                delivery.dispatch,
                {
                    dispatchStatus: "delivered",
                    deliveredAt: new Date()
                }
            );
        }

        // Update order status
        if (delivery.order) {
            await Order.findByIdAndUpdate(
                delivery.order,
                { status: "delivered" }
            );
        }

        // Update driver's total deliveries count
        if (delivery.driver) {
            // Need to find driver by name logic? Original code used generic findOneAndUpdate with regex.
            const allDrivers = await Driver.find({});
            const driver = allDrivers.find(d => d.name.toLowerCase() === delivery.driver.toLowerCase());

            if (driver) {
                await Driver.findByIdAndUpdate(
                    driver._id,
                    {
                        totalDeliveries: (driver.totalDeliveries || 0) + 1,
                        lastDeliveryDate: new Date()
                    }
                );
            }
        }

        // Populate details for response
        const updatedDelivery = await Delivery.findOne({ _id: id })
            .populate("order")
            .populate("dispatch");

        return NextResponse.json({
            message: "Delivery confirmed successfully",
            delivery: updatedDelivery,
        });
    } catch (error) {
        console.error("Error confirming delivery:", error);
        return NextResponse.json(
            { error: "Failed to confirm delivery" },
            { status: 500 }
        );
    }
}

