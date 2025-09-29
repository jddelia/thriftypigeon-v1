export const metadata = {
  title: "About | The Thrifty Pigeon",
  description: "The story behind The Thrifty Pigeon and the micro-playbook model.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">About</p>
      <h1 className="mt-4 font-heading text-4xl font-semibold text-ink-900">Money advice that doesn't make you feel broke or stupid</h1>
      <div className="prose prose-lg mt-6 max-w-none text-ink-700">
        <p>
          Hi, I'm building The Thrifty Pigeon because I got tired of financial advice that either talked down to people or assumed they already had money to work with.
        </p>
        <p>
          Whether you're saving your first $100 or your first $10,000, you deserve guides that treat you like an intelligent person who just needs practical steps—not lectures about coffee shop visits.
        </p>
        <p>
          Every article on this site gives you everything you need to succeed. No paywalls, no "sign up to read the rest," no holding back the good stuff. The playbooks ($5-$9) are just convenience tools with spreadsheets and templates ready to use. Think of them as paying someone to do the setup work so you can skip straight to implementation.
        </p>
        <p>
          I use these systems myself. When they work, I share them. When they don't, I don't. It's that simple.
        </p>
        <p>
          Questions? Email me directly. I read and respond to everything.
        </p>
      </div>
    </div>
  );
}
