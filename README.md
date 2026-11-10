# xzy-blog-workflow

夏正印（GeneXia）的个人博客。Next.js 15 静态站点（SSG），文章、个人资料、图片全部存放在仓库文件里，没有数据库；`pnpm build` 产出纯静态页面，可部署到任意支持 Node 的服务器或 Vercel / Cloudflare Pages。

## 环境要求

| 依赖 | 最低版本 | 用途 |
|---|---|---|
| Node.js | ≥ 20.10 | Next.js 15 运行时 |
| pnpm | ≥ 9.0 | 包依赖管理 |
| Python | ≥ 3.10 | 内核哈希校验与体检脚本 |

## 快速开始

```bash
pnpm install                      # 安装依赖
.\.agents\setup.ps1               # 生成 .env.local（macOS/Linux: bash .agents/setup.sh）
pnpm doctor                       # 换人门禁体检：残留指纹、渠道死链、图片规范
pnpm dev                          # 本地预览 http://localhost:3000
```

`.env.local` 里必须设置 `ADMIN_PASSWORD`（访问 `/admin` 的口令，留空则后台锁定），`PUBLIC_SITE_URL` 在上线时改成正式域名。

## 常用命令

| 命令 | 作用 |
|---|---|
| `pnpm dev` | 本地开发预览（热更新） |
| `pnpm build` | 生产静态构建 |
| `pnpm start` | 启动生产预览（改完内容必须先 build 再 start） |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm doctor` | 内容与素材体检门禁 |
| `pnpm test` | Vitest 单元测试 |
| `pnpm verify:public-discovery` | SEO / RSS / 路由发现校验 |
| `python tests/test_smoke.py` | 49 个内核文件哈希与槽位定义校验 |

## 内容写在哪里

| 内容 | 位置 |
|---|---|
| 博客文章 | `content/blog/<slug>/`（`index.mdx` + 1200×675 的 `cover.jpg` + 至少 2 个 `##` 标题） |
| 姓名、宣言、城市、书架、唱片、履历 | `lib/personal.ts` |
| 项目卡片 | `lib/projects.ts` |
| 相册照片 | `lib/photos.ts` 与 `public/images/photos/` |
| 联系渠道（微信 / 小红书 / 抖音 / GitHub 等） | `lib/channels.ts` |
| 头像、肖像、二维码 | `public/images/` |

字段级说明见 [`docs/SLOTS_DICTIONARY.md`](docs/SLOTS_DICTIONARY.md)；不想写代码可以打开 [`docs/slot-config-panel.html`](docs/slot-config-panel.html) 可视化配置；日常发文章与部署流程见 [`docs/DAILY_UPDATE_AND_SYNC_GUIDE.md`](docs/DAILY_UPDATE_AND_SYNC_GUIDE.md)。

## 修改红线

`app/` 与 `components/` 下的 49 个视觉内核文件由 `.kernel-lock.json` 做 SHA-256 锁定，改动会被 `python tests/test_smoke.py` 拦截；个人内容一律写进上表的 V 槽位文件。构建前跑 `pnpm doctor`，它会拦下模板残留、缺失素材与死链。

## 部署到自己的服务器

```bash
pnpm install && pnpm build       # 服务器上构建
pnpm start --port 3000           # 启动静态服务（或用 nginx 托管 .next 输出）
```

推送 `main` 分支到 GitHub 也会触发 `.github/workflows/ci.yml` 自动跑类型检查、测试与构建。

## 致谢

基于 [xh-blog-workflow](https://github.com/Dragon-01-you/xh-blog-workflow)（MIT License，作者 Dragon-01-you）构建，其视觉设计参考 Cali Castle 的 [cali.so](https://cali.so)。版权声明保留在 [`LICENSE`](LICENSE) 中。
