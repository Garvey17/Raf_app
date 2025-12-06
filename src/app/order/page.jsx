"use client";

import { useOrderStore } from "@/store/orderStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function OrderPage() {
  const { formData, setFormData, submitOrder, loading, error, success, resetForm, products, fetchProducts } = useOrderStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const productParam = searchParams.get('product');
    if (productParam) {
      setFormData({ product: productParam });
    }
  }, [searchParams, setFormData]);

  const handleChange = (e) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  const selectedProduct = useMemo(() => {
    return products.find(p => p.title === formData.product);
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
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to submit order: " + err.message);
    }
  };

  return (

    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Place Your Order
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Fill in the details below to request your delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-6">

              {/* Product Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Select Product</label>
                <div className="relative">
                  <select
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all"
                  >
                    <option value="">Select a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.title}>
                        {p.title} - ₦{p.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Quantity (bags)</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="+234..."
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Delivery Drop Location</label>
                <textarea
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Enter detailed delivery address..."
                  rows={3}
                ></textarea>
              </div>

              {/* Delivery date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Preferred Delivery Date</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  required
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Extra instructions */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Additional Instructions (optional)</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="E.g. 'Call on arrival', 'Deliver to site supervisor', etc."
                  rows={3}
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : "Submit Order Request"}
              </button>
            </form>
          </div>

          {/* Summary Preview */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg shadow-blue-500/5 border border-gray-100 dark:border-slate-800 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Order Preview</h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="pb-4 border-b border-gray-100 dark:border-slate-800">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Product</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.product || "Not selected"}</p>
                </div>

                <div className="pb-4 border-b border-gray-100 dark:border-slate-800">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Quantity</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.quantity} bags</p>
                </div>

                <div className="pb-4 border-b border-gray-100 dark:border-slate-800">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Total Price</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ₦{totalPrice.toLocaleString()}
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-100 dark:border-slate-800">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Contact</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.name || "—"}</p>
                  <p className="text-gray-500">{formData.phone}</p>
                </div>

                <div className="pb-4 border-b border-gray-100 dark:border-slate-800">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Delivery To</p>
                  <p className="font-semibold text-gray-900 dark:text-white break-words">{formData.location || "—"}</p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.deliveryDate || "—"}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
                  This is a preliminary request. Our team will contact you to confirm details and payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
