# Playbook Mint

Playbook Mint is a content-first micro-playbook platform that turns organic traffic into $5–$9 impulse purchases. The app is built with the Next.js App Router, Tailwind CSS, and MDX-based content to mirror the funnel defined in the PRD.

## Project structure

```
playbook-mint/
├── content/
│   └── articles/           # MDX articles with frontmatter metadata
├── public/
├── src/
│   ├── app/
│   │   ├── (site)/         # Marketing routes (home, articles, playbooks, etc.)
│   │   └── layout.tsx      # Root layout with font + metadata config
│   ├── components/         # UI and MDX components (CTA, cards, layout)
│   ├── data/               # Structured playbook metadata
│   └── lib/                # Content loaders, formatting utilities
└── tailwind.config.ts
```

### Content pipeline

- Articles live in `content/articles/*.mdx` with gray-matter frontmatter for SEO, tags, and playbook mapping.
- `src/lib/articles.ts` parses MDX, calculates reading time, and exposes helpers for list/detail pages.
- Custom MDX components (`CTAPlaybook`, typography overrides) are registered through `src/components/mdx/components.tsx`.

### Playbooks

Playbook metadata is currently stored in `src/data/playbooks.ts`. Each entry defines pricing, checkout URL, testimonial, and key bullets so CTAs can render consistently across the site.

## Getting started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the marketing site.

### Useful scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server with Turbopack |
| `npm run build` | Generate an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint with the Next.js TypeScript rules |

## Content authoring workflow

1. Create a new MDX file in `content/articles` using kebab-case for the filename.
2. Add frontmatter fields (`title`, `description`, `publishedAt`, `tags`, `playbookSku`).
3. Use the `<CTAPlaybook sku="..." />` component inline where the premium upgrade should appear.
4. The homepage and article index automatically surface the latest content.

## Next steps

- Integrate Lemon Squeezy overlay checkout and webhook-driven fulfillment.
- Add analytics instrumentation (Plausible + PostHog) for the content → CTA → purchase funnel.
- Wire the newsletter and contact forms to Resend + Turnstile with validation and spam protection.
