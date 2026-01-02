"use client";

import { useOrderStore } from "@/store/orderStore";
import { useRouter} from "next/navigation";
import { useEffect, useMemo } from "react";

export default function OrderClient() {
  const { formData, setFormData, submitOrder, loading, error, success, resetForm, products, fetchProducts } = useOrderStore();
  const router = useRouter();
  // const searchParams = useSearchParams();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // useEffect(() => {
  //   const productParam = searchParams.get("product");
  //   if (productParam) {
  //     setFormData({ product: productParam });
  //   }
  // }, [searchParams, setFormData]);

  const handleChange = (e) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.title === formData.product);
  }, [products, formData.product]);

  const totalPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    return selectedProduct.price * formData.quantity;
  }, [selectedProduct, formData.quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitOrder(formData);
      alert("Order submitted successfully!");
      resetForm();
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Failed to submit order: " + err.message);
    }
  };

  return (
    // 🔥 all your JSX exactly as before
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 p-6 md:p-12">
      {/* your full form code here */}
    </div>
  );
}
