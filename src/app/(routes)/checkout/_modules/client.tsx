"use client";

import useCart from '@/hooks/useCartStore';
import CheckoutReview from './client/checkout-review';

export default function Client() {
    const { items, clearCart } = useCart();

    const totalPrice = items.reduce(
    (total, item) => total + Number(item.price) * item.count,
    0
  );

 const itemsLenghtZero = items.length === 0 ? true : false;
    
  return (
    <CheckoutReview
        items={items}
        totalPrice={totalPrice}
        itemsLenghtZero={itemsLenghtZero}
    />
  )
}
