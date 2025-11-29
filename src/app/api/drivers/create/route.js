import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Driver from "@/lib/models/DriverModel";
import { hash } from "bcrypt";

// POST - Create new driver
export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const {
            name,
            email,
            phone,
            vehicleAssigned,
            licenseNumber,
            licenseExpiry,
            password,
            dateJoined,
            notes
        } = body;

        // Validate required fields
        if (!name || !email || !phone) {
            return NextResponse.json(
                { error: "Name, email, and phone are required" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingDriver = await Driver.findOne({ email });
        if (existingDriver) {
            return NextResponse.json(
                { error: "Driver with this email already exists" },
                { status: 400 }
            );
        }

        // Hash password if provided
        let hashedPassword = null;
        if (password) {
            hashedPassword = await hash(password, 10);
        }

        // Create driver
        const driver = await Driver.create({
            name,
            email,
            phone,
            vehicleAssigned: vehicleAssigned || null,
            licenseNumber: licenseNumber || "",
            licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : null,
            password: hashedPassword,
            dateJoined: dateJoined ? new Date(dateJoined) : new Date(),
            notes: notes || "",
            status: "active",
            role: "driver",
            department: "logistics",
            totalDeliveries: 0,
        });

        // Remove password from response
        const driverResponse = driver.toObject();
        delete driverResponse.password;

        return NextResponse.json(
            { message: "Driver created successfully", driver: driverResponse },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating driver:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
