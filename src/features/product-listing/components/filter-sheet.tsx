"use client";

import { Filter } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FilterControls, {
  countActiveFilters,
  type FilterControlsProps,
} from "./filter-controls";

export default function FilterSheet(props: FilterControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeFiltersCount = countActiveFilters(props);

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
          Filter products by category, size, price and availability
        </SheetDescription>

        <FilterControls {...props} />
      </SheetContent>
    </Sheet>
  );
}
