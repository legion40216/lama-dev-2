import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/assets/logo.png"
        alt=""
        width={36}
        height={36}
        className="size-6"
        priority
      />
      <span className="text-lg font-bold tracking-tight">Garment Store</span>
    </Link>
  );
}
