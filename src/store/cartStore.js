import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    immer((set, get) => ({
      cart: [],

      /* ---------------------------
         FETCH CART FROM BACKEND
      --------------------------- */
      fetchCart: async () => {
        try {
          const res = await fetch("/api/cart/get");
          if (!res.ok) return;

          const data = await res.json();

          if (data?.items) {
            // API returns items directly, no need to access .product
            const cartItems = data.items.map((item) => ({
              ...item,
              id: item.id, // ensure ID is preserved
            }));

            set({ cart: cartItems });
          }
        } catch (err) {
          console.error("Failed to fetch cart:", err);
        }
      },

      /* ---------------------------
         SYNC CART WITH BACKEND
      --------------------------- */
      syncCart: async (localCart) => {
        try {
          const res = await fetch("/api/cart/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ localItems: localCart }),
          });

          if (!res.ok) return;

          const data = await res.json();

          if (data?.items) {
            const cartItems = data.items.map((item) => ({
              ...item,
              id: item.id,
            }));

            set({ cart: cartItems });
          }
        } catch (error) {
          console.error("Failed to sync cart:", error);
        }
      },

      /* ---------------------------
         ADD TO CART (local + backend)
      --------------------------- */
      addToCart: async (product, isLoggedIn = false) => {
        set((state) => {
          const existing = state.cart.find((i) => i.id === product.id);

          if (existing) {
            existing.quantity += product.quantity || 1;
          } else {
            state.cart.push({ ...product, quantity: product.quantity || 1 });
          }
        });

        if (isLoggedIn) {
          try {
            await fetch("/api/cart/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                product,
                quantity: product.quantity || 1,
              }),
            });
          } catch (error) {
            console.error("Failed to sync addToCart:", error);
          }
        }
      },

      /* ---------------------------
         REMOVE FROM CART
      --------------------------- */
      removeFromCart: async (id, isLoggedIn = false) => {
        set((state) => {
          state.cart = state.cart.filter((item) => item.id !== id);
        });

        if (isLoggedIn) {
          try {
            await fetch("/api/cart/remove", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ itemId: id }),
            });
          } catch (error) {
            console.error("Failed to remove from backend cart:", error);
          }
        }
      },

      /* ---------------------------
         INCREASE QUANTITY
      --------------------------- */
      increaseQuantity: async (id, isLoggedIn = false) => {
        set((state) => {
          const target = state.cart.find((item) => item.id === id);
          if (target) target.quantity += 1;
        });

        if (isLoggedIn) {
          const newQty = get().cart.find((item) => item.id === id)?.quantity;

          if (newQty !== undefined) {
            try {
              await fetch("/api/cart/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: id, quantity: newQty }),
              });
            } catch (error) {
              console.error("Failed to update quantity:", error);
            }
          }
        }
      },

      /* ---------------------------
         DECREASE QUANTITY
      --------------------------- */
      decreaseQuantity: async (id, isLoggedIn = false) => {
        let shouldRemove = false;

        set((state) => {
          const target = state.cart.find((item) => item.id === id);

          if (!target) return;

          if (target.quantity > 1) {
            target.quantity -= 1;
          } else {
            state.cart = state.cart.filter((item) => item.id !== id);
            shouldRemove = true;
          }
        });

        if (isLoggedIn) {
          if (shouldRemove) {
            try {
              await fetch("/api/cart/remove", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId: id }),
              });
            } catch (error) {
              console.error("Failed to remove item:", error);
            }
          } else {
            const newQty = get().cart.find((item) => item.id === id)?.quantity;

            if (newQty !== undefined) {
              try {
                await fetch("/api/cart/update", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId: id, quantity: newQty }),
                });
              } catch (error) {
                console.error("Failed to decrease quantity:", error);
              }
            }
          }
        }
      },

      /* ---------------------------
         CLEAR CART
      --------------------------- */
      clearCart: () =>
        set((state) => {
          state.cart = [];
        }),

      /* ---------------------------
         TOTALS
      --------------------------- */
      totalPrice: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),

      totalQuantity: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),
    })),
    {
      name: "cart-store",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
