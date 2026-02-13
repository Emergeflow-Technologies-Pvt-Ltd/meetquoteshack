import { sanityFetch } from "@/sanity/lib/fetch";
import { POSTS_PAGINATED_QUERY } from "@/sanity/lib/queries";
import { BlogList } from "@/components/blog/BlogList";

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
    query: POSTS_PAGINATED_QUERY,
    params: { offset: 0, limit: 6 },
  });

  // Check if there are more posts by fetching one extra
  const hasMore = posts.length === 6;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-primary lg:text-4xl">
          Blogs
        </h1>
      </div>

      <BlogList initialPosts={posts} hasMore={hasMore} />
    </div>
  );
}
