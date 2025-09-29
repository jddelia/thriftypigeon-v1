export const metadata = {
  title: "Newsletter | Playbook Mint",
  description:
    "Join the Playbook Mint newsletter for field-tested tactics, best-performing articles, and subscriber-only playbook discounts.",
};

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Newsletter</p>
      <h1 className="mt-4 font-heading text-4xl font-semibold text-ink-900">Weekly funnel breakdowns + bonus playbook drops</h1>
      <p className="mt-4 text-lg text-ink-700">
        Subscribe to get deep dives on the content → CTA → checkout flow that powers Playbook Mint. Every issue includes a teardown, an optimization checklist, and early-bird pricing on new playbooks.
      </p>
      <div className="mt-10 rounded-3xl border border-brand-100 bg-brand-50/60 p-8 shadow-soft">
        <form className="flex flex-col gap-4 sm:flex-row">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            className="flex-1 rounded-full border border-brand-100 bg-white px-4 py-3 text-base text-ink-900 shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-4 text-xs text-ink-500">
          We respect your inbox. Expect one high-signal issue per week and occasional playbook launch announcements.
        </p>
      </div>
    </div>
  );
}
