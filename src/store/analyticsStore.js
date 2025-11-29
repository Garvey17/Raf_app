import { create } from "zustand";

export const useAnalyticsStore = create((set, get) => ({
    analytics: null,
    loading: false,
    error: null,
    lastFetched: null,

    /* ---------------------------
       FETCH ANALYTICS
    --------------------------- */
    fetchAnalytics: async (force = false) => {
        const { lastFetched, analytics } = get();

        // Cache for 5 minutes
        const CACHE_DURATION = 5 * 60 * 1000;
        const now = Date.now();

        if (!force && lastFetched && analytics && (now - lastFetched < CACHE_DURATION)) {
            console.log("Using cached analytics data");
            return;
        }

        set({ loading: true, error: null });

        try {
            const res = await fetch("/api/analytics/dashboard");

            if (!res.ok) {
                if (res.status === 401) {
                    set({
                        analytics: null,
                        loading: false,
                        error: "Unauthorized"
                    });
                    return;
                }
                throw new Error("Failed to fetch analytics");
            }

            const data = await res.json();

            if (data.success) {
                set({
                    analytics: data.data,
                    loading: false,
                    lastFetched: now
                });
            } else {
                throw new Error(data.error || "Failed to fetch analytics");
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
            set({
                error: error.message,
                loading: false
            });
        }
    },

    /* ---------------------------
       REFRESH ANALYTICS
    --------------------------- */
    refreshAnalytics: async () => {
        await get().fetchAnalytics(true);
    },

    /* ---------------------------
       EXPORT ANALYTICS
    --------------------------- */
    exportAnalytics: async (format = "csv") => {
        try {
            if (format === "pdf") {
                // For PDF, open in new window for printing
                const res = await fetch(`/api/analytics/export?format=pdf`);

                if (!res.ok) {
                    throw new Error("Failed to export analytics");
                }

                const html = await res.text();
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                    printWindow.document.write(html);
                    printWindow.document.close();
                }
            } else {
                // For CSV, download as file
                const res = await fetch(`/api/analytics/export?format=${format}`);

                if (!res.ok) {
                    throw new Error("Failed to export analytics");
                }

                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `analytics-${new Date().toISOString().split('T')[0]}.${format}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error("Error exporting analytics:", error);
            set({ error: error.message });
        }
    },

    /* ---------------------------
       CLEAR ERROR
    --------------------------- */
    clearError: () => set({ error: null }),
}));
