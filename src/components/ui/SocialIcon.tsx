export type SocialIconName = "mail" | "github" | "linkedin" | "instagram" | "x";

/** Stroke-style marks on a 24px grid so all five share one weight and tint. */
export default function SocialIcon({
  name,
  className = "h-4 w-4",
}: {
  name: SocialIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {name === "mail" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 7 8.5 6.5L20.5 7" />
        </>
      )}
      {name === "github" && (
        <>
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </>
      )}
      {name === "linkedin" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 10.5V16M8 8v.01M12 16v-5.5M12 13a2.5 2.5 0 0 1 5 0v3" />
        </>
      )}
      {name === "instagram" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17.5 6.5v.01" />
        </>
      )}
      {name === "x" && (
        <>
          <path d="M4 4l16 16M20 4 4 20" />
        </>
      )}
    </svg>
  );
}
