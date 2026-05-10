# 错误清单

以下规则从历史错误中提炼，每条都被用户反复纠正过，必须严格遵守。

### 1. SKILL.md不得依赖具体代码实现

SKILL.md是行为指引和原则文档，描述做什么和为什么，不引用具体的变量名、函数名、类名等代码实现细节。代码层的API说明放在脚本文件自身的docstring里，SKILL.md只描述原则和流程。

### 2. 所有SKILL.md必须包含no_ai_style规则

**触发条件**: 创建或修改任何SKILL.md时

**执行策略**: 在SKILL.md的禁止/约束章节中，加入no_ai_style的全部规则（自我标榜、解释用意、结尾反问、禁用符号、油腻煽情、表态铺垫、附和措辞、中英文不加空格）。

**禁止**: 创建SKILL.md时遗漏no_ai_style规则。no_ai_style是所有skill的基线约束，不是可选项。

### 3. Windows下curl传中文JSON必乱码

**触发条件**: 在Windows的Bash/PowerShell里用curl调外部API（飞书、企微等），JSON body含中文字段（title、name、content等）

**现象**: 服务端拿到的字符串变成`ֱ�����ɱʼ�`这种GBK->UTF8错配的乱码，飞书wiki/docx标题、bitable写入都中招过

**根因**: Windows shell默认编码不是UTF-8，curl的`-d '{"title":"中文"}'`命令行参数经过shell转义后字节序列错乱

**正确做法（按优先级）**:
1. 把JSON写到临时文件（用Write工具，UTF-8编码），再 `curl --data-binary @body.json`
2. 用Python `requests` 或脚本里的 `feishu_api.py` 封装调用，不走curl
3. 已有`build_doc.py`、`fetch_bitable.py`这类Python脚本就用脚本，不要为了"快"切回curl

**禁止**: 直接 `curl -d '{"title":"中文..."}'`，无论看起来多简单。

### 4. 直播答疑归档目录用英文，不用中文

**触发条件**: live-qa-workflow skill或任何归档目录命名时

**正确**: `YYYYMMDD_live_question`（例：`20260508_live_question`）

**错误**: `YYYYMMDD_直播答疑`、`直播答疑_YYYYMMDD` 等含中文的目录名

**例外**: 飞书文档/PPT文件名内部可以保留中文（如`YYYYMMDD 直播答疑笔记.docx`），只是文件夹名必须英文

**Why**: 中文目录名在Windows shell、git、跨工具协作里频繁触发编码问题，路径出错排查成本高

### 5. 项目CLAUDE.md不存在时禁止动手

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