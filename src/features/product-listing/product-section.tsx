import { cookies } from "next/headers";

import HeadingState from "@/components/global-ui/heading-state";
import { getPriceBounds } from "@/data/constants";
import { products } from "@/data/data";
import type { CategorySlug, FilterValue, SizeFilter } from "@/schema";
import { clampPriceRange } from "@/utils/clamp-price-range";
import { filterProducts } from "@/utils/filter-products";
import { sortProducts } from "@/utils/sort-products";
import FilterSidebar from "./components/filter-sidebar";
import { GRID_COLUMNS_COOKIE, parseGridColumns } from "./grid-columns";
import ProductList from "./product-list";

export default async function ProductSection({
  categoryParam,
  filterParam,
  sizeParam,
  minPrice,
  maxPrice,
  featuredParam,
  inStockParam,
  showCategoryFilter = true,
  headingTitle = "Collections",
  headingSubtitle = "Find something you'll wear on repeat.",
  queryParam = "",
}: {
  categoryParam: CategorySlug;
  filterParam: FilterValue;
  sizeParam: SizeFilter;
  minPrice: number;
  maxPrice: number;
  featuredParam: boolean;
  inStockParam: boolean;
  showCategoryFilter?: boolean;
  headingTitle?: string;
  headingSubtitle?: string;
  queryParam?: string;
}) {
  // Read on the server so the first paint already uses the saved layout.
  const cookieStore = await cookies();
  const initialColumns = parseGridColumns(
    cookieStore.get(GRID_COLUMNS_COOKIE)?.value,
  );

  const priceBounds = getPriceBounds({
    category: categoryParam,
    size: sizeParam,
  });
  const priceRange = clampPriceRange({ minPrice, maxPrice }, priceBounds);

  const filterProps = {
    categoryParam,
    sizeParam,
    minPrice: priceRange.minPrice,
    maxPrice: priceRange.maxPrice,
    featuredParam,
    inStockParam,
    showCategoryFilter,
    priceBounds,
  };

  const filteredAndSorted = sortProducts(
    filterProducts(products, { ...filterProps, queryParam }),
    filterParam,
    sizeParam,
  );

  return (
    <section className="space-y-6">
      <HeadingState
        title={queryParam ? "Search" : headingTitle}
        subtitle={
          queryParam
            ? `Results for \u201c${queryParam}\u201d.`
            : headingSubtitle
        }
      />

      <div className="flex flex-col gap-6 md:flex-row">
        <FilterSidebar {...filterProps} />

        <div className="min-w-0 flex-1">
          <ProductList
            initialData={filteredAndSorted}
            initialColumns={initialColumns}
            selectedSize={sizeParam}
            filterProps={filterProps}
            currentFilter={filterParam}
          />
        </div>
      </div>
    </section>
  );
}
