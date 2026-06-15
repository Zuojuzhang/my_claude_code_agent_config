# 错误清单

以下规则从历史错误中提炼，每条都被用户反复纠正过，必须严格遵守。

### 1. 派 agent 时禁止把含明文 key 的整份 .env 塞进 prompt

**触发条件**：派 code-writer / code-reviewer 等 sub-agent 时，prompt 里需要描述 .env 改动

**错误做法**：在 prompt 里复制整份 .env 文本（包含真实 API key、token、密码）让 agent 知道现状

**根因**：sub-agent 的 prompt 会被记入会话上下文，明文 key 一旦写入相当于多了一个泄露渠道（会话记录、缓存、可能的日志）。即使 .env 本身在 .gitignore 不会进 commit，prompt 化的 .env 走的是另一条路径。

**实证**：2026-06-04 派 code-writer 接入 qwen 时把整份 .env（含 4 个厂商真实 key）塞进 prompt，code-reviewer 一眼标 critical，要求轮换全部 4 个 key。轮换代价大（断 smoke test、断生产连接），最后判 reviewer 误判不轮换，但本质是 prompt 写法本可避免。

**正确做法**：
- 只列改动行号 / 字段名 / 默认值结构（如 `LLM_PROVIDER=qwen / QWEN_MODEL=qwen3.7-plus`）
- key 字段统一用占位符 `<KEY>` 或直接省略「key 部分保留现状不变」
- 让 agent 自己 Read 文件取真实值（agent 内部 Read 的内容不会无限放大到本体上下文）
- 涉及配置切换、回滚路径时只描述结构，让 agent 看代码取细节

### 2. prompt 优化禁止用「反例对照」结构

**触发条件**：给 LLM 写或改 system prompt 时

**错误做法**：在 prompt 里写「反例：错误回答是 XXX，正确做法是 YYY」「不要这样回：xxx」之类把错误措辞具体写出来的负例

**根因**：LLM 处理负例时会把负例措辞作为高频 token 学进去当成模板，反而强化错误行为。这是著名陷阱，越是小模型越严重。

**实证**：2026-06-04 AI 小秘项目针对「信清单不信历史」场景重写 prompt，加了「反例：用户问 X 还在吗，历史里你说过已删除，错误回答是『已经被删了不在了』。正确做法：看清单……」。30 次实测 deepseek-v4-pro 在该场景从 21/30 (70%) 暴跌到 2/30 (7%)，模型实际输出措辞跟反例里写的「错误回答」几乎一字不差。已回滚 prompt。

**正确做法**：
- 只用正例（「应该这样做」+ 具体示例）
- 反例要表达的禁止行为用规则陈述（「禁止 X」「必须 Y」），不要具体写出错误措辞
- 避免「再说一遍」式重复加强同一指令，会让模型形成机械应答（嘴上说但没执行）

### 3. SKILL.md不得依赖具体代码实现

SKILL.md是行为指引和原则文档，描述做什么和为什么，不引用具体的变量名、函数名、类名等代码实现细节。代码层的API说明放在脚本文件自身的docstring里，SKILL.md只描述原则和流程。

### 4. 所有SKILL.md必须包含no_ai_style规则

**触发条件**: 创建或修改任何SKILL.md时

**执行策略**: 在SKILL.md的禁止/约束章节中，加入no_ai_style的全部规则（自我标榜、解释用意、结尾反问、禁用符号、油腻煽情、表态铺垫、附和措辞、中英文不加空格）。

**禁止**: 创建SKILL.md时遗漏no_ai_style规则。no_ai_style是所有skill的基线约束，不是可选项。

### 5. Windows下curl传中文JSON必乱码

**触发条件**: 在Windows的Bash/PowerShell里用curl调外部API（飞书、企微等），JSON body含中文字段（title、name、content等）

**现象**: 服务端拿到的字符串变成`ֱ�����ɱʼ�`这种GBK->UTF8错配的乱码，飞书wiki/docx标题、bitable写入都中招过

**根因**: Windows shell默认编码不是UTF-8，curl的`-d '{"title":"中文"}'`命令行参数经过shell转义后字节序列错乱

**正确做法（按优先级）**:
1. 把JSON写到临时文件（用Write工具，UTF-8编码），再 `curl --data-binary @body.json`
2. 用Python `requests` 或脚本里的 `feishu_api.py` 封装调用，不走curl
3. 已有`build_doc.py`、`fetch_bitable.py`这类Python脚本就用脚本，不要为了"快"切回curl

**禁止**: 直接 `curl -d '{"title":"中文..."}'`，无论看起来多简单。

### 6. 项目CLAUDE.md不存在时禁止动手

**触发条件**: 接到具体任务，cwd或目标路径在某个具体项目下，且该项目根目录无CLAUDE.md

**正确做法**:
1. 停下，告诉用户「这个项目还没有CLAUDE.md，建议先建立项目规范再开始」
2. 提议要沉淀的内容（命名、路径、字段schema、API凭证位置、版式偏好、历次踩坑）
3. 用户确认后建CLAUDE.md，再进入任务执行

**禁止**:
- 用全局CLAUDE.md（`~/.claude/CLAUDE.md`）替代项目CLAUDE.md，全局规则只覆盖跨项目通用约束
- 用父目录CLAUDE.md（如工作区级 `E:\00 PycharmProjects\CLAUDE.md`）替代项目级，工作区规则只覆盖命名等浅层约定，不含具体项目的字段、API、版式偏好
- 觉得任务简单就跳过，规范化的边际成本远低于反复纠正同样问题

**Why**: 上次直播答疑项目就因为没有项目CLAUDE.md，反复在中文目录命名、PPT版式偏好、字段schema这些事上来回纠正三轮以上，每次纠正都没沉淀，下期重做时还会重犯。项目级规范是把"用户纠正一次"变成"以后都对"的唯一办法。

**如何识别"具体项目"**: 路径下有独立的代码、数据、产出物，不只是临时文件或scratch实验。判断不准就问用户「这是个项目吗，要不要先建CLAUDE.md」。