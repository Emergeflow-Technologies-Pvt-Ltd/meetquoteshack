import { PortableTextComponents, PortableTextTypeComponentProps, PortableTextMarkComponentProps } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

export const components: PortableTextComponents = {
    types: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image: ({ value }: PortableTextTypeComponentProps<any>) => {
            if (!value?.asset?._ref) {
                return null
            }
            return (
                <div className="relative w-full h-96 my-8 rounded-lg overflow-hidden">
                    <Image
                        src={urlFor(value).url()}
                        alt={value.alt || 'Post image'}
                        fill
                        className="object-cover"
                    />
                </div>
            )
        },
    },
    block: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        h1: ({ children }: any) => (
            <h1 className="text-3xl font-bold mt-12 mb-6 text-foreground">{children}</h1>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        h2: ({ children }: any) => (
            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">{children}</h2>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        h3: ({ children }: any) => (
            <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">{children}</h3>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic text-lg text-muted-foreground bg-muted/20 rounded-r-lg">
                {children}
            </blockquote>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        normal: ({ children }: any) => (
            <p className="mb-6 leading-8 text-muted-foreground text-[1.05rem]">{children}</p>
        ),
    },
    marks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        link: ({ children, value }: PortableTextMarkComponentProps<any>) => {
            const rel = !value?.href?.startsWith('/') ? 'noreferrer noopener' : undefined
            const target = !value?.href?.startsWith('/') ? '_blank' : undefined
            return (
                <Link
                    href={value?.href || '#'}
                    rel={rel}
                    target={target}
                    className="text-primary underline hover:opacity-80 transition-opacity"
                >
                    {children}
                </Link>
            )
        },
    },
    list: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bullet: ({ children }: any) => (
            <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        number: ({ children }: any) => (
            <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
        ),
    },
}
