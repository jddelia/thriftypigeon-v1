export const metadata = {
  title: "About | The Thrifty Pigeon",
  description: "The story behind The Thrifty Pigeon and the micro-playbook model.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">About</p>
      <h1 className="mt-4 font-heading text-4xl font-semibold text-ink-900">Building a machine that turns helpful content into happy customers</h1>
      <div className="prose prose-lg mt-6 max-w-none text-ink-700">
        <p>
          The Thrifty Pigeon exists for motivated searchers who want answers now. We publish free, SEO-driven guides that solve real problems and offer $5-$9 extended playbooks for readers ready to execute the full system.
        </p>
        <p>
          Our team has shipped dozens of digital products, run growth at fintech startups, and consulted on high-performing funnels. The result: a repeatable playbook for attracting intent-driven traffic and converting it into instant downloads.
        </p>
        <p>
          We’re obsessed with clarity, speed, and compounding learnings. Expect frequent iteration, transparent metrics, and an inbox that always has room for customer feedback.
        </p>
      </div>
    </div>
  );
}
