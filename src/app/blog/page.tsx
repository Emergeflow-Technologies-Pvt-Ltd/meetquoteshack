import { sanityFetch } from "@/sanity/lib/fetch";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { PostCard } from "@/components/blog/PostCard";

export const metadata = {
  title: "Blog | QuoteShack",
  description: "Latest insights and updates from QuoteShack.",
};

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mainImage: any;
  publishedAt: string;
  author: string;
  categories: string[];
  excerpt: string;
}

export default async function BlogPage() {
  const posts: BlogPost[] = await sanityFetch({
    query: POSTS_QUERY,
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-primary lg:text-4xl">
          Blogs
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
        {posts.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            No posts found. Check back later!
          </div>
        )}
      </div>

      {posts.length > 0 && (
        <div className="mt-16 flex justify-center">
          <button className="flex items-center gap-2 rounded-lg border border-primary px-6 py-2.5 font-medium text-primary transition-colors hover:bg-primary/5">
            View more
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
