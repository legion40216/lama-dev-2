// Canonical size list, in display order. Add a size here (e.g. "XXL", "One Size")
// before using it on a product; the type, URL schema and filters all follow.
export const APPAREL_SIZES = ["S", "M", "L", "XL"] as const;
export const SHOE_SIZES = ["40", "41", "42", "43", "44"] as const;

export const SIZES = [...APPAREL_SIZES, ...SHOE_SIZES] as const;

export type ProductSize = (typeof SIZES)[number];
