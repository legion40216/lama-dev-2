import type { FilterValue, SizeFilter } from "@/schema";
import type { ProductType } from "@/types/types";
import { getLowestPrice } from "@/utils/product-variants";

export function sortProducts(
  products: ProductType[],
  filter: FilterValue,
  sizeParam?: SizeFilter,
): ProductType[] {
  const sorted = [...products];

  const getComparisonPrice = (product: ProductType) => {
    if (sizeParam) {
      return (
        product.variants.find((variant) => variant.size === sizeParam)?.price ??
        Number.POSITIVE_INFINITY
      );
    }

    return getLowestPrice(product);
  };

  switch (filter) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    case "price_low_high":
      return sorted.sort((a, b) => getComparisonPrice(a) - getComparisonPrice(b));

    case "price_high_low":
      return sorted.sort((a, b) => getComparisonPrice(b) - getComparisonPrice(a));

    default:
      return sorted;
  }
}
