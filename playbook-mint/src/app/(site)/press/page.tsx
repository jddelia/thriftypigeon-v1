export const metadata = {
  title: "Press Kit | The Thrifty Pigeon",
  description: "Press kit, company facts, founder info, and media assets for The Thrifty Pigeon - making financial advice accessible to everyone.",
};

export default function PressPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Press Kit</p>
      <h1 className="mt-4 font-heading text-4xl font-semibold text-ink-900">Making money advice accessible to everyone</h1>
      
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-ink-900">Company Overview</h2>
          <div className="prose prose-lg mt-4 text-ink-700">
            <p>
              The Thrifty Pigeon creates practical financial guides and ready-made tools for people with real budgets. We believe money advice should work whether you're saving your first $100 or your first $10,000.
            </p>
            <p>
              Our free articles provide complete, actionable systems for building emergency funds, mastering budgeting, and earning extra income. Optional playbooks ($5-$9) include pre-built spreadsheets, calculators, and templates that save hours of setup work.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-6">
          <h3 className="text-lg font-semibold text-ink-900">Quick Facts</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">Founded</dt>
              <dd className="font-medium text-ink-900">2025</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Location</dt>
              <dd className="font-medium text-ink-900">United States</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Mission</dt>
              <dd className="font-medium text-ink-900">Accessible financial education</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Content</dt>
              <dd className="font-medium text-ink-900">Free guides + $5-$9 tools</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Audience</dt>
              <dd className="font-medium text-ink-900">Real people with real budgets</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-ink-900">What Makes Us Different</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-brand-100 bg-white p-6">
            <h3 className="font-semibold text-ink-900">Complete Free Content</h3>
            <p className="mt-2 text-sm text-ink-700">
              No paywalls, no "sign up to read the rest." Every article provides everything needed to succeed, from beginner to advanced level.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-100 bg-white p-6">
            <h3 className="font-semibold text-ink-900">Fair Pricing</h3>
            <p className="mt-2 text-sm text-ink-700">
              Ready-made tools cost $5-$9 (less than lunch). We position them as convenience, never as requirements for success.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-100 bg-white p-6">
            <h3 className="font-semibold text-ink-900">Inclusive Approach</h3>
            <p className="mt-2 text-sm text-ink-700">
              Systems that work for any income level. No assumptions about existing wealth or financial knowledge.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-100 bg-white p-6">
            <h3 className="font-semibold text-ink-900">No Fake Promises</h3>
            <p className="mt-2 text-sm text-ink-700">
              Honest expectations, realistic timelines, and transparent about what works (and what doesn't).
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-ink-900">Founder Story</h2>
        <div className="prose prose-lg mt-4 text-ink-700">
          <p>
            "I got tired of financial advice that either talked down to people or assumed they already had money to work with. Most guides are written for people who can already afford to save $1,000 a month, not someone trying to save their first $100."
          </p>
          <p>
            "The Thrifty Pigeon exists to bridge that gap—practical systems that work whether you're starting with $25 or $2,500, written in plain English without the condescending tone."
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-ink-900">Popular Content</h2>
        <div className="mt-4 space-y-4">
          <div className="border-l-4 border-brand-200 pl-4">
            <h3 className="font-semibold text-ink-900">"Emergency Fund Complete Guide"</h3>
            <p className="text-sm text-ink-700">Step-by-step system for building emergency savings, from $25 to $10,000</p>
          </div>
          <div className="border-l-4 border-brand-200 pl-4">
            <h3 className="font-semibold text-ink-900">"Budgeting for Beginners"</h3>
            <p className="text-sm text-ink-700">30-minute setup using the 3-bucket system that actually works</p>
          </div>
          <div className="border-l-4 border-brand-200 pl-4">
            <h3 className="font-semibold text-ink-900">"Save $200+ on Monthly Bills"</h3>
            <p className="text-sm text-ink-700">15 ways to cut expenses without changing your lifestyle</p>
          </div>
          <div className="border-l-4 border-brand-200 pl-4">
            <h3 className="font-semibold text-ink-900">"Simple Side Hustles"</h3>
            <p className="text-sm text-ink-700">10 income streams you can start this weekend with no special skills</p>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-brand-100 bg-brand-50/60 p-8">
        <h2 className="text-2xl font-semibold text-ink-900">Media Contact</h2>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-ink-500">Press & Media Inquiries</p>
            <p className="font-medium text-ink-900">press@thethriftypigeon.com</p>
          </div>
          <div>
            <p className="text-sm text-ink-500">Response Time</p>
            <p className="font-medium text-ink-900">Within 24 hours</p>
          </div>
          <div>
            <p className="text-sm text-ink-500">Available Assets</p>
            <p className="font-medium text-ink-900">High-res logos, founder photos, product screenshots, usage data</p>
          </div>
          <div>
            <p className="text-sm text-ink-500">Interview Availability</p>
            <p className="font-medium text-ink-900">Same-day interviews available via phone, video, or email</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-ink-500">
          For partnership inquiries, reach out to hello@thethriftypigeon.com
        </p>
      </div>
    </div>
  );
}
