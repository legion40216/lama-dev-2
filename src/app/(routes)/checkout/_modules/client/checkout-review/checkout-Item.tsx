"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import useCart from "@/hooks/useCartStore";
import type { CartItemType } from "@/types/cart";
import { formatter } from "@/utils/formatters";

type CheckoutItemProps = {
  item: CartItemType;
};

export default function CheckoutItem({ item }: CheckoutItemProps) {
  const { removeItem, updateItemCount } = useCart();
  const [cartQuantity, setCartQuantity] = useState(item.count);

  const handleRemove = () => {
    removeItem(item.id);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      toast.add({ title: "Quantity cannot be less than 1.", type: "error" });
      return;
    }

    if (newQuantity > item.stock) {
      toast.add({ title: `Only ${item.stock} in stock.`, type: "error" });
      return;
    }

    setCartQuantity(newQuantity);
    updateItemCount(item.id, newQuantity);
  };

  return (
    <li className="group flex gap-2">
      <Link
        href={`/product/${item.slug}`}
        className="relative block aspect-square w-[28%] overflow-hidden rounded-md border border-gray-200"
      >
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </Link>

      <div className="flex w-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <Link
            href={`/product/${item.slug}`}
            className="block underline group-hover:text-pizza-store-primary"
          >
            <h3 className="font-bold">{item.name}</h3>
          </Link>

          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {formatter.format(item.price)}
              <X className="h-2 w-2" />
              <span>{cartQuantity}</span>
            </div>
            <Badge className="font-semibold" variant="secondary">
              {formatter.format(item.price * cartQuantity)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Size: {item.size}</span>
              <span>•</span>
              <span className="flex items-center gap-2">
                Color: {item.color}
                <span
                  className="size-3 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: item.colorCode }}
                />
              </span>
            </div>

            <div className="flex w-max items-center rounded-md border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(cartQuantity - 1)}
                disabled={cartQuantity <= 1}
              >
                <Minus className="size-4" />
              </Button>
              <span className="px-3">{cartQuantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(cartQuantity + 1)}
                disabled={cartQuantity >= item.stock}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <Button
            className="text-red-600 hover:text-red-600"
            variant="ghost"
            onClick={handleRemove}
          >
            <Trash2 className="mr-2 size-4" />
            Remove
          </Button>
        </div>
      </div>
    </li>
  );
}
