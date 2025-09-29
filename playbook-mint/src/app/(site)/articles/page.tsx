import { ArticleCard } from "@/components/article-card";
import { listArticles } from "@/lib/articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles | The Thrifty Pigeon",
  description:
    "Free how-to guides and listicles that lead into our $5-$9 extended playbooks. Browse the latest content from The Thrifty Pigeon.",
};

export default async function ArticlesIndexPage() {
  const articles = await listArticles();

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Articles</p>
        <h1 className="font-heading text-4xl font-semibold text-ink-900">Guides that turn curiosity into confident action</h1>
        <p className="text-lg text-ink-700">
          Every article is designed to rank, resonate, and gently introduce the premium playbook. Swipe the frameworks, templates, and scripts that move people from intent to purchase.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
        {articles.length === 0 && (
          <p className="col-span-full rounded-3xl border border-dashed border-ink-200 bg-white/60 p-8 text-center text-sm text-ink-500">
            No articles published yet. Add MDX files to <code className="font-mono text-xs">/content/articles</code>.
          </p>
        )}
      </div>
    </div>
  );
}
