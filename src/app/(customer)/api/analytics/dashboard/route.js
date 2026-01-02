import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/analytics/dashboard - Get dashboard analytics
export async function GET(req) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Query the analytics view
        const { data, error } = await supabase
            .from('dashboard_analytics_view')
            .select('*')
            .single();

        if (error) {
            console.error("Supabase view fetch error:", error);
            throw new Error(error.message);
        }

        // The view returns a single row with valid JSON objects
        return NextResponse.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics", details: error.message },
            { status: 500 }
        );
    }
}
