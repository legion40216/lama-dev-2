"use client";

import { CircleAlert, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddToCartButton from "@/components/global-ui/add-to-cart-button";
import QuickView from "@/components/global-ui/quick-view";
import { categories } from "@/data/categories";
import { toast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useCart from "@/hooks/useCartStore";
import type { ProductSize, ProductType } from "@/types/types";
import { formatter } from "@/utils/formatters";
import { getProductPath } from "@/utils/product-url";
import {
  getDefaultVariant,
  getHighestPrice,
  getLowestPrice,
  isProductInStock,
  toCartProduct,
} from "@/utils/product-variants";

const WISHLIST_STORAGE_KEY = "fragrance-wishlist";
type WishlistProduct = Pick<
  ProductType,
  | "id"
  | "slug"
  | "name"
  | "brand"
  | "image"
  | "description"
  | "category"
  | "variants"
>;

function readWishlist(): WishlistProduct[] {
  try {
    const storedWishlist = JSON.parse(
      window.localStorage.getItem(WISHLIST_STORAGE_KEY) ?? "[]",
    );

    return Array.isArray(storedWishlist) ? storedWishlist : [];
  } catch {
    return [];
  }
}

interface ProductCardProps
  extends Pick<
    ProductType,
    | "id"
    | "slug"
    | "name"
    | "brand"
    | "variants"
    | "image"
    | "isNew"
    | "isBestSeller"
    | "description"
    | "category"
  > {
  selectedSize?: ProductSize;
  sizes?: string;
}

export default function ProductCard({
  id,
  slug,
  name,
  brand,
  variants,
  image,
  isNew,
  isBestSeller,
  description,
  category,
  selectedSize,
  sizes = "(min-width: 768px) 25vw, 50vw",
}: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [stockTooltipOpen, setStockTooltipOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const cartHasProduct = useCart((state) =>
    state.items.some((item) => item.productId === id),
  );
  const removeProduct = useCart((state) => state.removeProduct);

  useEffect(() => {
    setIsWishlisted(readWishlist().some((item) => item.id === id));
  }, [id]);

  const toggleWishlist = () => {
    const wishlist = readWishlist();
    const alreadyWishlisted = wishlist.some((item) => item.id === id);
    const product: WishlistProduct = {
      id,
      slug,
      name,
      brand,
      image,
      description,
      category,
      variants,
    };
    const updatedWishlist = alreadyWishlisted
      ? wishlist.filter((item) => item.id !== id)
      : [...wishlist, product];

    try {
      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(updatedWishlist),
      );
      setIsWishlisted(!alreadyWishlisted);
    } catch {
      // Leave the current state unchanged if browser storage is unavailable.
    }
  };

  const defaultVariant = getDefaultVariant({ variants });
  const selectedVariant =
    (selectedSize && variants.find((variant) => variant.size === selectedSize)) ??
    defaultVariant;
  const isOutOfStock = selectedSize
    ? selectedVariant.stock === 0
    : !isProductInStock({ variants });

  const sortedVariants = [...variants].sort((a, b) => a.price - b.price);
  const unavailableSizes = sortedVariants
    .filter((variant) => variant.stock === 0)
    .map((variant) => variant.size);

  const stockStatus =
    unavailableSizes.length === 0
      ? "available"
      : unavailableSizes.length === variants.length
        ? "out"
        : "partial";
  const lowStockVariants = sortedVariants.filter(
    (variant) => variant.stock > 0 && variant.stock <= 5,
  );
  const lowStockTooltip = lowStockVariants
    .map((variant) => `${variant.size}: Only ${variant.stock} left`)
    .join(" • ");

  const unavailableTooltip =
    stockStatus === "out"
      ? "All sizes currently unavailable"
      : stockStatus === "partial"
        ? `${unavailableSizes.join(", ")} currently unavailable`
        : "";

  const stockTooltip = [lowStockTooltip, unavailableTooltip]
    .filter(Boolean)
    .join(" • ");

  const priceLabel =
    selectedSize || variants.length === 1
      ? formatter.format(selectedVariant.price)
      : `${formatter.format(getLowestPrice({ variants }))} – ${formatter.format(getHighestPrice({ variants }))}`;

  const sizeLabel = selectedSize
    ? selectedVariant.size
    : variants.map((variant) => variant.size).join(" / ");
  const categoryLabel =
    categories.find((item) => item.slug === category)?.name ?? category;

  return (
    <article className="group relative min-w-0">
      <div className="relative isolate aspect-[4/5] overflow-hidden">
        <Link
          href={getProductPath(slug, selectedSize)}
          className="absolute inset-0 block"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={image}
            alt={name}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {(isNew || isBestSeller) && (
          <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 bg-background px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground sm:left-3 sm:top-3">
            {isNew ? "New" : "Bestseller"}
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
          {!selectedSize &&
            (stockStatus === "partial" || lowStockVariants.length > 0) && (
              <Tooltip
                open={stockTooltipOpen}
                onOpenChange={setStockTooltipOpen}
              >
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      className="flex size-7 items-center justify-center rounded-full bg-background/95 text-amber-700 shadow-sm transition-colors hover:bg-background"
                      aria-label={stockTooltip}
                      onClick={() => setStockTooltipOpen((open) => !open)}
                    />
                  }
                >
                  <CircleAlert className="size-3.5" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>{stockTooltip}</TooltipContent>
              </Tooltip>
            )}

          <QuickView
            product={{ id, slug, name, brand, image, description, category, variants }}
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
                  onClick={toggleWishlist}
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

          <AddToCartButton
            product={toCartProduct({ id, slug, name, brand, image }, selectedVariant)}
            disabled={selectedVariant.stock === 0}
            onClick={
              selectedSize || variants.length === 1
                ? undefined
                : () => {
                    if (cartHasProduct) {
                      removeProduct(id);
                      return;
                    }

                    toast.add({
                      title: "Please choose a size to add this product to your cart.",
                      type: "info",
                    });
                    setQuickViewOpen(true);
                  }
            }
            isInCartOverride={!selectedSize && cartHasProduct ? true : undefined}
          />
        </div>
      </div>

      <Link
        href={getProductPath(slug, selectedSize)}
        className="mt-2.5 block space-y-1.5 sm:mt-3"
      >
        <h3 className="text-xs font-medium leading-snug text-foreground sm:text-[13px]">
          {name}
        </h3>
        <p className="text-[11px] leading-snug text-muted-foreground">
          {categoryLabel}
        </p>
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 pt-0.5">
          <span className="text-xs font-normal tabular-nums text-foreground sm:text-[13px]">
            {priceLabel}
          </span>
          <span className="text-[10px] text-muted-foreground sm:text-[11px]">
            {sizeLabel}
          </span>
        </div>
      </Link>
    </article>
  );
}
