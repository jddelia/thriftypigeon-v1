import { NewsletterSignupForm } from '@/components/newsletter-signup-form';

export const metadata = {
  title: "Newsletter | The Thrifty Pigeon",
  description:
    "Get weekly money tips, new guides delivered first, and exclusive discounts on our ready-made financial tools. Free, practical advice in your inbox.",
};

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Newsletter</p>
      <h1 className="mt-4 font-heading text-4xl font-semibold text-ink-900">New money guides + exclusive discounts in your inbox</h1>
      <p className="mt-4 text-lg text-ink-700">
        Get my latest guides delivered first, practical tips you can use this week, and subscriber-only discounts on spreadsheets and templates. Plus, I share the money systems that are working best for me personally.
      </p>
      
      <div className="mt-10">
        <NewsletterSignupForm />
      </div>

      {/* Additional value props */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink-100 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-ink-900">Weekly Money Tips</h3>
              <p className="text-sm text-ink-600">Practical systems you can use this week</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl border border-ink-100 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100">
              <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-ink-900">Early Access</h3>
              <p className="text-sm text-ink-600">Get new guides before anyone else</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}