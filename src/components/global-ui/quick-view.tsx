"use client";

import { Eye } from "lucide-react";
import { useState } from "react";

import QuickViewContent from "@/components/global-ui/quick-view-content";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { ProductSize, ProductType } from "@/types/types";

// Eye icon for product cards. Opens the quick view modal.
export default function QuickView({
  product,
  selectedSize,
  open: controlledOpen,
  onOpenChange,
}: {
  product: ProductType;
  selectedSize?: ProductSize;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="secondary"
            size="icon-sm"
            className="rounded-full shadow"
            aria-label={`Quick view ${product.name}`}
          />
        }
      >
        <Eye className="size-3.5" />
      </DialogTrigger>

      <QuickViewContent
        product={product}
        initialSize={selectedSize}
        onClose={() => setOpen(false)}
      />
    </Dialog>
  );
}
