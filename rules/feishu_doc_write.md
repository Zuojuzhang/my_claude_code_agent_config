# 飞书文档读写规则

## 触发条件

用户要求读取飞书文档、将内容写入飞书wiki/文档，或提供了飞书文档URL。

---

## 一、读取文档

### 1.1 URL解析

从飞书文档URL直接提取doc_token，无需调用wiki API：

- `https://xxx.feishu.cn/docx/{doc_token}` → doc_token 就是文档ID
- `https://xxx.feishu.cn/wiki/{node_token}` → 需调用 `wiki/v2/spaces/get_node` 获取 `obj_token`

### 1.2 获取token

POST `/auth/v3/tenant_access_token/internal`，token有效期约2小时，长时间读取注意过期。

### 1.3 读取文档结构

```
GET /docx/v1/documents/{doc_token}/blocks/{doc_token}/children?page_size=100
```

- `page_size` 最大100
- 返回的 `has_more` 为 true 时继续分页
- 根block的 `block_type=1`（page），其 `children` 数组是顶层block ID列表

### 1.4 读取具体block内容

```
GET /docx/v1/documents/{doc_token}/blocks/{block_id}
```

返回该block的完整内容。不同 block_type 的文本提取路径：

| block_type | 枚举值 | 文本字段路径 |
|-----------|--------|------------|
| page | 1 | `block.page.elements[].text_run.content` |
| text | 2 | `block.text.elements[].text_run.content` |
| heading1 | 3 | `block.heading1.elements[].text_run.content` |
| heading2 | 4 | `block.heading2.elements[].text_run.content` |
| heading3 | 5 | `block.heading3.elements[].text_run.content` |
| bullet | 12 | `block.bullet.elements[].text_run.content` |
| callout | 19 | 本身无文本，需读取其 `children` 数组中的子block |
| table | 31 | `block.table.cells[]` 是cell ID数组，需逐个读取cell block |
| quote_container | 34 | 本身无文本，需读取其 `children` 数组中的子block |

### 1.5 读取表格

1. table block 的 `block.table.cells[]` 是所有cell的block ID（行优先排列）
2. `block.table.property.row_size` 和 `column_size` 给出行列数
3. 逐个GET每个cell block获取文本内容
4. **cell可能为空**（新建表格尚未填入内容），此时cell block只有 `block_type` 无文本字段，不是错误

### 1.6 读取时的工程约束

- **不要用 `/tmp/` 路径写临时JSON**：Windows环境下该路径可能不存在。写到当前工作区目录
- **避免长链命令**：不要在一个Bash调用里串联多行curl + python -c + 循环。拆成独立步骤：先curl保存JSON文件，再用Read工具读文件分析结构
- **批量读cell时控制并发**：表格cell数量大时，一次curl循环内逐个GET即可，不要并行
- **block_type必须是数字**：API返回和请求都使用数字枚举，不是字符串

---

## 二、写入文档

### 2.1 执行流程

1. 获取 `tenant_access_token`（POST `/auth/v3/tenant_access_token/internal`）
2. 从wiki URL提取node_token，调用 `wiki/v2/spaces/get_node` 获取 `obj_token`（即docx文档ID）
3. 调用 `docx/v1/documents/{obj_token}/blocks/{obj_token}/children` 分批追加内容
4. 遇到 `1770032 forBidden` 时，提示用户在飞书文档中添加应用协作者（可编辑权限）后重试

### 2.2 写入约束

- `block_type` 必须使用**数字枚举**，禁止传字符串
- 单次请求 children 数量不超过40个，内容过多时分批追加
- 写入前确认文档现有内容，避免重复追加（如需替换应先清空或追加在末尾）
- **建表有尺寸上限（2026-07-20实测踩坑）**：POST children建12×7表报1770001 invalid param，8×7可以过（16×6等历史小表也都能过，上限疑似按行数或总格数卡）。建大表的稳妥做法：先建8行以内的表，再用PATCH块接口`{"insert_table_row":{"row_index":-1}}`逐行补到目标行数，行补齐后再统一填格
- **表格/grid的默认空块是异步生成的（2026-07-19实测踩坑）**：新建table的每个单元格、grid的每个分栏，飞书都会自动补一个空text块，且创建接口返回时它可能尚未落位。「建完立刻读children再清空」会漏掉它，随后它排在你写入的内容前面，每格视觉上多一行空行。正确做法：所有单元格/分栏写完后，**整文档回读一遍**，对children≥2的cell（type 32）和grid_column（type 25）删除其中的空text块（batch_delete按索引从后往前删）；不要信任建表后立刻读到的children列表

---

## 三、常见错误与处理

| 错误码 | 含义 | 处理方式 |
|--------|------|----------|
| `99992402` | field validation failed，block_type传了字符串 | 改为数字枚举 |
| `1770032` | forBidden，应用无编辑权限 | 在飞书文档中添加应用为协作者，赋予可编辑权限 |
| `99991672` | 应用缺少某项权限scope | 见下方「权限新增后的生效链路」 |

### 画板（board）写入（2026-07-20实测跑通）

- docx里建画板：POST children传`{"block_type":43,"board":{}}`，响应的`board.token`就是whiteboard_id
- 画节点：POST `/board/v1/whiteboards/{id}/nodes`，body`{"nodes":[...]}`；必须先建形状（composite_shape）再建连线（connector，靠attached_object引用形状id）
- 节点JSON只用安全字段（type/x/y/width/height/composite_shape/text/style/z_index），多余字段报2890002；参考github.com/riba2534/feishu-cli的board references
- **创建响应里的节点id结构不可靠**：拿id稳妥做法是创建形状后GET回读全部节点，按text文本匹配出id再建连线
- 所需scope：`board:whiteboard:node:create`（写）、读回也要对应read权限；新加scope走下面的生效链路

### 权限新增后的生效链路（2026-07-20实测踩坑）

给应用新增权限（如画板`board:whiteboard:node:create`）后，API不会立即放行，两道关都要过：

1. **版本发布**：自建应用加权限后要在开发者后台创建新版本并发布，权限列表显示「已开通」不等于已生效。
2. **token轮换**：`tenant_access_token`按2小时缓存复用，权限是发token那一刻定死的。旧token不带新权限，要等它剩余有效期降到30分钟内飞书才换发新token。排查方法：看token响应的`expire`字段，接近7200说明是新token；拿到全新token仍报99991672，才能断定权限真没挂上（此时查权限页「应用身份」列的状态，别只看用户身份）。

---

## 四、API凭证

真实凭证不写在本文件（本仓库为 public，禁止明文密钥入库）。app_id 与 app_secret 存放于本地未追踪文件 `rules/feishu_credentials.local.md`（已被 .gitignore 排除），调用前从该文件读取。

- app_id: `<见 rules/feishu_credentials.local.md>`
- app_secret: `<见 rules/feishu_credentials.local.md>`
- 获取tenant_access_token接口: `https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal`
- 多维表格记录查询: `https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables/{table_id}/records`
- 列出多维表的tables: `https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables`
