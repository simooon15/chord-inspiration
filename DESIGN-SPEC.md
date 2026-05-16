# 设计规范文档 · 和弦灵感生成器

> 基于 Apple iOS 26 Liquid Glass 设计语言 + 项目实战定版参数
> 日期：2026-05-16

---

## 一、设计哲学

### 1.1 核心原则（来自 iOS 26 HIG）

| 原则 | 说明 |
|------|------|
| **玻璃是功能层** | Liquid Glass 仅用于控件和导航，绝不用于内容 |
| **内容层保持清晰** | 卡片、文字、数据使用纯色或 standard material |
| **控件与内容分明** | 玻璃半透 + blur 的控件浮在纯色内容之上 |
| **克制使用玻璃** | 主要操作 1-2 个玻璃控件，不过度 |
| **层级通过纵深表达** | 玻璃控件在上，内容在下，阴影辅助层次 |

### 1.2 项目特有原则

- **内容优先**：和弦是主角，字号最大、位置居中
- **零摩擦启动**：默认流行、无需登录、打开即用
- **控件退让**：按钮和选择器不抢内容的视觉权重
- **呼吸感**：区块间距清晰，三块结构一眼可辨

---

## 二、色彩体系

### 2.1 色板（定版）

```css
--bg: #f0f3ed;              /* 页面背景 — 暖调浅绿白 */
--surface: #fafdf6;          /* 卡片表面 — 微暖白，带标准材质层次 */
--text: #1e2618;             /* 主文字 — 深绿黑 */
--text-secondary: #6b7862;   /* 次要文字 — 中灰绿 */
--text-tertiary: rgba(30,38,24,0.35); /* 三级文字 */
--accent: #4f6d3a;           /* 强调色 — 森林绿 */
--accent-subtle: rgba(79,109,58,0.08); /* 强调色微底 */
```

### 2.2 Liquid Glass 色彩规则（来自 HIG）

- 玻璃控件**不使用固定颜色**，颜色来自背后内容的动态采样
- Web 端近似方案：`rgba(79,109,58,0.20)` + `backdrop-filter: blur(16px) saturate(1.4)`
- 前景文字仅用语义色（`.primary` / `.secondary`），不用 `#000` 或 `#fff`
- 强调色仅用于：主操作按钮、当前选中态、焦点环
- 禁用态：浅色背景 + 灰字，不透明度 ~40%

### 2.3 使用比例

- 强调色 ≤ 10% 视觉面积（Restrained 策略）
- 玻璃控件不透明度：主按钮 16-20%，辅助控件 48-52%，再换一组 12-14%

### 2.4 玻璃特效参数（Web 端模拟）

| 参数 | 主按钮 | 辅助按钮/选择器 | 说明 |
|------|--------|----------------|------|
| 背景不透明度 | 20% | 48-52% | `rgba()` alpha 值 |
| `backdrop-filter: blur()` | 16-18px | 16-18px | 模糊半径 |
| `saturate()` | 1.4-1.5 | 1.4-1.5 | 色彩增强 |
| 顶部边光 | `inset 0 1px 0 rgba(255,255,255,0.35)` | 同 | 玻璃边缘受光面 |
| 底部投影 | `0 2px 8px rgba(0,0,0,0.06)` | 同 | 层次深度 |

### 2.5 文字色对比度（WCAG）

| 组合 | 前景 | 背景 | 对比度 | 达标 |
|------|------|------|--------|------|
| 主文字 → 卡片 | `#1e2618` | `#fafdf6` | ~12:1 | AAA ✓ |
| 次要文字 → 卡片 | `#6b7862` | `#fafdf6` | ~4.5:1 | AA ✓ |
| 按钮文字(绿) → 玻璃 | `#4f6d3a` | 20%绿底 | ~3.5:1 | 可接受 |
| 白字 → 按压态 | `#fff` | 4%绿底 | ~15:1 | AAA ✓

