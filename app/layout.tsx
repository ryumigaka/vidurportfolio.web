import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { portfolio } from "@/src/data/portfolio";
import { DEFAULT_THEME, THEME_BOOT_SCRIPT } from "@/src/lib/theme";

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
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      className={`${mono.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored theme before first paint, so a light-mode
            visitor never sees the dark shell flash first. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="h-[100dvh] w-screen overflow-hidden bg-void text-fg antialiased">
        {children}
      </body>
    </html>
  );
}
