import type { ProductSize } from "@/types/types";

// One line in the cart = one product in one size
export type CartProduct = {
  id: string; // line id: product id + size (see getCartLineId)
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  size: ProductSize;
  price: number; // price of this size
  stock: number; // stock of this size
};

export type CartItemType = CartProduct & {
  count: number;
};
