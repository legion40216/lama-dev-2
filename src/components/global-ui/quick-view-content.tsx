"use client";

import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ShareButton from "@/components/global-ui/share-button";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { categories } from "@/data/categories";
import useCart from "@/hooks/useCartStore";
import useHydrated from "@/hooks/useHydrated";
import useWishlist from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import type { ProductSize, ProductType } from "@/types/types";
import { formatter } from "@/utils/formatters";
import { getProductPath } from "@/utils/product-url";
import {
  changeSize,
  getColor,
  getDefaultSelection,
  getFinalPrice,
  getSizeOption,
  getStock,
  hasDiscount,
  isColorOffered,
  isSizeInStock,
  toCartProduct,
} from "@/utils/product-variants";

const LOW_STOCK_THRESHOLD = 5;

type QuickViewContentProps = {
  product: ProductType;
  initialSize?: ProductSize;
  onClose: () => void;
};

// The body lives in its own component so its state is created fresh every
// time the dialog opens (the popup only mounts while open).
export default function QuickViewContent(props: QuickViewContentProps) {
  return (
    <DialogContent
      showCloseButton
      className="max-h-[90dvh] overflow-hidden p-0 sm:max-w-3xl"
    >
      <QuickViewBody {...props} />
    </DialogContent>
  );
}

function QuickViewBody({
  product,
  initialSize,
  onClose,
}: QuickViewContentProps) {
  const router = useRouter();
  const hydrated = useHydrated();
  const wishlist = useWishlist();
  const addItem = useCart((state) => state.addItem);
  const removeItem = useCart((state) => state.removeItem);
  const updateItemCount = useCart((state) => state.updateItemCount);

  const [selection, setSelection] = useState(() =>
    getDefaultSelection(product, { size: initialSize }),
  );
  const [draftQuantity, setDraftQuantity] = useState(1);

  const option = getSizeOption(product, selection.size) ?? product.sizes[0];
  const color = getColor(product, selection.color) ?? product.colors[0];
  const stock = getStock(option, color.name);
  const isSoldOut = stock === 0;

  const cartLine = toCartProduct(product, selection);
  const cartItem = useCart((state) =>
    state.items.find((item) => item.id === cartLine.id),
  );
  const inCart = hydrated && Boolean(cartItem);

  // A line already in the cart is edited in place; otherwise it is a draft.
  const quantity =
    inCart && cartItem
      ? cartItem.count
      : Math.min(Math.max(draftQuantity, 1), Math.max(stock, 1));

  const isWishlisted = wishlist.has(product.id);
  const categoryName =
    categories.find((category) => category.slug === product.category)?.name ??
    product.category;

  const availability = isSoldOut
    ? "Sold out"
    : stock <= LOW_STOCK_THRESHOLD
      ? `Only ${stock} left`
      : "In stock";

  const selectSize = (size: ProductSize) => {
    setSelection((current) => changeSize(product, current, size));
    setDraftQuantity(1);
  };

  const selectColor = (name: string) => {
    setSelection((current) => ({ ...current, color: name }));
    setDraftQuantity(1);
  };

  const changeQuantity = (next: number) => {
    const safe = Math.min(Math.max(next, 1), Math.max(stock, 1));
    setDraftQuantity(safe);
    if (cartItem) updateItemCount(cartLine.id, safe);
  };

  const toggleCart = () => {
    if (isSoldOut) return;

    if (cartItem) {
      removeItem(cartLine.id);
      return;
    }

    addItem(cartLine, quantity);
  };

  const buyNow = () => {
    if (isSoldOut) return;
    if (!cartItem) addItem(cartLine, quantity);

    onClose();
    router.push("/checkout");
  };

  const detailsPath = getProductPath(product.slug, {
    size: selection.size,
    color: selection.color,
  });

  return (
    <div className="max-h-[90dvh] overflow-y-auto">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/5] bg-muted md:sticky md:top-0 md:self-start">
          <Image
            src={color.image}
            alt={`${product.name} in ${color.name}`}
            fill
            sizes="(min-width: 768px) 384px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {categoryName}
            </p>

            <div className="flex items-center gap-2 pr-8">
              <DialogTitle className="min-w-0 flex-1 text-2xl">
                {product.name}
              </DialogTitle>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <ShareButton
                  title={product.name}
                  text={product.name}
                  path={detailsPath}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label={
                    isWishlisted
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  aria-pressed={isWishlisted}
                  onClick={() => wishlist.toggle(product.id)}
                >
                  <Heart
                    className={
                      isWishlisted
                        ? "size-3.5 fill-rose-600 text-rose-600"
                        : "size-3.5"
                    }
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </div>

            <p className="flex items-baseline gap-2 text-lg font-medium">
              {formatter.format(getFinalPrice(option))}
              {hasDiscount(option) && (
                <s className="text-sm font-normal text-muted-foreground">
                  {formatter.format(option.price)}
                </s>
              )}
            </p>

            <DialogDescription className="leading-6">
              {product.description}
            </DialogDescription>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              Color:{" "}
              <span className="font-normal text-muted-foreground">
                {color.name}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((item) => {
                const offered = isColorOffered(option, item.name);
                const selected = item.name === color.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    disabled={!offered}
                    aria-pressed={selected}
                    aria-label={`${item.name}${offered ? "" : ", not available in this size"}`}
                    title={
                      offered
                        ? item.name
                        : `${item.name} (not available in ${option.size})`
                    }
                    onClick={() => selectColor(item.name)}
                    className={cn(
                      "size-8 rounded-full border border-foreground/20 outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
                      selected && "ring-2 ring-foreground",
                      !offered && "cursor-not-allowed opacity-30",
                    )}
                    style={{ backgroundColor: item.code }}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((item) => (
                <Button
                  key={item.size}
                  type="button"
                  variant={selection.size === item.size ? "default" : "outline"}
                  size="sm"
                  title={isSizeInStock(item) ? undefined : "Sold out"}
                  aria-label={`${item.size}${isSizeInStock(item) ? "" : ", sold out"}`}
                  className={cn(
                    !isSizeInStock(item) && "line-through opacity-60",
                  )}
                  onClick={() => selectSize(item.size)}
                >
                  {item.size}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Quantity</p>
            <div className="flex w-fit items-center rounded-md border">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isSoldOut || quantity <= 1}
                onClick={() => changeQuantity(quantity - 1)}
                aria-label="Decrease quantity"
              >
                <Minus />
              </Button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isSoldOut || quantity >= stock}
                onClick={() => changeQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{availability}</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant={inCart ? "outline" : "default"}
              disabled={isSoldOut}
              onClick={toggleCart}
            >
              <ShoppingCart />
              {inCart ? "Remove from cart" : "Add to cart"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSoldOut}
              onClick={buyNow}
            >
              Buy it now
            </Button>
          </div>

          <div className="divide-y rounded-lg border text-sm">
            <Row label="Size" value={option.size} />
            <Row label="Color" value={color.name} />
            <Row label="SKU" value={cartLine.id.toUpperCase()} />
            <Row label="Availability" value={availability} />
          </div>

          <Link
            href={detailsPath}
            onClick={onClose}
            className="inline-flex text-sm font-medium underline underline-offset-4"
          >
            View full details
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 p-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
