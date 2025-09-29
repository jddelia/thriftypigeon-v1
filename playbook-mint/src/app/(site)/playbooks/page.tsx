import Link from "next/link";
import { listPlaybooks } from "@/data/playbooks";

export const metadata = {
  title: "Playbooks | The Thrifty Pigeon",
  description:
    "Ready-made financial tools and templates for $5-$9. Skip hours of setup work with spreadsheets, calculators, and step-by-step guides you can use immediately.",
};

export default function PlaybooksPage() {
  const playbooks = listPlaybooks();

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Playbooks</p>
        <h1 className="font-heading text-4xl font-semibold text-ink-900">Ready-made tools that save you hours of setup work</h1>
        <p className="text-lg text-ink-700">
          Skip building spreadsheets from scratch. Get proven templates, calculators, and step-by-step guides you can download and use immediately. Each toolkit costs less than lunch.
        </p>
      </div>
      <div className="mt-12 grid gap-8">
        {playbooks.map((playbook) => (
          <article
            key={playbook.sku}
            className="flex flex-col gap-6 rounded-3xl border border-brand-100 bg-brand-50/60 p-8 shadow-soft md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{playbook.title}</p>
              <h2 className="font-heading text-3xl font-semibold text-ink-900">{playbook.headline}</h2>
              <p className="text-base text-ink-700">{playbook.summary}</p>
              <ul className="grid gap-2 text-sm text-ink-700 sm:grid-cols-2">
                {playbook.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-brand-500" aria-hidden />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex w-full max-w-xs flex-col items-start gap-4 rounded-2xl bg-white p-6 shadow-soft">
              <div>
                <p className="text-sm uppercase tracking-wide text-ink-500">Ready to use</p>
                <p className="font-heading text-4xl font-semibold text-ink-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: playbook.currency,
                    maximumFractionDigits: 0,
                  }).format(playbook.price)}
                </p>
              </div>
              <Link
                href={playbook.checkoutUrl}
                className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Get the Tools
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
