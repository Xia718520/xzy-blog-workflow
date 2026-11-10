import React from 'react'

import { PostRow } from '~/components/post-row'
import type { Post } from '~/lib/content'
import { T } from '~/lib/i18n'

const MAX_FEATURED_POSTS = 5

export function WritingSection({ posts }: { posts: Post[] }) {
  const featured = posts.slice(0, MAX_FEATURED_POSTS)
  if (featured.length === 0) return null

  return (
    <section className="mt-14 space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-[var(--muted-foreground)] tracking-wider">
          02 //
        </span>
        <h2 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
          <T zh="写作" en="Writing" />
        </h2>
        <div className="h-px flex-1 bg-[var(--border)] opacity-60" />
        <a
          href="/blog"
          className="shrink-0 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-150"
        >
          <T zh="查看全部" en="View all" />
        </a>
      </div>

      <ul className="focus-list flex flex-col">
        {featured.map((post, index) => (
          <li
            key={post.slug}
            className="enter-swing"
            style={{ '--enter-delay': `${120 + index * 50}ms` } as React.CSSProperties}
          >
            <PostRow post={post} headingLevel="h3" dateStyle="short" />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default WritingSection
