"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type ParamUpdates = Record<string, string | null>;

/**
 * Single place for changing URL search params from client components.
 *
 * - `update` sets a key, or deletes it when the value is `null`.
 * - `clear` removes every param.
 * - Navigation runs in a transition, so the current UI stays interactive and
 *   `isPending` can drive a loading state while the server re-renders.
 * - `scroll: false` keeps the page position when filters change.
 */
export function useUpdateSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = (updates: ParamUpdates) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const query = params.toString();

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  const clear = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  return { update, clear, isPending };
}
