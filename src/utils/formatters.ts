import { CURRENCY } from "@/data/constants";

// Garment prices have cents ($19.99), so always show two decimals.
export const formatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
});
