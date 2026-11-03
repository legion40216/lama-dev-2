"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { categories } from "@/data/categories";
import { availableSizes, PRICE_STEP } from "@/data/constants";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import type { CategorySlug, SizeFilter } from "@/schema";
import { formatter } from "@/utils/formatters";

export interface FilterControlsProps {
  categoryParam: CategorySlug;
  sizeParam: SizeFilter;
  minPrice: number;
  maxPrice: number;
  featuredParam: boolean;
  inStockParam: boolean;
  showCategoryFilter?: boolean;
  onChange?: () => void;
  priceBounds: { min: number; max: number };
}

export function countActiveFilters({
  categoryParam,
  sizeParam,
  minPrice,
  maxPrice,
  featuredParam,
  inStockParam,
  showCategoryFilter = true,
  priceBounds,
}: Omit<FilterControlsProps, "onChange">): number {
  return (
    (showCategoryFilter && categoryParam !== "all" ? 1 : 0) +
    (sizeParam ? 1 : 0) +
    (minPrice !== priceBounds.min || maxPrice !== priceBounds.max ? 1 : 0) +
    (inStockParam ? 1 : 0) +
    (featuredParam ? 1 : 0)
  );
}

export default function FilterControls(props: FilterControlsProps) {
  const {
    categoryParam,
    sizeParam,
    minPrice,
    maxPrice,
    featuredParam,
    inStockParam,
    showCategoryFilter = true,
    onChange,
    priceBounds,
  } = props;

  const { update, clear, isPending } = useUpdateSearchParams();

  const [priceDraft, setPriceDraft] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  useEffect(() => {
    setPriceDraft([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const updateParams = (updates: Record<string, string | null>) => {
    update(updates);
    onChange?.();
  };

  const handlePriceCommit = (value: number | readonly number[]) => {
    if (typeof value === "number") return;

    const [min, max] = value;
    updateParams({
      minPrice: min === priceBounds.min ? null : String(min),
      maxPrice: max === priceBounds.max ? null : String(max),
    });
  };

  const handleClearAll = () => {
    clear();
    onChange?.();
  };

  return (
    <div
      className="space-y-6 transition-opacity aria-busy:opacity-60"
      aria-busy={isPending}
    >
      <h2 className="font-medium">Filters</h2>

      {showCategoryFilter && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Category</Label>
          <RadioGroup
            value={categoryParam}
            onValueChange={(slug) =>
              updateParams({ category: slug === "all" ? null : String(slug) })
            }
          >
            {categories.map((category) => (
              <div key={category.slug} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={category.slug}
                  id={`cat-${category.slug}`}
                />
                <Label
                  htmlFor={`cat-${category.slug}`}
                  className="cursor-pointer font-normal"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-sm font-medium">Size</Label>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => {
            const isActive = sizeParam === size;

            return (
              <Button
                key={size}
                type="button"
                size="sm"
                variant={isActive ? "default" : "outline"}
                aria-pressed={isActive}
                onClick={() => updateParams({ size: isActive ? null : size })}
                className="min-w-9"
              >
                {size}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Price</Label>
        <Slider
          min={priceBounds.min}
          max={priceBounds.max}
          step={PRICE_STEP}
          value={priceDraft}
          onValueChange={(value) => setPriceDraft(value as [number, number])}
          onValueCommitted={handlePriceCommit}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatter.format(priceDraft[0])}</span>
          <span>{formatter.format(priceDraft[1])}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Checkbox
          id="in-stock"
          checked={inStockParam}
          onCheckedChange={(checked) =>
            updateParams({ inStock: checked ? "true" : null })
          }
        />
        <Label htmlFor="in-stock" className="cursor-pointer font-normal">
          In stock only
        </Label>
      </div>

      <div className="flex items-center space-x-3">
        <Checkbox
          id="featured"
          checked={featuredParam}
          onCheckedChange={(checked) =>
            updateParams({ featured: checked ? "true" : null })
          }
        />
        <Label htmlFor="featured" className="cursor-pointer font-normal">
          Featured only
        </Label>
      </div>

      <div className="flex justify-end">
        {countActiveFilters(props) > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
