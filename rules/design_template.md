### 1. 色彩体系

定义方式：CSS变量，集中声明在`:root`中。

需要定义的色彩角色：
- `--color-bg-primary`：主背景色
- `--color-bg-secondary`：次级背景色（卡片、侧边栏）
- `--color-bg-tertiary`：更深层背景（输入框、代码块）
- `--color-bg-elevated`：悬浮层背景（弹窗、下拉菜单）
- `--color-text-primary`：主文字色
- `--color-text-secondary`：次级文字色（描述、标签）
- `--color-text-muted`：弱化文字色（时间戳、占位符）
- `--color-border-default`：默认边框色
- `--color-border-subtle`：弱化边框色
- `--color-accent`：主强调色（品牌色、主按钮、选中态）
- `--color-accent-hover`：主强调色悬停态
- `--color-accent-subtle`：主强调色的低透明度版本（标签背景、选中行背景）
- `--color-success`：成功/数据支撑/正向指标
- `--color-warning`：警告/推断/需注意
- `--color-danger`：错误/质疑/负向指标
- `--color-info`：信息/中性提示

色彩规则：
- 主强调色只用在需要用户注意或操作的地方，不超过界面面积的10%
- 语义色（success/warning/danger）保持全局一致，不在不同页面里用不同的绿色表示"成功"
- 背景色层级严格递进，通过亮度差异建立空间层次，不靠边框区分层级

### 2. 字体体系

```
--font-display: 用于标题、数字大屏、品牌元素的展示字体
--font-body: 用于正文、描述、按钮文字的阅读字体
--font-mono: 用于代码、SQL、数据表格、技术标签的等宽字体
```

字号定义（使用模块化缩放比例，推荐1.25倍递增）：
```
--text-xs: 10px    → 辅助标签、时间戳
--text-sm: 12px    → 次级文字、表头
--text-base: 14px  → 正文
--text-lg: 16px    → 小标题、强调文字
--text-xl: 20px    → 区域标题
--text-2xl: 28px   → 页面标题
--text-3xl: 36px   → 大屏数字、首屏标题
```

字重规则：
- 正文一律400，不加粗
- 标题和强调文字600
- 品牌元素和大数字700或800
- 禁止在同一段文字中出现3种以上字重

### 3. 间距体系

使用4px基准网格，所有间距都是4的倍数：
```
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

间距使用规则：
- 相关元素之间：space-2到space-3（紧凑关联）
- 同一区块内的段落之间：space-4到space-6
- 不同区块之间：space-8到space-12
- 页面边距：space-6到space-8
- 卡片内边距：space-4到space-6

### 4. 圆角体系
```
--radius-sm: 4px    → 小标签、badge
--radius-md: 8px    → 按钮、输入框
--radius-lg: 12px   → 卡片、面板
--radius-xl: 16px   → 大卡片、弹窗
--radius-full: 9999px → 圆形头像、药丸标签
```

### 5. 阴影体系
```
--shadow-sm: 用于微浮起（按钮hover）
--shadow-md: 用于卡片
--shadow-lg: 用于弹窗、浮层
```

### 6. 动效规范
```
--duration-fast: 150ms     → hover状态切换、颜色变化
--duration-normal: 250ms   → 面板展开/收起、tab切换
--duration-slow: 400ms     → 页面转场、模态框出现
--easing-default: cubic-bezier(0.4, 0, 0.2, 1)  → 通用缓动
--easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1) → 弹性效果
```

动效规则：
- 所有可交互元素必须有hover和active状态反馈
- 状态切换（展开/收起、显示/隐藏）必须有过渡动画，不允许瞬间出现/消失
- 动画方向遵循自然逻辑：展开从上到下，收起从下到上，弹窗从中心放大
- 列表项使用交错延迟（staggered delay），间隔50-80ms
- 加载状态使用骨架屏或脉冲动画，不使用旋转菊花图标