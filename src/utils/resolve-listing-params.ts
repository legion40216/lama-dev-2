import { redirect } from "next/navigation";
import {
  getValidatedSearchParams,
  type RawSearchParams,
} from "@/utils/parseSearchParams";

/**
 * Shared search-param handling for listing pages (/products, /categories).
 *
 * Parses and validates the URL params. If the URL carries an unknown
 * category, redirect to `basePath` (the same page, clean URL) instead of
 * silently showing an unfiltered list under a misleading address.
 */
export async function resolveListingParams(
  searchParams: Promise<RawSearchParams>,
  basePath: string,
) {
  const raw = await searchParams;
  const validated = getValidatedSearchParams(raw);

  const rawCategory =
    typeof raw.category === "string" ? raw.category : undefined;

  if (rawCategory && rawCategory !== validated.category) {
    redirect(basePath);
  }

  return validated;
}
