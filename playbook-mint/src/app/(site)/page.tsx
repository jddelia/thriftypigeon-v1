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
              Stop googling money advice that doesn't work for real people.
            </h1>
            <p className="max-w-xl text-lg text-ink-700">
              Get step-by-step systems for saving money, building emergency funds, and earning extra income—written for people starting with any income level. Read the complete strategy free, then grab the ready-made spreadsheets and templates for $5-$9.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/articles"
                className="inline-flex items-center rounded-full bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Start Building Wealth Today
              </Link>
              <Link
                href="/playbooks"
                className="inline-flex items-center rounded-full border border-ink-200 px-6 py-3 text-base font-semibold text-ink-700 transition hover:border-brand-200 hover:text-brand-700"
              >
                Browse Ready-Made Tools
              </Link>
            </div>
            <p className="text-sm text-ink-500">
              <span className="font-semibold text-ink-700">No fluff. No fake promises.</span> Just systems that work for people with real budgets.
            </p>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-xl font-semibold text-ink-900">Why this works better</h2>
            <ol className="mt-4 space-y-4 text-sm text-ink-700">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                  1
                </span>
                <div>
                  <p className="font-semibold text-ink-800">Complete strategies, not teases</p>
                  <p>Every guide gives you the full system. No "sign up for the rest" or paywall cliffs.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                  2
                </span>
                <div>
                  <p className="font-semibold text-ink-800">Start with any income level</p>
                  <p>Systems that work whether you're saving your first $100 or your first $10,000.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                  3
                </span>
                <div>
                  <p className="font-semibold text-ink-800">Skip hours of setup work</p>
                  <p>Ready-made spreadsheets, calculators, and templates for $5-$9. Less than a coffee.</p>
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
