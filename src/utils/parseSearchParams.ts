import { type SearchParamsValues, searchParamsSchema } from "@/schema";

export type RawSearchParams = Record<string, string | string[] | undefined>;

// Repeated params (?a=1&a=2) are reduced to the last value.
function normalizeSearchParams(
  searchParams: RawSearchParams,
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
  searchParams: RawSearchParams,
): SearchParamsValues {
  return searchParamsSchema.parse(normalizeSearchParams(searchParams));
}
