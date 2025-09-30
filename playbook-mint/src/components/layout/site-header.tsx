import Link from "next/link";
import Image from "next/image";

const navigation = [
  { href: "/articles", label: "Articles" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/newsletter", label: "Newsletter" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-100/60 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-ink-900">
          <Image
            src="/thrifty-logo-no-text.svg"
            alt="The Thrifty Pigeon logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="font-heading text-lg">The Thrifty Pigeon</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-600 sm:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 transition hover:bg-brand-50 hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/playbooks"
          className="hidden rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-ink-800 sm:inline-flex"
        >
          Browse playbooks
        </Link>
      </div>
    </header>
  );
}
