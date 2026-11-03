import { type ProductSize, SIZES } from "@/data/sizes";
import { getHighestPrice, getLowestPrice } from "@/utils/product-variants";
import type { ProductCategorySlug } from "./categories";
import { products } from "./data";

export const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price_low_high" },
  { label: "Price: High to Low", value: "price_high_low" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

export const CURRENCY = "USD";

// Price slider step (whole currency units)
export const PRICE_STEP = 5;

// Lowest / highest price (rounded to PRICE_STEP) for the products that match
// a category and/or size. Used as the price slider's range.
export function getPriceBounds({
  category,
  size,
}: {
  category?: ProductCategorySlug | "all";
  size?: ProductSize;
}): { min: number; max: number } {
  const matching = products.filter((product) => {
    if (category && category !== "all" && product.category !== category) {
      return false;
    }
    if (size && !product.sizes.some((option) => option.size === size)) {
      return false;
    }
    return true;
  });

  if (matching.length === 0) return { min: 0, max: PRICE_STEP };

  const lowest = Math.min(...matching.map((p) => getLowestPrice(p, size)));
  const highest = Math.max(...matching.map((p) => getHighestPrice(p, size)));

  return {
    min: Math.floor(lowest / PRICE_STEP) * PRICE_STEP,
    max: Math.max(PRICE_STEP, Math.ceil(highest / PRICE_STEP) * PRICE_STEP),
  };
}

export const PRICE_BOUNDS = getPriceBounds({});

// Sizes that at least one product comes in, in canonical order.
// Drives the size filter, so unused sizes never show up.
export const availableSizes = SIZES.filter((size) =>
  products.some((product) =>
    product.sizes.some((option) => option.size === size),
  ),
);
