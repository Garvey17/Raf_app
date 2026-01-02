import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Cart } from "@/lib/services/dataService";

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    const userId = session.user.id;
    const { localItems } = await req.json(); // Expecting an array of { product: id, quantity: n }

    if (!localItems || !Array.isArray(localItems)) {
        return new Response(JSON.stringify({ message: "Invalid data" }), { status: 400 });
    }

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create new cart with local items
            const newCartItems = localItems.map(item => ({
                product: item._id, // Assuming structure match
                ...item, // Keep other fields
                quantity: item.quantity || 1
            }));

            cart = await Cart.create({ user: userId, items: newCartItems });
            return new Response(JSON.stringify(cart), { status: 200 });
        }

        // Merge logic
        const mergedItems = [...cart.items];

        for (const localItem of localItems) {
            const existingItemIndex = mergedItems.findIndex(
                (item) => item.product?.toString() === localItem._id || item.id === localItem._id
            );

            if (existingItemIndex > -1) {
                // Add local quantity
                mergedItems[existingItemIndex].quantity += localItem.quantity || 1;
            } else {
                mergedItems.push({
                    product: localItem._id,
                    ...localItem,
                    quantity: localItem.quantity || 1,
                });
            }
        }

        const updatedCart = await Cart.findByIdAndUpdate(
            cart._id,
            { items: mergedItems },
            { new: true }
        );

        // Note: dataService populate is not deeply integrated but query supports it. 
        // Here we might just return the cart, or try to populate if needed. 
        // With dummy data, we can try to populate if structure matches.
        // For now returning updatedCart directly.

        return new Response(JSON.stringify(updatedCart), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
