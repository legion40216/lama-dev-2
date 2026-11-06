"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { ProductType } from "@/types/types";
import {
  changeSize,
  getColor,
  getSizeOption,
  getStock,
  hasDiscount,
  isColorOffered,
  type Selection,
} from "@/utils/product-variants";
import ProductDetails from "../components/product-details";

export default function ProductSection({
  product,
  initialSelection,
}: {
  product: ProductType;
  initialSelection: Selection;
}) {
  const [selection, setSelection] = useState<Selection>(initialSelection);

  const option = getSizeOption(product, selection.size) ?? product.sizes[0];
  const color = getColor(product, selection.color) ?? product.colors[0];

  const isSoldOut = getStock(option, color.name) === 0;
  const onSale = hasDiscount(option);

  // Keep the URL in step with the choice so a refresh or a shared link opens
  // on the same size and colour.
  const select = (next: Selection) => {
    setSelection(next);

    const url = new URL(window.location.href);
    url.searchParams.set("size", next.size);
    url.searchParams.set("color", next.color);
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div className="space-y-3">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          <Image
            src={color.image}
            alt={`${product.name} in ${color.name}`}
            fill
            priority
            sizes="(min-width: 1200px) 560px, (min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />

          {(onSale || product.isNew) && (
            <span className="pointer-events-none absolute left-3 top-3 bg-background px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em]">
              {onSale ? "Sale" : "New"}
            </span>
          )}

          {isSoldOut && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/65">
              <span className="border border-foreground/20 bg-background/90 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em]">
                Sold out
              </span>
            </div>
          )}
        </div>

        {/* One thumbnail per colour. Colours this size doesn't come in are off. */}
        {product.colors.length > 1 && (
          <ul className="grid grid-cols-4 gap-3" aria-label="Colour photos">
            {product.colors.map((item) => {
              const offered = isColorOffered(option, item.name);
              const isSelected = item.name === color.name;

              return (
                <li key={item.name}>
                  <button
                    type="button"
                    disabled={!offered}
                    aria-pressed={isSelected}
                    aria-label={
                      offered
                        ? `Show ${item.name}`
                        : `${item.name}, not made in size ${option.size}`
                    }
                    title={
                      offered ? item.name : `Not made in size ${option.size}`
                    }
                    onClick={() =>
                      select({ size: selection.size, color: item.name })
                    }
                    className={cn(
                      "relative block aspect-[4/5] w-full overflow-hidden border bg-muted outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                      isSelected
                        ? "border-foreground"
                        : "border-transparent hover:border-foreground/40",
                      !offered && "cursor-not-allowed opacity-40",
                    )}
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 10vw, 22vw"
                      className="object-cover"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ProductDetails
        product={product}
        selection={selection}
        onSelectSize={(size) => select(changeSize(product, selection, size))}
        onSelectColor={(name) => select({ size: selection.size, color: name })}
      />
    </div>
  );
}
