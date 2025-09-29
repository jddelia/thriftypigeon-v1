import Link from "next/link";
import { formatDateToLong } from "@/lib/utils";
import type { ArticleFrontmatter } from "@/lib/articles";

interface ArticleCardProps {
  article: ArticleFrontmatter;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-brand-600">{formatDateToLong(article.publishedAt)}</p>
          <h3 className="font-heading text-2xl font-semibold text-ink-900 transition group-hover:text-brand-700">
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
          </h3>
          <p className="text-sm text-ink-600">{article.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between text-sm text-ink-500">
          <span>{article.readingMinutes} min read</span>
          <Link
            href={`/articles/${article.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-brand-600 transition group-hover:text-brand-700"
          >
            Read article →
          </Link>
        </div>
      </div>
    </article>
  );
}
