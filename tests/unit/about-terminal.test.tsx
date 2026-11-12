// @vitest-environment jsdom
// @ts-expect-error React 19 act environment flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import AboutPage from '~/app/about/page'
import Template from '~/app/template'
import { MiniTerminal } from '~/components/mini-terminal'
import { TypewriterText } from '~/components/typewriter-text'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}))

describe('关于页 · 打字机 · 迷你终端', () => {
  it('关于页渲染标题、身份铭牌、经历与访客位', () => {
    const html = renderToStaticMarkup(<AboutPage />)
    expect(html).toContain('关于')
    expect(html).toContain('About')
    expect(html).toContain('身份')
    expect(html).toContain('经历')
    expect(html).toContain('spec-plate')
    expect(html).toContain('visitor-counter')
  })

  it('打字机组件初始输出空内容并带光标语义', () => {
    const html = renderToStaticMarkup(
      <TypewriterText text="你好，世界" className="tw-test" />,
    )
    expect(html).toContain('aria-live="polite"')
    // SSR 阶段尚未打字，完整文本在完成后由 aria 补充
    expect(html).not.toContain('你好，世界')
  })

  it('迷你终端渲染开关按钮', () => {
    const html = renderToStaticMarkup(<MiniTerminal />)
    expect(html).toContain('open terminal')
    expect(html).toContain('mini-terminal')
  })

  it('全站模板同时挂载子页面与迷你终端', () => {
    const html = renderToStaticMarkup(
      <Template>
        <div>page-body</div>
      </Template>,
    )
    expect(html).toContain('page-body')
    expect(html).toContain('open terminal')
  })
})
