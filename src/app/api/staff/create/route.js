import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Staff from "@/lib/models/StaffModel";
import { hash } from "bcrypt";

// POST - Create new staff member
export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const {
            name,
            email,
            phone,
            role,
            department,
            password,
            dateJoined,
            permissions,
            notes
        } = body;

        // Validate required fields
        if (!name || !email || !role || !department) {
            return NextResponse.json(
                { error: "Name, email, role, and department are required" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return NextResponse.json(
                { error: "Staff member with this email already exists" },
                { status: 400 }
            );
        }

        // Hash password if provided
        let hashedPassword = null;
        if (password) {
            hashedPassword = await hash(password, 10);
        }

        // Create staff member
        const staff = await Staff.create({
            name,
            email,
            phone: phone || "",
            role,
            department,
            password: hashedPassword,
            dateJoined: dateJoined ? new Date(dateJoined) : new Date(),
            permissions: permissions || [],
            notes: notes || "",
            status: "active",
        });

        // Remove password from response
        const staffResponse = staff.toObject();
        delete staffResponse.password;

        return NextResponse.json(
            { message: "Staff member created successfully", staff: staffResponse },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating staff:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
