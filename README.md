# my_claude_code_agent_config

橘长的 Claude Code 全局配置仓。内容对应 `~/.claude/` 目录下的可版本化部分：规则、subagent 定义、skill 库。规则文件里的路径引用统一用 `~/.claude/...`，因此本仓需要落到 `~/.claude` 才能正常工作。

## 目录结构

| 路径 | 作用 |
|------|------|
| `CLAUDE.md` | 全局约定索引。只放「做什么用什么原则」和「何时跳过」，详细规则按需 Read 子文件 |
| `rules/` | 规则正文。`no_ai_style`（反 AI 腔，每次对话必 Read）、`error_log`（历史踩坑强制规则，必 Read）、`sub_agent_dispatch`（委派调度唯一权威）、`ui_engineering_baseline`、`design_template`、`feishu_doc_write` |
| `agents/` | subagent 定义：`code-writer` / `code-reviewer` / `ui-designer` / `ux-reviewer` |
| `skills/` | skill 库。自建（`product-breakdown` / `product-strategy` / `no-ai-style` 等）与 vendored 第三方混存 |
| `docs/` | 工作日志归档 |

## 部署到新环境

```bash
git clone <repo-url> ~/my_claude_code_agent_config
# 方式一：直接把内容铺进 ~/.claude（已有内容先备份）
rsync -a --exclude='.git' ~/my_claude_code_agent_config/ ~/.claude/
# 方式二：软链单项（按需）
ln -s ~/my_claude_code_agent_config/CLAUDE.md ~/.claude/CLAUDE.md
ln -s ~/my_claude_code_agent_config/rules    ~/.claude/rules
ln -s ~/my_claude_code_agent_config/agents   ~/.claude/agents
ln -s ~/my_claude_code_agent_config/skills   ~/.claude/skills
```

## harness 配置（不进仓，需手动落地）

`settings.json`、`hooks/`、`mcp.json` 含权限、密钥、本地路径，全部在 `.gitignore` 里，**不版本化**。仓内提供脱敏模板，新环境按下面步骤复制成真名再填值。

```bash
cp ~/.claude/settings.json.example  ~/.claude/settings.json
cp ~/.claude/.mcp.json.example      ~/.claude/.mcp.json
# 编辑两个真名文件，填入密钥/本地路径，禁止把真值写回 .example
```

- `settings.json.example`：权限 allow/deny/ask、env、SessionStart hook、statusLine 的代表性字段。字段含义以官方文档为准：https://code.claude.com/docs
- `.mcp.json.example`：MCP server 配置示例（stdio 与 http 两种）
- SessionStart hook 指向的脚本（如 `.claude/hooks/session-start.sh`）也不进仓，按 `session-start-hook` skill 在本地生成

## 约束

- 密钥、token、密码不进代码、不进 commit、不进日志。模板里凡是密钥位都用占位符
- 修改规则前先读 `CLAUDE.md` 的 preflight 章节
- 被用户指出错误时：严重错误写入 `rules/error_log.md`，一般错误写入对应项目的 CLAUDE.md
