import { create } from 'zustand';

export const usePaymentStore = create((set, get) => ({
    payments: [],
    loading: false,
    error: null,
    updating: false,
    successMessage: null,

    fetchPayments: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('/api/payments');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch payments');
            }

            set({ payments: data.payments || [], loading: false });
        } catch (error) {
            console.error('Error fetching payments:', error);
            set({ error: error.message, loading: false, payments: [] });
        }
    },

    verifyPayment: async (paymentId, verificationStatus, staffNumber) => {
        set({ updating: true, error: null, successMessage: null });
        try {
            const response = await fetch(`/api/payments/${paymentId}/verify`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    verificationStatus,
                    staffNumber,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to verify payment');
            }

            // Update the payment in the local state
            const updatedPayments = get().payments.map((payment) =>
                payment._id === paymentId ? data.payment : payment
            );

            set({
                payments: updatedPayments,
                updating: false,
                successMessage: data.message || 'Payment verified successfully',
            });

            // Clear success message after 3 seconds
            setTimeout(() => {
                set({ successMessage: null });
            }, 3000);

            return data.payment;
        } catch (error) {
            console.error('Error verifying payment:', error);
            set({ error: error.message, updating: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
    clearSuccessMessage: () => set({ successMessage: null }),
}));
