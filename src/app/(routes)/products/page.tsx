import type { Metadata } from "next";

import ProductSection from "@/features/product-listing/product-section";
import type { RawSearchParams } from "@/utils/parseSearchParams";
import { resolveListingParams } from "@/utils/resolve-listing-params";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage(props: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await resolveListingParams(props.searchParams, "/products");

  return (
    <ProductSection
      categoryParam={params.category}
      filterParam={params.filter}
      sizeParam={params.size}
      minPrice={params.minPrice}
      maxPrice={params.maxPrice}
      featuredParam={params.featured}
      inStockParam={params.inStock}
      queryParam={params.q}
      headingTitle="All products"
    />
  );
}
