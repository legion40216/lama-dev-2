"use client";

import { CircleAlert, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import QuickView from "@/components/global-ui/quick-view";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { categories } from "@/data/categories";
import useWishlist from "@/hooks/useWishlist";
import type { ProductSize, ProductType } from "@/types/types";
import { formatter } from "@/utils/formatters";
import { getProductPath } from "@/utils/product-url";
import {
  getHighestPrice,
  getLowestPrice,
  hasDiscount,
  isProductInStock,
  isSizeInStock,
} from "@/utils/product-variants";

const LOW_STOCK_THRESHOLD = 5;

interface ProductCardProps {
  product: ProductType;
  // Set when the list is filtered to one size (?size=M)
  selectedSize?: ProductSize;
  sizes?: string; // next/image `sizes` hint
}

export default function ProductCard({
  product,
  selectedSize,
  sizes = "(min-width: 768px) 25vw, 50vw",
}: ProductCardProps) {
  const { name, slug, colors, isNew } = product;

  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const wishlist = useWishlist();
  const isWishlisted = wishlist.has(product.id);

  const selectedOption = selectedSize
    ? product.sizes.find((option) => option.size === selectedSize)
    : undefined;

  const isOutOfStock = selectedOption
    ? !isSizeInStock(selectedOption)
    : !isProductInStock(product);

  const onSale = selectedOption
    ? hasDiscount(selectedOption)
    : product.sizes.some(hasDiscount);

  // Stock hints for the warning icon (only when not filtered to one size)
  const soldOutSizes = product.sizes
    .filter((option) => !isSizeInStock(option))
    .map((option) => option.size);

  const lowStockSizes = product.sizes
    .map((option) => ({
      size: option.size,
      units: Object.values(option.stock).reduce((sum, n) => sum + n, 0),
    }))
    .filter(({ units }) => units > 0 && units <= LOW_STOCK_THRESHOLD)
    .map(({ size, units }) => `${size}: only ${units} left`);

  const stockTooltip = [
    lowStockSizes.join(" • "),
    soldOutSizes.length > 0 ? `${soldOutSizes.join(", ")} sold out` : "",
  ]
    .filter(Boolean)
    .join(" • ");

  const showStockWarning =
    !selectedSize && !isOutOfStock && stockTooltip.length > 0;

  const lowest = getLowestPrice(product, selectedSize);
  const highest = getHighestPrice(product, selectedSize);
  const priceLabel =
    lowest === highest
      ? formatter.format(lowest)
      : `${formatter.format(lowest)} – ${formatter.format(highest)}`;

  const sizeLabel = selectedSize
    ? selectedSize
    : product.sizes.map((option) => option.size).join(" / ");

  const categoryLabel =
    categories.find((item) => item.slug === product.category)?.name ??
    product.category;

  const href = getProductPath(slug, { size: selectedSize });

  return (
    <article className="group relative min-w-0">
      <div className="relative isolate aspect-[4/5] overflow-hidden bg-muted">
        <Link
          href={href}
          className="absolute inset-0 block"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={colors[0].image}
            alt={name}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {(isNew || onSale) && (
          <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 bg-background px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground sm:left-3 sm:top-3">
            {onSale ? "Sale" : "New"}
          </span>
        )}

        {isOutOfStock && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-background/65">
            <span className="border border-foreground/20 bg-background/90 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em]">
              Out of stock
            </span>
          </div>
        )}

        <div className="absolute right-2 top-2 z-20 flex flex-col items-center gap-1.5 sm:right-3 sm:top-3 sm:gap-2">
          {showStockWarning && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    className="flex size-7 items-center justify-center rounded-full bg-background/95 text-amber-700 shadow-sm transition-colors hover:bg-background"
                    aria-label={stockTooltip}
                  />
                }
              >
                <CircleAlert className="size-3.5" aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent side="left">{stockTooltip}</TooltipContent>
            </Tooltip>
          )}

          <QuickView
            product={product}
            selectedSize={selectedSize}
            open={quickViewOpen}
            onOpenChange={setQuickViewOpen}
          />

          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  className="flex size-7 items-center justify-center rounded-full bg-background/95 shadow-sm transition-colors hover:bg-background"
                  aria-label={
                    isWishlisted
                      ? `Remove ${name} from wishlist`
                      : `Add ${name} to wishlist`
                  }
                  aria-pressed={isWishlisted}
                  onClick={() => wishlist.toggle(product.id)}
                />
              }
            >
              <Heart
                className={
                  isWishlisted
                    ? "size-3.5 fill-rose-600 text-rose-600"
                    : "size-3.5"
                }
                aria-hidden="true"
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Link href={href} className="mt-2.5 block space-y-1.5 sm:mt-3">
        <h3 className="text-xs font-medium leading-snug text-foreground sm:text-[13px]">
          {name}
        </h3>
        <p className="text-[11px] leading-snug text-muted-foreground">
          {categoryLabel}
        </p>

        <ul className="flex gap-1" aria-label="Available colours">
          {colors.map((color) => (
            <li
              key={color.name}
              title={color.name}
              className="size-3 rounded-full border border-foreground/20"
              style={{ backgroundColor: color.code }}
            />
          ))}
        </ul>

        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 pt-0.5">
          <span className="flex items-baseline gap-1.5 text-xs font-normal tabular-nums text-foreground sm:text-[13px]">
            {priceLabel}
            {selectedOption && hasDiscount(selectedOption) && (
              <s className="text-[11px] text-muted-foreground">
                {formatter.format(selectedOption.price)}
              </s>
            )}
          </span>
          <span className="text-[10px] text-muted-foreground sm:text-[11px]">
            {sizeLabel}
          </span>
        </div>
      </Link>
    </article>
  );
}
