---
name: ux-writing
description: UX文案与产品长文案审查与生成。两条主线：(A) UI微文案——按钮、错误信息、占位符、空状态、语气一致；(B) 产品长文案——落地页H1/副标题/价值主张、课程详情页、产品介绍页、用户证言、场景叙述、功能描述。被 ux-bug-check skill 在第4类文案扫描时调用，也可被 code-writer、ui-designer、product-breakdown 在涉及文案时独立调用。触发词：写按钮文案、错误提示、空状态、占位符、落地页文案、价值主张、写H1、产品介绍、课程详情页、用户证言、使用场景、功能描述、文案审查、文案改写、改AI腔、去AI味、文案有点假。
---

## 两条主线

| 主线 | 场景 | 用到的 references |
|------|------|------------------|
| A. UI微文案 | 按钮、错误信息、占位符、空状态、语气一致 | button-text / error-messages / placeholder / empty-state-copy / tone-of-voice |
| B. 产品长文案 | 落地页hero、价值主张、课程详情页、产品功能页、用户证言、场景叙述 | value-proposition / long-form-structure / testimonial / scenario-narrative + tone-of-voice |

两条主线共享一条底层原则：**用具体代替抽象，用人话代替AI腔**。

## 触发

### A 类微文案触发

- 写代码涉及UI文案（按钮、错误、占位符、空状态、提示）
- ux-reviewer 通过 ux-bug-check 扫到第4类「文案」
- 用户消息含「按钮文字/错误提示/空状态/占位符/术语统一」

### B 类长文案触发

- 写落地页/产品介绍页/课程详情页/SaaS 功能页
- 写 H1、副标题、价值主张、slogan
- 写用户证言、案例研究、推荐语
- 写真实使用场景叙述
- 用户消息含「落地页文案/写H1/价值主张/产品介绍/课程详情/用户证言/使用场景/功能描述/文案有点假/去AI味」

## 不做什么

- 不做品牌定位、slogan 的商业策略层（那是 product-strategy skill 的事）
- 不做 SEO 关键词优化
- 不做翻译、本地化（只在文案里避免翻译腔）
- 不做长篇内容创作（博客、白皮书、电子书）的全文写作；但博客的开头/结论/标题适用本 skill

## 共享底层原则

不管 A 还是 B，所有文案都遵守：

1. **用具体代替抽象**：数字、例子、场景、类比、引语，至少出现一种
2. **不写 AI 腔黑名单词**：赋能/打造/一站式/沉浸式/解锁/智能化/重新定义/全方位 等
3. **不写翻译腔**：让我们/您将/为您而生/不仅是X更是Y
4. **抄到竞品身上不成立**：如果改个产品名贴到竞品页面还通顺，那就是太泛
5. **语气一致**：「你」「您」全局选一种不混用

## 执行步骤

### 步骤 1：判断主线

收到任务后先判断是 A 还是 B。判断依据：

- 单条文案（一个按钮、一个错误提示）→ A
- 多段连续文案（落地页一屏、详情页板块、产品介绍一节）→ B
- 一段超过 60 字的描述 → B

### 步骤 2：加载对应 references

**A 类**：按文案类型读对应文件
- 按钮 → `references/button-text.md`
- 错误信息 → `references/error-messages.md`
- 占位符 → `references/placeholder.md`
- 空状态 → `references/empty-state-copy.md`
- 语气 → `references/tone-of-voice.md`

**B 类**：必读 + 按需读

必读（任何长文案场景都加载）：
- `references/long-form-structure.md`（段落节奏、用具体代替抽象、AI 腔黑名单）

按子场景加载：
- 写 H1/副标题/价值主张 → `references/value-proposition.md`
- 写用户证言/推荐语 → `references/testimonial.md`
- 写使用场景/功能描述 → `references/scenario-narrative.md`
- 涉及语气统一 → `references/tone-of-voice.md`

### 步骤 3：按 references 的规则执行

A 类：按反例对照表改写
B 类：按公式/三段式/五要素生成或改写

### 步骤 4：自检后输出

每个 reference 末尾有自检清单，写完文案过一遍清单再交付。

## 输出原则

- **给具体改写建议**，不只是说「需要优化」「比较抽象」
- **复用项目里已有的语气和称呼**：写新文案前先 Grep 项目里同类位置的现有文案，跟着走
- **B 类长文案**：每段至少一个具体物（数字/例子/场景/类比/引语），如果一段没有任何具体物，标出来改写
- **改写建议不引入 AI 腔**，遵守 no_ai_style 规则
- **解释为什么改**，不只是给改后版本（让用户能学到原则）

## 跟其他 skill / agent 的边界

| 场景 | 归属 |
|------|------|
| 商业判断、产品定位 | product-strategy skill |
| 功能拆解、AC 验收 | product-breakdown / feature-breakdown skill |
| UI 视觉审美（配色/排版/布局/动效/反AI套路） | ui-taste（被 ui-designer 和 code-writer 加载） |
| UI 方案文档与组件规格 | ui-designer |
| 用户视角体验审查 | ux-reviewer / ux-bug-check |
| 反 AI 腔的语言规则 | no-ai-style（本 skill 的语言层基线） |

## 语言规范

输出遵守 `~/.claude/rules/no_ai_style.md`。
