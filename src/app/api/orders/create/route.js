import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        const body = await req.json();
        const { product, quantity, name, phone, location, deliveryDate, instructions } = body;

        // Basic validation
        if (!product || !quantity || !name || !phone || !location || !deliveryDate) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate Order Number: ORD-YYYYMMDD-XXXX
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

        // Construct items array (assuming single product selection for now as per form)
        const items = [
            {
                productName: product,
                quantity: Number(quantity),
                priceAtPurchase: 0, // Ideally fetch this from DB, but 0 for now as per logic
            }
        ];

        // Insert into Supabase
        const { data, error } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                user_id: user?.id || null, // Link if logged in
                customer_name: name,
                customer_phone: phone,
                address: location,
                delivery_date: new Date(deliveryDate), // Ensure Date object/ISO string
                instructions: instructions,
                items: items, // JSONB
                total_amount: 0, // Placeholder
                status: 'pending'
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            throw new Error(error.message);
        }

        return NextResponse.json(
            { message: "Order created successfully", order: data },
            { status: 201 }
        );

    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
