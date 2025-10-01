import imageUrlBuilder from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityConfig } from "./config";

const builder: ImageUrlBuilder = imageUrlBuilder({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
});

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}
