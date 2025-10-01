# The Thrifty Pigeon

The Thrifty Pigeon is a content-first micro-playbook platform that turns organic traffic into $5–$9 impulse purchases. The app is built with the Next.js App Router, Tailwind CSS, and a Sanity-backed content pipeline to mirror the funnel defined in the PRD.

## Project structure

```
playbook-mint/
├── content/
│   └── articles/           # Legacy MDX articles (kept for reference during migration)
├── public/
├── src/
│   ├── app/
│   │   ├── (site)/         # Marketing routes (home, articles, playbooks, etc.)
│   │   └── layout.tsx      # Root layout with font + metadata config
│   ├── components/         # UI components (cards, layout, Sanity Portable Text renderer)
│   ├── data/               # Structured playbook metadata
│   └── lib/                # Sanity clients, content loaders, formatting utilities
├── sanity/                 # Sanity Studio configuration and schemas
└── tailwind.config.ts
```

### Content pipeline

- Articles are authored and published through Sanity Studio (`/sanity`).
- `src/lib/articles.ts` queries Sanity with GROQ, normalizes metadata, and calculates reading time from the Portable Text body.
- `src/components/sanity/portable-text.tsx` maps Portable Text blocks to the same styled React components previously provided by MDX.

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

1. Run `npm run dev` in the `sanity` directory (or open the hosted Studio) and create a new **Article** document.
2. Fill in the required metadata (`title`, `slug`, `description`, `publishedAt`, `tags`, `heroImage`, `playbookSku`).
3. Compose the story with Portable Text blocks. Use the **CTA Playbook** block to drop in premium upsell components inline.
4. Publish the document—Next.js will fetch it from the Sanity CDN for the homepage, article index, and detail routes.

### Required environment variables

Set the following variables in your `.env.local` (and deployment environment) for the Next.js app:

```
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
SANITY_READ_TOKEN= # optional, only needed for preview/draft mode
```

## Next steps

- Integrate Lemon Squeezy overlay checkout and webhook-driven fulfillment.
- Add analytics instrumentation (Plausible + PostHog) for the content → CTA → purchase funnel.
- Wire the newsletter and contact forms to Resend + Turnstile with validation and spam protection.
