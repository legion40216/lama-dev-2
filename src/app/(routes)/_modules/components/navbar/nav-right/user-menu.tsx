import { User } from "lucide-react";

import { Button } from "@/components/ui/button";

// Dummy account icon. No functionality yet.
export default function UserMenu() {
  return (
    <Button variant="ghost" size="icon" aria-label="Account">
      <User className="size-5" />
    </Button>
  );
}
