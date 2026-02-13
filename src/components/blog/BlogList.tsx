"use client";

import { useState } from "react";
import { PostCard } from "./PostCard";

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

interface BlogListProps {
  initialPosts: BlogPost[];
  hasMore: boolean;
}

export function BlogList({ initialPosts, hasMore: initialHasMore }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [offset, setOffset] = useState(6);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blog/posts?offset=${offset}&limit=6`);
      const data = await response.json();

      if (data.posts) {
        setPosts((prev) => [...prev, ...data.posts]);
        setOffset((prev) => prev + 6);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      {hasMore && posts.length > 0 && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-primary px-6 py-2.5 font-medium text-primary transition-colors hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "View more"}
            {!loading && (
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
            )}
          </button>
        </div>
      )}
    </>
  );
}
