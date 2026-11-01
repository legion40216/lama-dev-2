import type { CategorySlug, SizeFilter } from "@/schema";
import type { ProductType } from "@/types/types";
import { getLowestPrice } from "@/utils/product-variants";

export interface ProductFilters {
  categoryParam: CategorySlug;
  sizeParam: SizeFilter;
  minPrice: number;
  maxPrice: number;
  brandParam: string[];
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
    brandParam,
    featuredParam,
    inStockParam,
    queryParam = "",
  }: ProductFilters,
): ProductType[] {
  return products.filter((product) => {
    if (categoryParam && product.category !== categoryParam) return false;

    const query = queryParam.toLowerCase().trim();
    if (
      query &&
      ![product.name, product.brand, product.description].some((value) =>
        value.toLowerCase().includes(query),
      )
    ) {
      return false;
    }

    const variants = sizeParam
      ? product.variants.filter((variant) => variant.size === sizeParam)
      : product.variants;

    if (variants.length === 0) return false;

    const priceToFilter = sizeParam
      ? variants[0].price
      : getLowestPrice({ variants });

    if (priceToFilter < minPrice || priceToFilter > maxPrice) return false;

    if (brandParam.length > 0 && !brandParam.includes(product.brand)) {
      return false;
    }

    if (
      featuredParam &&
      !product.isFeatured &&
      !product.isBestSeller
    ) {
      return false;
    }

    if (inStockParam && !variants.some((variant) => variant.stock > 0)) {
      return false;
    }

    return true;
  });
}
