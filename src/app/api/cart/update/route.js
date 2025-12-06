import { Cart } from "@/lib/services/dataService";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }
    const userId = session?.user?.id;

    const { productId, quantity } = await req.json();

    if (quantity < 1) {
      return new Response(JSON.stringify({ message: "Quantity must be at least 1" }), { status: 400 });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return new Response(JSON.stringify({ message: "Cart not found" }), { status: 404 });

    const items = [...cart.items];
    const itemIndex = items.findIndex(
      (item) => String(item.id) === String(productId)
    );

    if (itemIndex === -1) return new Response(JSON.stringify({ message: "Product not in cart" }), { status: 404 });

    items[itemIndex].quantity = quantity;

    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      { items },
      { new: true }
    );

    return new Response(JSON.stringify(updatedCart), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
