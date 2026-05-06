# 飞书文档写入规则

## 触发条件

用户要求将内容写入飞书wiki/文档，或提供了飞书文档URL并要求写入。

## 执行流程

1. 获取 `tenant_access_token`（POST `/auth/v3/tenant_access_token/internal`）
2. 从wiki URL提取node_token，调用 `wiki/v2/spaces/get_node` 获取 `obj_token`（即docx文档ID）
3. 调用 `docx/v1/documents/{obj_token}/blocks/{obj_token}/children` 分批追加内容
4. 遇到 `1770032 forBidden` 时，提示用户在飞书文档中添加应用协作者（可编辑权限）后重试

## 强制约束

- `block_type` 必须使用**数字枚举**，禁止传字符串。常见映射：
  - `2` = text（段落）
  - `3` = heading1
  - `4` = heading2
  - `5` = heading3
- 单次请求 children 数量不超过40个，内容过多时分批追加
- 写入前确认文档现有内容，避免重复追加（如需替换应先清空或追加在末尾）

## 常见错误与处理

| 错误码 | 含义 | 处理方式 |
|--------|------|----------|
| `99992402` | field validation failed，block_type传了字符串 | 改为数字枚举 |
| `1770032` | forBidden，应用无编辑权限 | 在飞书文档中添加应用为协作者，赋予可编辑权限 |

## API凭证（同CLAUDE.md）

- app_id: `cli_a9530738d5b85bcd`
- app_secret: `dnNsXP6F0FTYHRNnX3Eaee6r07cO3rzn`
- 获取tenant_access_token接口: `https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal`
- 多维表格记录查询: `https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables/{table_id}/records`
- 列出多维表的tables: `https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables`
