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

        const body = await req.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Only allow customer to mark as 'delivered'
        // Admin logic would be different, but for this user-facing app:
        if (status !== 'delivered') {
            return NextResponse.json({ error: "Invalid status update for customer" }, { status: 403 });
        }

        // Update in Supabase, ensuring user owns the order
        const { data, error } = await supabase
            .from('orders')
            .update({ status: status, updated_at: new Date() })
            .eq('id', orderId)
            .eq('user_id', user.id) // Security: Ensure user owns it
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json(
            { message: "Order status updated", order: data },
            { status: 200 }
        );

    } catch (error) {
        console.error("Update status error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
