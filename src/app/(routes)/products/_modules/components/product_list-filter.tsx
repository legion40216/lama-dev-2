"use client";

import { 
  usePathname, 
  useRouter, 
  useSearchParams 
} from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductListFilter({
  currentFilter,
}: {
  currentFilter: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <Select
        value={currentFilter} // ✅ Changed from defaultValue to value
        onValueChange={handleFilterChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="price_low_high">Price: Low to High</SelectItem>
          <SelectItem value="price_high_low">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
