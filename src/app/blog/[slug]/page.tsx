import { sanityFetch } from "@/sanity/lib/fetch";
import { POST_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "next-sanity";
import { components } from "@/components/blog/PortableTextComponents";
import { notFound } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { format } from "date-fns";
import { ImageIcon } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const post = await sanityFetch({
    query: POST_QUERY,
    params: { slug: params.slug },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | QuoteShack Blog`,
    description: post.excerpt || "Read this article on QuoteShack.",
  };
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const post = await sanityFetch({
    query: POST_QUERY,
    params: { slug: params.slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="mb-6 text-3xl font-bold leading-[1.15] tracking-tight text-foreground md:text-5xl">
          {post.title}
        </h1>

        <div className="mb-8 flex items-center gap-3 text-sm font-medium">
          {post.categories && post.categories.length > 0 && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {post.categories[0]}
            </span>
          )}

          <span className="mx-1 text-lg text-muted-foreground/40">|</span>

          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.image?.asset && (
                <div className="relative h-6 w-6 overflow-hidden rounded-full">
                  <Image
                    src={urlFor(post.author.image).width(48).height(48).url()}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="font-semibold text-primary">
                {post.author.name}
              </span>
            </div>
          )}

          <span className="mx-1 text-lg text-muted-foreground/40">|</span>

          <span className="text-muted-foreground">
            {format(new Date(post.publishedAt || new Date()), "MMM d, yyyy")}
          </span>
        </div>

        {/* Intro/Excerpt Placeholder */}
        {post.excerpt && (
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Hero Image */}
      <div className="relative mb-16 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted shadow-sm">
        {post.mainImage?.asset ? (
          <Image
            src={urlFor(post.mainImage).width(1200).height(600).url()}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/20">
            <ImageIcon className="h-20 w-20" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-lg prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-8 mx-auto max-w-none">
        {post.body ? (
          <PortableText value={post.body} components={components} />
        ) : (
          <p className="italic text-muted-foreground">
            No content available for this post.
          </p>
        )}
      </div>
    </article>
  );
}
