import { connectDB } from "@/lib/config/dbSetup";
import Cart from "@/lib/models/CartModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req) {
  try {
    await connectDB();

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

    const item = cart.items.find(
      (item) => String(item.id) === String(productId)
    );

    if (!item) return new Response(JSON.stringify({ message: "Product not in cart" }), { status: 404 });

    item.quantity = quantity;

    await cart.save();


    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
