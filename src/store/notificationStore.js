import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,

    /* ---------------------------
       FETCH NOTIFICATIONS
    --------------------------- */
    fetchNotifications: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("/api/notifications");

            if (!res.ok) {
                // If unauthorized or error, set empty notifications
                if (res.status === 401) {
                    set({
                        notifications: [],
                        unreadCount: 0,
                        loading: false,
                    });
                    return;
                }
                throw new Error("Failed to fetch notifications");
            }

            const data = await res.json();
            const notifications = data.notifications || [];

            set({
                notifications,
                unreadCount: notifications.filter((n) => !n.read).length,
                loading: false,
            });

        } catch (error) {
            console.error("Error fetching notifications:", error);
            set({
                error: error.message,
                loading: false,
                notifications: [],
                unreadCount: 0,
            });
        }
    },

    /* ---------------------------
       MARK AS READ
    --------------------------- */
    markAsRead: async (id) => {
        try {
            const res = await fetch(`/api/notifications/read`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                throw new Error("Failed to mark notification as read");
            }

            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, read: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            }));
        } catch (error) {
            console.error("Error marking notification as read:", error);
            set({ error: error.message });
        }
    },

    /* ---------------------------
       MARK ALL AS READ
    --------------------------- */
    markAllAsRead: async () => {
        try {
            const res = await fetch("/api/notifications/read-all", {
                method: "PUT",
            });

            if (!res.ok) {
                throw new Error("Failed to mark all notifications as read");
            }

            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, read: true })),
                unreadCount: 0,
            }));
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            set({ error: error.message });
        }
    },

    /* ---------------------------
       ADD NOTIFICATION (for real-time updates)
    --------------------------- */
    addNotification: (notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
        }));
    },

    /* ---------------------------
       CLEAR ERROR
    --------------------------- */
    clearError: () => set({ error: null }),
}));
