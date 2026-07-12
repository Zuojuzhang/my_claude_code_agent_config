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

## 2026-07-13 审计修复批次（Fable 5全面审计后，按用户逐条决定执行）

冲突类：checklist B1对齐分镜思维（B1-2按知识点取舍、B1-7页粒度按分镜，课件页时长按知识点合计2到4分钟算）；code-writer第5条接受grill-with-docs/wayfinder产物为AC等价规格；sub_agent_dispatch新增「mattpocock工程流路由」节（触发方式如实描述、大工程强制tdd、规格等价、调研统一走research），dispatch.md编码轨只留指针归一权威；code-writer删「请同时写测试」旧口子，改为「给测试路径则变绿、禁改测试」；code-writer第7条B分支（产品UI）补cn_typography中文字体补丁；T1拆三段（草模/风格样张/铺全），段间人工过门，dispatch备课节同步。
死链类：重建rules/feishu_credentials.local.md（凭证源自live-qa-archive/.env，该项目非git仓库无泄漏，脚本无明文）；webapp-testing补官方scripts/with_server.py；tdd里code-review对应物点名为code-reviewer；制度不再引用deep-research（调研统一research）。
不合理类：maintenance修改权补例外二（会话内当场确认直改留痕，proposals留给AI主动发起）；tdd加体量分级（小修复seam自确认，大工程无豁免）；git rm重复的no-ai-style skill（rules/no_ai_style.md为唯一权威）；死条目统计接WORKLOG命中留痕（checklist/maintenance/VERIFY三处闭环）。
版本：checklist/maintenance/templates/VERIFY升v1.1，dispatch升v1.2。R2（T5巡库派机械层）按用户决定暂不处理。修复后已派8个核查员对抗验证。

## 2026-07-13 修复批次的对抗核查与二轮修正

8核查员并行核查一轮修复：4簇通过，抓出2个high加7个low。二轮修正：①大工程TDD矛盾清除（删「≥1000行并行派测试subagent两段式」条款及其模板，大工程改为wayfinder拆工单后逐单红绿循环；补前提「命中写测试场景才强制，UI样式文案按性质豁免不因体量升级」）；②T1c补内容来源和素材真实化步骤，checklist新增B1-8素材真实条，堵占位成片漏洞；③grill-with-docs产物措辞修正（无spec产物，CONTEXT.md是术语表不算规格，拷问收尾必须落结论文档），code-writer全链路（第3条、第5条、输出判定、完整版模板字段）同步接受等价规格；④B1-7对齐SKILL原文（一页1到2个分镜）；⑤T1a草模构成对齐SKILL（问题行不是要点）；⑥T1b补禁止段、风格方向输入、1版或3版口径；⑦dispatch备课节「每页取舍」改「知识点取舍」；⑧「三条硬规则」标题改为如实的三加一表述；⑨全局CLAUDE.md测试节删「并行派工模板」字样。残留low不修项：WORKLOG历史条目的旧deep-research描述（日志只增不改）。

## 2026-07-13 探针发现的7处空白合入（proposals通道首用）

用户批准proposals/20260713-probe-findings.md全部7项后合入：P1全局CLAUDE.md任务清单加界面设计项加SYSTEM.md次要工作流同步（修设计轨入口断链）；P2 sub_agent_dispatch消歧（完整营销页默认派ui-designer，本体直接taste-skill限小体量）；P3课件skill分流加「先查现状」规则；P4五道门加WORKLOG门状态记账；P5文稿产出目录定为workspace/bilibili-scripts/；P6内容轨补「默认主线执行」；P7 personal-note/CLAUDE.md回写微信读书管道。提议文件按流程合入后删除。
