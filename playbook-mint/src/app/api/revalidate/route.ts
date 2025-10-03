import { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

type SanitySlug = {
  current?: string | null;
};

interface SanityWebhookPayload {
  _type?: string;
  slug?: SanitySlug;
  draft?: { slug?: SanitySlug } | null;
  previous?: { slug?: SanitySlug } | null;
  transition?: "create" | "update" | "delete";
}

const ARTICLE_TYPE = "article";

function extractSlug(payload: SanityWebhookPayload): string | null {
  const slugCandidate =
    payload.slug?.current ||
    payload.draft?.slug?.current ||
    payload.previous?.slug?.current ||
    null;

  return typeof slugCandidate === "string" && slugCandidate.length > 0
    ? slugCandidate
    : null;
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return Response.json(
      {
        error: "Missing SANITY_REVALIDATE_SECRET environment variable",
      },
      { status: 500 },
    );
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? "";
  const body = await request.text();

  if (!isValidSignature(body, signature, secret)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: SanityWebhookPayload;

  try {
    payload = JSON.parse(body) as SanityWebhookPayload;
  } catch (error) {
    return Response.json(
      { error: "Unable to parse webhook payload", details: String(error) },
      { status: 400 },
    );
  }

  if (payload._type !== ARTICLE_TYPE) {
    return Response.json({ skipped: true, reason: "Unsupported document type" });
  }

  const slug = extractSlug(payload);

  revalidateTag("article-detail");
  revalidateTag("article-list");
  revalidateTag("article-slugs");

  const revalidatedPaths: string[] = [];

  if (slug) {
    const articlePath = `/articles/${slug}`;
    revalidatePath(articlePath);
    revalidatedPaths.push(articlePath);
  }

  revalidatePath("/articles");
  revalidatedPaths.push("/articles");

  return Response.json({
    revalidated: true,
    slug,
    transition: payload.transition,
    paths: revalidatedPaths,
  });
}
