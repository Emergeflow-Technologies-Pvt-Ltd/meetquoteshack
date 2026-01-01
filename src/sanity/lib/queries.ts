import { defineQuery } from "next-sanity";

export const POSTS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  mainImage,
  publishedAt,
  "author": author->name,
  "categories": categories[]->title,
  "excerpt": coalesce(excerpt, array::join(string::split((pt::text(body)), "")[0..200], "") + "...")
}`);

export const POST_QUERY =
  defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  mainImage,
  publishedAt,
  excerpt,
  body,
  "author": author->{name, image, bio},
  "categories": categories[]->title
}`);
