# personal-ai-os

## 做什么

个人AI操作系统的制度源仓库：把三条主工作流（备课/课件、直播答疑归档、B站文稿）加知识库、模型调度、验收标准、派工模板沉淀成任何AI工具（Claude Code、Codex、kimi code）都能执行的markdown文档。2026-07-08由Fable 5起草。

## 怎么用

- **Claude Code**：`~/.claude/CLAUDE.md`已指向本仓库的SYSTEM.md，自动生效，无需操作
- **Codex / kimi code**：会话第一条消息写「先Read ~/.claude/personal-ai-os/SYSTEM.md再开工」
- **修改制度**：见maintenance.md「修改权」一节，AI只能提议
- **判断制度是否可用**：按VERIFY.md的V1到V5跑

## 文件地图

| 文件 | 一句话 |
|------|--------|
| SYSTEM.md | 总纲：用户是谁、三条主工作流、知识库架构、模型分层、路由 |
| dispatch.md | 什么活派给哪层模型、怎么派（编码轨指向sub_agent_dispatch.md） |
| checklist.md | 人的判断节点、红线、五类产出的验收标准 |
| templates.md | 6个自包含派工模板（弱模型/跨工具可执行） |
| maintenance.md | 修改权、错误沉淀、周月维护、待建清单、5天冲刺计划 |
| VERIFY.md | 5项可判过/不过的验证方法 |
| merge-notes.md | 对既有rules的收编与变更记录 |

## 依赖

无运行依赖。飞书凭证位置：`~/.claude/rules/feishu_credentials.local.md`（明文不入库）。

## 备注

- 知识库主库定为`/Users/zrf/workspace/personal-note/obsidian-vault/`，理由见SYSTEM.md知识库一节
- bilibili-script skill待建，等用户提供3到5篇满意的文稿样本
