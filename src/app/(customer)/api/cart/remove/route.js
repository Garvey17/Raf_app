import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Cart } from "@/lib/services/dataService";

export async function DELETE(req) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 })
    }

    const userId = session.user.id

    try {
        const { itemId } = await req.json()

        const cart = await Cart.findOne({ user: userId })

        if (!cart) {
            return new Response(JSON.stringify({ error: "Cart not found" }), { status: 404 })
        }

        // Filter items
        const updatedItems = cart.items.filter(item => String(item.id) !== String(itemId))

        // Update cart
        const updatedCart = await Cart.findByIdAndUpdate(
            cart._id,
            { items: updatedItems },
            { new: true }
        )

        return new Response(JSON.stringify(updatedCart), { status: 200 })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
}