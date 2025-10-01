const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION || "2025-01-01";

if (!projectId) {
  throw new Error("Missing SANITY_PROJECT_ID environment variable");
}

if (!dataset) {
  throw new Error("Missing SANITY_DATASET environment variable");
}

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
};
