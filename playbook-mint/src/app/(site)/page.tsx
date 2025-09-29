import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { listArticles } from "@/lib/articles";

export default async function HomePage() {
  const articles = await listArticles();
  const featured = articles.slice(0, 3);

  return (
    <div className="bg-gradient-to-b from-brand-50/60 via-white to-white">
      <section className="mx-auto max-w-content px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-brand-100 bg-brand-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
              The Thrifty Pigeon
            </span>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              Free guides that unlock $5 playbooks your future self will thank you for.
            </h1>
            <p className="max-w-xl text-lg text-ink-700">
              Read the exact checklists, scripts, and automation workflows that help motivated people hit their next money milestone. Grab the extended playbook when you’re ready to implement.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/playbooks"
                className="inline-flex items-center rounded-full bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Browse micro playbooks
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center rounded-full border border-ink-200 px-6 py-3 text-base font-semibold text-ink-700 transition hover:border-brand-200 hover:text-brand-700"
              >
                Explore all articles
              </Link>
            </div>
            <p className="text-sm text-ink-500">
              No spam. Just field-tested systems with templates, spreadsheets, and scripts.
            </p>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-xl font-semibold text-ink-900">How the funnel works</h2>
            <ol className="mt-4 space-y-4 text-sm text-ink-700">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                  1
                </span>
                <div>
                  <p className="font-semibold text-ink-800">Find the guide you need</p>
                  <p>SEO-first articles show up exactly when someone is actively looking for solutions.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                  2
                </span>
                <div>
                  <p className="font-semibold text-ink-800">See the playbook CTA in context</p>
                  <p>Inline call-to-actions showcase the extended playbook right after the highest-intent section.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                  3
                </span>
                <div>
                  <p className="font-semibold text-ink-800">Checkout in under 30 seconds</p>
                  <p>Lemon Squeezy handles payments, fulfillment, and receipts. Buyers get instant download links.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-content px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-2xl font-semibold text-ink-900">Fresh from the library</h2>
          <Link href="/articles" className="text-sm font-semibold text-brand-600 transition hover:text-brand-700">
            View all articles →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {featured.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
          {featured.length === 0 && (
            <p className="col-span-full rounded-3xl border border-dashed border-ink-200 bg-white/60 p-8 text-center text-sm text-ink-500">
              No articles published yet. Add MDX files to <code className="font-mono text-xs">/content/articles</code> to populate the homepage.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
