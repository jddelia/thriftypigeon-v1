export const metadata = {
  title: "Press Kit | Playbook Mint",
  description: "Press-ready assets, company facts, and contact info for Playbook Mint.",
};

export default function PressPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Press</p>
      <h1 className="mt-4 font-heading text-4xl font-semibold text-ink-900">Press kit & fast facts</h1>
      <div className="prose prose-lg mt-6 max-w-none text-ink-700">
        <p>
          Playbook Mint is a content-first micro-product brand helping motivated readers unlock instant-download playbooks. For interviews, quotes, or media assets, you can reach us at press@playbookmint.com.
        </p>
        <ul>
          <li>Founded: 2024</li>
          <li>Headquarters: Remote-first (US + Europe)</li>
          <li>Focus: SEO content → $5-$9 digital playbooks</li>
          <li>North Star: $500 monthly revenue within eight weeks</li>
        </ul>
        <p>
          Logos, product mockups, and founder bios are available upon request. We can typically accommodate same-day interviews.
        </p>
      </div>
    </div>
  );
}
