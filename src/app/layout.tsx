import type { Metadata } from "next";
import { IBM_Plex_Mono, Public_Sans } from "next/font/google";
import Link from "next/link";

import { SiteNav } from "@/components/SiteNav";
import { Mark } from "@/components/Wordmark";

import "./globals.css";

const sans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://openroomid.org"),
  title: {
    default: "OpenRoomID",
    template: "%s | OpenRoomID",
  },
  description:
    "OpenRoomID is an open standard for roomID, a permanent public identifier for a single accommodation unit. Assignment and resolution are free.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <header className="masthead">
          <div className="shell masthead-inner">
            <Link href="/" className="brand" aria-label="OpenRoomID, home">
              <Mark height={15} />
              <span>
                <span className="brand-name">OpenRoomID</span>
                <span className="brand-line">
                  An open identifier for accommodation units
                </span>
              </span>
            </Link>
            <SiteNav />
          </div>
        </header>
        <main className="shell pb-8">{children}</main>
        <footer className="site-footer">
          <div className="shell site-footer-inner">
            <p className="footer-statement">
              <span className="font-semibold text-ink">The OpenRoomID Project</span>{" "}
              is the registrar. Assignment and resolution are free and stay
              free. The specification is licensed CC BY 4.0 and registry
              records are CC0.
            </p>
            <ul>
              <li>
                <Link href="/spec/1.0#section-7">Governance</Link>
              </li>
              <li>
                <Link href="/brand">Identity</Link>
              </li>
              <li>
                <a href="https://github.com/curtiscrimmins/openroomid">Source</a>
              </li>
              <li>
                <a href="https://github.com/curtiscrimmins/openroomid/issues">Feedback</a>
              </li>
              <li>
                <a href="mailto:registry@openroomid.org">registry@openroomid.org</a>
              </li>
            </ul>
          </div>
        </footer>
      </body>
    </html>
  );
}
