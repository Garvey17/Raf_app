import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Driver from "@/lib/models/DriverModel";

// GET driver's delivery history
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const driver = await Driver.findById(id).select("name driverNumber totalDeliveries");
        if (!driver) {
            return NextResponse.json(
                { error: "Driver not found" },
                { status: 404 }
            );
        }

        // Get delivery records for this driver
        const Delivery = (await import("@/lib/models/DeliveryModel")).default;
        const deliveries = await Delivery.find({
            driver: { $regex: driver.name, $options: "i" }
        })
            .sort({ deliveredAt: -1 })
            .populate("order", "orderNumber items");

        return NextResponse.json({
            driver: {
                name: driver.name,
                driverNumber: driver.driverNumber,
                totalDeliveries: driver.totalDeliveries,
            },
            deliveries,
            count: deliveries.length,
        });
    } catch (error) {
        console.error("Error fetching driver deliveries:", error);
        return NextResponse.json(
            { error: "Failed to fetch driver deliveries" },
            { status: 500 }
        );
    }
}
