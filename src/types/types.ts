// types/types.ts
import type { ProductCategorySlug } from "@/data/categories";

export type CategoryType = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type CategoriesType = CategoryType[];

export type ProductSize = "50ml" | "100ml";

// Products can have one or more size variants, each with its own price and stock
export type ProductVariant = {
  size: ProductSize;
  price: number;
  stock: number;
};

export type ProductType = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategorySlug;
  description: string;
  variants: ProductVariant[];
  image: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  createdAt: string; // ISO date string, used for "newest" / "oldest" sort
};

export type ProductsType = ProductType[];
