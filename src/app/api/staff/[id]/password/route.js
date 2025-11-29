import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/dbSetup";
import Staff from "@/lib/models/StaffModel";
import { hash, compare } from "bcrypt";

// PATCH - Update staff password
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const { currentPassword, newPassword } = await req.json();

        if (!newPassword) {
            return NextResponse.json(
                { error: "New password is required" },
                { status: 400 }
            );
        }

        const staff = await Staff.findById(id);
        if (!staff) {
            return NextResponse.json(
                { error: "Staff member not found" },
                { status: 404 }
            );
        }

        // If current password is provided, verify it
        if (currentPassword && staff.password) {
            const isValid = await compare(currentPassword, staff.password);
            if (!isValid) {
                return NextResponse.json(
                    { error: "Current password is incorrect" },
                    { status: 401 }
                );
            }
        }

        // Hash new password
        const hashedPassword = await hash(newPassword, 10);
        staff.password = hashedPassword;
        await staff.save();

        return NextResponse.json({
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json(
            { error: "Failed to update password" },
            { status: 500 }
        );
    }
}
