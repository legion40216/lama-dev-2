"use client";

import useCart from "@/hooks/useCartStore";
import useHydrated from "@/hooks/useHydrated";
import type { ProductType } from "@/types/types";
import {
  getCartLineId,
  type Selection,
  toCartProduct,
} from "@/utils/product-variants";

type CartProductSource = Pick<
  ProductType,
  "id" | "slug" | "name" | "sizes" | "colors"
>;

// The cart line for one product in one size + colour: is it in the cart, how
// many, and the actions on it. Shared by the product card and product page.
export default function useProductCartLine(
  product: CartProductSource,
  selection: Selection,
) {
  const lineId = getCartLineId(product.id, selection.size, selection.color);

  const line = useCart((state) =>
    state.items.find((item) => item.id === lineId),
  );
  const addItem = useCart((state) => state.addItem);
  const removeItem = useCart((state) => state.removeItem);
  const updateItemCount = useCart((state) => state.updateItemCount);

  // The cart is restored from localStorage, so the server never knows what is
  // in it. Report "empty" until hydrated to avoid a mismatch.
  const hydrated = useHydrated();

  return {
    inCart: hydrated && line !== undefined,
    count: hydrated ? (line?.count ?? 0) : 0,
    add: (quantity = 1) => addItem(toCartProduct(product, selection), quantity),
    remove: () => removeItem(lineId),
    setCount: (count: number) => updateItemCount(lineId, count),
  };
}
