// Shared (server + client) so the server can read the saved preference from a
// cookie and render the right grid on first paint, with no layout jump.
export type GridColumns = 1 | 2 | 3;

export const DEFAULT_GRID_COLUMNS: GridColumns = 3;
export const GRID_COLUMNS_COOKIE = "product-grid-columns";

export function parseGridColumns(
  value: string | null | undefined,
): GridColumns {
  return value === "1" || value === "2" || value === "3"
    ? (Number(value) as GridColumns)
    : DEFAULT_GRID_COLUMNS;
}
