"use client";

import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

// Uses the native share sheet when there is one, otherwise copies the link.
export default function ShareButton({
  title,
  text,
  path,
}: {
  title: string;
  text: string;
  path: string;
}) {
  const share = async () => {
    const url = new URL(path, window.location.origin).toString();

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      toast.add({ title: "Link copied.", type: "success" });
    } catch (error) {
      // Closing the share sheet throws AbortError; that is not a failure.
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.add({ title: "Couldn\u2019t share this product.", type: "error" });
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={`Share ${title}`}
      onClick={share}
    >
      <Share2 className="size-3.5" aria-hidden="true" />
    </Button>
  );
}
