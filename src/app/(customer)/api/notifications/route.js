import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch notifications for the user
        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50); // Reasonable limit

        if (error) {
            console.error("Supabase fetch error:", error);
            throw new Error(error.message);
        }

        return NextResponse.json(
            { notifications: notifications || [] },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
