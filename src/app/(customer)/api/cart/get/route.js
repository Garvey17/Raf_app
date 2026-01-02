import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Cart } from "@/lib/services/dataService";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const userid = session.user.id;

    const cart = await Cart.findOne({ user: userid });

    if (!cart) {
      return new Response(JSON.stringify({ message: "Cart not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
