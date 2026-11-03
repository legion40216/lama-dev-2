import type { ProductSize } from "@/types/types";

// "/products/classic-fleece-hoodie" or "...?size=M&color=Orange"
export function getProductPath(
  slug: string,
  selection?: { size?: ProductSize; color?: string },
): string {
  const params = new URLSearchParams();
  if (selection?.size) params.set("size", selection.size);
  if (selection?.color) params.set("color", selection.color);

  const query = params.toString();
  return query ? `/products/${slug}?${query}` : `/products/${slug}`;
}

export function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
