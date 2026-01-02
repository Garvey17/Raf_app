import { NextResponse } from "next/server";
import { Cart } from "@/lib/services/dataService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(customer)/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
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
      cart = await Cart.create({
        user: userId,
        items: [{ ...product, quantity: quantity || 1 }],
      });
      return NextResponse.json(cart, { status: 200 });
    }

    // 4️⃣ Check if product already exists in cart
    // Note: In dataService, cart is a plain object, so we modify a copy and update
    const items = [...cart.items];
    const existingItemIndex = items.findIndex((item) => String(item.id) === String(product.id));

    if (existingItemIndex > -1) {
      items[existingItemIndex].quantity += quantity || 1;
    } else {
      items.push({ ...product, quantity: quantity || 1 });
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      { items },
      { new: true }
    );

    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error) {
    console.error("Cart add error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
