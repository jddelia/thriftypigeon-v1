import { createClient } from "next-sanity";
import { sanityConfig } from "./config";

const stegaStudioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || process.env.SANITY_STUDIO_URL;

const readClientStegaConfig = stegaStudioUrl
  ? {
      enabled: process.env.NODE_ENV !== "production",
      studioUrl: stegaStudioUrl,
    }
  : { enabled: false };

export const readClient = createClient({
  ...sanityConfig,
  useCdn: sanityConfig.useCdn,
  stega: readClientStegaConfig,
});

export function getPreviewClient(token?: string) {
  const previewStegaConfig = stegaStudioUrl
    ? {
        enabled: true,
        studioUrl: stegaStudioUrl,
      }
    : { enabled: false };

  return createClient({
    ...sanityConfig,
    token: token || process.env.SANITY_READ_TOKEN,
    useCdn: false,
    stega: previewStegaConfig,
  });
}
