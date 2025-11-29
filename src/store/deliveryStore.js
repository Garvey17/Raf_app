import { create } from 'zustand';

export const useDeliveryStore = create((set, get) => ({
    deliveries: [],
    loading: false,
    error: null,
    updating: false,
    successMessage: null,

    fetchDeliveries: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('/api/deliveries');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch deliveries');
            }

            set({ deliveries: data.deliveries || [], loading: false });
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            set({ error: error.message, loading: false, deliveries: [] });
        }
    },

    updateDeliveryStatus: async (deliveryId, status, notes = '') => {
        set({ updating: true, error: null, successMessage: null });
        try {
            const response = await fetch(`/api/deliveries/${deliveryId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deliveryStatus: status,
                    deliveryNotes: notes,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update delivery status');
            }

            // Update the delivery in the local state
            const updatedDeliveries = get().deliveries.map((delivery) =>
                delivery._id === deliveryId ? data.delivery : delivery
            );

            set({
                deliveries: updatedDeliveries,
                updating: false,
                successMessage: data.message || 'Delivery status updated successfully',
            });

            // Clear success message after 3 seconds
            setTimeout(() => {
                set({ successMessage: null });
            }, 3000);

            return data.delivery;
        } catch (error) {
            console.error('Error updating delivery status:', error);
            set({ error: error.message, updating: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
    clearSuccessMessage: () => set({ successMessage: null }),
}));