---

## 三、排版体系

### 3.1 字体（SF Hierarchy 适配 Web）

| 用途 | 字体 | 字重 | 字号 | iOS 对应 |
|------|------|------|------|---------|
| 页面标题「和弦灵感」 | Iowan Old Style / Palatino / Georgia / Noto Serif SC 衬线栈 | 650 | `calc(var(--body-size) + 7px)` = 22px | `.title2` |
| 和弦名称（主角） | 同上衬线栈 | 700 | 32px | `.title` ~ `.largeTitle` |
| 和弦级数 | 同上衬线栈 | 600 | 17px | `.headline` |
| 构成音 | 系统 sans-serif | 400 | `calc(var(--body-size) - 1px)` = 14px | `.subheadline` |
| 按钮文字 | 系统 sans-serif | 600 | 15px | `.body` |
| 选择器文字 | 系统 sans-serif（风格）/ 衬线栈（调性） | 500-600 | 15px | `.body` |

### 3.2 排版规则（来自 HIG）

- **一个字体家族优先**：产品 UI 通常一个无衬线足够。但和弦名称作为内容主角，可用衬线突出
- **固定 rem 缩放**，不要 `clamp()` 流体字号
- **层级对比**：字号比例 ≥ 1.25（标题 22px → 和弦 32px = 1.45 ✓）
- **行宽**：正文 65-75ch，数据和紧凑 UI 可以更窄
- **Dynamic Type**：尊重系统字体设置

---

## 四、间距体系（8pt Grid）

### 4.1 标准间距倍率（来自 HIG）

| 名称 | 值 | 本项目使用场景 |
|------|-----|--------------|
| 超小 | 4pt | — |
| 小 | 8pt | 调性 & 风格选择器之间 |
| 默认 | 12pt | — |
| 中 | 16pt | 按钮内部垂直 padding |
| 大 | 20pt | 选择器行 → 按钮 |
| 加大 | 24pt | 标题 → 选择器行 |
| 特大 | 32pt | 按钮 → 和弦区 / 和弦区 → 再换一组 |
| XXL | 40pt | — |
| XXXL | 64pt | — |

### 4.2 安全区域

```css
/* 顶部 — 状态栏 ~54pt + 呼吸间距 18pt */
padding-top: 72px;

/* 底部 — iPhone 横条 home indicator ~34pt */
padding-bottom: max(48px, env(safe-area-inset-bottom));
```

### 4.3 项目定版间距

```css
/* 手机框 */
padding: 72px 24px max(48px, env(safe-area-inset-bottom));

/* 标题 → 选择器 */
.header-row { margin-bottom: 24px; }

/* 选择器行 → 给我灵感 */
.controls-row { margin-bottom: 20px; }

/* 选择器之间 */
.controls-row { gap: 8px; }

/* 给我灵感 → 和弦区 */
.chord-section { margin: 32px auto; }

/* 和弦行间距 */
--gap: 14px;

/* 和弦卡片左右内边距 */
--card-pad-x: 24px;

/* 和弦区 → 再换一组 */
/* 通过 chord-section margin-bottom: 32px 实现 */
```

---

## 五、圆角体系（同心系统）

### 5.1 核心公式（来自 HIG）

```
内层圆角 = 外层圆角 - 内边距
```

### 5.2 本项目应用

| 元素 | 圆角值 | 类型 | 依据 |
|------|--------|------|------|
| 手机框 | 40px | Fixed，近似 iPhone 屏幕圆角 | iOS HIG |
| 和弦卡片 | 20px | Fixed，iOS 卡片标准 | 14-20pt |
| 主按钮 | 9999px | Capsule | iOS 标准胶囊形 |
| 再换一组 | 9999px | Capsule | 同上 |
| 选择器 | 9999px | Capsule | 同上 |

### 5.3 卡片宽度

