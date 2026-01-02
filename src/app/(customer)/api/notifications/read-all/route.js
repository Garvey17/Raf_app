import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(req) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Mark all as read
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', user.id)
            .eq('read', false); // Only update unread ones

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
