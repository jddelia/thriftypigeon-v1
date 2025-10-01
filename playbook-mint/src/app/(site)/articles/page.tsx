import { ArticleCard } from "@/components/article-card";
import { listArticles } from "@/lib/articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles | The Thrifty Pigeon",
  description:
    "Step-by-step money guides that actually work for real people. Build emergency funds, master budgeting, and earn extra income with systems you can start today.",
};

export default async function ArticlesIndexPage() {
  const articles = await listArticles();

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Articles</p>
        <h1 className="font-heading text-4xl font-semibold text-ink-900">Money systems that work for people with real budgets</h1>
        <p className="text-lg text-ink-700">
          No more generic advice that assumes you already have money. Get complete step-by-step systems for building wealth, saving money, and earning extra income—starting from wherever you are right now.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
        {articles.length === 0 && (
          <p className="col-span-full rounded-3xl border border-dashed border-ink-200 bg-white/60 p-8 text-center text-sm text-ink-500">
            No articles published yet. Publish your first story from Sanity Studio to populate this page.
          </p>
        )}
      </div>
    </div>
  );
}