```css
--card-width: 96%;
```
- 和弦卡片比全宽控件（按钮、选择器）略窄
- 96% ≈ 每边 2% 内收，视觉上区分「内容区」和「控件区」
- 全宽 = 100% 会像设置列表，失去层次

### 5.4 曲率说明

- **CSS `border-radius` 只能做圆弧**，Apple 使用超椭圆（Squircle n≈5）
- Web 端无法完美复现，通过正确比例（40/20）和对齐弥补
- 胶囊形（9999px）天然不存在圆弧 vs 超椭圆差异

---

## 六、阴影与层次

### 6.1 规则（来自 HIG）

- **玻璃控件自动处理深度**，不建议叠加手动阴影
- **内容卡片**可用微妙阴影表示层级
- Liquid Glass 阴影是**系统管理**的，不固定值

### 6.2 本项目应用

```css
/* 和弦卡片（内容层，standard material） */
box-shadow: 0 1px 4px rgba(0,0,0,0.06);  /* 可调滑杆控制 */

/* 玻璃控件（glass layer） */
box-shadow:
  inset 0 1px 0 rgba(255,255,255,0.35),   /* 顶部白色玻璃边光 */
  0 2px 8px rgba(0,0,0,0.06);             /* 微妙底部投影 */
```

---

## 七、交互与动效

### 7.1 iOS 26 动效标准（来自 HIG）

| 动作 | 曲线 | 时长 | 参数 |
|------|------|------|------|
| 按钮按下 | 瞬时 + 弹簧释放 | 0.45s | 缩放至 0.88，松手 spring 回弹 |
| 列表入场 | 阶梯淡入 | 0.35s/项 | 延迟 0.06s |
| 页面转场 | `.bouncy` | 0.4-0.6s | extraBounce 0.1-0.2 |

### 7.2 本项目定版动效

```css
/* 按钮/和弦卡片 — 瞬时压入 + 弹簧释放 */
transition: transform 0.45s cubic-bezier(0.34,1.80,0.64,1);
:active {
  transform: scale(0.88);
  transition: transform 0s;  /* 瞬时压入 */
}

/* 选择器 — 轻微缩放 + 平滑释放 */
.ctrl-select:active {
  transform: scale(0.97);
  transition: transform 0s;
}
/* 默认无 transform 过渡 — blur() 即刻关闭 */
```

### 7.3 Mac 轻点兼容

- Mac 触控板「轻点」只触发 `click`，不触发 `pointerdown` → `:active` 无效
- **JS 兜底**：`pointerdown` 未触发时，`click` 加 `.tapped` 类触发动画
- **防双触发**：`pointerdown` 标记 `wasPressed`，按压过的不再叠加 `.tapped`
- `animationend` 自动清除 `.tapped`

### 7.4 缓动曲线速查

| 用途 | cubic-bezier | 说明 |
|------|-------------|------|
| 按压释放（Q弹） | `cubic-bezier(0.34,1.80,0.64,1)` | 1.80 overshoot 产生回弹感 |
| 轻柔释放 | `cubic-bezier(0.2,0.9,0.4,1)` | 无 overshoot，平滑 |
| 选择器释放 | `ease-out` | 极简，不抢注意力 |
| 瞬时压入 | `cubic-bezier(0,0,1,1)` → `transition: 0s` | 0 秒过渡 |

### 7.5 入场动画细节

```css
/* 和弦卡片阶梯入场 */
@keyframes chordIn {
  from { opacity: 0; transform: translateX(-8px); }
  to { opacity: 1; transform: translateX(0); }
}
/* 每张卡片延迟 0.06s，总时长 0.35s/张 */
.chord-item:nth-child(1) { animation-delay: 0s; }
.chord-item:nth-child(2) { animation-delay: 0.06s; }
.chord-item:nth-child(3) { animation-delay: 0.12s; }
.chord-item:nth-child(4) { animation-delay: 0.18s; }

/* Mac 轻点兜底动画 */
@keyframes tapPop {
  0%   { transform: scale(1); }
  30%  { transform: scale(0.85); }
  100% { transform: scale(1); }
}
```

