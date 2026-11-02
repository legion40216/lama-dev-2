import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  eyebrow: string;
  href?: string;
  linkLabel?: string;
}

export default function SectionHeader({
  title,
  eyebrow,
  href,
  linkLabel,
}: SectionHeaderProps) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4 border-b pb-4 sm:mb-9">
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="font-serif text-3xl leading-tight">{title}</h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 pb-1 text-[11px] font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-60"
        >
          {linkLabel}
          <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
        </Link>
      )}
    </div>
  );
}
