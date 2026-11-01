"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import NavLinks from "@/components/global-ui/nav-links";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavRoutes } from "../nav-routes";

export default function NavMobile() {
  const routes = useNavRoutes();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Menu className="size-5" />
        </SheetTrigger>

        <SheetContent side="left" className="overflow-y-auto p-4">
          <SheetTitle className="sr-only">Fragrance Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Navigation menu for Fragrance
          </SheetDescription>

          <div className="flex h-full flex-col justify-between">
            <div className="grid gap-6">
              <div>
                <h2 className="text-xl font-bold">Fragrance</h2>
              </div>

              <nav className="flex flex-col gap-2">
                {routes.map((route) => (
                  <NavLinks
                    key={route.href}
                    routeActive={route.active}
                    routeHref={route.href}
                    routeLabel={route.label}
                    className="border-b py-3"
                    activeClassName="font-semibold"
                    inactiveClassName="text-muted-foreground"
                    onClick={handleLinkClick}
                  />
                ))}
              </nav>
            </div>

            <Button className="w-full">Contact Us</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
