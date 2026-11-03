import type { CartProduct } from "@/types/cart";
import type {
  ProductColor,
  ProductSize,
  ProductSizeOption,
  ProductType,
} from "@/types/types";

type WithSizes = Pick<ProductType, "sizes">;

export type Selection = { size: ProductSize; color: string };

// Price after discount
export function getFinalPrice(option: ProductSizeOption): number {
  return Math.max(0, option.price - (option.discount ?? 0));
}

export function hasDiscount(option: ProductSizeOption): boolean {
  return (option.discount ?? 0) > 0;
}

export function getSizeOption(
  { sizes }: WithSizes,
  size: ProductSize | undefined,
): ProductSizeOption | undefined {
  return size ? sizes.find((option) => option.size === size) : undefined;
}

export function getColor(
  { colors }: Pick<ProductType, "colors">,
  name: string | undefined,
): ProductColor | undefined {
  return colors.find((color) => color.name === name);
}

// Units of one colour in one size. Missing colour = not made in that size.
export function getStock(option: ProductSizeOption, color: string): number {
  return option.stock[color] ?? 0;
}

export function isColorOffered(option: ProductSizeOption, color: string) {
  return color in option.stock;
}

export function isSizeInStock(option: ProductSizeOption): boolean {
  return Object.values(option.stock).some((units) => units > 0);
}

export function isProductInStock({ sizes }: WithSizes): boolean {
  return sizes.some(isSizeInStock);
}

// Price range across all sizes, or just one size when `size` is given.
function priceList({ sizes }: WithSizes, size?: ProductSize): number[] {
  const options = size ? sizes.filter((o) => o.size === size) : sizes;
  return options.map(getFinalPrice);
}

export function getLowestPrice(product: WithSizes, size?: ProductSize): number {
  return Math.min(...priceList(product, size));
}

export function getHighestPrice(
  product: WithSizes,
  size?: ProductSize,
): number {
  return Math.max(...priceList(product, size));
}

// First colour that is in stock for a size, else the first colour offered.
function pickColor(
  product: Pick<ProductType, "colors">,
  option: ProductSizeOption,
  preferred?: string,
): string {
  if (preferred && isColorOffered(option, preferred)) return preferred;

  const inStock = product.colors.find((c) => getStock(option, c.name) > 0);
  const offered = product.colors.find((c) => isColorOffered(option, c.name));

  return (inStock ?? offered ?? product.colors[0]).name;
}

// What is selected when nothing is picked yet. A requested size (e.g. from
// ?size=M) is kept even when sold out; unknown sizes fall back to the first
// size that has stock.
export function getDefaultSelection(
  product: Pick<ProductType, "sizes" | "colors">,
  requested?: { size?: string; color?: string },
): Selection {
  const option =
    product.sizes.find((o) => o.size === requested?.size) ??
    product.sizes.find(isSizeInStock) ??
    product.sizes[0];

  return {
    size: option.size,
    color: pickColor(product, option, requested?.color),
  };
}

// Switching size keeps the colour when that colour exists in the new size.
export function changeSize(
  product: Pick<ProductType, "sizes" | "colors">,
  current: Selection,
  size: ProductSize,
): Selection {
  const option = getSizeOption(product, size) ?? product.sizes[0];
  return {
    size: option.size,
    color: pickColor(product, option, current.color),
  };
}

// One cart line per product + size + colour, e.g. "5-M-orange"
export function getCartLineId(
  productId: string,
  size: ProductSize,
  color: string,
): string {
  return `${productId}-${size}-${color.toLowerCase().replace(/\s+/g, "-")}`;
}

export function toCartProduct(
  product: Pick<ProductType, "id" | "slug" | "name" | "sizes" | "colors">,
  { size, color }: Selection,
): CartProduct {
  const option = getSizeOption(product, size) ?? product.sizes[0];
  const colorInfo = getColor(product, color) ?? product.colors[0];

  return {
    id: getCartLineId(product.id, option.size, colorInfo.name),
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: colorInfo.image,
    size: option.size,
    color: colorInfo.name,
    colorCode: colorInfo.code,
    price: getFinalPrice(option),
    stock: getStock(option, colorInfo.name),
  };
}
