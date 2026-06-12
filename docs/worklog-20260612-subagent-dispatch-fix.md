# 工作日志：调度体系提速改造（2026-06-12）

## 背景

用户卡点：走完整流程干活时间太长，PM类强交互的活不适合subagent。外部chat模型给了五点诊断，本次核对后全部属实，按其建议加自查结果一并修正。

## 根因

subagent中途没有和用户对话的通道，但product-manager、product-strategist的prompt都要求「每步等用户确认」。实际运行中每次「等确认」都触发一次重新派工，而重新派工是全新上下文从头探索，中间状态又不落盘，确认轮次越多耗时越翻倍。

## 改动清单

1. **agents/product-manager.md（重写）**：补Write工具（原来要求落盘却没有写文件能力，硬bug）；定位改为「弱交互一口气执行器」，跑完把假设集中列在产出文档末尾「待确认项」，修正意见带文件路径重派做增量修正；日期由调度方派工prompt传入，不再用PowerShell取（跨平台）
2. **agents/product-strategist.md**：一口气跑完选定方法，不再逐方法暂停，待验证假设集中列在汇总；输入模糊时直接返回说缺什么，不中途问用户
3. **agents/ui-designer.md**：补Write工具，方案落盘`docs/ui-<YYYYMMDD>-<slug>.md`，返回只给路径加待决策项摘要（原来方案只能塞返回消息，本体派writer时只好粘全文，违反自己定的「传路径不转述」原则）；另修两处chat模型没点到的同类问题：「先问用户是否建设计系统」「向用户确认延续现状还是突破」都改走待决策项机制
4. **CLAUDE.md**：「本体不写代码、不做产品判断、不审代码」与dispatch「本体直接给第一手判断」正面矛盾，改为权威只有sub_agent_dispatch.md一个
5. **rules/sub_agent_dispatch.md**：
   - 新增硬规则「强交互的活永远不派」：共创式拆解收回本体直接加载ooux-product-design / feature-breakdown skill跟用户走，本体Write落盘
   - 归口表、升级条件、完整流程顺序步骤3-5同步改写：阶段A默认本体共创，阶段B默认派PM一口气
   - strategist拆分：商业对话留本体，系统性论证加竞品查证才派
   - 行数阈值灰区消除：本体直接改/派code-writer的线统一到100行（原来<50本体改、≥100派writer，50到100无归属）
   - 新增「派PM/ui-designer时本体在prompt里传当天日期」

## 未做

- ui-designer的prompt瘦身（工程正确性底线外移成reference文件）：按建议优先级先放着，前面改完跑一阵再说

## 验证建议

拿一个「从idea到AC落盘」的真实需求跑一遍新流程，重点看：共创环节是否不再触发重新派工、PM一口气返回的待确认项质量、修正重派是否真的增量而非从头跑。

---

# 第二轮：agent层删除，方法论skill化（同日）

用户对照chat模型第二版方案拍板：agent层删干净、reviewer翻转按本体理解执行、ux-reviewer上sonnet。

## 改动清单

1. **新增 skills/product-breakdown/SKILL.md**：替代product-manager agent。阶段A/B判断、加载ooux-product-design和feature-breakdown方法论、落盘、衔接下游全部搬入。双运行模式：主线共创（默认，每步确认后追加落盘，中断不丢进度）、一口气（被派为subagent时，待确认项集中列文末）。日期从上下文取
2. **新增 skills/product-strategy/SKILL.md**：替代product-strategist agent。三套方法（商业判断/功能建议/关键路径体验）完整移植。主线执行每套方法完等确认；查证项>2个打包派general-purpose去搜，刷屏隔离在外
3. **删除 agents/product-manager.md、agents/product-strategist.md**
4. **新增 rules/ui_engineering_baseline.md**：从ui-designer抽出的工程底线清单（可访问性/触控/表单/导航/响应式/动效/图表/反馈状态），按需加载
5. **ui-designer**：底线段替换为Read指引，prompt瘦身；返回摘要限10行内
6. **ux-reviewer**：上sonnet；运行时观察改为默认复用code-writer证据（先推可见面清单再对照覆盖），只补缺口不整套重跑；检查方式栏同步改
7. **code-writer**：动手前第一条重写为「采信工作包、禁止重新全局探索」，留出口：现场不符以现场为准并标注；自测段加「证据是下游唯一运行时依据，必须覆盖全部改动可见面」；缺AC话术改指向product-breakdown skill
8. **code-reviewer**：AC文档来源引用更新；设计系统合规加baseline按需Read（顺手闭环ux-reviewer的悬空引用）
9. **dispatch**：归口表换skill路径；产品类工作执行方式整节重写（主线skill执行+一口气外派general-purpose保留并行批量能力）；完整流程9站压8站、前4站全主线；新增writer工作包模板；起服务去重（复用证据不复用进程）；code-reviewer边界默认不调但安全敏感/核心逻辑例外，ux-reviewer边界默认不派但关键路径例外、单组件小改和文案微调改为本体自检/ux-writing自扫
10. **CLAUDE.md**：「委派」改「委派与主线分工」，登记baseline文件
11. **连带修正**：feature-breakdown和ux-writing两个skill里指向已删agent的引用改为新skill名

## 后续补充

- 讨论「code-writer该不该也删」后结论：保留。AC定稿后的成块实现是全流程交互最弱、输出最重的一站，是subagent最佳适配；删掉等于把最该隔离的活拉回主线（丢上下文经济、并行能力）。补了一个缺口：「需要用户边看边调的迭代式实现，无论体量」加入本体直接改清单，并写进「强交互的活永远不派」原则，封掉「体量大但强交互」被误派writer的情况

## 与chat模型方案的差异（有意为之）

- 保留一口气外派路径（general-purpose+skill路径），不堵死并行批量拆解
- reviewer模糊翻转留例外：安全敏感/核心业务逻辑（code-reviewer）、关键路径（ux-reviewer）模糊时仍倾向调
- 起服务去重明确为复用证据，不是复用进程（subagent的服务随它结束就停）
- 采信工作包留出口：现场与工作包不符时以现场为准并标注差异
