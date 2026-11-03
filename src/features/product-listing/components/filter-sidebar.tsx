import FilterControls, { type FilterControlsProps } from "./filter-controls";

export default function FilterSidebar(props: FilterControlsProps) {
  return (
    <aside className="hidden md:block w-56 shrink-0">
      <FilterControls {...props} />
    </aside>
  );
}
