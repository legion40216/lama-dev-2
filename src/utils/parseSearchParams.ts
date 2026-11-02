// utils/parseSearchParams.ts

import { searchParamsSchema, SearchParamsValues } from "@/schema";

export type RawSearchParams = Record<string, string | string[] | undefined>;

function normalizeSearchParams(
  searchParams: RawSearchParams
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      result[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      result[key] = value[value.length - 1];
    }
  }

  return result;
}

export function getValidatedSearchParams(
  searchParams: RawSearchParams
): SearchParamsValues {
  const normalized = normalizeSearchParams(searchParams);
  const result = searchParamsSchema.safeParse(normalized);

  // Invalid or unknown category -> treat as "no filter" rather than erroring
  return result.success ? result.data : searchParamsSchema.parse({});
}
