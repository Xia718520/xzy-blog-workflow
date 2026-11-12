import type { Metadata } from 'next'
import React from 'react'

import { PixelCluster } from '~/components/pixel-cluster'
import { TypewriterText } from '~/components/typewriter-text'
import { VisitorCounter } from '~/components/visitor-counter'
import { T } from '~/lib/i18n'
import { brandConfig, experience, personalInfo } from '~/lib/personal'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export const metadata: Metadata = {
  title: `关于 | ${brandConfig.name}`,
  description: publicPageMetadata.home.zh.description,
  openGraph: {
    title: `关于 | ${brandConfig.name}`,
    description: publicPageMetadata.home.zh.description,
  },
}

const bioLines = [
  brandConfig.bio,
  `常驻 ${brandConfig.location}。`,
  '在这里公开构建：写作、项目、影像与正在发生的事。',
]

export default function AboutPage(): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-[37.5rem] space-y-10">
      <header className="enter flex items-center justify-between">
        <h1 className="page-eyebrow">
          <T zh="关于" en="About" />
        </h1>
        <PixelCluster variant={4} />
      </header>

      <section className="enter space-y-4" aria-labelledby="about-typewriter">
        <h2 id="about-typewriter" className="sr-only">
          <T zh="打字机自我介绍" en="Typewriter introduction" />
        </h2>
        <TypewriterText
          text={bioLines[0]}
          className="text-lg leading-relaxed text-balance text-[var(--foreground)]"
          speedMs={42}
        />
        <TypewriterText
          text={bioLines[1]}
          className="text-sm leading-relaxed text-[var(--muted-foreground)]"
          speedMs={28}
          delayMs={900}
        />
        <TypewriterText
          text={bioLines[2]}
          className="text-sm leading-relaxed text-[var(--muted-foreground)]"
          speedMs={28}
          delayMs={1600}
        />
      </section>

      <section className="enter hairline-top pt-6" aria-labelledby="about-identity">
        <h2 id="about-identity" className="post-related-label mb-3">
          <T zh="身份" en="Identity" />
        </h2>
        <dl className="spec-plate spec-plate-flow">
          <div>
            <dt>
              <T zh="名字" en="Name" />
            </dt>
            <dd>
              {brandConfig.name} · {brandConfig.enName}
            </dd>
          </div>
          <div>
            <dt>
              <T zh="坐标" en="Location" />
            </dt>
            <dd>{brandConfig.location}</dd>
          </div>
          <div>
            <dt>
              <T zh="联络" en="Contact" />
            </dt>
            <dd>{personalInfo.email}</dd>
          </div>
          <div>
            <dt>
              <T zh="GitHub" en="GitHub" />
            </dt>
            <dd>{personalInfo.githubUser}</dd>
          </div>
        </dl>
      </section>

      <section className="enter hairline-top pt-6" aria-labelledby="about-experience">
        <h2 id="about-experience" className="post-related-label mb-3">
          <T zh="经历" en="Experience" />
        </h2>
        <ul className="space-y-3">
          {experience.map((item) => (
            <li
              key={`${item.company}-${item.from}`}
              className="flex flex-col gap-1 rounded-md border border-[var(--border)] bg-[var(--surface-1)] px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  <T zh={item.role} en={item.roleEn} />
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  <T zh={item.company} en={item.companyEn} />
                </p>
              </div>
              <p className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--muted-foreground)]">
                {item.from}
                {item.to ? ` — ${item.to}` : ''}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="enter hairline-top flex flex-wrap items-center justify-between gap-4 pt-6">
        <VisitorCounter />
        <p className="font-mono text-[11px] text-[var(--muted-foreground)]">
          <T zh="试试右下角终端：输入 help" en="Try the terminal bottom-right: type help" />
        </p>
      </section>
    </div>
  )
}
