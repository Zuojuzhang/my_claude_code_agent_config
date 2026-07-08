# 收编说明（2026-07-08）

新制度对既有`~/.claude/`规则体系的收编方式，用户已同意收编，本文件记录改了什么、没改什么，供回溯。

## 改了什么（只有一个文件被改）

`~/.claude/CLAUDE.md`，全部是新增，无删除：

1. 新增「个人AI操作系统」一节：内容生产类任务的入口指向SYSTEM.md
2. 「委派与主线分工」一节：原文「唯一权威是rules/sub_agent_dispatch.md」改为双轨表述，编码类权威不变，内容生产类权威是新dispatch.md
3. 「规则清单」加一行：SYSTEM.md，内容生产类任务开始前必读

改前版本备份：`~/.claude/CLAUDE.md.bak-20260708`

## 没改什么（原文继续有效）

- `rules/sub_agent_dispatch.md`：仍是编码轨唯一权威，新dispatch.md编码部分只指向它不复述
- `rules/error_log.md`：机制不变，维护协议把内容类错误也接进它的沉淀流程
- `rules/no_ai_style.md`：不变，被文稿checklist（B2组第1条）引用为硬约束
- `rules/code_rules.md`、`rules/feishu_doc_write.md`、`rules/ui_engineering_baseline.md`、`rules/design_template.md`：全部不变
- 所有已有skill：不变。live-lesson-deck和live-qa-archive被提升为两条主工作流的流程权威

## 设计决定（为什么这么收编）

- 不把新制度文件复制进`~/.claude/rules/`：两份副本必然漂移。全部原地放workspace项目里被绝对路径引用，唯一例外是CLAUDE.md本身（Claude Code只认`~/.claude/CLAUDE.md`这个位置），所以它有源文件加同步机制
- 不重写sub_agent_dispatch.md：它是编码轨的成熟规则，重写只会引入回归。新dispatch.md做总调度，编码部分委托给它
- `~/.claude`是public仓库：workspace路径的引用不影响它的公开性，凭证规则照旧

---

# 变更记录（2026-07-08晚）

制度仓库从`/Users/zrf/workspace/20260708-personal-ai-os/`迁入`~/.claude/personal-ai-os/`，用户提议，理由：制度是全局配置，和rules/是一类东西，不该放workspace沙箱。

随迁移废除的机制：上文「设计决定」里的源文件加同步方案（global-CLAUDE.md）不再存在。本目录已在`~/.claude`仓库内，`~/.claude/CLAUDE.md`直接改，无副本无漂移。`~/.claude/CLAUDE.md.bak-20260708`是收编前的原版备份，保留。

注意：`~/.claude`是public仓库，SYSTEM.md最初含用户画像细节，处理方式见下一条。

已处理（同日）：画像敏感项迁入`profile.local.md`，该文件命中gitignore已有的`*.local.md`全局排除规则，不入库。SYSTEM.md只留可公开部分加指针。
