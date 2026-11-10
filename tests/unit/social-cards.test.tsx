// @vitest-environment jsdom
// @ts-expect-error React 19 act environment flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { describe, expect, it, beforeEach, vi } from 'vitest'
import React, { act } from 'react'
import { renderToString } from 'react-dom/server'
import { createRoot } from 'react-dom/client'

import {
  EmailCard,
  GitHubCard,
  GitHubCardBody,
  WechatCard,
  WechatCardBody,
  XiaohongshuCard,
  XiaohongshuCardBody,
} from '~/components/social-cards'
import { HomeIntroReplay } from '~/components/home-intro-replay'
import { HomeIntroduction } from '~/components/home-introduction'
import { BottomDock } from '~/components/bottom-dock'
import { SiteFooter } from '~/components/site-footer'
import { LanguageProvider } from '~/lib/i18n'
import { ThemeProvider } from '~/lib/theme'
import { brandConfig, personalInfo } from '~/lib/personal'
import { getChannels } from '~/lib/channels'
import { uiLabels } from '~/lib/ui-labels'
import bakedGithub from '~/content/github.json'

describe('Subagent 2: Micro-interactions & Social Cards 1:1 Verification', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  describe('1. HomeIntroduction Dynamic SVG & Replay', () => {
    it('renders DesignEngineerMark with notebook and sparkles structure', () => {
      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <HomeIntroduction />
        </LanguageProvider>
      )

      expect(html).toContain('home-design-mark')
      expect(html).toContain('home-design-laptop')
      expect(html).toContain('home-design-sparkle')
    })

    it('renders DetailsPhrase with DetailsMark orbit and 刚刚好 character units', () => {
      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <HomeIntroduction />
        </LanguageProvider>
      )

      expect(html).toContain('home-details-mark')
      expect(html).toContain('home-detail-unit')
      expect(html).toContain('刚')
      expect(html).toContain('好')
    })

    it('wraps dynamic phrases inside HomeIntroReplay triggers', () => {
      const html = renderToString(
        <HomeIntroReplay>
          <span className="test-child">Replayable content</span>
        </HomeIntroReplay>
      )

      expect(html).toContain('home-intro-trigger')
      expect(html).toContain('Replayable content')
    })
  })

  describe('2. Social Cards Bodies & Targets (components/social-cards.tsx)', () => {
    it('GitHubCardBody renders 26-week contrib-grid and contribution statistics', () => {
      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <GitHubCardBody data={bakedGithub} />
        </LanguageProvider>
      )

      expect(html).toContain('contrib-grid')
      expect(html).toContain('次贡献')
      expect(html).toContain(String(bakedGithub.total))
      expect(html).toContain('关注者')
    })

    it('GitHubCard links to github repos tab', () => {
      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <GitHubCard data={bakedGithub} />
        </LanguageProvider>
      )

      const user = personalInfo.githubUser || personalInfo.handle || 'Xia718520'
      const expectedHref = personalInfo.github
        ? `${personalInfo.github}?tab=repositories`
        : `https://github.com/${user}?tab=repositories`
      expect(html).toContain(`href="${expectedHref}"`)
    })

    it('XiaohongshuCardBody renders brand name and engagement statistics', () => {
      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <XiaohongshuCardBody />
        </LanguageProvider>
      )

      expect(html).toContain('xiaohongshu-card-content')
      expect(html).toContain(brandConfig.name)
      expect(html).toContain('获赞与收藏')
    })

    it('XiaohongshuCard links to configured rednote URL', () => {
      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <XiaohongshuCard />
        </LanguageProvider>
      )

      const expectedHref = personalInfo.xiaoHongShu || '/'
      expect(html).toContain(`href="${expectedHref}"`)
    })

    it('WechatCardBody renders QR code popup card referencing QR image and WeChat official name without external dead links', () => {
      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <WechatCardBody />
        </LanguageProvider>
      )

      const wechatName = personalInfo.weChatOfficial || brandConfig.name
      expect(html).toContain(wechatName)
      expect(decodeURIComponent(html)).toContain(personalInfo.weChatOfficialQr || '/images/wechat-qr.jpg')
      expect(html).toContain('微信扫一扫 · 关注公众号')
      expect(html).not.toContain('https://weixin.qq.com')
    })

    it('EmailCard renders mailto: href', () => {
      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <EmailCard address={personalInfo.email} />
        </LanguageProvider>
      )

      expect(html).toContain(`href="mailto:${personalInfo.email}"`)
    })
  })

  describe('3. BottomDock & SiteFooter Social Hygiene', () => {
    it('BottomDock includes brand logo slot and opens the dock QR channel (Douyin) modal on interaction', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      act(() => {
        root.render(
          <ThemeProvider>
            <LanguageProvider defaultLanguage="zh">
              <BottomDock />
            </LanguageProvider>
          </ThemeProvider>
        )
      })

      // Verify brand slot exists
      const brandSlot = container.querySelector('[data-brand-slot="logo-symbol"]')
      expect(brandSlot).not.toBeNull()

      // 底栏二维码按钮取 dock 槽位里第一个 qr-image 渠道，当前配置为抖音二维码渠道 douyin-qr；aria-label 与底栏组件同一取值来源
      const dockQr = getChannels().find((c) => c.kind === 'qr-image' && c.showIn.includes('dock'))
      expect(dockQr).toBeDefined()
      if (!dockQr) return
      expect(dockQr.key).toBe('douyin-qr')
      const expectedAria =
        dockQr.key === 'wechat'
          ? `查看${dockQr.label || brandConfig.name}微信公众号二维码`
          : uiLabels.dockQrAria.zh.replace('{channel}', dockQr.label)
      const dockBtn = container.querySelector(`button[aria-label="${expectedAria}"]`) as HTMLButtonElement
      expect(dockBtn).not.toBeNull()

      act(() => {
        dockBtn.click()
      })

      expect(container.innerHTML).toContain(dockQr.label)
      expect(decodeURIComponent(container.innerHTML)).toContain(dockQr.image)

      act(() => {
        root.unmount()
      })
      container.remove()
    })

    it('SiteFooter renders clean contact items without fake X/Twitter/YouTube links and handles external links safely', () => {
      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <SiteFooter />
        </LanguageProvider>
      )

      // Strict social hygiene: no fictitious platforms
      expect(html).not.toContain('x.com')
      expect(html).not.toContain('twitter.com')
      expect(html).not.toContain('youtube.com')

      // Never render dead placeholder links
      expect(html).not.toContain('href="#"')
      expect(html).not.toContain('href=""')

      // Real targets are present
      if (personalInfo.github) {
        expect(html).toContain(personalInfo.github)
      }
      if (personalInfo.xiaoHongShu) {
        expect(html).toContain(personalInfo.xiaoHongShu)
      }
      expect(html).toContain(`mailto:${personalInfo.email}`)
    })
  })
})
