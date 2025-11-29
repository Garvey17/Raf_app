import { NextResponse } from "next/server";
import Cart from "@/lib/models/CartModel";
import { connectDB } from "@/lib/config/dbSetup";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    await connectDB();

    // 1️⃣ Get session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // 2️⃣ Parse body
    const body = await req.json();
    const { product, quantity } = body;

    if (!product || !product.id) {
      return NextResponse.json(
        { error: "Product data missing or invalid" },
        { status: 400 }
      );
    }

    // 3️⃣ Find or create cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ ...product, quantity: quantity || 1 }],
      });
      await cart.save();
      return NextResponse.json(cart, { status: 200 });
    }

    // 4️⃣ Check if product already exists in cart
    const existingItem = cart.items.find((item) => String(item.id) === String(product.id));

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ ...product, quantity: quantity || 1 });
    }

    await cart.save();

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("Cart add error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
