# CLAUDE.md（personal-ai-os制度仓库规范）

本目录是个人AI操作系统的制度仓库，产物是制度文档本身。在本目录内工作时：

- 制度文件的修改走maintenance.md的修改权流程：AI提议写`proposals/<YYYYMMDD>-<slug>.md`，人确认后合入。例外：错别字、失效路径直接修
- 本目录在`~/.claude`仓库内，`~/.claude/CLAUDE.md`直接改，没有源副本和同步步骤
- 文件之间互引用`~/.claude/personal-ai-os/`前缀路径，改文件名前先grep全部引用
- 所有文档遵守`~/.claude/rules/no_ai_style.md`
- 有产出的会话追加WORKLOG.md

## 文件清单

SYSTEM.md（总纲）、dispatch.md（调度）、checklist.md（判断节点与验收）、templates.md（派工模板）、maintenance.md（维护协议）、VERIFY.md（验证方法）、merge-notes.md（收编与变更记录）
