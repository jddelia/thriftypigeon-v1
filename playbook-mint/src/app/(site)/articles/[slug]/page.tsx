import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDateToLong } from "@/lib/utils";
import {
  getArticleBySlug,
  getArticleFrontmatter,
  listArticleSlugs,
} from "@/lib/articles";

export async function generateStaticParams() {
  const slugs = await listArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const article = await getArticleFrontmatter(slug).catch(() => null);

  if (!article) {
    return {
      title: "Article not found | The Thrifty Pigeon",
    };
  }

  const published = article.publishedAt.toISOString();

  return {
    title: `${article.title} | The Thrifty Pigeon`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: published,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  } satisfies Metadata;
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug).catch(() => null);

  if (!article) {
    notFound();
  }

  return (
    <article className="bg-white">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-16 sm:px-6 lg:px-0">
        <Link
          href="/articles"
          className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          ← Back to articles
        </Link>
        <header className="mt-6 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            {article.tags.join(" · ") || "The Thrifty Pigeon"}
          </p>
          <h1 className="font-heading text-4xl font-semibold text-ink-900 sm:text-5xl">
            {article.title}
          </h1>
          <p className="text-lg text-ink-700">{article.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-ink-500">
            <span>Published {formatDateToLong(article.publishedAt)}</span>
            <span aria-hidden>•</span>
            <span>{article.readingMinutes} min read</span>
          </div>
        </header>
        <div className="prose prose-lg mt-12 max-w-none text-ink-700">
          {article.content}
        </div>
      </div>
    </article>
  );
}
