import CTAPlaybook from "@/components/cta-playbook";
import { cn } from "@/lib/utils";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  CTAPlaybook,
  a: (props) => (
    <Link
      {...props}
      className={cn(
        "font-semibold text-brand-600 underline-offset-4 transition hover:text-brand-700 hover:underline",
        props.className,
      )}
    />
  ),
  h2: (props) => (
    <h2
      {...props}
      className={cn(
        "mt-12 scroll-mt-28 text-3xl font-heading font-semibold tracking-tight text-ink-900",
        props.className,
      )}
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className={cn(
        "mt-10 scroll-mt-28 text-2xl font-heading font-semibold tracking-tight text-ink-900",
        props.className,
      )}
    />
  ),
  p: (props) => (
    <p {...props} className={cn("leading-relaxed text-ink-700", props.className)} />
  ),
  ul: (props) => (
    <ul
      {...props}
      className={cn("my-6 list-disc space-y-2 pl-6 text-ink-700", props.className)}
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className={cn("my-6 list-decimal space-y-2 pl-6 text-ink-700", props.className)}
    />
  ),
  blockquote: (props) => (
    <blockquote
      {...props}
      className={cn(
        "border-l-4 border-brand-200 bg-brand-50/60 px-6 py-4 italic text-ink-700",
        props.className,
      )}
    />
  ),
};
