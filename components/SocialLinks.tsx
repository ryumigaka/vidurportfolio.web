import { site } from "@/content/site";

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {site.social.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          title={link.todo ? `${link.label} — link not set yet` : link.label}
          className={`group flex items-center gap-2 border border-border px-3 py-2 text-sm transition-colors hover:border-accent hover:text-accent ${
            link.todo ? "opacity-50" : ""
          }`}
        >
          <span className="text-accent2">[</span>
          <span>{link.label.toLowerCase()}</span>
          <span className="text-accent2">]</span>
          {link.todo && <span className="text-xs text-accent2">todo</span>}
        </a>
      ))}
    </div>
  );
}
