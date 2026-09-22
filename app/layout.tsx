import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { portfolio } from "@/src/data/portfolio";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

// No `title` here on purpose: the active view owns the document title, and a
// static metadata title would be re-applied over it after hydration.
export const metadata: Metadata = {
  description: portfolio.shortBio,
};

export const viewport: Viewport = {
  themeColor: "#020403",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${mono.variable} ${display.variable}`}>
      <body className="h-[100dvh] w-screen overflow-hidden bg-void text-fg antialiased">
        {children}
      </body>
    </html>
  );
}
