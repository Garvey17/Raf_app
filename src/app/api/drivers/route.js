import { NextResponse } from "next/server";
import { Driver } from "@/lib/services/dataService";

// GET all drivers
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const vehicleAssigned = searchParams.get("vehicleAssigned");
        const search = searchParams.get("search"); // Search by name, email, or driver number

        let query = {};

        // Build query filters
        if (status) {
            query.status = status;
        }

        if (vehicleAssigned) {
            if (vehicleAssigned === "assigned") {
                query.vehicleAssigned = { $ne: null };
            } else if (vehicleAssigned === "unassigned") {
                query.vehicleAssigned = null;
            } else {
                query.vehicleAssigned = vehicleAssigned;
            }
        }

        if (search) {
            query.$or = [
                { driverNumber: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        const drivers = await Driver.find(query)
            .select("-password") // Exclude password from results
            .sort({ dateJoined: -1 });

        return NextResponse.json(
            { drivers, count: drivers.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching drivers:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
