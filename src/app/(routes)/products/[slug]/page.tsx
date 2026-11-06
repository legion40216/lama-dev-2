import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { products } from "@/data/data";
import { getProductBySlug } from "@/utils/get-product-by-slug";
import ProductSkeleton from "./_modules/components/product-skeleton";
import SingleProductView from "./_modules/views/single_product-view";

// Cache Components needs at least one sample param to prerender this route.
// Slugs that aren't listed here still render on the first request.
export async function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return { title: product.name, description: product.description };
}

export default function Page({
  params,
  searchParams,
}: PageProps<"/products/[slug]">) {
  // `params` is awaited inside Suspense so slugs that weren't prerendered
  // still show the skeleton straight away while the product resolves.
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <Product params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Product({
  params,
  searchParams,
}: Pick<PageProps<"/products/[slug]">, "params" | "searchParams">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  // Unknown or archived slug (archived products are not in `products`)
  if (!product) notFound();

  return <SingleProductView product={product} searchParams={searchParams} />;
}
