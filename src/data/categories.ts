// `as const` keeps each slug as a literal type, so a typo in a product's
// `category` (or in a URL-param schema) is caught at compile time.

export const categories: CategoriesType = [
  {
    name: "All",
    icon: Sun,
    slug: "all",
  },
  {
    name: "T-Shirts",
    icon: Shirt,
    slug: "t-shirts",
  },
  {
    name: "Accessories",
    icon: Coffee,
    slug: "accessories",
  },
]; as const;

export type ProductCategorySlug = (typeof categories)[number]["slug"];
