import { connectDB } from "@/lib/config/dbSetup";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Cart from "@/lib/models/CartModel";

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
        await connectDB();

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Merge logic
        for (const localItem of localItems) {
            const existingItem = cart.items.find(
                (item) => item.product.toString() === localItem._id
            );

            if (existingItem) {
                // Option: Keep DB quantity, or add local? Let's add local to DB
                existingItem.quantity += localItem.quantity || 1;
            } else {
                cart.items.push({
                    product: localItem._id,
                    quantity: localItem.quantity || 1,
                });
            }
        }

        await cart.save();
        const populatedCart = await cart.populate("items.product");

        return new Response(JSON.stringify(populatedCart), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
