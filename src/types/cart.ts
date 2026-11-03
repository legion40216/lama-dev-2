import type { ProductSize } from "@/types/types";

// One line in the cart = one product in one size and one colour
export type CartProduct = {
  id: string; // line id: product + size + colour (see getCartLineId)
  productId: string;
  slug: string;
  name: string;
  image: string; // photo of the chosen colour
  size: ProductSize;
  color: string;
  colorCode: string;
  price: number; // final unit price (discount already applied)
  stock: number; // stock of this size + colour
};

export type CartItemType = CartProduct & {
  count: number;
};
