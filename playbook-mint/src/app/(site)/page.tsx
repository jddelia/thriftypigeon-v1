import Link from "next/link";
import Image from "next/image";
import { ArticleCard } from "@/components/article-card";
import { listArticles } from "@/lib/articles";

export default async function HomePage() {
  const articles = await listArticles();
  const featured = articles.slice(0, 3);

  return (
    <div className="bg-gradient-to-b from-brand-50/60 via-white to-white">
      <section className="mx-auto max-w-content px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center">
          {/* Logo Section - Left */}
          <div className="flex justify-center md:justify-start order-2 md:order-1">
            <Image
              src="/thrifty-logo-text.svg"
              alt="The Thrifty Pigeon"
              width={400}
              height={300}
              className="w-full max-w-sm md:max-w-md lg:max-w-md opacity-95"
              priority
            />
          </div>

          {/* Content Section - Right */}
          <div className="space-y-8 order-1 md:order-2">
            {/* Header Section */}
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-brand-100 bg-brand-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
                Financial Freedom Made Simple
              </span>
              <h1 className="font-heading text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl leading-tight">
                Money making tips that
                <span className="text-brand-600"> actually work</span>
              </h1>
            </div>

            {/* Visual Divider */}
            <div className="flex items-center space-x-4">
              <div className="h-px bg-gradient-to-r from-brand-200 to-transparent flex-grow"></div>
              <div className="w-2 h-2 bg-brand-400 rounded-full"></div>
              <div className="h-px bg-gradient-to-l from-brand-200 to-transparent flex-grow"></div>
            </div>

            {/* Value Proposition */}
            <div className="space-y-4">
              <p className="text-xl text-ink-700 font-medium">
                Step-by-step systems for any income level
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-ink-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Free complete guides</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>$5-$9 ready-made tools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Real budgets only</span>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/articles"
                  className="inline-flex items-center rounded-full bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Start Building Wealth Today
                </Link>
                <Link
                  href="/playbooks"
                  className="inline-flex items-center rounded-full border border-ink-200 px-6 py-3 text-base font-semibold text-ink-700 transition hover:border-brand-200 hover:text-brand-700 hover:shadow-sm"
                >
                  Browse Ready-Made Tools
                </Link>
              </div>

              {/* Trust Signal */}
              <div className="flex items-center space-x-2 text-sm text-ink-500">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-brand-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-brand-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-brand-400 rounded-full"></div>
                </div>
                <span className="font-semibold text-ink-700">No fluff. No fake promises.</span>
                <span>Just systems that work.</span>
              </div>
            </div>
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
              No articles published yet. Publish your first story from Sanity Studio to populate the homepage.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
