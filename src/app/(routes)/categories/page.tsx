import type { Metadata } from "next";

import CategoriesBar from "@/components/global-ui/categories-bar";
import { categories } from "@/data/categories";
import ProductSection from "@/features/product-listing/product-section";
import type { RawSearchParams } from "@/utils/parseSearchParams";
import { resolveListingParams } from "@/utils/resolve-listing-params";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage(props: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await resolveListingParams(props.searchParams, "/categories");
  const category = categories.find((item) => item.slug === params.category);

  return (
    <div className="space-y-6">
      <CategoriesBar categoryParam={params.category} />

      {/* The category is chosen in the bar above, so the sidebar hides it. */}
      <ProductSection
        categoryParam={params.category}
        filterParam={params.filter}
        sizeParam={params.size}
        minPrice={params.minPrice}
        maxPrice={params.maxPrice}
        featuredParam={params.featured}
        inStockParam={params.inStock}
        queryParam={params.q}
        showCategoryFilter={false}
        headingTitle={category?.name ?? "Categories"}
      />
    </div>
  );
}
