import EmptyState from "@/components/global-ui/empty-state";
import ProductCard from "@/components/global-ui/product-card";
import { products } from "@/data/data";
import type { CategorySlug } from "@/schema";

const HOME_PRODUCT_LIMIT = 8;

export default function MainSection({
  categoryParam,
}: {
  categoryParam: CategorySlug;
}) {
  const visibleProducts = products
    .filter(
      (product) =>
        categoryParam === "all" || product.category === categoryParam,
    )
    .slice(0, HOME_PRODUCT_LIMIT);

  if (visibleProducts.length === 0) {
    return <EmptyState title="Nothing here yet" subtitle="Check back soon." />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {visibleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
