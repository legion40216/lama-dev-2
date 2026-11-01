// schema/index.ts
import { z } from "zod";
import { categories, brands } from "@/data/data";
import type { ProductCategorySlug } from "@/data/categories";
import { sortOptions, PRICE_BOUNDS, type SortValue } from "@/data/constants";

const validCategorySlugs = categories.map((category) => category.slug) as [
  ProductCategorySlug,
  ...ProductCategorySlug[],
];

const validFilterValues = sortOptions.map((option) => option.value) as [
  SortValue,
  ...SortValue[],
];

const baseSearchParamsSchema = z.object({
  q: z.string().trim().max(80).optional().catch(""),
  category: z.enum(validCategorySlugs).optional().catch(undefined),

  filter: z
    .enum(validFilterValues)
    .optional()
    .catch("newest")
    .default("newest"),

  size: z.enum(["50ml", "100ml"]).optional().catch(undefined),

  minPrice: z.coerce
    .number()
    .min(PRICE_BOUNDS.min)
    .max(PRICE_BOUNDS.max)
    .optional()
    .catch(PRICE_BOUNDS.min)
    .default(PRICE_BOUNDS.min),

  maxPrice: z.coerce
    .number()
    .min(PRICE_BOUNDS.min)
    .max(PRICE_BOUNDS.max)
    .optional()
    .catch(PRICE_BOUNDS.max)
    .default(PRICE_BOUNDS.max),

  // Comma-separated list of brand names -> string[], unknown brands dropped
  brand: z
    .string()
    .optional()
    .catch(undefined)
    .transform((value) =>
      value ? value.split(",").filter((b) => brands.includes(b)) : []
    ),

  inStock: z
    .enum(["true"])
    .optional()
    .catch(undefined)
    .transform((value) => value === "true"),

  featured: z
    .enum(["true"])
    .optional()
    .catch(undefined)
    .transform((value) => value === "true"),
});

// ?minPrice=9000&maxPrice=1000 would match nothing, so swap an inverted range.
export const searchParamsSchema = baseSearchParamsSchema.transform((params) =>
  params.minPrice > params.maxPrice
    ? { ...params, minPrice: params.maxPrice, maxPrice: params.minPrice }
    : params
);

export type SearchParamsValues = z.infer<typeof searchParamsSchema>;
export type CategorySlug = SearchParamsValues["category"];
export type FilterValue = SearchParamsValues["filter"];
export type SizeFilter = SearchParamsValues["size"];
