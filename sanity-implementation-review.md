# Sanity Integration Review

## Current Implementation Snapshot

### Studio configuration (`playbook-mint/sanity`)
- Sanity Studio lives in `playbook-mint/sanity` with a single project configuration that targets the `qdgro20q` project and `production` dataset, and loads the default desk structure plus Vision for GROQ debugging.【F:playbook-mint/sanity/sanity.config.ts†L1-L18】
- The article document schema models all front matter fields we previously relied on in MDX: title, slug, SEO-friendly description, publish/update timestamps, tag arrays (capped at six), hero image with required alt text, optional listing alt override, a featured playbook SKU, and a rich `body` array that accepts block content, inline link annotations, images, code blocks, and a custom CTA object.【F:playbook-mint/sanity/schemaTypes/documents/article.ts†L3-L131】
- A dedicated `ctaPlaybook` object type backs the article body CTA block so authors can embed SKU-specific upsells without manual JSX edits.【F:playbook-mint/sanity/schemaTypes/objects/ctaPlaybook.ts†L3-L24】

### Application-side integration (`playbook-mint/src`)
- Runtime configuration pulls `SANITY_PROJECT_ID`, `SANITY_DATASET`, and `SANITY_API_VERSION` from environment variables at module load; missing IDs throw eagerly to prevent silent misconfiguration.【F:playbook-mint/src/lib/sanity/config.ts†L1-L18】
- `createClient` from `next-sanity` instantiates a CDN-enabled read client (with optional steganography overlays in non-production environments) and exposes a token-aware preview client, although no preview entry points consume it yet.【F:playbook-mint/src/lib/sanity/client.ts†L1-L34】
- Centralized GROQ queries provide article detail, listing, and slug lookups—including derived plain-text bodies for reading-time calculations—giving the Next.js app a single source of truth for Sanity reads.【F:playbook-mint/src/lib/sanity/queries.ts†L1-L36】
- `src/lib/articles.ts` wraps the Sanity client with Zod validation, runtime type coercion for Portable Text and images, and helpers for fetching individual articles, front matter summaries, collections, and static params; it also computes reading length from Portable Text output to preserve the existing UX badge.【F:playbook-mint/src/lib/articles.ts†L1-L111】
- Portable Text rendering mirrors our MDX typography by mapping blocks, marks, lists, CTA objects, and responsive Sanity images to the design system, ensuring Sanity-authored content slots into existing layouts.【F:playbook-mint/src/components/sanity/portable-text.tsx†L1-L104】
- Article routes (`/articles` and `/articles/[slug]`) already depend entirely on the Sanity-backed helpers for listing and rendering content, providing sensible empty states when the dataset has no published entries.【F:playbook-mint/src/app/(site)/articles/page.tsx†L1-L35】【F:playbook-mint/src/app/(site)/articles/[slug]/page.tsx†L1-L91】

### Legacy surface area still in place
- The MDX content directory (`playbook-mint/content/articles`) remains checked in, signalling that the migration is mid-flight and dual maintenance is still required until content is imported into Sanity.【F:playbook-mint/content/articles/beginner-budgeting-guide.mdx†L1-L40】

## Strengths observed
- **Parity-focused schema** – The article document captures all metadata we needed from MDX, with validation rules that enforce quality standards such as SEO-length descriptions and mandatory image alt text.【F:playbook-mint/sanity/schemaTypes/documents/article.ts†L7-L114】
- **Type-safe data access** – Zod schemas guard our Sanity responses, reducing the risk of runtime regressions as editors start creating content.【F:playbook-mint/src/lib/articles.ts†L9-L111】
- **Design-consistent rendering** – Custom Portable Text components replicate our MDX presentation layer, including CTA blocks, so we do not lose marketing hooks when switching backends.【F:playbook-mint/src/components/sanity/portable-text.tsx†L13-L104】

## Gaps & technical risks
- **Preview and drafts unimplemented** – Although a preview client helper exists, there is no draft-mode API route or middleware to surface unpublished changes, limiting editorial feedback loops.【F:playbook-mint/src/lib/sanity/client.ts†L20-L34】
- **Revalidation strategy TBD** – Static routes call `cache` wrappers but do not declare `revalidate` intervals nor webhooks, so fresh publishes will not automatically appear in production without manual cache busting.【F:playbook-mint/src/lib/articles.ts†L83-L111】
- **Environment management split** – The Studio hard-codes the project ID/dataset while the Next.js app expects env vars. Without documentation, it is easy for developers to configure one side and forget the other, or accidentally point Studio previews at the wrong dataset.【F:playbook-mint/sanity/sanity.config.ts†L6-L18】【F:playbook-mint/src/lib/sanity/config.ts†L1-L18】
- **Content migration incomplete** – Legacy MDX files are still the source of truth; until they are imported (or an automated bridge exists) the Sanity-backed frontend will surface empty states in lower environments.【F:playbook-mint/content/articles/beginner-budgeting-guide.mdx†L1-L40】【F:playbook-mint/src/app/(site)/articles/page.tsx†L23-L31】
- **Hero media unused on frontend** – Article listings/pages do not yet render the new `heroImage` field, reducing parity with the MDX experience and making it harder to validate image handling end-to-end.【F:playbook-mint/src/lib/articles.ts†L69-L80】【F:playbook-mint/src/app/(site)/articles/[slug]/page.tsx†L62-L88】
- **Playbook SKU freeform** – The CTA object enforces a SKU string but does not validate against existing playbooks or provide authoring affordances (references, dropdowns), inviting typos until additional schema is added.【F:playbook-mint/sanity/schemaTypes/objects/ctaPlaybook.ts†L7-L24】

## Recommended next steps
1. **Finish content migration** – Import existing MDX articles into Sanity (or build a bridge script) so the live site is populated during rollout; remove the filesystem content once parity is verified.【F:playbook-mint/content/articles/beginner-budgeting-guide.mdx†L1-L40】【F:playbook-mint/src/lib/articles.ts†L83-L111】
2. **Wire up preview & drafts** – Add a preview secret route, enable `draftMode`, and plumb the `getPreviewClient` into article pages so editors can QA unpublished changes safely.【F:playbook-mint/src/lib/sanity/client.ts†L20-L34】【F:playbook-mint/src/app/(site)/articles/[slug]/page.tsx†L51-L91】
3. **Define revalidation + webhooks** – Decide on ISR timing or on-demand revalidation and configure Sanity webhooks to trigger Next.js cache busting after publishes.【F:playbook-mint/src/lib/articles.ts†L83-L111】
4. **Document environment setup** – Create a shared doc (and `.env.example` entries) that lists required Sanity variables for both Studio and Next.js, and consider aligning Studio config to read from env to avoid drift.【F:playbook-mint/sanity/sanity.config.ts†L6-L18】【F:playbook-mint/src/lib/sanity/config.ts†L1-L18】
5. **Surface hero media and CTAs** – Update article and listing templates to render `heroImage` blocks and validate CTA SKU inputs (e.g., via references to a playbook document) to complete parity with the MDX presentation.【F:playbook-mint/src/lib/articles.ts†L69-L80】【F:playbook-mint/src/components/sanity/portable-text.tsx†L63-L104】
6. **Plan cleanup and dependency removal** – Once content lives in Sanity, remove unused MDX tooling/dependencies to reduce bundle size and maintenance overhead (e.g., delete `playbook-mint/content`, drop MDX packages).【F:playbook-mint/content/articles/beginner-budgeting-guide.mdx†L1-L40】【F:playbook-mint/src/lib/articles.ts†L1-L111】
