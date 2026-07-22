# 定位报告输出契约

## 一、三件套

每次正式交付生成同一目录中的三份文件：

| 文件 | 作用 | 强制内容 |
|---|---|---|
| `positioning-report-data.json` | 唯一结构化事实源 | 对象、竞品、证据、指标、方案和来源 |
| `positioning-report.html` | 决策与管理层阅读 | 结论、图表、来源跳转、风险和验证 |
| `positioning-report.md` | 无脚本降级与长期审计 | 与 HTML 一致的核心结论和证据索引 |

HTML 和 Markdown 不得重新推理或补写 JSON 中不存在的结论。

JSON 保留稳定机器枚举；HTML 和 Markdown 必须使用一致的中文显示标签。个人 IP 的商业价格没有进入定位比较时，应显示“未纳入定位比较”，不能显示为“未核验”；空否决项应显示“暂无否决项”，不能与“证据不足”混用。

## 二、报告章节

1. 心智快照：当前理解、当前问题、主要对手、目标心智词、一句话定位、可信理由和战略牺牲。
2. 执行摘要与推荐定位。
3. 定位对象、身份、阶段和商业目标。
4. 研究范围、证据边界和整体可信度。
5. 用户任务、购买触发、决策标准和需求证据。
6. 竞争集合、竞品矩阵和替代方案。
7. 心智阶梯、品类结构和已占位置。
8. 自身资产、D6 相对优势和证据链。
9. 市场机会、无效空位和供应缺口。
10. 2 至 3 套定位方案比较与推荐理由。
11. 表达、产品、内容、价格、渠道和销售建议。
12. 风险、反证条件和市场验证计划。
13. 证据台账与来源附录。

个人 IP 或课程任务追加使命、人设、商业、内容四层一致性。

课程任务还必须包含 `course_marketing_extension`：专业/性格/用户匹配人设、靶心人行动路径、痛点、4P 基线与差异选择、课程结果、方法机制、交付结构和内容差异。

## 三、关键结论对象

`positioning_snapshot` 是首页唯一允许使用的极简定位源。它必须与推荐方案一致，并满足 `references/plain-language-positioning-method.md` 的表达预算。完整推理放在主张和证据层，不得用首页长段落承担审计功能。

JSON 中每条关键主张必须包含：

```text
claim_id
claim_type: fact | self_report | inference | hypothesis | recommendation
claim_text
evidence_ids[]
reasoning
confidence: high | medium | low | insufficient
counterevidence[]
falsification_condition
report_sections[]
```

最终推荐还必须引用 `executive_summary.evidence_ids`。

证据对象使用 `claim_ids[]` 回链所有被其支撑的主张。校验器必须确认 `claims[].evidence_ids` 与 `evidence[].claim_ids` 双向一致。

## 四、推荐状态

- `execute`：关键需求、竞争和优势均有足够证据，无关键否决项。
- `validate_first`：方向可用，但存在一个重要弱项或中等置信度证据。
- `insufficient_evidence`：核心需求、优势或竞争参照无法确认。

报告必须明确显示状态，不能只给多个方案不做判断。

`execute` 还必须满足：推荐证据同时覆盖用户需求、竞争或替代方案和自身能力；推荐主张为高置信；没有未解决冲突；个人 IP/课程四层定位不存在直接冲突。

## 五、数据与图表一致性

- 所有指标由 `scripts/report_model.py` 从原始数组计算。
- 缺失值使用 `null`，不得用 0 替代。
- 1 至 5 级诊断分值必须说明评分理由和证据。
- 不计算没有统计依据的伪精确总分。
- 图表缺少数据时显示“证据不足”，不生成虚假柱形或默认中间值。
- HTML 中的来源、指标和推荐必须与 JSON 一致。
- `executive_summary` 的品类、差异化标签、核心价值、独特机制和心智关键词必须与唯一推荐方案一致。
- `price_label` 只有在 `price_verified=true` 时才进入价格透明度；定性价格带不能冒充当前价格事实。
- 验证门槛用 `threshold_unit=rate|score_5` 保留百分比或五分制原始单位。

## 六、研究边界

报告首页或执行摘要必须显示：

- 地域、语言、时间范围。
- 研究模式：本地、标准或深度。
- 计划与实际竞品数量。
- 资料缺口、样本限制和冲突。
- 动态信息访问日期。

## 七、验证命令

```bash
python3 scripts/validate-report-data.py positioning-report-data.json
python3 scripts/render-report.py positioning-report-data.json --out positioning-report
python3 scripts/review-report.py positioning-report
```

严格模式会把警告升级为失败：

```bash
python3 scripts/validate-report-data.py positioning-report-data.json --strict
python3 scripts/review-report.py positioning-report --strict
```

## 八、交付前检查

- 推荐定位在 HTML、JSON 和 Markdown 中逐字一致。
- 关键事实引用覆盖率为 100%，否则降级相关结论。
- 竞品角色覆盖直接、间接、现状或不行动。
- 本地路径没有出现在 HTML。
- 外部 URL 只允许 `http` 和 `https`。
- 375px、1280px 和打印模式没有遮挡、裁切或空白图表。
- ECharts 从本地内嵌，不依赖 CDN。
- 来源附录能解释来源等级、用途和访问日期。
- `scripts/review-report.py` 的基础审校通过，警告没有被删除或伪造数据掩盖。
- 模板、图表或打印样式变化时，按 `references/report-review-method.md` 完成三视口和 A4 PDF 栅格化审校。
