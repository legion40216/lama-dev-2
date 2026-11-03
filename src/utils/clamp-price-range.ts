// Keeps a requested price range inside the bounds of the current
// category / size, so the slider never shows a value outside its track.
export function clampPriceRange(
  range: { minPrice: number; maxPrice: number },
  bounds: { min: number; max: number },
): { minPrice: number; maxPrice: number } {
  const clamp = (value: number) =>
    Math.min(Math.max(value, bounds.min), bounds.max);

  const minPrice = clamp(Math.min(range.minPrice, range.maxPrice));
  const maxPrice = clamp(Math.max(range.minPrice, range.maxPrice));

  return { minPrice, maxPrice };
}
