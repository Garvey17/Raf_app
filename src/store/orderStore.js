import { create } from "zustand";

export const useOrderStore = create((set) => ({
    formData: {
        product: "",
        quantity: 1,
        name: "",
        phone: "",
        location: "",
        deliveryDate: "",
        instructions: "",
    },
    loading: false,
    error: null,
    success: false,
    orders: [],

    setFormData: (data) =>
        set((state) => ({
            formData: { ...state.formData, ...data },
        })),

    resetForm: () =>
        set({
            formData: {
                product: "",
                quantity: 1,
                name: "",
                phone: "",
                location: "",
                deliveryDate: "",
                instructions: "",
            },
            success: false,
            error: null,
        }),

    fetchOrders: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch orders");
            }

            set({ orders: data.orders, loading: false });
        } catch (error) {
            set({ loading: false, error: error.message });
        }
    },

    products: [],

    fetchProducts: async () => {
        try {
            const { createClient } = await import("@/lib/supabase/supabaseClient");
            const supabase = createClient();
            const { data, error } = await supabase.from("products").select("*").eq("is_active", true);

            if (error) throw error;

            set({ products: data || [] });
        } catch (error) {
            console.error("Failed to fetch products:", error);
            // Fallback or empty
            set({ products: [] });
        }
    },

    submitOrder: async (orderData) => {
        set({ loading: true, error: null, success: false });
        try {
            const res = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit order");
            }

            set((state) => ({
                loading: false,
                success: true,
                orders: [data.order, ...state.orders] // Optimistically update list
            }));
            return data;
        } catch (error) {
            set({ loading: false, error: error.message });
            throw error;
        }
    },

    updateOrderStatus: async (orderId, newStatus) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("/api/orders/update-status", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update order status");
            }

            // Update local state
            set((state) => ({
                orders: state.orders.map(o =>
                    (o._id === orderId || o.id === orderId) ? { ...o, status: newStatus } : o
                ),
                loading: false
            }));

            return data;
        } catch (error) {
            set({ loading: false, error: error.message });
            throw error;
        }
    },
}));
