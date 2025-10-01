import { groq } from "next-sanity";

export const ARTICLE_QUERY = groq`
  *[_type == "article" && slug.current == $slug][0]{
    title,
    description,
    "slug": slug.current,
    publishedAt,
    updatedAt,
    tags,
    heroImage,
    heroImageAlt,
    playbookSku,
    body,
    "bodyText": pt::text(body)
  }
`;

export const ARTICLE_LIST_QUERY = groq`
  *[_type == "article" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc){
    title,
    description,
    "slug": slug.current,
    publishedAt,
    updatedAt,
    tags,
    heroImage,
    heroImageAlt,
    playbookSku,
    "bodyText": pt::text(body)
  }
`;

export const ARTICLE_SLUGS_QUERY = groq`
  *[_type == "article" && defined(slug.current)][].slug.current
`;
