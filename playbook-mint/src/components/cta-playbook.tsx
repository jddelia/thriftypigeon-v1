import { getPlaybookBySku } from "@/data/playbooks";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CTAPlaybookProps {
  sku: string;
  className?: string;
}

export default function CTAPlaybook({ sku, className }: CTAPlaybookProps) {
  const playbook = getPlaybookBySku(sku);

  if (!playbook) {
    console.warn(`CTAPlaybook: unknown playbook sku "${sku}"`);
    return null;
  }

  const priceLabel = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: playbook.currency,
    maximumFractionDigits: 0,
  }).format(playbook.price);

  return (
    <section
      className={cn(
        "not-prose mt-12 overflow-hidden rounded-3xl border border-brand-100 bg-brand-50/60 shadow-soft",
        className,
      )}
    >
      <div className="grid gap-8 p-8 md:grid-cols-[1.5fr_1fr] md:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Skip the Setup Work
          </p>
          <h3 className="font-heading text-3xl font-semibold text-ink-900">
            {playbook.title}
          </h3>
          <p className="text-lg text-ink-700">{playbook.headline}</p>
          <p className="text-base text-ink-700/90">{playbook.summary}</p>
          <ul className="grid gap-2 pt-2 text-sm text-ink-700 sm:grid-cols-2">
            {playbook.bullets.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-brand-500" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {playbook.testimonial && (
            <figure className="mt-6 rounded-2xl border border-brand-100 bg-white/70 p-4 text-sm text-ink-700 shadow-sm">
              <blockquote className="font-medium text-ink-900">“{playbook.testimonial.quote}”</blockquote>
              <figcaption className="mt-2 text-xs uppercase tracking-wide text-ink-500">
                {playbook.testimonial.attribution}
              </figcaption>
            </figure>
          )}
        </div>
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-white p-6 shadow-soft">
          <div>
            <p className="text-sm uppercase tracking-wide text-ink-500">Ready-made toolkit</p>
            <p className="font-heading text-4xl font-semibold text-ink-900">{priceLabel}</p>
          </div>
          <Link
            href={playbook.checkoutUrl}
            className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Get the Tools
          </Link>
          <p className="text-xs text-ink-500">
            Instant download. 30-day money-back guarantee. All tools ready to use.
          </p>
        </div>
      </div>
    </section>
  );
}
