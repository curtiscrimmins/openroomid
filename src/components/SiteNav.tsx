"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/spec/1.0", label: "Specification" },
  { href: "/paper", label: "Paper" },
  { href: "/registry", label: "Registry" },
  { href: "/implement", label: "Implementation" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/changelog", label: "Changelog" },
];

export function SiteNav() {
  const path = usePathname();
  return (
    <nav className="site-nav" aria-label="Primary">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={path.startsWith(item.href) ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
