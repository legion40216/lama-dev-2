import Link from "next/link";
import { Suspense } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { categories } from "@/data/categories";
import type { ProductType } from "@/types/types";
import type { RawSearchParams } from "@/utils/parseSearchParams";
import { firstParam } from "@/utils/product-url";
import { getDefaultSelection } from "@/utils/product-variants";
import ProductSkeleton from "../components/product-skeleton";
import ProductSection from "../sections/product-section";

export default function SingleProductView({
  product,
  searchParams,
}: {
  product: ProductType;
  searchParams: Promise<RawSearchParams>;
}) {
  const category = categories.find((item) => item.slug === product.category);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/products" />}>
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {category && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href={`/products?category=${category.slug}`} />}
                >
                  {category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ?size= and ?color= are request-time data, so they are read inside
          Suspense and the rest of the page can be prerendered. */}
      <Suspense fallback={<ProductSkeleton />}>
        <SelectedProduct product={product} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SelectedProduct({
  product,
  searchParams,
}: {
  product: ProductType;
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;

  // Unknown sizes/colours in the URL fall back to the default selection.
  const initialSelection = getDefaultSelection(product, {
    size: firstParam(params.size),
    color: firstParam(params.color),
  });

  return (
    <ProductSection product={product} initialSelection={initialSelection} />
  );
}
