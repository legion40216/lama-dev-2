"use client";

import { Eye } from "lucide-react";
import { useState } from "react";

import type { ProductSize } from "@/types/types";

import QuickViewContent, {
  type QuickViewProduct,
} from "@/components/global-ui/quick-view-content";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

// Eye icon for product cards. Opens the quick view modal.
export default function QuickView({
  product,
  selectedSize,
  open: controlledOpen,
  onOpenChange,
}: {
  product: QuickViewProduct;
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
