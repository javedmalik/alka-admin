"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  label: string;
};

export default function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={[
        "block rounded-xl px-4 py-3 text-sm font-medium transition",
        isActive
          ? "bg-[var(--primary)] text-white"
          : "text-[var(--foreground)] hover:bg-slate-100",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}