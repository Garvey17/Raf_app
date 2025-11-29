import { connectDB } from "@/lib/config/dbSetup";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Cart from "@/lib/models/CartModel";

export async function DELETE(req) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 })
    }

    const userId = session.user.id

    try {
        await connectDB()
        const { itemId } = await req.json()

        const cart = await Cart.findOne({ user: userId })

        if (!cart) {
            return new Response(JSON.stringify({ error: "Cart not found" }), { status: 404 })
        }

        // IMPORTANT FIX — remove await + make sure mongoose detects changes
        // Also using String() for robust ID comparison
        cart.items = cart.items.filter(item => String(item.id) !== String(itemId))

        await cart.save()

        return new Response(JSON.stringify(cart), { status: 200 })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
}