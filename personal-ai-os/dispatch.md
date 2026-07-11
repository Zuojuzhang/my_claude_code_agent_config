# 模型调度守则

版本：v1.1（2026-07-08建，07-11增harness分工与设计轨）

## 总原则

- 本体攥主线：意图、判断、上下文在主会话手里，执行者领的是工作包不是思考
- 派工prompt必须自包含：绝对路径、执行步骤、产出路径、自检清单，骨架见templates.md
- 执行者可能跑在Codex或kimi code里，没有Claude Code的skill机制，一律让它Read流程文档的绝对路径
- 同一消息里能并行的独立工作包一起派，不串行排队

## harness分工（Claude Code / Codex / kimi code）

- **Claude Code**：主力。全部内容生产轨、判断类工作、重要编码（线上产品的核心改动）。整套制度、skill、memory、subagent调度都长在这里
- **Codex**：编码副驾。两个用法：①跨模型审查，上线前的改动让Codex独立review Claude写的代码，同一模型审自己的代码有共同盲区，跨模型才是真独立；②并行工作包，Claude主线忙时把边界清楚的编码任务丢过去
- **kimi code**：机械层执行器。跑templates.md的T4/T5、数据抓取清洗、飞书批量读写、格式转换。会话第一句给SYSTEM.md路径，或直接贴自包含模板
- 纪律：按任务分，不按半个任务分（中途换harness上下文带不过去，交接成本比省的quota贵）；判断类活不喂机械层，改错的时间比token贵

## 编码轨

权威文件：`~/.claude/rules/sub_agent_dispatch.md`，全文有效，本文件不复述。

何时派code-writer、reviewer触发条件、reviewer循环2轮上限、测试归属、行号标注要求，全部以那份文件为准。

## 内容轨

### 备课/课件生产

流程权威：`~/.claude/skills/live-lesson-deck/SKILL.md`

分工：

- **主线设计（追问链、每页取舍）**：人加顶层模型共创，这是checklist.md里的判断节点1，不外派。产出一份大纲（每页主题加一句话内容），人确认后落盘到课件项目目录
- **大纲确认后的页面制作、排版、编辑器嵌入**：日常层照SKILL执行，派工用templates.md的T1
- **修改已有deck**（换案例、插页、删页、改文案）：日常层直接干，先读SKILL里「修改已有deck」一节识别页间耦合

停点（硬约束）：大纲没经人确认，禁止开始做页面。做完再改大纲等于全部返工。

### 直播答疑归档

流程权威：`~/.claude/skills/live-qa-archive/SKILL.md`，九步全流程。

- 整条链可交日常层甚至机械层，唯一人工步骤是第7步精炼要点（SKILL里已标注），执行者到第7步必须停下交回
- 派工用templates.md的T2，给两样：当期日期（YYYYMMDD）、归档项目目录路径

### B站视频文稿

- skill建成前（见maintenance.md待建清单）：文稿由人加顶层模型主线共创，不外派
- skill建成后：选题和核心观点人定（判断节点2），初稿日常层按T3跑，终稿必须过checklist.md的B2组

### 数据分析报告

- 流程权威：`~/.claude/skills/business-analyst`，日常层执行
- 报告结论人过目后才能给任何外部人看（判断节点3的延伸：对外的都要人点头）

### 知识库归档与巡库

- 机械层任务：微信读书落盘用T4，周巡库用T5
- 产出可机器验证（文件数、frontmatter字段、条数核对），验证方式写在模板里

## 设计轨（网页与界面的视觉工作）

### 动手阶段的审美来源（按页面类型路由）

权威在`~/.claude/rules/sub_agent_dispatch.md`「不派时怎么处理」和`~/.claude/agents/code-writer.md`第7条，本文件不复述。一句话版：营销类页面（落地页/官网/招募页/作品集）用taste-skill，中文页面配`~/.claude/rules/cn_typography.md`字体补丁；产品UI/看板/多步应用界面用frontend-design（taste-skill自我声明不覆盖这类）。

### 新营销页四步流水线

1. 定调：从`~/.claude/design-md/`（74个品牌设计体系库）挑气质接近的，拷它的DESIGN.md进项目根当锚
2. 查参：ui-ux-pro-max按产品类型查配色、字体搭配、UX守则
3. 动手：按上面的页面类型路由加载审美skill；整页新方案可先派ui-designer出方案文档
4. 审查：impeccable的audit模式过一遍，`~/.claude/rules/ui_engineering_baseline.md`当硬门槛

### 纪律

- 「动手」类设计skill一个任务只一个主导，指名调用，不靠自动触发碰运气
- 「参考」类（design-md品牌库、ui-ux-pro-max数据库）可叠加使用，它们只供信息不抢方向盘

## 什么活不派（留主线）

- 强交互的活：边看边调的课件调优、逐步确认的需求拆解、逐题讨论的答疑答案。subagent中途没有和用户对话的通道
- 单文件小改、纯文案微调
- 需要全局语境的快速判断
- 本体已经读过相关文件的活（派出去等于让执行者重读一遍）

编码轨的量化阈值（500行、10文件等）见sub_agent_dispatch.md，内容轨同理类推：产出会刷屏的、能和别的活并行的才派。

## 跨工具执行注意

- Codex/kimi code执行者收到模板后，第一步永远是Read列出的文件，禁止凭记忆执行
- 飞书凭证只给位置（`~/.claude/rules/feishu_credentials.local.md`），明文永不进prompt（教训见`~/.claude/rules/error_log.md`第1条）
- Windows环境跑飞书脚本的坑（curl中文乱码、/tmp不存在）见`~/.claude/rules/feishu_doc_write.md`和error_log第5条
