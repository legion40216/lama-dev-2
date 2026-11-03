import {
  Footprints,
  Layers,
  LayoutGrid,
  type LucideIcon,
  Shirt,
  Tag,
} from "lucide-react";

type Category = { name: string; slug: string; icon: LucideIcon };

// "all" is a UI-only option (no filter). Products can only use the others.
export const categories = [
  { name: "All", slug: "all", icon: LayoutGrid },
  { name: "T-Shirts", slug: "t-shirts", icon: Shirt },
  { name: "Hoodies", slug: "hoodies", icon: Layers },
  { name: "Shirts", slug: "shirts", icon: Tag },
  { name: "Shoes", slug: "shoes", icon: Footprints },
] as const satisfies readonly Category[];

// `as const` keeps each slug a literal type, so a typo in a product's
// `category` (or in a URL param) is a compile error.
export type CategorySlug = (typeof categories)[number]["slug"];
export type ProductCategorySlug = Exclude<CategorySlug, "all">;
