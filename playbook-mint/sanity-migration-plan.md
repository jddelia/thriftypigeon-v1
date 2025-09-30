# Sanity Migration Plan

## Objective
Replace the current MDX + Contentlayer-style filesystem workflow used for `playbook-mint` articles with a production-grade Sanity headless CMS integration while preserving (and ideally enhancing) authoring, rendering, and publishing capabilities.

## Guiding Principles
- **Parity first**: ship a Sanity-backed article experience that matches the current MDX feature set (frontmatter fields, reading time, tagging, hero images, etc.).
- **Incremental rollout**: introduce Sanity alongside the existing MDX pipeline until confidence is gained, then fully remove MDX dependencies.
- **Production hardening**: leverage Sanity best practices (structured content, GROQ queries, preview/draft support, CDN caching, image pipelines) to ensure scalability and maintainability.

## Current State Audit
1. Articles live in `/playbook-mint/content/articles/*.mdx` with frontmatter parsed in `src/lib/articles.ts` using `next-mdx-remote`, `gray-matter`, and remark/rehype plugins.
2. The frontend renders MDX through `mdxComponents` (`src/components/mdx/components.tsx`).
3. Metadata required per article: `title`, `description`, `slug`, `publishedAt`, `updatedAt`, `tags`, `heroImage`, `heroImageAlt`, optional `playbookSku`, and computed `readingMinutes`.
4. Supporting packages to be removed once migration completes: `next-mdx-remote`, `gray-matter`, `reading-time` (if replaced by Sanity content helper), `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`.

## High-Level Phases
1. **Model & Infrastructure Setup** – establish Sanity schemas, datasets, tokens, and local studio tooling.
2. **Application Integration** – wire Next.js to Sanity for both static generation and runtime previews.
3. **Content Migration** – import existing MDX content into Sanity and validate rendered output.
4. **Cutover & Cleanup** – switch the app to rely solely on Sanity, then delete MDX-specific code and dependencies.

## Detailed Plan

### Phase 1: Sanity Project & Schema Design
1. **Project provisioning**
   - Confirm the Sanity project & dataset exist (`production` dataset recommended). If not, run `npm create sanity@latest` locally and select "Use existing project" or create a new one.
   - Ensure you have an API token with `read` access for production usage and optionally a `write` token for migration scripts. Store tokens securely (1Password, env vars).
2. **Schema definition**
   - Create a `schemas/article.ts` with fields matching current frontmatter:
     ```ts
     export default defineType({
       name: "article",
       type: "document",
       title: "Article",
       fields: [
         defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
         defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (Rule) => Rule.required() }),
         defineField({ name: "description", type: "text", rows: 3 }),
         defineField({ name: "publishedAt", type: "datetime", validation: (Rule) => Rule.required() }),
         defineField({ name: "updatedAt", type: "datetime" }),
         defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
         defineField({ name: "heroImage", type: "image", options: { hotspot: true } }),
         defineField({ name: "heroImageAlt", type: "string" }),
         defineField({ name: "playbookSku", type: "string" }),
         defineField({
           name: "body",
           title: "Body",
           type: "array",
           of: [
             { type: "block" },
             { type: "image", options: { hotspot: true } },
             { type: "code", options: { withFilename: true } }
           ]
         })
       ]
     });
     ```
   - Create shared objects for SEO, authors, categories if future requirements warrant it.
3. **Content validation hooks**
   - Add schema-level validation (e.g., hero image alt text required when hero image is present, `publishedAt` <= `updatedAt`).
   - Configure default `orderings` for `publishedAt`.
4. **Studio configuration**
   - Initialize a Sanity Studio (either in a separate repo or within `/playbook-mint/sanity-studio`). Add desk structure for managing articles, tags, etc.

### Phase 2: Next.js Integration
1. **Dependencies**
   - Install Sanity tooling: `next-sanity`, `@sanity/client`, `@portabletext/react`, `@sanity/image-url`, and optionally `groq` (typed queries) and `sanity-plugin-asset-source-unsplash` for authors.
2. **Sanity client setup**
   - Create `src/lib/sanity/config.ts` exporting projectId, dataset, API version, CDN usage.
   - Create `src/lib/sanity/client.ts` using `createClient` from `next-sanity` with edge-friendly configuration. Provide helpers `readClient` (CDN-enabled) and `previewClient` (token based).
3. **Queries**
   - Define GROQ query modules (`src/lib/sanity/queries.ts`) for:
     - `ARTICLE_QUERY`: fetch article by slug with all fields + body + `_updatedAt` for caching.
     - `ARTICLE_LIST_QUERY`: list slugs and summary metadata.
     - `ARTICLE_PATHS_QUERY`: for SSG path generation if using `generateStaticParams`.
   - Use `zod` or `groqd` to validate query responses for type safety.
