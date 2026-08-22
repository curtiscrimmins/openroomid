import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import Link from "next/link";

import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  style: ["normal", "italic"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://openroomid.org"),
  title: {
    default: "Open Room ID",
    template: "%s | Open Room ID",
  },
  description:
    "An open standard for roomID: a permanent, publicly resolvable identifier for a single hotel accommodation unit.",
};

const NAV = [
  { href: "/spec/1.0", label: "Specification" },
  { href: "/registry", label: "Registry" },
  { href: "/implement", label: "Implement" },
  { href: "/changelog", label: "Changelog" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body>
        <header className="border-b-2 border-ink">
          <div className="mx-auto flex max-w-3xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 pb-3 pt-5">
            <Link href="/" className="site-name">
              Open Room ID
            </Link>
            <nav className="site-nav flex flex-wrap gap-x-5 gap-y-1">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <div aria-hidden className="mt-[2px] border-b border-rule" />
        <main className="mx-auto max-w-3xl px-5 pb-20 pt-9">{children}</main>
        <footer className="border-t border-rule">
          <div className="mx-auto grid max-w-3xl gap-x-10 gap-y-4 px-5 py-8 text-[0.85rem] text-muted sm:grid-cols-[1fr_auto]">
            <div>
              <p className="label-caps mb-1.5">Registrar</p>
              <p className="max-w-md">
                Administered by <a href="https://www.roomza.com">Roomza, Inc.</a>,
                228 Park Ave S, New York, NY. Identifier assignment is free and
                always will be.
              </p>
            </div>
            <div>
              <p className="label-caps mb-1.5">Documents</p>
              <ul className="space-y-1">
                <li>
                  <Link href="/spec/1.0">Specification 1.0</Link>
                </li>
                <li>
                  <Link href="/registry">Registry policy</Link>
                </li>
                <li>
                  <a href="https://github.com/curtiscrimmins/openroomid">Source</a>
                </li>
                <li>
                  <a href="mailto:curtis@roomza.com">Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
