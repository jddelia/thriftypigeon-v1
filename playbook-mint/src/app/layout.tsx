import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://playbookmint.com"),
  title: {
    default: "Playbook Mint — Micro playbooks that convert readers into buyers",
    template: "%s | Playbook Mint",
  },
  description:
    "Playbook Mint turns high-intent search traffic into instant $5-$9 playbook downloads with contextual CTAs and seamless checkout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white text-ink-900">
      <body className="min-h-screen bg-white text-ink-900 antialiased">
        {children}
      </body>
    </html>
  );
}
