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

## 2026-07-13 B站文稿工作流定案

用户决定采用林亦LYi风格蒸馏skill（linyi-lyi-scriptwriter，源项目workspace/20260711-linyi-lyi-distill，206份语料、v2自评78到80分），不再自建bilibili-script。接线：SYSTEM.md主工作流表、dispatch.md文稿节（三模式、自检8条为主B2为辅、素材示意红线）、T3模板重写启用、maintenance.md待建清单销项、memory同步。三条主工作流至此全部有流程权威。

## 2026-07-14 新建ui-copy-check（界面文案专业度检查skill）

用户痛点：AI产物的UI文字爱写解释性话语、不够官方。建法走挖矿加蒸馏加留出集验收：3矿工扫真实产物（课件38页、AI小秘36组件、作品集页）归纳18类特征；蒸馏成单文件skill（七类检查：解释机制上墙/教学腔/聊天腔拟人化/语域不齐/黑话泄漏/自言自语辩解/字数形态线，附五条防过矫例外）；留出集（drink-water-helper，未参与挖矿）A/B验收暴露v1三缺陷（硬线诱发字数洁癖、语域基准对叙事页失效、没写明查JS字符串），v1.1修订后烟测零过矫、检出与裁判真值重合5条加新增3条，服役。接线：dispatch设计轨审查步、ux-bug-check第6类下钻指针、checklist B1第9条（T1c同步九条口径）。副产物：drink-water-helper和AI小秘各攒一批带重写文字的可直接落地的文案修复清单。

## 2026-07-14 ui-copy-check第二轮测试收官，v1.2服役

三线测试（10个agent）：A线弹幕POC靶子选择失误（4个HTML实为抖音官方页面抓包件非项目UI），但4份报告全部正确拒审无一硬编，意外验证拒审纪律；B线04课件抓到5处「待填」占位页挂在正式翻页序列（阻断级真问题）加3处编辑器黑话泄漏，deference_ok为真（讲课上墙文字未被越界改动，仅1条标点级轻度过矫）；C线干净对照两次运行一次零误报一次2误报（alt文本、footer英文），据此v1.2微修两行（alt等辅助文本不算可见文字、整区块统一外语语域是设计）。测试就此收官：检出力、过矫、稳定性、场景边界、误报、拒审全部有数据。副产物：04课件的占位页和data-day泄漏需修，测试期间三批文案修复清单待用户排期。

## 2026-07-14 ui-copy-check走完skill-creator官方eval，用户验收通过

三用例（喝水助手审查、Memory组件审查、8条裸文案改写）各跑with/without skill，官方grader按每用例5条assertions打分：带skill 86.7%对不带73.3%，净增13个百分点。分用例：简单改写任务打平（模型裸奔就够），组件审查5/5对4/5（分水岭是人称处理：skill版去人设中性化，裸版反向强化聊天人设），全站审查3/5对2/5（skill版位置引用抽查9处全对，裸版行号错引到CSS）。用户看过审阅页后裁决：用skill整体文案风格更舒适。ui-copy-check v1.2定版。过程踩坑记录：aggregate_benchmark要求run-1子目录层级和grading.json的summary块；generate_review.py需要Python 3.10语法，已给它打from __future__ import annotations兼容补丁（本机3.9.6）。

## 2026-07-14 proposals批复合入（ux-skill两项）

用户批准20260714-ux-skill-fixes全部两项后合入：ux-reviewer的Read上限改为「10+改动文件数×3」（方法论固定读数不占配额，消除与skill流程的自相矛盾）；ux-bug-check的user-control.md新增第7条检查项（破坏性确认框须带目标唯一识别信息，附实证），SKILL.md核心视角节补「清单抓结构性抓不住情境性、用户真实反馈优先沉淀为检查项」的边界认知。提议文件按流程删除。课件占位页用户自理，三批文案修复清单缓办。

## 2026-07-14 ui-copy-check例外4口径修正（用户圈图纠正）

04课件38页六张步骤卡正文被我按「整页统一讲课语气」放行，用户圈图指出怪。病灶是no_ai_style第15条动词制造机加第17条三连排比的金句体成组出现。修正：例外4补充「teaching-voice只豁免口语和叙事节奏，不豁免金句体表演，单句成立、成组即病」。同时用户红框带出我漏报的页内术语跳脱（卡①周视图对卡④日历）。六句重写已交付。教训：例外条款的豁免范围要写到「豁免什么维度」的粒度，写成「整页归它管」就会把不该豁免的一起放走。

