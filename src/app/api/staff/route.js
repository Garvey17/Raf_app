import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Staff from "@/lib/models/StaffModel";

// GET all staff
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const role = searchParams.get("role");
        const department = searchParams.get("department");
        const search = searchParams.get("search"); // Search by name, email, or staff number

        let query = {};

        // Build query filters
        if (status) {
            query.status = status;
        }

        if (role) {
            query.role = role;
        }

        if (department) {
            query.department = department;
        }

        if (search) {
            query.$or = [
                { staffNumber: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const staff = await Staff.find(query)
            .select("-password") // Exclude password from results
            .sort({ dateJoined: -1 });

        return NextResponse.json(
            { staff, count: staff.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching staff:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
