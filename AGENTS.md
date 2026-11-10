# xzy-blog-workflow（夏正印个人博客 · AI 协作总规矩）

> **文件通俗解释**：这份 `AGENTS.md` 就是贴在工地大门口的**「AI 施工总规矩」**。不管哪个 AI 进来干活，第一眼必须先读它。

---

## Agent skills（AI 技能与目录设置）

### Issue tracker（施工小工单存放在哪）

本项目的「自动规划需求书（`spec.md`）」与「拆分后的施工小工单（`issues`）」全部作为本地中文 Markdown 文件存放在 `.scratch/<功能名>/` 文件夹下。详见 [`docs/agents/issue-tracker.md`](./docs/agents/issue-tracker.md)。

### Triage labels（工单状态标签怎么贴）

使用 5 个标准状态标签来标记每张工单的进度（待评估 `needs-triage`、缺信息 `needs-info`、AI 可直接干 `ready-for-agent`、需人工拍板 `ready-for-human`、决定不做 `wontfix`）。详见 [`docs/agents/triage-labels.md`](./docs/agents/triage-labels.md)。

### Design（视觉与交互原型标准）

所有界面与动画开发必须严格遵守 [`docs/design-language.md`](./docs/design-language.md)（**视觉原型与交互标准说明书**），写界面或检查动画时以它为准。

### Domain docs（技术拍板记录）

[`docs/adr/`](./docs/adr/) 文件夹存放所有的**「技术选型拍板备忘录（ADR）」**，改架构前先读一遍，避免推翻已经拍过板的决定。

---

## 0 内核红线与交付门禁

1. **守住红线**：绝不篡改 `.kernel-lock.json` 锁定的 49 个内核文件（`app/` 路由骨架与 `components/` 视觉动效组件），任何改动都会被 `python tests/test_smoke.py` 拦截；
2. **只改 V 槽位**：个人内容一律写在 `lib/personal.ts`、`lib/projects.ts`、`lib/photos.ts`、`lib/channels.ts`、`content/blog/` 与 `public/images/` 里；
3. **弹性渠道**：`lib/channels.ts` 中只保留真实存在的渠道，没有的平台写进 `disabledChannels`，绝不产生 `#` 死链；
4. **门禁自愈**：构建前必须执行 `pnpm run doctor`，出现红灯先修复再构建；
5. **全量闭环**：`python tests/test_smoke.py`、`pnpm typecheck`、`pnpm test`、`pnpm verify:public-discovery` 与 `pnpm build` 必须全部绿灯才算完成。
