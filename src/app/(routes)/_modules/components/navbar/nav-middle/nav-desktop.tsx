"use client";

import NavLinks from "@/components/global-ui/nav-links";
import { useNavRoutes } from "../nav-routes";

export default function NavDesktop() {
  const routes = useNavRoutes();

  return (
    <nav className="flex items-center gap-6">
      {routes.map((route) => (
        <NavLinks
          key={route.href}
          routeActive={route.active}
          routeHref={route.href}
          routeLabel={route.label}
          activeClassName="font-medium underline underline-offset-10 decoration-2 decoration-foreground"
          inactiveClassName="text-muted-foreground hover:text-foreground"
        />
      ))}
    </nav>
  );
}
