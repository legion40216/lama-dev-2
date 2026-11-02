"use client";

import { useState, useSyncExternalStore } from "react";
import type { ProductSize, ProductsType } from "@/types/types";
import type { FilterControlsProps } from "./components/filter-controls";
import ProductCard from "@/components/global-ui/product-card";
import EmptyState from "@/components/global-ui/empty-state";
import { Button } from "@/components/ui/button";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import { GRID_COLUMNS_COOKIE, type GridColumns } from "./grid-columns";
import FilterSheet from "./components/filter-sheet";
import ProductListFilter from "./components/product-list-filter";
import type { FilterValue } from "@/schema";

const gridClasses: Record<GridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
};

const sizeOptions: { value: ProductSize | null; label: string }[] = [
  { value: null, label: "All sizes" },
  { value: "50ml", label: "50ml" },
  { value: "100ml", label: "100ml" },
];

const columnOptions: { value: GridColumns; label: string }[] = [
  { value: 1, label: "Single column" },
  { value: 2, label: "Two columns" },
  { value: 3, label: "Three columns" },
];

const cardSizes: Record<GridColumns, string> = {
  1: "(min-width: 768px) 75vw, 100vw",
  2: "(min-width: 768px) 38vw, 50vw",
  3: "(min-width: 768px) 25vw, 50vw",
};

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function ColumnsIcon({ columns }: { columns: GridColumns }) {
  const gap = 2;
  const width = (16 - gap * (columns - 1)) / columns;

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      {Array.from({ length: columns }).map((_, i) => (
        <rect
          key={i}
          x={i * (width + gap)}
          y={2}
          width={width}
          height={12}
          rx={1.5}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export default function ProductList({
  initialData,
  initialColumns,
  selectedSize,
  filterProps,
  currentFilter,
}: {
  initialData: ProductsType;
  initialColumns: GridColumns;
  selectedSize: ProductSize | undefined;
  filterProps: FilterControlsProps;
  currentFilter: FilterValue;
}) {
  const [columns, setColumns] = useState<GridColumns>(initialColumns);
  const { update, isPending } = useUpdateSearchParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const activeColumns: GridColumns = columns === 3 && !isDesktop ? 2 : columns;

  const handleSizeChange = (value: ProductSize | null) => {
    update({ size: value });
  };

  const handleGridChange = (value: GridColumns) => {
    setColumns(value);

    // A cookie (not localStorage) so the server can render the saved layout.
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API isn't supported in all browsers yet
    document.cookie =
      GRID_COLUMNS_COOKIE +
      "=" +
      value +
      "; path=/; max-age=" +
      ONE_YEAR_SECONDS +
      "; samesite=lax";
  };

  return (
    <div className="space-y-4">
      {/* Mobile row 1: filters and grid layout */}
      <div className="flex items-center justify-between gap-3">
        <div className="md:hidden">
          <FilterSheet {...filterProps} />
        </div>

        <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1 md:ml-auto">
          {columnOptions.map(({ value, label }) => (
            <Button
              key={value}
              type="button"
              size="icon"
              variant={activeColumns === value ? "secondary" : "ghost"}
              aria-pressed={activeColumns === value}
              aria-label={label}
              title={label}
              onClick={() => handleGridChange(value)}
              className={`h-8 w-8 ${value === 3 ? "hidden md:inline-flex" : ""}`}
            >
              <ColumnsIcon columns={value} />
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile row 2: size options */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Size:</span>
        <div
          className={`flex items-center gap-1 rounded-lg border bg-muted/40 p-1 transition-opacity ${isPending ? "opacity-60" : ""}`}
          role="group"
          aria-label="Filter products by size"
        >
          {sizeOptions.map(({ value, label }) => {
            const isActive =
              value === null
                ? selectedSize === undefined
                : selectedSize === value;

            return (
              <Button
                key={label}
                type="button"
                size="sm"
                variant={isActive ? "secondary" : "ghost"}
                aria-pressed={isActive}
                disabled={isPending}
                onClick={() => handleSizeChange(value)}
                className="h-8 rounded-md px-3"
              >
                {label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Mobile row 3: product count and sorting */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {initialData.length}{" "}
          {initialData.length === 1 ? "product" : "products"}
        </p>
        <div className="min-w-0">
          <ProductListFilter currentFilter={currentFilter} />
        </div>
      </div>

      {initialData.length === 0 ? (
        <EmptyState
          title="No fragrances found"
          subtitle="Try changing your filters."
        />
      ) : (
        <div
          className={`grid gap-4 transition-[grid-template-columns] duration-300 ease-out ${gridClasses[columns]}`}
        >
          {initialData.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              selectedSize={selectedSize}
              sizes={cardSizes[activeColumns]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
