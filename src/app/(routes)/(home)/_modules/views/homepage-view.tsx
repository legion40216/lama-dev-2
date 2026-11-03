import Image from "next/image";
import Link from "next/link";

import CategoriesBar from "@/components/global-ui/categories-bar";
import { buttonVariants } from "@/components/ui/button";
import type { CategorySlug } from "@/schema";
import MainSection from "../sections/main-section";

export default function HomepageView({
  categoryParam,
}: {
  categoryParam: CategorySlug;
}) {
  const allProductsHref =
    categoryParam === "all"
      ? "/products"
      : `/products?category=${categoryParam}`;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/1] overflow-hidden">
        <Image
          src="/assets/featured.png"
          alt="Garment Store featured collection"
          fill
          priority
          sizes="(min-width: 1200px) 1200px, 100vw"
          className="object-cover"
        />
      </div>

      <CategoriesBar categoryParam={categoryParam} />
      <MainSection categoryParam={categoryParam} />

      <div className="flex justify-end">
        <Link
          href={allProductsHref}
          className={buttonVariants({ variant: "link" })}
        >
          See all products
        </Link>
      </div>
    </div>
  );
}
