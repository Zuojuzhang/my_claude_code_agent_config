# PDF 渲染技术路径

适用场景：用户明确要A4打印或归档PDF时的次要路径。阅读型报告的默认形态是HTML长页，见`references/html_report.md`。

渲染链路：Playwright 无头Chromium加载HTML → 注入Paged.js → 自动分页为A4 → 调用`page.pdf()`导出PDF。

本文档给技术骨架、视觉体系要求和可读性底线。具体配色和组件样式由执行方按报告内容决定，但必须先过下面的视觉体系章节再写HTML。可读性底线是及格线，不是完成标准。

---

## 视觉体系（写HTML前必做）

历史教训（2026-07-07台风弹幕报告）：只满足可读性底线直接渲染，产出被用户判为丑。以下六条是硬要求：

1. **Token先行**：写HTML前先定一套design token并集中声明在`:root`：色彩（1个主色加success/warning/danger语义色加中性灰阶）、字号阶梯（正文10~10.5pt起步）、间距节奏。气质方向与token按html_report.md的设计判读流程现场确定，不要即兴配色。badge、风险标注、图表用色全部从这套token派生，禁止三套颜色各管各的。
2. **图表与页面同源**：图表的字族、字号、配色取自同一套token；图内不放标题，标题只写在figcaption，避免图里图外重复；同一份报告所有图表的图例位置、网格线、坐标轴风格保持一致；优先SVG矢量输出（matplotlib用`svg.fonttype: none`并确认CJK字族可用），栅格图与矢量正文混排会显糊。
3. **表格用三线表**：顶线、表头线、底线，行间可用极浅分隔线，禁止全边框网格。表格默认`break-inside: avoid`；确需跨页时必须让表头在新页重复，Paged.js不会自动重复thead，做不到就调分页或压缩行距让表不跨页。
4. **封面要设计**：至少包含色块、关键指标大数字之一，禁止纯文字加一条分割线的默认封面。中文大标题按容器宽度验算断行（必要时手动`<br>`），禁止单字或双字孤行。
5. **分页纪律**：强制换页只加在主维度章节，概览、Insight、局限性、References等短章节流式排布；正文段落设`orphans/widows`。
6. **渲染后逐页自检**：用截图逐页检查（Playwright对`.pagedjs_page`逐个screenshot），检查项：无整页空白超过约40%的页、图表清晰无文字重叠、表格未破线、页眉页脚页码正常、封面断行正常。发现问题回去调，检查通过才算渲染完成。

---

## 渲染链路

1. 生成一份自包含的HTML（样式内联或同目录CSS），按报告结构切成`<section>`
2. 在HTML里通过`<script>`引入Paged.js。Paged.js会读取`@page`和`break-*`规则，把单页DOM拆成A4多页
3. Playwright以无头模式打开本地HTML文件，等待Paged.js完成分页事件，再调用`page.pdf()`导出

Paged.js版本选0.4.x稳定版，CDN任选：

```html
<script src="https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js"></script>
```

或：

```html
<script src="https://cdn.jsdelivr.net/npm/pagedjs@0.4.3/dist/paged.polyfill.js"></script>
```

离线环境把`paged.polyfill.js`下载到本地与HTML同目录即可。

---

## HTML骨架

用语义化标签，不套无意义的div。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>分析报告</title>
  <link rel="stylesheet" href="print.css">
</head>
<body>
  <section class="cover">
    <h1>分析标题</h1>
    <p class="subtitle">时间范围 · 分析目的</p>
  </section>

  <section class="hypothesis">
    <h2>商业假设</h2>
    <article>...</article>
  </section>

  <section class="insight">
    <h2>Actionable Insight</h2>
    <p>...</p>
  </section>

  <section class="dimension">
    <h2>分析维度：渠道效率对比</h2>
    <article>
      <h3>核心发现</h3>
      <p>...</p>
      <figure>
        <img src="chart_1.png" alt="各渠道ROI对比">
        <figcaption>各渠道ROI对比（含盈亏平衡线）</figcaption>
      </figure>
    </article>
  </section>

  <section class="metrics">
    <h2>Key Metrics</h2>
    <ul>...</ul>
  </section>

  <section class="limits">
    <h2>分析局限性</h2>
    <p>...</p>
  </section>

  <section class="references">
    <h2>References</h2>
    <p>...</p>
  </section>

  <script src="https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js"></script>
</body>
</html>
```

---

## Paged.js关键CSS

```css
@page {
  size: A4;
  margin: 18mm 16mm 20mm 16mm;

  @top-right {
    content: "分析报告";
    font-size: 9pt;
  }

  @bottom-center {
    content: counter(page) " / " counter(pages);
    font-size: 9pt;
  }
}

section.dimension {
  break-before: page;
}

figure, table {
  break-inside: avoid;
}

h2, h3 {
  break-after: avoid;
}
```

`break-before: page`保证每个分析维度独立成页。`break-inside: avoid`防止图表和表格被拆到两页。`@top-right`与`@bottom-center`用Paged.js的CSS Generated Content for Paged Media实现页眉页脚。

---

## 中文字体兜底

执行环境必须有至少一个完整覆盖CJK的字体。Windows系统字体`Microsoft YaHei`（微软雅黑）、macOS的`PingFang SC`、Linux发行版常见的`Noto Sans CJK SC`或思源黑体任选其一。CSS里用`font-family`指定时给一串降级列表，保证任一平台都能命中：

```css
body {
  font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif;
}
```

字体缺失会导致整页乱码或方块，生成前务必确认。

---

## Playwright执行命令

Python示例：

```python
from playwright.sync_api import sync_playwright
from pathlib import Path

html_path = Path("report.html").resolve().as_uri()
output_path = "report.pdf"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(html_path)
    page.emulate_media(media="print")
    page.wait_for_function("window.PagedPolyfill && window.PagedPolyfill.pages && window.PagedPolyfill.pages.length > 0", timeout=30000)
    page.pdf(
        path=output_path,
        format="A4",
        print_background=True,
        prefer_css_page_size=True,
    )
    browser.close()
```

`emulate_media("print")`让CSS中`@media print`规则生效。`prefer_css_page_size=True`让Playwright尊重`@page size`设置，不用再传width/height。

Node等价写法用`@playwright/test`或`playwright` npm包，API一致，只是同步/异步语法差异。

---

## 可读性底线

1. 正文与背景的对比度足以在打印环境下直接阅读，不依赖屏幕色彩还原
2. 正文字号建议不低于10pt，图注和脚注不低于8pt
3. 图表必须自带标题、轴标签、数据标签，不依赖正文解读
4. 表格不跨页，跨页时表头在新页重复
5. 所有风险标注（【小样本】【推断】【数据不足】【未做时间归因校正】）在视觉上与正文可区分，不被忽略

执行方如选用其他工具（weasyprint、reportlab、puppeteer截图等）替代默认链路，必须自行解决A4分页、页眉页脚页码、CJK字体三件事，且达到以上可读性底线。
