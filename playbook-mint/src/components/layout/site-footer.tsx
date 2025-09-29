import Link from "next/link";

const footerLinks = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/press", label: "Press Kit" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/articles", label: "Articles" },
      { href: "/playbooks", label: "Playbooks" },
      { href: "/newsletter", label: "Newsletter" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-100 bg-ink-900 text-ink-100">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 text-lg font-semibold">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-bold uppercase text-white shadow-sm">
                TP
              </span>
              <span className="font-heading text-xl text-white">The Thrifty Pigeon</span>
            </p>
            <p className="max-w-sm text-sm text-ink-200">
              Actionable playbooks for people who want to make smarter money moves without spending hours researching.
            </p>
          </div>
          <div className="grid flex-1 gap-8 sm:grid-cols-2">
            {footerLinks.map((column) => (
              <div key={column.title} className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wider text-ink-300">
                  {column.title}
                </p>
                <ul className="space-y-2 text-sm text-ink-200">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="transition hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-ink-300">
          © {new Date().getFullYear()} The Thrifty Pigeon. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
