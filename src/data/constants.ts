import { getHighestPrice, getLowestPrice } from "@/utils/product-variants";
import { products } from "./data";
import type { ProductCategorySlug } from "./categories";
import type { ProductSize } from "@/types/types";

export const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price_low_high" },
  { label: "Price: High to Low", value: "price_high_low" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

export const CURRENCY = "USD";

export const PRICE_STEP = 500;

export function getPriceBounds({
  category,
  size,
}: {
  category?: ProductCategorySlug;
  size?: ProductSize;
}): { min: number; max: number } {
  const matchingProducts = products.filter((product) => {
    if (category && product.category !== category) return false;
    if (size && !product.variants.some((variant) => variant.size === size)) {
      return false;
    }
    return true;
  });

  const { lowestPrice, highestPrice } = matchingProducts.reduce(
    (bounds, product) => {
      const variants = size
        ? product.variants.filter((variant) => variant.size === size)
        : product.variants;

      return {
        lowestPrice: Math.min(
          bounds.lowestPrice,
          getLowestPrice({ variants }),
        ),
        highestPrice: Math.max(
          bounds.highestPrice,
          getHighestPrice({ variants }),
        ),
      };
    },
    { lowestPrice: Number.POSITIVE_INFINITY, highestPrice: 0 },
  );

  const min = Number.isFinite(lowestPrice)
    ? Math.floor(lowestPrice / PRICE_STEP) * PRICE_STEP
    : 0;

  return {
    min,
    max: Math.max(PRICE_STEP, Math.ceil(highestPrice / PRICE_STEP) * PRICE_STEP),
  };
}

export const PRICE_BOUNDS: { min: number; max: number } = getPriceBounds({});
