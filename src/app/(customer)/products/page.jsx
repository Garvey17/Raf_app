"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { Bmaster } from "@/Assets/assets";
import { dangote3x } from "@/Assets/assets";
import { bua } from "@/Assets/assets";
import { mangal } from "@/Assets/assets";

import { useSession } from "next-auth/react";

export default function ProductsPage() {
  const { status } = useSession();
  const addToCart = useCartStore((state) => state.addToCart)
  const products = [
    {
      id: 1,
      name: "Dangote 3x",
      price: 5800,
      image: dangote3x,
    },
    {
      id: 2,
      name: "BUA Cement ",
      price: 5700,
      image: bua,
    },
    {
      id: 3,
      name: "Mangal",
      price: 950,
      image: mangal,
    },
    {
      id: 4,
      name: "Blockmaster",
      price: 630,
      image: Bmaster,
    },
  ];

  const [quantities, setQuantities] = useState({});

  const updateQuantity = (id, qty) => {
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  const addToCartOnPage = async (product) => {
    const quantity = quantities[product.id] || 1;

    // 1️⃣ Update local Zustand state immediately
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });

    console.log("Added to cart (local):", product.name, "Qty:", quantity);

    // 2️⃣ If user is logged in, sync with backend
    if (status === "authenticated") {
      try {
        const res = await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              image: "coming",
            },
            quantity,
          }),
        });

        if (!res.ok) {
          console.error("Failed to sync cart with backend:", await res.text());
        } else {
          const data = await res.json();
          console.log("Cart synced with backend:", data);
        }
      } catch (err) {
        console.error("Error syncing cart with backend:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Premium <span className="text-blue-600">Materials</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl">
              High-quality construction materials delivered directly to your site.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live Inventory
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 p-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <div className="relative w-full h-full drop-shadow-xl">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Badge */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  In Stock
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>

                <div className="mt-auto space-y-4">
                  {/* Quantity Control */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500 dark:text-gray-400">Quantity</span>
                      <span className="font-bold text-gray-900 dark:text-white">{quantities[product.id] || 1} bags</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      defaultValue="10"
                      onChange={(e) =>
                        updateQuantity(product.id, Number(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white transition-all duration-300 py-6 rounded-xl text-base font-semibold shadow-lg hover:shadow-blue-500/25 active:scale-95"
                    onClick={() => addToCartOnPage(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
