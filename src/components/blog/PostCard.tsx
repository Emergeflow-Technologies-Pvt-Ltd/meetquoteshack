import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { format } from 'date-fns'
import { ImageIcon } from 'lucide-react'

interface PostCardProps {
    post: {
        title: string
        slug: { current: string }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mainImage: any
        publishedAt: string
        author: string
        categories: string[]
        excerpt: string
    }
}

export function PostCard({ post }: PostCardProps) {
    return (
        <Link href={`/blog/${post.slug.current}`} className="group flex flex-col h-full bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
            {/* Image Section */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
                {post.mainImage ? (
                    <Image
                        src={urlFor(post.mainImage).width(800).height(500).url()}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                        <ImageIcon className="w-12 h-12" />
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                {/* Title */}
                <h2 className="text-xl font-bold mb-3 leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                </h2>

                {/* Badge */}
                {post.categories && post.categories.length > 0 && (
                    <div className="mb-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold tracking-wide">
                            {post.categories[0]}
                        </span>
                    </div>
                )}

                {/* Excerpt */}
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                </p>

                {/* Author & Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-4 border-b pb-4 border-border/50">
                    <span className="text-foreground/80">{post.author}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    <span>{format(new Date(post.publishedAt || new Date()), 'MMMM d, yyyy')}</span>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between mt-auto">
                    <span className="flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                        Read More <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                        5 min read
                    </span>
                </div>
            </div>
        </Link>
    )
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
    )
}
