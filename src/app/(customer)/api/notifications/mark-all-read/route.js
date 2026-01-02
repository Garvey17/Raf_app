import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/config/dbSetup";
import Notification from "@/lib/models/NotificationModel";

// PATCH /api/notifications/mark-all-read - Mark all user notifications as read
export async function PATCH(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        // Update all unread notifications for this user
        const result = await Notification.updateMany(
            {
                $or: [
                    { userId: session.user.id },
                    { userId: null }, // Include broadcast notifications
                ],
                read: false,
            },
            { read: true }
        );

        return NextResponse.json({
            success: true,
            modifiedCount: result.modifiedCount,
            message: `${result.modifiedCount} notification(s) marked as read`,
        });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return NextResponse.json(
            { error: "Failed to update notifications" },
            { status: 500 }
        );
    }
}
