import type { CartProduct } from "@/types/cart";
import type { ProductSize, ProductType, ProductVariant } from "@/types/types";

type WithVariants = Pick<ProductType, "variants">;

// The variant used when nothing is picked yet: the first one in stock
export function getDefaultVariant({ variants }: WithVariants): ProductVariant {
  return variants.find((variant) => variant.stock > 0) ?? variants[0];
}

export function getLowestPrice({ variants }: WithVariants): number {
  return Math.min(...variants.map((variant) => variant.price));
}

export function getHighestPrice({ variants }: WithVariants): number {
  return Math.max(...variants.map((variant) => variant.price));
}

export function isProductInStock({ variants }: WithVariants): boolean {
  return variants.some((variant) => variant.stock > 0);
}

// One cart line per product + size, e.g. "noir-01-100ml"
export function getCartLineId(productId: string, size: ProductSize): string {
  return `${productId}-${size}`;
}

export function toCartProduct(
  product: Pick<ProductType, "id" | "slug" | "name" | "brand" | "image">,
  variant: ProductVariant,
): CartProduct {
  return {
    id: getCartLineId(product.id, variant.size),
    productId: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    image: product.image,
    size: variant.size,
    price: variant.price,
    stock: variant.stock,
  };
}