4. **Data access layer**
   - Replace `src/lib/articles.ts` with Sanity-backed implementations:
     - `getArticleBySlug` fetches via `readClient.fetch`, transforms `PortableTextBlock[]` into React nodes using `PortableText` component.
     - Compute `readingMinutes` either by reusing `reading-time` on the Portable Text plain text or by storing a `readingTime` field in Sanity (computed via a custom action or webhook).
     - Continue to expose `listArticles`/`listArticleSlugs` for page generation.
   - Introduce caching with `cache()` or Next.js `unstable_cache`, keyed by GROQ + params.
5. **Rendering components**
   - Create `src/components/sanity/PortableText.tsx` that maps block types to existing typography components (headings, code blocks, callouts). Mirror behavior from the current `mdxComponents` to preserve styling.
   - Handle embedded images via `@sanity/image-url` builder and `<Image>` component.
6. **Draft preview (optional but recommended)**
   - Implement Next.js `draftMode` support: create `/api/draft` route, configure preview secret, and use `previewClient` for preview sessions.
7. **Environment variables**
   - Document required env vars: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, `SANITY_READ_TOKEN` (for previews), `SANITY_STUDIO_URL` (if linking to studio). Add them to `.env.example` and integrate with deployment secrets (e.g., Vercel project).

### Phase 3: Content Migration
1. **Extract existing MDX metadata**
   - Write a node script (e.g., `scripts/export-mdx-to-json.ts`) that reads `/content/articles`, parses frontmatter/body, and outputs JSON objects ready for Sanity import (including slug, timestamps, tags, etc.).
2. **Transform MDX body**
   - Convert MDX markdown into Sanity Portable Text. Options:
     - Use `@portabletext/to-markdown` & remark to convert; or
     - Import markdown directly by enabling the [`markdown` block content type](https://www.sanity.io/docs/block-content-types) with `@sanity/markdown` plugin.
   - For a one-time migration, the quickest path is to import markdown into a `block` field by using `@sanity/block-tools` or the CLI `sanity dataset import --replace` with prepared NDJSON.
3. **Run the import**
   - Use `sanity dataset import ./tmp/articles.ndjson production --replace` (requires `write` token) or use the Sanity Studio to paste content manually if the volume is small.
4. **Manual QA**
   - Verify that references, headings, images, and code blocks render as expected in Studio and the preview environment. Adjust Portable Text serializers until parity is achieved.

### Phase 4: Cutover & Cleanup
1. **Feature flag rollout**
   - Optionally gate the Sanity-backed rendering behind an environment flag (`SANITY_ENABLED`). This allows quick fallback to MDX during rollout.
2. **Switch production to Sanity**
   - Update `generateStaticParams` and page components to source data exclusively from Sanity once validation is complete.
   - Re-run `next build` locally to ensure SSG works using Sanity data.
3. **Remove MDX pipeline**
   - Delete `/content/articles` directory once content lives in Sanity.
   - Remove unused components (`src/components/mdx`) and dependencies from `package.json`.
   - Update TypeScript types & lint rules accordingly.
4. **Observability & caching**
   - Configure `revalidate` timings based on publishing cadence (e.g., `export const revalidate = 60` with on-demand ISR via Sanity webhook).
   - Set up a Sanity webhook that hits `/api/revalidate` to trigger Next.js ISR after publishing.
5. **Documentation handoff**
   - Document authoring workflows (how to log into Studio, draft/publish, preview) and developer operations (how to run the Studio locally, how to manage schema changes).

## Required Inputs From You
- Confirm Sanity project ID & dataset name.
- Create API tokens: one read-only for production runtime, one with write access for local imports (optional but recommended).
- Decide where the Sanity Studio should live (inside this repo vs. managed separately).
- Approve the content model (fields, validation, optional SEO/marketing data).

## Risk & Mitigation Checklist
- **Content fidelity**: differences between Markdown and Portable Text. Mitigate by testing key articles and adjusting block serializers.
- **Build-time failures**: ensure Sanity dataset access during `next build` by setting env vars in CI/CD.
- **Performance**: use Sanity CDN (`useCdn: true`) for published content and enable caching at the Next.js data layer.
- **Availability**: configure fallback for missing slugs, handle `null` results gracefully with 404 pages.

## Success Criteria
- Articles render from Sanity with identical (or improved) layout, metadata, and SEO tags.
- Authors can create/edit/publish via Sanity Studio and preview changes before publishing.
- The codebase has no MDX/contentlayer dependencies and uses Sanity clients/queries exclusively.
- Deployment pipeline includes necessary env vars and revalidation strategy.

## Next Actions
1. Review and finalize the article schema & studio location decision.
2. Provision tokens and share them securely for integration work.
3. Begin Phase 2 implementation, starting with client setup and queries.
4. Parallelize migration script development while schema finalization is underway.