### 7.6 减弱动效偏好

```css
@media (prefers-reduced-motion: reduce) {
  .chord-item.animate-in { animation: none; }
  .gen-btn, .refresh-btn { transition: none; }
  .chord-item { transition: none; }
}
```

### 7.7 触摸目标（来自 HIG）

- 最小 44×44pt
- 按钮 padding: 16px 垂直 = 16+16+font ≈ 47px ✓

---

## 八、控件规范

### 8.1 层次模型

```
Glass 层（z轴上方）
├── 选择器（glass-regular, blur 16px, 48-54% 白底）
├── 给我灵感（glass-prominent, blur 16px, 20% 绿底）
└── 再换一组（glass-regular, blur 16px, 14% 灰底）

Content 层（z轴下方）
└── 和弦卡片（纯白/微暖白, standard material 阴影）
```

### 8.2 按钮状态矩阵

| 状态 | 主按钮 | 辅助按钮 | 选择器 |
|------|--------|---------|--------|
| 默认 | 20% 绿底 + 白字绿 | 14% 灰底 + 文字色 | 48% 白底 + 文字色 |
| 悬停（桌面） | 10% 绿底 + 微光晕 | 7% 灰底 + 微光晕 | — |
| 按压 | scale(0.88) + 4% 绿底 + 光晕扩散 28px | scale(0.88) + 2% 灰底 + 光晕扩散 28px | scale(0.97) + 光晕 20px |
| 焦点 | 2px 绿 outline offset 3px | 2px 绿 outline offset 2px | 2px 绿 outline offset 2px |

### 8.3 组件状态完整性（来自 HIG）

每个交互元素必须有：**default, hover, focus, active, disabled**。本项目已覆盖。

---

## 九、选择器特殊行为

### 9.1 `<select>` 原生限制

- iOS/macOS 的 `<select>` 弹出原生菜单，拦截 `:active` CSS 和触摸事件
- `change` 事件在选择完成后触发
- `focus` 状态在选择后保持，`:focus-visible` outline 不自动消失

### 9.2 本项目处理方案

```js
// 选择后立即 blur，消除绿框
styleSelect.addEventListener('change', () => {
  currentStyle = styleSelect.value;
  styleSelect.blur();  // 即刻关闭、去绿框
});

// 调性选择：blur 提前，避免 remapResult 阻塞关闭
keySelect.addEventListener('change', () => {
  keySelect.blur();    // 先关
  const newKey = keySelect.value;
  if (lastProgression && newKey !== currentKey) remapResult(newKey);
  currentKey = newKey;
});
```

### 9.3 选择器动效

- 按压缩放 `0.97`（比按钮 0.88 更克制——选择器尺寸小）
- 默认状态无 `transform` 过渡 → `blur()` 关闭瞬间完成
- 焦点环 `2px solid var(--accent)` offset 2px

---

## 十、状态处理

### 10.1 空状态
- 页面加载时：和弦卡片区不显示，等待用户点击「给我灵感」
- 无特殊空状态占位——默认「流行」已选中，减少摩擦

### 10.2 加载/生成状态
- 纯前端静态数据 + `Math.random()`，无网络请求
- 生成和弦无延迟，无需 loading 状态

### 10.3 错误状态
- 无网络请求 → 无网络错误
- 无表单验证 → 无表单错误
- 「给我灵感」初始禁用态已移除（默认流行已选）

### 10.4 禁用状态
```css
.gen-btn:disabled {
  background: rgba(79,109,58,0.18);   /* 浅绿底 */
  color: rgba(255,255,255,0.55);      /* 半透白字 */
  box-shadow: none;
  cursor: not-allowed;
}
```

---

## 十一、可访问性

