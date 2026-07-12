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

## 2026-07-11 测试方法论切换到mattpocock版TDD

装入mattpocock/skills的tdd skill（~/.claude/skills/tdd/，SKILL.md加tests.md加mocking.md，MIT）。旧test-driven-development skill经git rm移除（历史可恢复）。sub_agent_dispatch.md「何时写测试」重写：命中写测试场景的编码任务默认走红绿循环（原先是实现完补测试、TDD仅显式触发）；三条硬规则入库（seam先确认、垂直切片、重构归review阶段）；派writer改为「本体先写seam测试，writer让测试变绿且不许改测试」；并行测试subagent模板补seam和反模式约束。写测试/不写测试的场景清单未动。

## 2026-07-11 装入mattpocock工程流骨干

用户点名grill-with-docs和wayfinder，连依赖闭包共装7个：grill-with-docs（拷问出规格加落ADR/CONTEXT.md）、wayfinder（跨会话大工程的工单地图）、grilling、domain-modeling（前两者的硬依赖）、research、prototype（wayfinder工单类型依赖）、setup-matt-pocock-skills（tracker配置向导，wayfinder的本地tracker文档在它目录里）。dispatch.md编码轨补两行路由。注意：research与已有deep-research有触发重叠，分工是仓库/文档事实核查归research、多源网络调研报告归deep-research。
