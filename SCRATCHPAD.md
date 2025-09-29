# Playbook Mint Implementation Notes

## TODO
- [x] Review PRD requirements and define MVP scope for initial commit.
- [x] Set up Next.js 14 App Router project with Tailwind CSS and project conventions.
- [x] Establish content loading pipeline for MDX articles in `/content`.
- [x] Implement foundational layout, navigation, and CTA component.
- [x] Create sample article MDX demonstrating CTA embed and metadata.
- [x] Prepare placeholder data structures for playbooks and checkout integration points.
- [x] Add lint/test scripts to CI instructions.
- [x] Document progress and next steps.

## Decisions
- Using `next-mdx-remote` RSC utilities for MDX rendering to stay within App Router.
- Content is file-based under `/content/articles` with frontmatter for SEO and CTA mapping.
- Playbook metadata stored in TypeScript config for now; future integration with Lemon Squeezy webhooks planned.

## Questions / Follow-ups
- Determine analytics/event tracking integrations (Plausible/PostHog) in subsequent iterations.
- Checkout modal implementation with Lemon Squeezy embed pending API keys.

## Progress log
- Established baseline Next.js + Tailwind app with App Router grouping, shared layout, and custom typography.
- Implemented MDX-driven article system with CTA component injection and reading-time metadata.
- Added sample articles and playbook data to demonstrate contextual CTA placements.
- Created marketing pages (home, articles, playbooks, newsletter, about, contact, press) to reflect PRD messaging.
- Remaining: document lint/test expectations and plan analytics + checkout integrations.

