import { z } from "zod";
import {
  type CategorySlug as CategorySlugValue,
  categories,
} from "@/data/categories";
import { PRICE_BOUNDS, type SortValue, sortOptions } from "@/data/constants";
import { type ProductSize, SIZES } from "@/data/sizes";

const categorySlugs = categories.map((category) => category.slug) as [
  CategorySlugValue,
  ...CategorySlugValue[],
];

const sortValues = sortOptions.map((option) => option.value) as [
  SortValue,
  ...SortValue[],
];

// Every param falls back to a safe default instead of throwing, so a hand-edited
// URL never breaks the page.
const baseSearchParamsSchema = z.object({
  q: z.string().trim().max(80).catch(""),

  // "all" means no category filter
  category: z.enum(categorySlugs).catch("all"),

  filter: z.enum(sortValues).catch("newest"),

  size: z.enum(SIZES).optional().catch(undefined) as z.ZodType<
    ProductSize | undefined
  >,

  minPrice: z.coerce
    .number()
    .min(PRICE_BOUNDS.min)
    .max(PRICE_BOUNDS.max)
    .catch(PRICE_BOUNDS.min),

  maxPrice: z.coerce
    .number()
    .min(PRICE_BOUNDS.min)
    .max(PRICE_BOUNDS.max)
    .catch(PRICE_BOUNDS.max),

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

// ?minPrice=90&maxPrice=10 would match nothing, so swap an inverted range.
export const searchParamsSchema = baseSearchParamsSchema.transform((params) =>
  params.minPrice > params.maxPrice
    ? { ...params, minPrice: params.maxPrice, maxPrice: params.minPrice }
    : params,
);

export type SearchParamsValues = z.infer<typeof searchParamsSchema>;
export type CategorySlug = SearchParamsValues["category"];
export type FilterValue = SearchParamsValues["filter"];
export type SizeFilter = SearchParamsValues["size"];
