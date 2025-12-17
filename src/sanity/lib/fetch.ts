import { type QueryParams } from 'next-sanity'
import { client } from './client'

export async function sanityFetch<const QueryString extends string>({
    query,
    params = {},
    revalidate = 60,
    tags = [],
}: {
    query: QueryString
    params?: QueryParams
    revalidate?: number | false
    tags?: string[]
}) {
    return client.fetch(query, params, {
        next: {
            revalidate: tags.length ? false : revalidate,
            tags,
        },
    })
}
