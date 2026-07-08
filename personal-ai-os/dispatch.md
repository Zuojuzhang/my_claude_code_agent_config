# 模型调度守则

版本：v1.0（2026-07-08）

## 总原则

- 本体攥主线：意图、判断、上下文在主会话手里，执行者领的是工作包不是思考
- 派工prompt必须自包含：绝对路径、执行步骤、产出路径、自检清单，骨架见templates.md
- 执行者可能跑在Codex或kimi code里，没有Claude Code的skill机制，一律让它Read流程文档的绝对路径
- 同一消息里能并行的独立工作包一起派，不串行排队

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