### 11.1 键盘导航
- 所有交互元素是原生 `<button>` 或 `<select>`，天然支持 Tab 导航
- `:focus-visible` 为所有控件提供 2px outline
- Tab 顺序：调性 → 风格 → 给我灵感 → 和弦卡片（不可聚焦，仅展示）→ 再换一组

### 11.2 屏幕阅读器
- 🎵 图标标记 `aria-hidden="true"`
- 按钮文字即标签（无需额外 `aria-label`）
- `<label for="keySelect">` 已关联选择器

### 11.3 色彩对比度
- 所有文字组合满足 WCAG AA 或 AAA（见 2.5 节）

### 11.4 减少动画
- `prefers-reduced-motion: reduce` 禁用所有动效（见 7.6 节）

### 11.5 缩放
- 不禁止用户缩放（无 `user-scalable=no`）
- `touch-action: manipulation` 仅优化触摸延迟

---

## 十二、性能

### 12.1 GPU 合成层
- `will-change: transform` 给所有交互元素 → 提前分配 GPU 层
- `backdrop-filter` 在 iOS Safari 性能昂贵 → 仅用于 4 个控件

### 12.2 动画性能
- 所有动画使用 `transform` 和 `opacity`（合成器属性，不触发重排）
- 不动画 layout 属性（width/height/padding/margin）

### 12.3 数据量
- 和弦数据 5 风格 × 16 组 = 80 条，纯静态 JSON
- 无网络请求、无数据库、无框架依赖

---

## 十三、Web 端已知限制

| 限制 | iOS Native | Web 实现 | 影响 |
|------|-----------|---------|------|
| 连续曲线 (Squircle n≈5) | 原生支持 | CSS 只能做圆弧 | 大圆角下有细微差异 |
| 实时动态玻璃着色 | GPU 实时采样 | `backdrop-filter` 静态模糊 | 玻璃不随内容变色 |
| 方向性光影 (edge light) | 系统自动 | 手动 `inset` 模拟 | 顶光效果需硬编码 |
| 原生胶囊按钮 | `.capsule` shape | `border-radius: 9999px` | 完全等效 ✓ |
| 弹簧动画 | SpringAnimation | `cubic-bezier` 近似 | 回弹感基本一致 |
| `<select>` 原生菜单 | 系统控件 | 浏览器原生 | 无法定制样式 |

---

## 十四、设备适配计划

| 版本 | 设备 | 策略 |
|------|------|------|
| V1.0 MVP | 手机竖屏 375-414px | 唯一适配 |
| V2.0 | iPad 竖/横屏 768-1024px | 响应式扩展：字号加大 + 卡片宽度自适应 |

---

## 十五、图标

- 使用 Iconoir Spark（4 瓣贝塞尔曲线火花）
- `stroke-width: 1.5`, `stroke-linejoin: round`
- `transform: scaleY(1.45)` 纵向拉伸
- 颜色跟随 `--accent`

---

## 十六、设计流程 SOP

### 16.1 用户发起「设计一个页面」

当用户说「帮我设计 XX 页面」时，按以下步骤执行：

1. **不直接生成 prototype**。先确认布局和功能需求。
2. **生成 `tuner.html`**：左侧手机框预览 + 右侧完整参数面板。
3. 用户在 tuner 里拖滑杆、改颜色、调间距，实时看到效果。
4. 调满意后，用户点「复制参数」→ 粘贴给我 → 我同步生成 `prototype.html`。

### 16.2 Tuner 创建规范

**文件命名**：`tuner.html`（或 `tuner-<风格>.html` 如需多版本）。

**结构**：
```
左侧（.preview）            右侧（.panel）
┌─ 手机框 ─────────┐      ┌─ 参数面板 ─────────┐
│  ♫ 标题           │      │  色彩取色器 × 5      │
│  [控件区]         │      │  字号滑块 × 2        │
│  [给我灵感]       │      │  动效滑块            │
│  [和弦卡片 × 4]   │      │  间距滑块 × 5        │
│  [再换一组]       │      │  圆角滑块 × 2        │
│                   │      │  阴影滑块            │
│  (纯设计内容)     │      │  ↻ 预览入场动画      │
└───────────────────┘      │  [复制参数]          │
                           └──────────────────────┘
```

