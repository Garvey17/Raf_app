import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/config/dbSetup";
import Notification from "@/lib/models/NotificationModel";

// POST /api/notifications/send - Send notification (company/admin use)
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // TODO: Add admin role check here
        // if (session.user.role !== "admin") {
        //   return NextResponse.json(
        //     { error: "Forbidden - Admin access required" },
        //     { status: 403 }
        //   );
        // }

        await connectDB();

        const body = await req.json();
        const {
            userId,
            type = "info",
            category = "company",
            title,
            message,
            icon,
            metadata = {},
            expiresAt,
        } = body;

        if (!title || !message) {
            return NextResponse.json(
                { error: "Title and message are required" },
                { status: 400 }
            );
        }

        // Create notification
        const notification = await Notification.create({
            userId: userId || null, // null for broadcast
            type,
            category,
            title,
            message,
            icon,
            metadata,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        });

        return NextResponse.json({
            success: true,
            notification,
            message: userId
                ? "Notification sent to user"
                : "Broadcast notification created",
        });
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json(
            { error: "Failed to send notification" },
            { status: 500 }
        );
    }
}
