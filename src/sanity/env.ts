export const apiVersion =
  process.env.SANITY_STUDIO_SANITY_API_VERSION ?? "2023-10-01";

export const dataset =
  process.env.SANITY_STUDIO_SANITY_DATASET ?? "production";

export const projectId = process.env.SANITY_STUDIO_SANITY_PROJECT_ID;

if (!projectId) {
  throw new Error("Missing SANITY_STUDIO_SANITY_PROJECT_ID");
}

export const useCdn = process.env.NODE_ENV === "production"