**核心规则**：
- **手机框只放最终界面上存在的元素**。重播按钮、调试开关一律在右侧面板。
- **所有视觉属性用 CSS 变量**（`--bg`, `--accent`, `--radius-sm` 等），JS 通过 `phoneFrame.style.setProperty()` 注入。
- 每个滑杆/取色器改变时触发 `updatePreview()`，即时刷新左侧预览。
- 「复制参数」按钮输出完整的 CSS 变量清单。

### 16.3 Tuner 必备参数模块

```
色彩：  bg, surface, surfaceAlpha(不透明度), text, text-secondary, accent
排版：  chord-size, body-size
动效：  anim-speed
间距：  gap(行间距), card-pad-x(内边距), card-width(卡片宽度)
圆角：  radius-sm(卡片), radius(手机框)
阴影：  card-shadow(强度)
```

### 16.4 交互预览

- Tuner 必须包含和弦数据、调性映射、随机生成逻辑——左侧是可操作的完整 Demo，不是静态图。
- 入场动画重播按钮：点击后触发阶梯滑入动效，让用户直观感受动画速度和节奏。
- 选择器 `change` 后必须 `.blur()`，避免绿框残留。

### 16.5 从 Tuner 到 Prototype

1. 用户在 Tuner 调好参数，点「复制参数」
2. 用户粘贴参数给我
3. 我写入 `prototype.html` 的 `:root` 变量
4. Prototype 不包含参数面板——只有最终 UI

### 16.6 修改前读代码（强制）

每次 Edit 前必须 Read 目标代码段。改完后整体检查：
- const 声明顺序（无 TDZ ReferenceError）
- CSS 规则无重复/冲突（如两处 `:active` 同时生效）
- 事件监听无双触发路径（如 `:active` + `click` 叠加）
- 删除代码后无残留引用（CSS 类名、JS 选择器、HTML id）
- 输出检查结论，即使「未发现 bug」也要明确说

---

## 十七、反模式清单

| 反模式 | 为什么错 |
|--------|---------|
| 内容卡片用玻璃 | 混合 glass/content 层级 |
| 纯黑/纯白 | 应该 tint 偏向品牌色调 |
| `transition: all` | 性能差，列出具体属性 |
| `outline: none` 无反代 | 键盘可访问性丧失 |
| `user-scalable=no` | 阻止用户缩放，反可访问性 |
| 深色边框表示玻璃边缘 | 玻璃边缘是光，不是框 |
| 悬停用蓝色/紫色渐变 | AI slop，没辨识度 |
| 按钮直径 < 44px | 不符合 HIG 触摸目标 |

---

## 十八、技能参考

本项目参考的 vabole/apple-skills：
- `hig` — 完整 Apple Human Interface Guidelines（布局、颜色、材质、排版、按钮）
- `ios-liquid-glass` — Liquid Glass API 与设计原则
- `ios-design-consultant` — UX/视觉设计顾问

其他使用过的技能：
- `web-design-guidelines` — Web 端可访问性审查
- `frontend-design` — 原型生成
- `impeccable` — 设计精调（product register, bolder）
- `better-icons` — Iconify 图标搜索

---

## 十九、定版 CSS 变量清单

```css
--bg: #f0f3ed;
--surface: #fafdf6;
--text: #1e2618;
--text-secondary: #6b7862;
--accent: #4f6d3a;
--chord-size: 32px;
--body-size: 15px;
--anim-speed: 800ms;
--gap: 14px;
--card-pad-x: 24px;
--card-width: 96%;
--radius-sm: 20px;
--radius: 40px;
--card-shadow: 3;
```
