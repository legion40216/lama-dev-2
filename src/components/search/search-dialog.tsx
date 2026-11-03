"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Search icon in the navbar. Submitting opens /products?q=... where the
// listing filters by name, description and category.
export default function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    setOpen(false);
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="ghost" size="icon" aria-label="Search" />}
      >
        <Search className="size-5" />
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="top-24 -translate-y-0 p-4"
      >
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <DialogDescription className="sr-only">
          Search the store by product name, description or category.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            autoFocus
            type="search"
            value={query}
            maxLength={80}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search hoodies, tees, shoes…"
            aria-label="Search products"
            className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <Button type="submit" size="lg">
            Search
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
