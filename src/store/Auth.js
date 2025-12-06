import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createClient } from "../lib/supabase/supabaseClient";

// Initialize Supabase client
const supabase = createClient();

export const useAuthStore = create(
    immer((set, get) => ({
        user: null,
        status: "loading",
        hydrated: false,

        // Only used for manual updates if needed, mostly listened via subscription
        setUser: (user) => set({ user, status: user ? "authenticated" : "unauthenticated" }),

        initializeAuth: async () => {
            // 1. Get initial session
            const { data: { session } } = await supabase.auth.getSession();
            set({
                user: session?.user ?? null,
                status: session ? "authenticated" : "unauthenticated",
                hydrated: true
            });

            // 2. Listen for auth changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                set({
                    user: session?.user ?? null,
                    status: session ? "authenticated" : "unauthenticated"
                });
            });

            return () => subscription.unsubscribe();
        },

        logout: async () => {
            await supabase.auth.signOut();
            set({ user: null, status: "unauthenticated" });
        },

        setHydrated: () => set({ hydrated: true })
    }))
);