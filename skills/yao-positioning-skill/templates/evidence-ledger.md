# 证据台账

| evidence_id | claim_ids | claim_types | claim_texts | source_id | source_title | perspective | grade | directness | origin_group | accessed_at | summary | market_fit | market_fit_notes | independent | conflict | confidence | report_use | reviewer_note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| E01 | C01, C03 | inference, recommendation |  | S01 |  |  |  |  |  |  |  |  |  |  |  |  |

## 使用规则

- 先建立 `claim_id`，再寻找适合证明该主张的来源；同一证据可通过 `claim_ids[]` 支撑多个主张。
- 摘要只写证据支持的内容，不复制搜索结果摘要。
- 同一原始材料的转载共享一个 `origin_group`，不得重复计算独立佐证。
- 冲突证据保留在台账中，并在关键结论旁解释处理方式。
- `fact`、`inference` 和 `recommendation` 必须有证据；`self_report` 必须明确标记为自述。
