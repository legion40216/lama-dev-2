"use client";

import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getProductPath } from "@/utils/product-url";
import useCart from "@/hooks/useCartStore";
import type { CartItemType } from "@/types/cart";
import { formatter } from "@/utils/formatters";

interface CartItemProps {
  item: CartItemType;
  onNavigate: () => void;
}

export default function CartItem({ item, onNavigate }: CartItemProps) {
  const { removeItem, updateItemCount } = useCart();

  return (
    <div className="grid grid-cols-[72px_1fr] gap-3 border-b py-4">
      <div className="relative aspect-square overflow-hidden rounded-md bg-neutral-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="72px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={getProductPath(item.slug, item.size)}
              onClick={onNavigate}
              className="block truncate font-medium hover:underline"
            >
              {item.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {item.brand} · {item.size}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${item.name}`}
            onClick={() => removeItem(item.id)}
          >
            <X className="size-3.5" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Decrease quantity"
              disabled={item.count <= 1}
              onClick={() => updateItemCount(item.id, item.count - 1)}
            >
              <Minus className="size-3.5" />
            </Button>

            <span className="w-8 text-center text-sm">{item.count}</span>

            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Increase quantity"
              disabled={item.count >= item.stock}
              onClick={() => updateItemCount(item.id, item.count + 1)}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          <span className="font-semibold">
            {formatter.format(item.price * item.count)}
          </span>
        </div>
      </div>
    </div>
  );
}
