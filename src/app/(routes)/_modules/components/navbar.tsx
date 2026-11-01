import NavLeft from "./navbar/nav-left";
import { Button } from "@/components/ui/button";

import NavMiddle from "./navbar/nav-middle";
import NavRight from "./navbar/nav-right";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between py-0 md:py-2">
      <NavLeft />

      <NavMiddle />
      
      <NavRight />
    </div>
  );
}