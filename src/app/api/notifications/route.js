import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/config/dbSetup";
import Notification from "@/lib/models/NotificationModel";

// GET /api/notifications - Fetch user notifications
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const unreadOnly = searchParams.get("unreadOnly") === "true";
        const limit = parseInt(searchParams.get("limit") || "50");

        // Build query: user-specific notifications OR company broadcasts (userId: null)
        const query = {
            $or: [
                { userId: session.user.id },
                { userId: null }, // Company broadcasts
            ],
        };

        if (unreadOnly) {
            query.read = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            notifications,
            count: notifications.length,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}
