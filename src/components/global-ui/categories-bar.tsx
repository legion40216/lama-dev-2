"use client";

import { Button } from "@/components/ui/button";
import { categories } from "@/data/categories";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import type { CategorySlug } from "@/schema";

// Category tabs. Picking one sets ?category=...; "All" removes the param.
export default function CategoriesBar({
  categoryParam,
}: {
  categoryParam: CategorySlug;
}) {
  const { update, isPending } = useUpdateSearchParams();

  return (
    <div
      className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 rounded-md bg-muted p-2 aria-busy:opacity-60"
      aria-busy={isPending}
    >
      {categories.map(({ name, slug, icon: Icon }) => {
        const isActive = categoryParam === slug;

        return (
          <Button
            key={slug}
            type="button"
            variant={isActive ? "default" : "ghost"}
            aria-pressed={isActive}
            onClick={() => update({ category: slug === "all" ? null : slug })}
            className="text-sm"
          >
            <Icon className="mr-1 size-4" />
            {name}
          </Button>
        );
      })}
    </div>
  );
}
