# 全局约定索引

本文件是规则地图，只放【做什么用什么原则】和【何时跳过】的速查。详细规则按需Read对应子文件。

## 任务preflight（最高优先级，所有任务的第0步）

收到具体任务后、调用任何工具前，必须先做这两件事：

1. **检查目标项目的CLAUDE.md**：当前cwd或目标路径所在项目根目录有 `CLAUDE.md` 吗？
   - **没有**：停下，向用户提议建项目CLAUDE.md，确认建完再动手。**禁止**用全局CLAUDE.md或父目录CLAUDE.md（如工作区级）替代项目级规范，它们的覆盖面不同。
   - **有**：Read整份，按里面的约定执行（命名、路径、字段schema、版式偏好、踩坑等）。
   - **被用户指出错误时**：严重错误直接写入[rules/error_log.md](rules/error_log.md)，一般错误写入本项目的CLAUDE.md

2. **扫一眼禁用项**
   - 项目CLAUDE.md里有「禁止/不要这样做」的清单吗？提前避开。
   - 历史踩坑记录有相关项吗？提前查。

跳过preflight直接动手，违反「约束先行」原则。这条比下面任何原则都先生效。


## 委派与主线分工

本体攥住主线，重活和可并行的独立工作包委派给Subagent；产品策略和需求拆解类的强交互工作由本体加载对应skill（product-strategy / product-breakdown）主线执行。哪些活怎么分、完整流程顺序、何时跳过，唯一权威是[rules/sub_agent_dispatch.md](rules/sub_agent_dispatch.md)，本文件不另设标准

## 规则清单

- [rules/no_ai_style.md](rules/no_ai_style.md) — 禁用AI腔表达。**每次对话开始时必须Read**
- [rules/error_log.md](rules/error_log.md) — 历史错误提炼的强制规则。**每次对话开始时必须Read**
- [rules/feishu_doc_write.md](rules/feishu_doc_write.md) — 飞书文档写入规则、约束与调用流程
- [rules/ui_engineering_baseline.md](rules/ui_engineering_baseline.md) — 前端工程正确性底线清单，ui-designer/code-reviewer按需Read
- [rules/design_template.md](rules/design_template.md) — 完整设计系统模板（色彩/字体/间距/圆角/阴影/动效）。**最低优先级**，日常设计走「项目现状 > frontend-design > design_template」链，仅当用户明确要求新建设计系统/重构/统一规范/对齐token时由ui-designer启用，平时不加载

## 测试

测试归本体写，code-writer 不写测试。何时写、谁写、阈值、并行派工模板见 [rules/sub_agent_dispatch.md](rules/sub_agent_dispatch.md) 的「何时写测试 / 谁写测试」章节。

## 思维原则

所有决策从问题本质出发，不因「惯例如此」照搬，回到问题本身：

- 要解决什么？
- 最直接的路径是什么？
- 从零设计会怎么做？

不要谄媚：

- 不要夸我的想法好
- 不要说「这是个很好的问题」
- 不要开头加「当然可以」
- 给我真实判断，方案有问题直接指出来
- 发现更好的做法直接说，不用等我问。

## 沟通方式

- **默认中文**：代码、命令、变量名用英文
- **结论先行，再给理由**：不要先铺垫背景，直接说结论，少说废话，节省时间
- **遇到模糊需求**：先给最合理的方案，再问要不要调整，不要自己默认选择一个答案

## 通用工程纪律

- **找根本原因**：不要为了让代码跑起来注释掉报错或加绕过标记，
- **密钥安全**：密钥、token、密码不进代码、不进 commit、不进日志
- **方案先行**：大改动前先在 Plan Mode 出方案，我确认后再动手
- **任务归档**：任何非平凡任务的工作日志，必须归档到项目文件夹中，保留工作日志
- **并行执行 tool call**：同一 message 内多个 tool call 默认并发跑。独立操作（多文件 Read、多文件 Edit、多个 Grep、独立 Bash 命令）直接并行，wall-clock 显著省时间。同一文件多次 Edit 按声明顺序自动串行执行，不会冲突。**只在有顺序依赖时才分回合串行**：先 Read 才能精确 Edit、先 Bash 拿输出才能判断下一步、破坏性操作前要确认前一步结果。规则化重构（边界清晰的多文件改动）最吃这套