import Link from "next/link";
import { site } from "@/content/site";

const links = [
  { href: "/#projects", label: "--projects" },
  { href: "/#about", label: "--about" },
  { href: "/#connect", label: "--connect" },
];

export default function Nav() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-6 text-sm">
      <Link href="/" className="text-muted hover:text-accent">
        ~/{site.name.toLowerCase()}
        <span className="ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.15em] animate-blink bg-accent align-middle" />
      </Link>
      <nav className="flex flex-wrap gap-x-5 gap-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted transition-colors hover:text-accent"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
