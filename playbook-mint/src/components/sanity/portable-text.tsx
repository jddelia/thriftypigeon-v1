import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import CTAPlaybook from "@/components/cta-playbook";
import { urlForImage } from "@/lib/sanity/image";

interface SanityPortableTextProps {
  value: PortableTextBlock[];
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-12 scroll-mt-28 font-heading text-3xl font-semibold tracking-tight text-ink-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 scroll-mt-28 font-heading text-2xl font-semibold tracking-tight text-ink-900">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand-200 bg-brand-50/60 px-6 py-4 italic text-ink-700">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="leading-relaxed text-ink-700">{children}</p>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const openInNewTab = Boolean(value?.openInNewTab);
      const target = openInNewTab ? "_blank" : undefined;
      const rel = openInNewTab ? "noopener noreferrer" : undefined;

      return (
        <Link
          href={href}
          target={target}
          rel={rel}
          className="font-semibold text-brand-600 underline-offset-4 transition hover:text-brand-700 hover:underline"
        >
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 list-disc space-y-2 pl-6 text-ink-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 list-decimal space-y-2 pl-6 text-ink-700">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value || !("asset" in value)) {
        return null;
      }

      const imageValue = value as SanityImageSource & { alt?: string };
      const url = urlForImage(imageValue).width(1200).quality(85).url();

      if (!url) {
        return null;
      }

      return (
        <div className="my-10 overflow-hidden rounded-3xl">
          <Image
            src={url}
            alt={typeof value.alt === "string" ? value.alt : ""}
            width={1200}
            height={675}
            className="h-auto w-full"
          />
        </div>
      );
    },
    ctaPlaybook: ({ value }) => {
      if (!value?.sku) {
        return null;
      }

      return (
        <div className="my-10">
          <CTAPlaybook sku={value.sku} className="mx-auto max-w-xl" />
        </div>
      );
    },
  },
};

export function SanityPortableText({ value }: SanityPortableTextProps) {
  return <PortableText value={value} components={components} />;
}
