import { products } from "@/data/data";
import type { ProductType } from "@/types/types";

export function getProductBySlug(slug: string): ProductType | undefined {
  return products.find((product) => product.slug === slug);
}
