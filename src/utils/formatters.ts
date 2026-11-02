import { CURRENCY } from "@/data/constants";

export const formatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
