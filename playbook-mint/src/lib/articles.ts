import fs from "node:fs/promises";
import path from "node:path";
import { cache, type ReactNode } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import { mdxComponents } from "@/components/mdx/components";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const articlesDirectory = path.join(process.cwd(), "content", "articles");

const articleFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string().optional(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  heroImage: z.string().optional(),
  heroImageAlt: z.string().optional(),
  playbookSku: z.string().optional(),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema> & {
  slug: string;
  readingMinutes: number;
};

export interface ArticleDetail extends ArticleFrontmatter {
  content: ReactNode;
}

async function loadArticleFile(slug: string) {
  const filePath = path.join(articlesDirectory, `${slug}.mdx`);
  const file = await fs.readFile(filePath, "utf8");
  return file;
}

async function parseArticle(slug: string) {
  const raw = await loadArticleFile(slug);
  const { content, data } = matter(raw);
  const stats = readingTime(content);
  const parsed = articleFrontmatterSchema.parse({ ...data, slug: data.slug ?? slug });
  const { content: mdxContent } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
      },
    },
  });

  return {
    frontmatter: {
      ...parsed,
      slug: parsed.slug ?? slug,
      readingMinutes: Math.max(1, Math.round(stats.minutes)),
    },
    content: mdxContent,
  } as const;
}

export const getArticleBySlug = cache(async (slug: string): Promise<ArticleDetail> => {
  const article = await parseArticle(slug);
  return {
    ...article.frontmatter,
    content: article.content,
  } satisfies ArticleDetail;
});

export const getArticleFrontmatter = cache(async (slug: string) => {
  const article = await parseArticle(slug);
  return article.frontmatter;
});

async function getArticleSlugs() {
  const entries = await fs.readdir(articlesDirectory, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx")).map((entry) => entry.name.replace(/\.mdx$/, ""));
}

export const listArticles = cache(async (): Promise<ArticleFrontmatter[]> => {
  const slugs = await getArticleSlugs();
  const articles = await Promise.all(slugs.map(async (slug) => getArticleFrontmatter(slug)));
  return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
});

export const listArticleSlugs = cache(async () => getArticleSlugs());
