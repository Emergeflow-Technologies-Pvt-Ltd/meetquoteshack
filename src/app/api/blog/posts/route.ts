import { NextRequest, NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POSTS_PAGINATED_QUERY } from "@/sanity/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = parseInt(searchParams.get("limit") || "6");

    const posts = await sanityFetch({
      query: POSTS_PAGINATED_QUERY,
      params: { offset, limit },
    });

    return NextResponse.json({ posts, hasMore: posts.length === limit });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
