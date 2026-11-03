import type { FilterValue, SizeFilter } from "@/schema";
import type { ProductType } from "@/types/types";
import { getLowestPrice } from "@/utils/product-variants";

export function sortProducts(
  products: ProductType[],
  filter: FilterValue,
  sizeParam?: SizeFilter,
): ProductType[] {
  const sorted = [...products];
  const time = (product: ProductType) => new Date(product.createdAt).getTime();
  const price = (product: ProductType) => getLowestPrice(product, sizeParam);

  switch (filter) {
    case "newest":
      return sorted.sort((a, b) => time(b) - time(a));
    case "oldest":
      return sorted.sort((a, b) => time(a) - time(b));
    case "price_low_high":
      return sorted.sort((a, b) => price(a) - price(b));
    case "price_high_low":
      return sorted.sort((a, b) => price(b) - price(a));
    default:
      return sorted;
  }
}
