"use client";

import EmptyState from "@/components/global-ui/empty-state";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <EmptyState
      title="Something went wrong"
      subtitle="Please try again later"
    >
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => retry()}>
          Try again
        </Button>
      </div>
    </EmptyState>
  );
}
