"use client";

import { ShoppingBasket, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useCart from "@/hooks/useCartStore";
import useHydrated from "@/hooks/useHydrated";
import { formatter } from "@/utils/formatters";
import { getProductPath } from "@/utils/product-url";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBumping, setIsBumping] = useState(false);
  const previousCount = useRef<number | null>(null);

  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);
  const hydrated = useHydrated();

  const visibleItems = hydrated ? items : [];
  const totalCount = visibleItems.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = visibleItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );

  useEffect(() => {
    const previous = previousCount.current;
    previousCount.current = totalCount;

    if (previous !== null && previous !== totalCount) {
      setIsBumping(true);
      const timeout = window.setTimeout(() => setIsBumping(false), 450);

      return () => window.clearTimeout(timeout);
    }
  }, [totalCount]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Open cart, ${totalCount} items`}
          />
        }
      >
        <ShoppingBasket
          className={`size-5 ${isBumping ? "animate-bounce" : ""}`}
        />

        {totalCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {totalCount > 9 ? "9+" : totalCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-sm"
        showCloseButton={false}
      >
        <SheetHeader className="flex-row items-center justify-between">
          <SheetTitle className="uppercase">Cart</SheetTitle>

          {visibleItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="uppercase text-muted-foreground"
              onClick={clearCart}
            >
              <Trash2 />
              Clear cart
            </Button>
          )}

          <SheetDescription className="sr-only">
            Items in your shopping cart
          </SheetDescription>
        </SheetHeader>

        {visibleItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
            <ShoppingBasket className="size-8" />
            <p className="uppercase">Your cart is empty</p>

            <SheetClose
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 sm:hidden"
                />
              }
            >
              <X />
              Close
            </SheetClose>
          </div>
        ) : (
          // Read-only summary; quantity and removal live on /checkout.
          <ul className="flex-1 divide-y overflow-y-auto px-4">
            {visibleItems.map((item) => (
              <li key={item.id} className="flex gap-3 py-3">
                <Link
                  href={getProductPath(item.slug, {
                    size: item.size,
                    color: item.color,
                  })}
                  onClick={() => setIsOpen(false)}
                  className="relative block aspect-[4/5] w-16 shrink-0 overflow-hidden bg-muted"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </Link>

                <div className="min-w-0 flex-1 space-y-0.5 text-sm">
                  <p className="truncate font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.size} · {item.color}
                  </p>
                  <p className="text-xs tabular-nums text-muted-foreground">
                    {item.count} × {formatter.format(item.price)}
                  </p>
                </div>

                <span className="text-sm tabular-nums">
                  {formatter.format(item.price * item.count)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-4 border-t p-4">
          <div className="flex justify-between text-lg font-semibold">
            <span className="uppercase">Total</span>
            <span>{formatter.format(totalPrice)}</span>
          </div>

          <Button
            className="w-full"
            disabled={visibleItems.length === 0}
            nativeButton={false}
            render={<Link href="/checkout" onClick={() => setIsOpen(false)} />}
          >
            <ShoppingBasket />
            <span className="uppercase">Checkout</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
