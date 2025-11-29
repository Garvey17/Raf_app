import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/config/dbSetup";
import Notification from "@/lib/models/NotificationModel";

// PATCH /api/notifications/[id]/read - Mark notification as read
export async function PATCH(req, context) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        // Await params in Next.js 15+
        const { id } = await context.params;

        console.log("Marking notification as read:", id, "for user:", session.user.id);

        // Find and update the notification
        const notification = await Notification.findOneAndUpdate(
            {
                _id: id,
                $or: [
                    { userId: session.user.id },
                    { userId: null }, // Allow marking broadcast notifications as read
                ],
            },
            { read: true },
            { new: true }
        );

        if (!notification) {
            console.log("Notification not found:", id);
            return NextResponse.json(
                { error: "Notification not found" },
                { status: 404 }
            );
        }

        console.log("Notification marked as read successfully:", notification._id);

        return NextResponse.json({
            success: true,
            notification,
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return NextResponse.json(
            { error: "Failed to update notification", details: error.message },
            { status: 500 }
        );
    }
}
