"use client";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { sortOptions } from "@/data/constants";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import type { FilterValue } from "@/schema";

export default function ProductListFilter({
  currentFilter,
}: {
  currentFilter: FilterValue;
}) {
  const { update, isPending } = useUpdateSearchParams();

  return (
    <NativeSelect
      value={currentFilter}
      aria-busy={isPending}
      className="transition-opacity aria-busy:opacity-60"
      onChange={(event) => update({ filter: event.target.value })}
    >
      {sortOptions.map(({ label, value }) => (
        <NativeSelectOption key={value} value={value}>
          {label}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
