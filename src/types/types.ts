import type { ProductCategorySlug } from "@/data/categories";
import type { ProductSize } from "@/data/sizes";

export type { ProductSize };

// A colour is defined once per product and carries its own photo.
export type ProductColor = {
  name: string; // also the key used in `ProductSizeOption.stock`
  code: string; // hex, used for the swatch
  image: string;
};

// One row per size. Price is per size; stock is per size + colour.
export type ProductSizeOption = {
  size: ProductSize;
  price: number; // list price in CURRENCY
  discount?: number; // amount off `price` (not a percentage); omit for none
  // colour name -> units in stock.
  //   0           = sold out
  //   key missing = this colour isn't made in this size
  stock: Record<string, number>;
};

export type ProductType = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProductCategorySlug;
  colors: ProductColor[]; // first colour is the default / card image
  sizes: ProductSizeOption[];
  isNew: boolean;
  isFeatured: boolean;
  isArchived: boolean; // archived products are hidden everywhere
  createdAt: string; // ISO date string, used for "newest" / "oldest" sort
};

export type ProductsType = ProductType[];
