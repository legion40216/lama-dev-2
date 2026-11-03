"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { toast } from "@/components/ui/toast";

const STORAGE_KEY = "wishlist";
const EMPTY = "[]";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

// The raw string is the snapshot: it is stable between reads, which
// useSyncExternalStore requires.
function getSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? EMPTY;
  } catch {
    return EMPTY;
  }
}

function parse(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((id) => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

// Wishlist of product ids, shared by every component and kept in localStorage.
export default function useWishlist() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const ids = useMemo(() => parse(raw), [raw]);

  const toggle = useCallback(
    (productId: string) => {
      const wasWishlisted = ids.includes(productId);
      const next = wasWishlisted
        ? ids.filter((id) => id !== productId)
        : [...ids, productId];

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        for (const listener of listeners) listener();
        toast.add({
          title: wasWishlisted
            ? "Removed from wishlist."
            : "Added to wishlist.",
          type: "success",
        });
      } catch {
        toast.add({
          title: "Couldn\u2019t update your wishlist.",
          type: "error",
        });
      }
    },
    [ids],
  );

  return { ids, has: (productId: string) => ids.includes(productId), toggle };
}
