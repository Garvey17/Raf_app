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
}));
