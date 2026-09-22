import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16">
      <p className="mb-2 text-sm text-accent2">$ cat {"{requested path}"}</p>
      <p className="mb-6 text-fg">404: no such file or directory.</p>
      <Link href="/" className="text-accent hover:underline">
        cd ~
      </Link>
    </div>
  );
}
