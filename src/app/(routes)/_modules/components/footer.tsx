import Image from "next/image";
import Link from "next/link";

import { footerLinks } from "@/data/links";

// `new Date()` can't run while prerendering, so the year is cached instead.
async function CurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export default function Footer() {
  return (
    <div className="grid place-items-center gap-6 rounded-md bg-muted p-4 text-center sm:grid-cols-4 md:place-items-start">
      <div className="space-y-4">
        <Link
          className="flex items-center justify-center gap-2 md:justify-start"
          href="/"
        >
          <Image
            src="/assets/logo.png"
            alt=""
            width={36}
            height={36}
            className="size-6"
          />
          <span className="hidden text-base font-medium tracking-wider sm:block">
            Garment Store
          </span>
        </Link>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            &copy; <CurrentYear /> Garment Store.
          </p>
          <p>All rights reserved.</p>
        </div>
      </div>

      {footerLinks.map((section) => (
        <div key={section.title}>
          <h3 className="mb-2 font-semibold">{section.title}</h3>
          <ul className="space-y-1">
            {section.links.map((link) => (
              <li key={link.href} className="text-sm">
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
