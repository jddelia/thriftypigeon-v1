import { cache } from "react";
import readingTime from "reading-time";
import { z } from "zod";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { readClient } from "@/lib/sanity/client";
import { ARTICLE_LIST_QUERY, ARTICLE_QUERY, ARTICLE_SLUGS_QUERY } from "@/lib/sanity/queries";

const sanityImageSchema: z.ZodType<SanityImageSource | null> = z
  .unknown()
  .nullable()
  .transform((value) => (value ? (value as SanityImageSource) : null));

const portableTextBlockSchema: z.ZodType<PortableTextBlock> = z
  .object({
    _key: z.string(),
    _type: z.string(),
  })
  .passthrough();

const baseArticleSchema = z.object({
  title: z.string(),
  description: z.string().default(""),
  slug: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string().nullish(),
  tags: z.array(z.string()).default([]),
  heroImage: sanityImageSchema.nullish(),
  heroImageAlt: z.string().nullish(),
  playbookSku: z.string().nullish(),
  bodyText: z.string().default(""),
});

type ArticleRecord = z.infer<typeof baseArticleSchema>;

const articleDetailSchema = baseArticleSchema.extend({
  body: z.array(portableTextBlockSchema).default([]),
});

export interface ArticleFrontmatter {
  title: string;
  description: string;
  slug: string;
  publishedAt: Date;
  updatedAt?: Date;
  tags: string[];
  heroImage: SanityImageSource | null;
  heroImageAlt?: string | null;
  playbookSku?: string;
  readingMinutes: number;
}

export interface ArticleDetail extends ArticleFrontmatter {
  body: PortableTextBlock[];
}

function mapArticle(record: ArticleRecord): ArticleFrontmatter {
  const publishedAt = new Date(record.publishedAt);
  const updatedAt = record.updatedAt ? new Date(record.updatedAt) : undefined;
  const readingStats = readingTime(record.bodyText || "");
  const readingMinutes = Math.max(1, Math.round(readingStats.minutes));

  const heroImageAlt =
    record.heroImageAlt ??
    (record.heroImage && typeof (record.heroImage as { alt?: unknown }).alt === "string"
      ? ((record.heroImage as { alt?: string }).alt ?? null)
      : null);

  return {
    title: record.title,
    description: record.description,
    slug: record.slug,
    publishedAt,
    updatedAt,
    tags: record.tags ?? [],
    heroImage: record.heroImage ?? null,
    heroImageAlt,
    playbookSku: record.playbookSku ?? undefined,
    readingMinutes,
  } satisfies ArticleFrontmatter;
}

export const getArticleBySlug = cache(async (slug: string): Promise<ArticleDetail> => {
  const result = await readClient.fetch(ARTICLE_QUERY, { slug });
  const parsed = articleDetailSchema.parse(result);
  const frontmatter = mapArticle(parsed);

  return {
    ...frontmatter,
    body: parsed.body,
  } satisfies ArticleDetail;
});

export const getArticleFrontmatter = cache(async (slug: string): Promise<ArticleFrontmatter> => {
  const result = await readClient.fetch(ARTICLE_QUERY, { slug });
  const parsed = articleDetailSchema.parse(result);
  return mapArticle(parsed);
});

export const listArticles = cache(async (): Promise<ArticleFrontmatter[]> => {
  const result = await readClient.fetch(ARTICLE_LIST_QUERY);
  const parsed = z.array(baseArticleSchema).parse(result ?? []);
  const articles = parsed.map(mapArticle);
  return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
});

export const listArticleSlugs = cache(async (): Promise<string[]> => {
  const result = await readClient.fetch(ARTICLE_SLUGS_QUERY);
  const parsed = z.array(z.string()).parse(result ?? []);
  return parsed;
});
