"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "Dangote 3x",
      price: 5800,
      image: "/cement1.png",
    },
    {
      id: 2,
      name: "BUA Cement ",
      price: 5700,
      image: "/cement2.png",
    },
    {
      id: 3,
      name: "Diesel (AGO)",
      price: 950,
      image: "/diesel.png",
    },
    {
      id: 4,
      name: "Blockmaster",
      price: 630,
      image: "/petrol.png",
    },
  ];

  const [quantities, setQuantities] = useState({});

  const updateQuantity = (id, qty) => {
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  const addToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    console.log("Added to cart:", product.name, "Qty:", quantity);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="rounded-2xl shadow-md hover:shadow-lg transition p-4"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {product.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Product Image */}
              <div className="w-full h-32 relative rounded-lg bg-gray-100 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Price */}
              <p className="text-xl font-bold">₦{product.price.toLocaleString()}</p>

              {/* Quantity Slider */}
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  defaultValue="10"
                  onChange={(e) =>
                    updateQuantity(product.id, Number(e.target.value))
                  }
                  className="w-full mt-1"
                />
                <p className="text-sm">
                  {quantities[product.id] || 1} unit(s)
                </p>
              </div>

              {/* Add to Cart */}
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
