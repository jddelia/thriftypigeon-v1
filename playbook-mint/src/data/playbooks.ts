import { z } from "zod";

const playbookSchema = z.object({
  sku: z.string(),
  title: z.string(),
  headline: z.string(),
  summary: z.string(),
  price: z.number(),
  currency: z.string().default("USD"),
  checkoutUrl: z.string().url(),
  bullets: z.array(z.string()).min(3),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().optional(),
  testimonial: z
    .object({
      quote: z.string(),
      attribution: z.string(),
    })
    .optional(),
});

const playbookData = [
  {
    sku: "pb-emergency-fund",
    title: "Emergency Fund Blueprint",
    headline: "Build a 90-day cash buffer in six focused weeks",
    summary:
      "A proven, step-by-step system to audit spending, automate savings, and keep your emergency fund untouchable.",
    price: 7,
    currency: "USD",
    checkoutUrl: "https://lemonsqueezy.com/demo-checkout",
    bullets: [
      "4-week sprint plan with accountability check-ins",
      "Notion + Google Sheets templates for goal tracking",
      "Email scripts for negotiating bills and refunds",
      "Automation recipes for every major bank",
    ],
    testimonial: {
      quote: "I funded $5,000 in 7 weeks without feeling deprived. The scripts alone paid for the playbook.",
      attribution: "Jamie, freelance designer",
    },
  },
] satisfies z.infer<typeof playbookSchema>[];

const playbooks = new Map(playbookData.map((item) => [item.sku, playbookSchema.parse(item)]));

export type Playbook = z.infer<typeof playbookSchema>;

export function getPlaybookBySku(sku: string) {
  return playbooks.get(sku) ?? null;
}

export function listPlaybooks(): Playbook[] {
  return Array.from(playbooks.values());
}
