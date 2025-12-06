import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        // Optional: Ensure user is logged in to see their orders
        // if (!user) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const search = searchParams.get("search");

        let query = supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        // Filter by user if logged in (RLS usually handles this, but good to be explicit or if RLS is open)
        if (user) {
            query = query.eq('user_id', user.id);
        }

        if (status) {
            query = query.eq('status', status);
        }

        if (search) {
            query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`);
        }

        const { data: orders, error } = await query;

        if (error) {
            console.error("Supabase fetch error:", error);
            throw new Error(error.message);
        }

        // Transform Supabase data to match expected frontend structure if needed
        // Assuming frontend expects keys like `orderNumber`, `customerName` but DB has `order_number`, `customer_name`
        // We can map them here or update frontend. 
        // Let's update frontend to handle snake_case or map here. 
        // Mapping here is safer for existing frontend components.

        const mappedOrders = orders.map(order => ({
            _id: order.id, // Frontend uses _id for key/links
            orderNumber: order.order_number,
            customerName: order.customer_name,
            customerPhone: order.customer_phone,
            items: order.items || [], // JSONB
            totalAmount: order.total_amount,
            status: order.status,
            address: order.address,
            deliveryDate: order.delivery_date,
            createdAt: order.created_at,
            // Dispatch Info
            driverName: order.driver_name,
            driverPhone: order.driver_phone,
            truckNumber: order.truck_number,
            atcNumber: order.atc_number
        }));

        return NextResponse.json(
            { orders: mappedOrders, count: mappedOrders.length },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
