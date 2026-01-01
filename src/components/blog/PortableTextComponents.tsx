import {
  PortableTextComponents,
  PortableTextTypeComponentProps,
  PortableTextMarkComponentProps,
} from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export const components: PortableTextComponents = {
  types: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: ({ value }: PortableTextTypeComponentProps<any>) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="relative my-8 h-96 w-full overflow-hidden rounded-lg">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Post image"}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  block: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h1: ({ children }: any) => (
      <h1 className="mb-6 mt-12 text-3xl font-bold text-foreground">
        {children}
      </h1>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h2: ({ children }: any) => (
      <h2 className="mb-4 mt-10 text-2xl font-bold text-foreground">
        {children}
      </h2>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h3: ({ children }: any) => (
      <h3 className="mb-3 mt-8 text-xl font-semibold text-foreground">
        {children}
      </h3>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blockquote: ({ children }: any) => (
      <blockquote className="my-8 rounded-r-lg border-l-4 border-primary bg-muted/20 py-2 pl-6 text-lg italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    normal: ({ children }: any) => (
      <p className="mb-6 text-[1.05rem] leading-8 text-muted-foreground">
        {children}
      </p>
    ),
  },
  marks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    link: ({ children, value }: PortableTextMarkComponentProps<any>) => {
      const rel = !value?.href?.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      const target = !value?.href?.startsWith("/") ? "_blank" : undefined;
      return (
        <Link
          href={value?.href || "#"}
          rel={rel}
          target={target}
          className="text-primary underline transition-opacity hover:opacity-80"
        >
          {children}
        </Link>
      );
    },
  },
  list: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bullet: ({ children }: any) => (
      <ul className="mb-4 list-disc space-y-2 pl-6">{children}</ul>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    number: ({ children }: any) => (
      <ol className="mb-4 list-decimal space-y-2 pl-6">{children}</ol>
    ),
  },
};
