"use client";

import React from "react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const totalprice = useCartStore((state) => state.totalPrice());

  // ============================================================
  // FRONTEND HANDLERS — Update Zustand first, then update backend
  // ============================================================

  const handleRemove = async (id) => {
    removeFromCart(id); // instant UI update

    try {
      const res = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id }),
      });
      console.log(res);

    } catch (err) {
      console.error("Failed to sync remove:", err);
    }
  };

  const handleIncrease = async (id) => {
    increaseQuantity(id); // UI updates first

    const updatedItem = cart.find((item) => item.id === id);

    try {
      const res = await fetch("/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          quantity: updatedItem.quantity,
        }),
      });
      console.log(res);

    } catch (err) {
      console.error("Failed to sync increase:", err);
    }
  };


  const handleDecrease = async (id) => {
    const currentItem = cart.find((item) => item.id === id);

    // First update UI
    decreaseQuantity(id);

    // If quantity becomes zero in Zustand store, it gets removed
    const updatedItem = useCartStore.getState().cart.find((i) => i.id === id);

    if (!updatedItem) {
      // Item was removed from state → sync DELETE
      try {
        const res = await fetch("/api/cart/remove", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: id }),
        });
        console.log(res);

      } catch (err) {
        console.error("Failed to sync removal:", err);
      }
      return;
    }

    // Otherwise update normal quantity
    try {
      const res = await fetch("/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          quantity: updatedItem.quantity,
        }),
      });
      console.log(res);

    } catch (err) {
      console.error("Failed to sync decrease:", err);
    }
  };


  // ============================================================

  if (cart.length === 0)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-3">Your Cart is Empty</h2>
        <p className="mb-6 text-gray-600">
          Browse products and add items to your cart.
        </p>
        <Link
          href="/products"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Go to Products
        </Link>
      </div>
    );

  // Import framer-motion at the top if not already imported (I will add the import in a separate block if needed, but since I'm replacing the whole file content effectively, I should ensure imports are there. Wait, I'm replacing the component body. I need to make sure imports are present. The previous file content showed imports at the top. I should probably use `replace_file_content` on the whole file or just the return statement. The return statement is large. I'll replace the whole file content to be safe and include imports.)
  // Actually, I can just replace the return statement and add the import at the top using a separate tool call or just replace the whole file. Replacing the whole file is safer to ensure imports are correct.
  // Let's replace the whole file content.

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Your Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="group flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800"
                >
                  <div className="relative w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-xl flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{item.name}</h3>
                    <p className="text-blue-600 font-bold">₦{item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => handleDecrease(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 shadow-sm hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrease(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 shadow-sm hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 text-sm mt-1 hover:text-red-600 hover:underline transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg shadow-blue-500/5 border border-gray-100 dark:border-slate-800 p-8 sticky top-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₦{totalprice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="h-px bg-gray-100 dark:bg-slate-800 my-4"></div>
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-blue-600">₦{totalprice.toLocaleString()}</span>
                </div>
              </div>

              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => alert("Checkout not implemented yet")}
              >
                Proceed to Checkout
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Secure Checkout powered by Paystack
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
