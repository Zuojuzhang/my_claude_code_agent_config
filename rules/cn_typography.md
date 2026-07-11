# 中文页面字体池（taste-skill等西式设计skill的中文补丁）

## 何时读

用taste-skill（design-taste-frontend）、impeccable、frontend-design等西式设计skill做**中文页面**时必读。这些skill的字体规则建立在拉丁字体上（Geist、Satoshi、Cabinet Grotesk等），全部不覆盖中文，直接套用会退化成系统默认宋体黑体。本文件把它们的字体原则（display要有性格、正文要中性耐读、一个项目一套搭配）翻译成中文可用的字体池。

## Display字体池（标题、大字、品牌感，选一个有性格的）

| 字体 | 性格 | 免费商用 | 适合 |
|------|------|----------|------|
| 得意黑 Smiley Sans | 窄斜、运动感、现代 | 是 | 科技、课程、活动页 |
| 优设标题黑 | 厚重有力、斜切 | 是 | 营销落地页、大促 |
| 霞鹜文楷 LXGW WenKai | 文艺、手写楷感 | 是 | 人文、读书、随笔类 |
| 思源宋体 Heavy/Black | 杂志编辑部感 | 是 | 编辑排版、深度长文 |
| 汇文明朝体 | 旧印刷、复古 | 是 | 怀旧、文化题材 |
| 阿里妈妈数黑体 | 几何、数字感 | 是 | 数据大屏、科技 |
| 站酷高端黑 | 简洁商务 | 是 | 通用备选 |

## 正文字体池（中性、耐读，别用display字体排正文）

优先级：系统栈 > 自托管子集。

- 系统栈（零加载成本，单文件HTML课件默认）：`-apple-system, "PingFang SC", "HarmonyOS Sans SC", "MiSans", "Microsoft YaHei", sans-serif`
- 需要统一观感时自托管：思源黑体（Noto Sans SC）、MiSans、HarmonyOS Sans，三选一
- 衬线正文（少用，编辑感场景）：思源宋体（Noto Serif SC）

## 中英混排

- font-family里西文字体放中文字体**前面**，让拉丁字符走西文字体：`"Geist", "Noto Sans SC", sans-serif`。这样taste-skill选的西文display字体仍然生效，中文自动落到中文字体
- 数字建议显式走西文或等宽字体，中文字体的数字普遍难看
- 代码、数据用 `"JetBrains Mono", "Noto Sans SC", monospace`

## 加载纪律（中文webfont的特有坑）

- 中文字体文件5到15MB，**禁止整包引入**。三条路：①系统栈（首选）②子集化（cn-font-split/font-spider，只打包页面用到的字）③中文网字计划CDN（chinese-fonts，按需分片加载）
- display字体只用于标题，标题字符量小，子集化后通常小于200KB，可以放心用
- `font-display: swap`必加，中文字体加载慢，不加会白屏等字

## 失效的西式规则（中文页面直接忽略）

- 衬线体轮换名单、意大利斜体强调（中文没有真斜体，倾斜是伪斜）
- letter-spacing负值收紧标题（中文方块字收紧会粘连，中文标题字距给0或正微量）
- 全大写眉题（中文无大小写，眉题用小字号加字距加颜色弱化实现同等效果）

其余版式规则（hero首屏放下、CTA不换行、之字形布局上限、眉题密度上限等）语言无关，中文页面照常执行。
