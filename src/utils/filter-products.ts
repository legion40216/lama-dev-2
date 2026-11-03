import type { CategorySlug, SizeFilter } from "@/schema";
import type { ProductType } from "@/types/types";
import {
  getFinalPrice,
  getLowestPrice,
  isProductInStock,
  isSizeInStock,
} from "@/utils/product-variants";

export interface ProductFilters {
  categoryParam: CategorySlug;
  sizeParam: SizeFilter;
  minPrice: number;
  maxPrice: number;
  featuredParam: boolean;
  inStockParam: boolean;
  queryParam?: string;
}

export function filterProducts(
  products: ProductType[],
  {
    categoryParam,
    sizeParam,
    minPrice,
    maxPrice,
    featuredParam,
    inStockParam,
    queryParam = "",
  }: ProductFilters,
): ProductType[] {
  const query = queryParam.toLowerCase().trim();

  return products.filter((product) => {
    if (categoryParam !== "all" && product.category !== categoryParam) {
      return false;
    }

    if (
      query &&
      ![product.name, product.description, product.category].some((value) =>
        value.toLowerCase().includes(query),
      )
    ) {
      return false;
    }

    if (featuredParam && !product.isFeatured) return false;

    // With a size filter, price and stock are judged for that size only.
    if (sizeParam) {
      const option = product.sizes.find((o) => o.size === sizeParam);
      if (!option) return false;

      const price = getFinalPrice(option);
      if (price < minPrice || price > maxPrice) return false;

      return !inStockParam || isSizeInStock(option);
    }

    const price = getLowestPrice(product);
    if (price < minPrice || price > maxPrice) return false;

    return !inStockParam || isProductInStock(product);
  });
}
