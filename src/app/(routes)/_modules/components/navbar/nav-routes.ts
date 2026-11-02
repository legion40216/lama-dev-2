"use client";

import { usePathname } from "next/navigation";

import { navLinks } from "@/data/links";

export function useNavRoutes() {
  const pathname = usePathname();

  return navLinks.map((link) => ({
    ...link,
    active:
      pathname === link.href ||
      (link.href !== "/" && pathname.startsWith(link.href + "/")),
  }));
}
