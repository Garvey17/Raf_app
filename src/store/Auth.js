import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export const useAuthStore =  create(
    persist(
        immer((set) => ({
            user :null,
            status: "loading",
            hydrated: false,

            setUser: (user) => set({user, status: user ? "authenticated" : "unauthenticated"}),

            logout: async () => {
                set({user: null, status: "unauthenticated"})
                await fetch('/api/auth/signout', {method: 'POST'})
            },

            setHydrated: () => set({hydrated: true})
        })),
        {
            name: "auth-store",
            partialize: (state) => ({ user: state.user }),
        }
    )
)