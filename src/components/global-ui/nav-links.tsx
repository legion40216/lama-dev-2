"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  routeActive?: boolean;
  routeHref: string;
  routeLabel?: string;
  children?: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  newTab?: boolean;
  onClick?: () => void;
}

export default function NavLinks({
  routeActive = false,
  routeHref,
  routeLabel,
  children,
  className,
  activeClassName = "",
  inactiveClassName = "",
  newTab = false,
  onClick,
}: NavLinksProps) {
  return (
    <Link
      href={routeHref}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      onClick={onClick}
      className={cn(
        "transition-colors",
        routeActive ? activeClassName : inactiveClassName,
        className,
      )}
    >
      {children ?? routeLabel}
    </Link>
  );
}
