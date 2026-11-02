"use client";

import { useEffect, useState } from "react";

import { categories, brands } from "@/data/data";
import { PRICE_STEP } from "@/data/constants";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import type { CategorySlug } from "@/schema";
import { formatter } from "@/utils/formatters";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

export interface FilterControlsProps {
  categoryParam: CategorySlug;
  minPrice: number;
  maxPrice: number;
  brandParam: string[];
  featuredParam: boolean;
  inStockParam: boolean;
  showCategoryFilter?: boolean;
  onChange?: () => void;
  priceBounds: { min: number; max: number };
}

export default function FilterControls({
  categoryParam,
  minPrice,
  maxPrice,
  brandParam,
  featuredParam,
  inStockParam,
  showCategoryFilter = true,
  onChange,
  priceBounds,
}: FilterControlsProps) {
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

  const handleCategoryChange = (slug: string) => {
    updateParams({ category: slug === "all" ? null : slug });
  };

  const handlePriceCommit = (value: number | readonly number[]) => {
    if (typeof value === "number") return;

    const [min, max] = value;
    updateParams({
      minPrice: min === priceBounds.min ? null : String(min),
      maxPrice: max === priceBounds.max ? null : String(max),
    });
  };

  const handleBrandToggle = (brand: string) => {
    const next = brandParam.includes(brand)
      ? brandParam.filter((b) => b !== brand)
      : [...brandParam, brand];

    updateParams({ brand: next.length ? next.join(",") : null });
  };

  const handleInStockToggle = (checked: boolean) => {
    updateParams({ inStock: checked ? "true" : null });
  };

  const handleFeaturedToggle = (checked: boolean) => {
    updateParams({ featured: checked ? "true" : null });
  };

  const handleClearAll = () => {
    clear();
    onChange?.();
  };

  const hasActiveFilters =
    (showCategoryFilter && !!categoryParam) ||
    minPrice !== priceBounds.min ||
    maxPrice !== priceBounds.max ||
    brandParam.length > 0 ||
    inStockParam ||
    featuredParam;

  return (
    <div
      className="space-y-6 transition-opacity aria-busy:opacity-60"
      aria-busy={isPending}
    >
      <div>
        <h2 className="font-medium">Filters</h2>
      </div>

      {showCategoryFilter && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Category</Label>
          <RadioGroup
            value={categoryParam ?? "all"}
            onValueChange={handleCategoryChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="cat-all" />
              <Label htmlFor="cat-all" className="font-normal cursor-pointer">
                All
              </Label>
            </div>

            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.slug} id={`cat-${category.id}`} />
                <Label
                  htmlFor={`cat-${category.id}`}
                  className="font-normal cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

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

      <div className="space-y-3">
        <Label className="text-sm font-medium">Brand</Label>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-3">
              <Checkbox
                id={`brand-${brand}`}
                checked={brandParam.includes(brand)}
                onCheckedChange={() => handleBrandToggle(brand)}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="font-normal cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Checkbox
          id="in-stock"
          checked={inStockParam}
          onCheckedChange={(checked) => handleInStockToggle(!!checked)}
        />
        <Label htmlFor="in-stock" className="font-normal cursor-pointer">
          In stock only
        </Label>
      </div>

      <div className="flex items-center space-x-3">
        <Checkbox
          id="featured"
          checked={featuredParam}
          onCheckedChange={(checked) => handleFeaturedToggle(!!checked)}
        />
        <Label htmlFor="featured" className="font-normal cursor-pointer">
          Featured & Best Sellers
        </Label>
      </div>

      <div className="flex justify-end">
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
