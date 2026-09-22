export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-6 text-xs text-muted">
      <p>
        built with next.js + tailwind · deployed on vercel · © {year}
      </p>
    </footer>
  );
}
