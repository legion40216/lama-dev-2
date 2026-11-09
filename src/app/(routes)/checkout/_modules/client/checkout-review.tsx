"use client";

import type { CartItemType } from "@/types/cart";

import OrderSummary from "./checkout-review/order-summary";
import CheckoutItem from "./checkout-review/checkout-Item";

type CheckoutReviewProps = {
  items: CartItemType[];
  totalPrice: number;
  itemsLenghtZero: boolean;
};

export default function CheckoutReview({
  items,
  totalPrice,
  itemsLenghtZero,
}: CheckoutReviewProps) {
  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-2 lg:col-span-8">
          {items.length === 0 ? (
            <p className="text-muted-foreground">Your cart is empty</p>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <CheckoutItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-4">
          <OrderSummary
            totalPrice={totalPrice}
            itemsLenghtZero={itemsLenghtZero}
          />
        </div>
      </div>
    </div>
  );
}
