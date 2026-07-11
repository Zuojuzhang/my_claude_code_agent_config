# WORKLOG

## 2026-07-08 个人AI操作系统制度六件套落地

采访确认后建立本项目。关键决定：

- 收编方式：只改`~/.claude/CLAUDE.md`（纯新增），其余rules原地引用不复制，详见merge-notes.md
- 知识库主库定为`personal-note/obsidian-vault/`，维护交AI（周巡库），人只丢东西
- 投资观察模块砍掉（用户不需要，细节见profile.local.md）
- 研究方向（AI/Web3/DePIN）降级为B站文稿选题输入
- 派工模板按跨工具（Codex/kimi code）自包含设计，不依赖Claude Code的skill机制

产出：SYSTEM.md、dispatch.md、checklist.md、templates.md、maintenance.md、VERIFY.md、global-CLAUDE.md、merge-notes.md、README.md、CLAUDE.md。顺手补了缺失的`_template/README.md`（workspace的CLAUDE.md引用它但文件不存在）。

待办：bilibili-script skill等用户给3到5篇文稿样本；D3课件流程实测；D4微信读书管道实测加Concepts初建；D5按VERIFY.md验证。

## 2026-07-08 迁入~/.claude

用户提议把制度仓库从workspace迁到`~/.claude/personal-ai-os/`（制度属全局配置，放沙箱定位不对）。执行：mv整目录、全文路径改写为`~/.claude/personal-ai-os/`、删除global-CLAUDE.md并废除同步机制（本目录已和CLAUDE.md同仓库，直接改，双副本漂移风险归零）、`~/.claude/CLAUDE.md`三处引用改为仓库内相对链接。残留检查过，无旧路径引用。

## 2026-07-11 设计技能栈落地与制度v1.1

- 新装设计资产：impeccable（审查）、ui-ux-pro-max加banner-design（参数库/banner）、shadcn（组件库操作）、design-md（74品牌风格锚点库，装在~/.claude/design-md/）。ui-ux-pro-max套件另5个子skill跳过（slides会截胡live-lesson-deck，其余重复）
- 审美路由定案（用户实测偏好）：营销页taste-skill加cn_typography.md中文字体补丁（新建），产品UI用frontend-design。写入code-writer.md第7条、sub_agent_dispatch.md、重写ui-designer.md步骤二（A/B线分流）
- dispatch.md升v1.1：增harness分工（Claude主力/Codex编码第二意见/kimi机械层）、设计轨（页面类型路由加新营销页四步流水线）。SYSTEM.md模型分层表补harness归属
