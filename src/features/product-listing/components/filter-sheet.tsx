"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import FilterControls, { FilterControlsProps } from "./filter-controls";
import { PRICE_BOUNDS } from "@/data/constants";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export default function FilterSheet(props: FilterControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    categoryParam,
    minPrice,
    maxPrice,
    brandParam,
    featuredParam,
    inStockParam,
    showCategoryFilter = true,
    priceBounds,
  } = props;

  const activeFiltersCount =
    (showCategoryFilter && categoryParam ? 1 : 0) +
    (minPrice !== priceBounds.min || maxPrice !== priceBounds.max ? 1 : 0) +
    brandParam.length +
    (inStockParam ? 1 : 0) +
    (featuredParam ? 1 : 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" className="w-full justify-start">
            <Filter className="mr-2 size-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        }
      />

      <SheetContent side="left" className="overflow-y-auto p-4">
        <SheetTitle className="sr-only">Filter products</SheetTitle>
        <SheetDescription className="sr-only">
          Filter fragrances by category, price, brand, and availability
        </SheetDescription>

        <FilterControls {...props} />
      </SheetContent>
    </Sheet>
  );
}
