import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { format } from "date-fns";
import { ImageIcon } from "lucide-react";

interface PostCardProps {
  post: {
    title: string;
    slug: { current: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mainImage: any;
    publishedAt: string;
    author: string;
    categories: string[];
    excerpt: string;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      {/* Image Section */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {post.mainImage?.asset ? (
          <Image
            src={urlFor(post.mainImage).width(800).height(500).url()}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/20">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h2 className="mb-3 line-clamp-2 text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h2>

        {/* Badge */}
        {post.categories && post.categories.length > 0 && (
          <div className="mb-3">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
              {post.categories[0]}
            </span>
          </div>
        )}

        {/* Excerpt */}
        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        {/* Author & Date */}
        <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-4 text-xs font-medium text-muted-foreground">
          <span className="text-foreground/80">{post.author}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>
            {format(new Date(post.publishedAt || new Date()), "MMMM d, yyyy")}
          </span>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-auto flex items-center justify-between">
          <span className="flex items-center text-sm font-bold text-primary transition-transform group-hover:translate-x-1">
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            5 min read
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
