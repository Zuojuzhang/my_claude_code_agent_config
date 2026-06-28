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
- 不依赖 `edit-server.py`
- 不保留 `POST /__save`

## 每份 deck 必配

- `editSelector`：哪些元素可编辑
- `accent` / `selectedBg` / `warnColor`：主题色
- `host.afterRebuild()`：可选，重建页面后刷新 demo 索引

## 验收

至少测这些：

- `E` 进入编辑模式
- 普通文本框可点选
- 隐藏 `.frag` 文本框进入编辑模式后可见、可点选
- 删文本框会删除整个节点
- Cmd+Z / Ctrl+Z 能恢复删文本框
- 删本页后 Cmd+Z / Ctrl+Z 能恢复
- 页前移 / 页后移后页数不变
- `SECTIONS` / `NOTES` 同步

