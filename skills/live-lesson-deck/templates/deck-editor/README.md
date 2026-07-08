# Deck Editor Template

这是直播课件的内嵌编辑器模板。维护时它是一套独立源码，交付时由 skill 注入到最终 `lesson.html` 里，保持单文件课件可复制、可离线、可直接打开。

## 文件

- `editor.css`：编辑模式样式、工具条样式、文本框选中态、动画文本框强制可见、挪位置态
- `toolbar.html`：编辑工具条 DOM
- `runtime.js`：通用编辑器逻辑
- `config.example.js`：每份 deck 的配置示例

## 推荐接入方式

最终 HTML 内嵌顺序：

1. 把 `editor.css` 内容放到主 CSS 后面
2. 把 `toolbar.html` 放到 `</main>` 后面
3. 把 `runtime.js` 放到主脚本里
4. 在主脚本里、`deck` / `slides` / `show()` / `SECTIONS` / `NOTES` 定义之后，调用 `installDeckEditor(host, config)`

示例：

```js
installDeckEditor({
  deck: deck,
  getSlides: function(){ return slides; },
  setSlides: function(v){ slides = v; },
  getCur: function(){ return cur; },
  setCur: function(v){ cur = v; },
  getTotal: function(){ return total; },
  setTotal: function(v){ total = v; },
  show: show,
  renderBar: renderBar,
  renderBarSegments: typeof renderBarSegments === 'function' ? renderBarSegments : null,
  renderToc: typeof renderToc === 'function' ? renderToc : null,
  getSections: function(){ return SECTIONS; },
  setSections: function(v){ SECTIONS = v; },
  getNotes: function(){ return typeof NOTES !== 'undefined' ? NOTES : null; },
  setNotes: function(v){ if(typeof NOTES !== 'undefined') NOTES = v; },
  afterRebuild: function(ctx){
    // 按 deck 需要刷新 demo 索引
  }
}, {
  editSelector: '.k,.t,.big,.lead,.callout',
  accent: 'var(--accent)',
  selectedBg: 'rgba(110,231,240,0.10)',
  warnColor: '#ffd2b3'
});
```

## 为什么不是直接 `<script src>`

可以做，但不推荐作为默认交付。

当前课件的核心状态通常在闭包里，外部脚本拿不到 `deck`、`slides`、`cur`、`show()`、`SECTIONS`、`NOTES`。要外部引用，就必须暴露 host API。这样会多一个文件依赖，也削弱单文件课件的稳定性。

推荐做法是：skill 维护这套模板源码，生成课件时把它注入成内嵌代码。

## 保存方式

只保留 Chrome File System Access。

- 第一次按 `E` 进入编辑模式时，浏览器会要求选择当前 HTML 并授权
- 授权成功后修改会写回同一个 HTML
- 授权失败时可以临时编辑页面，但不会落盘
- 临时编辑也支持 Cmd+Z / Ctrl+Z 撤回，离开页面前会提示未保存风险
- 授权文件会校验 deck 指纹，避免误选同结构的旧副本或其他课件
- 不依赖 `edit-server.py`
- 不保留 `POST /__save`

## 可编辑文本框

编辑器默认自动收集 `.slide` 内所有带直接文本的常见文本节点（p / h1-h6 / li / div / span / b / strong / code / SVG text / tspan 等），排除工具条、目录、进度条、热区等控制 UI，并做父子去重。手写白名单方案反复漏文本框（03 实测：换成自动收集后可编辑覆盖从 154 涨到 437），自动收集是默认行为。

相关配置：

- `autoCollect`：默认 true；传 false 退回纯白名单模式
- `skipSelector`：deck 自有的控制 UI（章节轨、页内导航等），追加进排除清单
- `data-editable`：想保证被收集的节点直接加这个属性，永远生效
- `editSelector`：白名单补充，用于自动收集抓不到的特殊节点

```html
<h1 class="cover-title" data-editable>标题</h1>
<p class="lead" data-editable>说明文字</p>
```

## 每份 deck 必配

- `skipSelector`：把 deck 自有控制 UI 排除出自动收集
- `accent` / `selectedBg` / `warnColor`：主题色
- `host.afterRebuild()`：可选，重建页面后刷新 demo 索引

## 编辑器能力

- `E` 进入编辑模式，`Esc` 退出。
- 标题、小标题、正文等实质文案可点选编辑。
- 容器里如果有子级可编辑叶子，不要把容器本身设成 `contenteditable`。
- 支持高亮、清高亮、加粗、斜体、下划线，以及 Cmd/Ctrl+B/I/U。
- 支持删除整个文本框节点，不只是清空文本。
- 带 `.frag` / `.fragR` 等揭示动画的文本框，在编辑模式下必须临时可见且可选。
- 支持拖动文本块微调位置，双击还原单个块，用 `transform` 偏移，不破坏原布局。
- 支持页前移、页后移、删本页，并同步目录、页码、进度条、`SECTIONS`、`NOTES` 和特殊 demo 索引。
- Cmd/Ctrl+Z 能撤文字编辑、删文本框、挪位置、移页、删页。
- 拒绝授权时可以临时编辑 DOM，但状态栏必须提示不会落盘。

## 验收

至少测这些：

- `E` 进入编辑模式
- 普通文本框可点选
- 隐藏 `.frag` 文本框进入编辑模式后可见、可点选
- `B` 只加粗所选文字，不受标题等版式默认粗体影响；`清粗` 能清掉当前文本框里的编辑加粗
- 编辑模式下 `上一页` / `下一页` 只切页，不改变 deck 顺序
- 编辑模式下方向键在未聚焦文本框时切页，聚焦文本框时移动光标
- 未授权文件时，删文本框、本页前移、本页后移、删本页禁用
- 窄屏下工具条按钮不出屏
- 未授权临时编辑后 Cmd+Z / Ctrl+Z 能撤回
- 有未保存临时编辑时离开页面会提示风险；撤回到干净状态后不提示
- 删文本框会删除整个节点
- Cmd+Z / Ctrl+Z 能恢复删文本框
- 删本页后 Cmd+Z / Ctrl+Z 能恢复
- 页前移 / 页后移后页数不变
- `SECTIONS`、`NOTES`、目录、进度条和页码同步
- 控制台无报错
