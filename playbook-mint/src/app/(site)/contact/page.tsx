export const metadata = {
  title: "Contact | The Thrifty Pigeon",
  description: "Questions about our money guides or playbooks? Need help with your order? Want to share your success story? We read and respond to every message.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Contact</p>
      <h1 className="mt-4 font-heading text-4xl font-semibold text-ink-900">Questions? Success stories? Just want to say hi?</h1>
      <p className="mt-4 text-lg text-ink-700">
        I personally read and respond to every message. Whether you need help with a playbook, want to share how our systems worked for you, or have suggestions for future guides, I'd love to hear from you.
      </p>
      <div className="mt-10 rounded-3xl border border-brand-100 bg-brand-50/60 p-8 shadow-soft">
        <form className="grid gap-4">
          <label className="text-sm font-medium text-ink-700" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="rounded-full border border-brand-100 bg-white px-4 py-3 text-base text-ink-900 shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="Your name"
          />
          <label className="text-sm font-medium text-ink-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-full border border-brand-100 bg-white px-4 py-3 text-base text-ink-900 shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="you@example.com"
          />
          <label className="text-sm font-medium text-ink-700" htmlFor="message">
            How can we help?
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="rounded-3xl border border-brand-100 bg-white px-4 py-3 text-base text-ink-900 shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="What's on your mind? Questions, feedback, or success stories welcome!"
          />
          <button
            type="submit"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Send message
          </button>
        </form>
        <p className="mt-4 text-xs text-ink-500">Prefer email? Reach me directly at hello@thethriftypigeon.com. I usually respond within a few hours.</p>
      </div>
    </div>
  );
}
