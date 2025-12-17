import { sanityFetch } from '@/sanity/lib/fetch'
import { POST_QUERY } from '@/sanity/lib/queries'
import { PortableText } from 'next-sanity'
import { components } from '@/components/blog/PortableTextComponents'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { format } from 'date-fns'
import { ImageIcon } from 'lucide-react'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props) {
    const params = await props.params;
    const post = await sanityFetch({
        query: POST_QUERY,
        params: { slug: params.slug },
    })

    if (!post) {
        return {
            title: 'Post Not Found',
        }
    }

    return {
        title: `${post.title} | QuoteShack Blog`,
        description: post.excerpt || 'Read this article on QuoteShack.',
    }
}

export default async function BlogPostPage(props: Props) {
    const params = await props.params;
    const post = await sanityFetch({
        query: POST_QUERY,
        params: { slug: params.slug },
    })

    if (!post) {
        notFound()
    }

    return (
        <article className="container max-w-4xl py-12 md:py-16 mx-auto px-4">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.15] text-foreground">
                    {post.title}
                </h1>

                <div className="flex items-center gap-3 text-sm font-medium mb-8">
                    {post.categories && post.categories.length > 0 && (
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {post.categories[0]}
                        </span>
                    )}

                    <span className="text-muted-foreground/40 text-lg mx-1">|</span>

                    {post.author && (
                        <div className="flex items-center gap-2">
                            {post.author.image && (
                                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                    <Image
                                        src={urlFor(post.author.image).width(48).height(48).url()}
                                        alt={post.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <span className="text-primary font-semibold">
                                {post.author.name}
                            </span>
                        </div>
                    )}

                    <span className="text-muted-foreground/40 text-lg mx-1">|</span>

                    <span className="text-muted-foreground">
                        {format(new Date(post.publishedAt || new Date()), 'MMM d, yyyy')}
                    </span>
                </div>

                {/* Intro/Excerpt Placeholder */}
                {post.excerpt && (
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        {post.excerpt}
                    </p>
                )}
            </div>

            {/* Hero Image */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-16 shadow-sm bg-muted">
                {post.mainImage ? (
                    <Image
                        src={urlFor(post.mainImage).width(1200).height(600).url()}
                        alt={post.title}
                        fill
                        priority
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                        <ImageIcon className="w-20 h-20" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="prose prose-lg prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-8 max-w-none mx-auto">
                {post.body ? (
                    <PortableText value={post.body} components={components} />
                ) : (
                    <p className="text-muted-foreground italic">No content available for this post.</p>
                )}
            </div>
        </article>
    )
}
