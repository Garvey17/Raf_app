"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

export default function CartBadge() {
  const total = useCartStore((state) => state.totalQuantity(state));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <span>{total}</span>;
}