## 2026-07-14 Day1终审交付加skill定位规则（用户第二次校准）

Day1全44页审查交付：4审查员加裁判，确认14条（第17页一张卡占4条最集中）加3组术语问题，拦下4条过矫。用户指出报告用元素id定位（d1-s8c）他完全无法对应到放映页码，要求按页码排序定位。已重排清单（页码经38页截图交叉验证），并在ui-copy-check输出节写死硬规则：分页产物必须按用户可见页码排序定位，id和行号只作辅助，映射由审查方先算好。教训同例外4那次：产出的定位坐标系必须是用户的坐标系，不是代码的坐标系。

## 2026-07-14 第三次校准：重写环节的读出声测试（用户抓出「这是人话吗」）

Day1清单里三句重写（图省事说出来就行、从定位长出功能、一次看全）被用户点名不是人话。病根：用另一种金句体修金句体，正犯no_ai_style第15条动词制造机和第17条碎句堆叠，裁判只查了表面项没做读出声测试。修正：skill输出节点名两条硬要求（每句重写读出声测试、禁止用表演替换表演，目标是平实完整句宁可平淡）。连同五句重写自纠一并交付。今天三次校准同根：例外范围要写维度、坐标系要用用户的、重写要过嘴不过笔。

## 2026-07-14 口喷链路进入备课工作流（用户会话内拍板，走维护协议例外二直改）

背景：用户判断deck直接从项目生成时，叙事结构和取舍被AI代做，上墙字凭空创作是金句体病根。定下新链路：困惑链（人确认）→AI按困惑链展开口播稿初稿（默认文风，不用linyi）→用户口喷重讲转文字→deck从转写稿提炼。linyi结合方案讨论过，用户决定暂不用。

- live-lesson-deck/SKILL.md：五道门改六道门，新增3.5口喷转写门（过门凭据是拿到转写稿或明确跳过）；新增3.5节，核心条款是初稿只当脚手架口喷后作废、转写稿是唯一叙事源、上墙字任务从创作降级为压缩、项目降级为素材源、卡壳位置即困惑链裂缝回第3步修链；红线2补半句防止和「从转写稿提炼」相互矛盾；frontmatter触发词加口喷转写稿
- templates.md：T1引言五道门改六道门并注明口喷门在派工前应已过；T1c先读清单加转写稿（叙事源必传），项目目录改注素材源

待观察：下节课首跑，留意口喷转写和AI初稿的差异量。差异小说明口喷可降级为只重讲不顺段落。

## 2026-07-14 第3步知识点清单重构+提问大呈现（用户会话内拍板，例外二直改）

背景：用户诊断两个病。一是知识点清单这道门确认的是备料清单（倒推视图），困惑链没有自己的确认产出物，第一次成形在页序大纲，链倒过来迁就知识点，产生伪困惑链；且链推出的知识点碎片化，缺整体视角。二是成课平铺直叙，提问过程被压成一行小字，页型清单里的Q页早就有但结构层从没强制用。

- SKILL.md第3步重写：困惑链为主体逐环产出（每环是学员真实会问出口的问题），知识点挂环（挂不上就删或存疑），新增知识域完整性判断（知识点归域，站在域视角补缺、定不教清单，拿定位当尺子），清掉两条编辑残句
- confirm-formats.md知识点清单确认重写：主产出物改为困惑链逐环视图（环号+学员问题+一句话回答），挂环知识点表加「所属知识域」列变五列，新增不教清单（取舍摆出来确认），倒推视图降级可选
- SKILL.md第4步加两条：3提问大呈现（主环转折必须独立成Q页占大版面，节奏是问题页→解释页→新问题页，禁止问题缩成角落小字）；4素材从认知任务推导（优先级：真实演示>截图代码>对比图流程图>数据图表>文字卡兜底，文字卡必须配图标；素材语境优先从口喷转写稿找）
- SKILL.md第5步加第9条：文字偏多页面主动搜开源图标集（lucide/tabler）内嵌SVG，贴知识点语义，不引运行时依赖

发现：第5步被人加过一条概念视觉身份（编号顺移），本次按现状追加，未动它。
