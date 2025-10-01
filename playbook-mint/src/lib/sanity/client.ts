import { createClient } from "next-sanity";
import { sanityConfig } from "./config";

export const readClient = createClient({
  ...sanityConfig,
  useCdn: sanityConfig.useCdn,
  stega: {
    enabled: process.env.NODE_ENV !== "production",
  },
});

export function getPreviewClient(token?: string) {
  return createClient({
    ...sanityConfig,
    token: token || process.env.SANITY_READ_TOKEN,
    useCdn: false,
    stega: {
      enabled: true,
    },
  });
}
