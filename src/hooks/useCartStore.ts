import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { toast } from "@/components/ui/toast";
import type { CartItemType, CartProduct } from "@/types/cart";

interface CartState {
  items: CartItemType[];

  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (id: string) => void;
  removeProduct: (productId: string) => void;
  updateItemCount: (id: string, newCount: number) => void;
  clearCart: () => void;

  isInCart: (id: string) => boolean;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        if (product.stock === 0) {
          toast.add({ title: "This item is out of stock.", type: "error" });
          return;
        }

        if (get().items.some((item) => item.id === product.id)) return;

        // Keep the quantity between 1 and what is in stock
        const count = Math.min(Math.max(quantity, 1), product.stock);

        set({ items: [...get().items, { ...product, count }] });
        toast.add({ title: "Added to cart.", type: "success" });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast.add({ title: "Removed from cart.", type: "success" });
      },

      removeProduct: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
        toast.add({ title: "Removed from cart.", type: "success" });
      },

      updateItemCount: (id, newCount) => {
        const item = get().items.find((currentItem) => currentItem.id === id);
        if (!item) return;

        if (newCount < 1) return;

        if (newCount > item.stock) {
          toast.add({
            title: `Only ${item.stock} in stock.`,
            type: "error",
          });
          return;
        }

        set({
          items: get().items.map((currentItem) =>
            currentItem.id === id
              ? { ...currentItem, count: newCount }
              : currentItem,
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
        toast.add({ title: "Cart cleared.", type: "success" });
      },

      isInCart: (id) => get().items.some((item) => item.id === id),

      getTotalCount: () =>
        get().items.reduce((total, item) => total + item.count, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.count, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      // Carts saved before sizes existed use the old shape, so start fresh
      version: 2,
      migrate: () => ({ items: [] }),
    },
  ),
);

export default useCart;
