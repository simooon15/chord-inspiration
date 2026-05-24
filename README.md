<div align="center">

# 和弦灵感生成器 — Chord Inspiration

**给略懂乐理但卡在套路的爱好者 — 一个不仅能看、还能听和记的完整创作工作台**

</div>

## 项目背景

和弦灵感生成器是一个面向「中间层」音乐创作者的移动端 Web 工具。如果你：

- 学过一点乐理，知道和弦级数的概念
- 能弹几首弹唱，但自己想创作时只会那几套进行
- 拿起琴脑子一片空白，缺素材但不知道去哪找

这个工具就是为你准备的。打开网页 → 选调性 → 点一下 → 获得一组随机和弦进行。不需要登录、不需要安装、不需要任何配置。

---

## v2.1 新特性 — 相比 v2.0 的变化

<details open>
<summary><b>🎸 节奏型系统 — 从「匀速琶音」到「有律动的完整伴奏」</b></summary>

v2.1 的核心变化：给试听加上节奏。三个独立开关自由组合，节拍器 + 扫弦节奏型 + 和弦音色，让用户听到的不再是机械的匀速琶音，而是有方向感、有律动的真实吉他伴奏。

### 新增功能

- **🎛️ 三开关自由组合** — 节拍器 / 节奏型 / 和弦，互不锁定，7 种有效组合
- **🕐 节拍器底座** — 正弦波 click 声，强拍区分（1000Hz / 700Hz），BPM 40-200 + 4/4｜3/4｜6/8 拍号
- **🎸 15 套内置节奏型** — 含 6 套两小节 pattern（光辉岁月、蓝莲花、Disco 等），下拉选择 + 预览网格
- **🔊 SF2 真人吉他音色** — spessasynth_lib + 92MB SoundFont 钢弦吉他采样，下扫↑（6弦，12ms/弦）、上扫↓（3弦，8ms/弦）方向区分
- **🎼 1 小节预备拍** — 点击播放先 count-in，之后自动进入完整伴奏
- **💓 和弦卡片呼吸脉动** — 节奏播放中当前和弦卡片 scale 循环呼吸（Infinity spring）
- **📐 两小节预览网格** — 支持 barCount=2 的节奏型分两行展示，实时播放位置高亮

### 技术亮点

- **rAF 时钟引擎**：`requestAnimationFrame` + `performance.now()` 驱动 tick 循环，替代 setInterval，6/8 拍 bpmFactor 自动换算
- **SF2/fallback 双轨音频**：SF2 就绪时用真人采样，未就绪时自动回退到双 sawtooth + 吉他滤波器链
- **音符跟踪止音**：allStrumNotes Set 追踪 + 和弦切换时批量 noteOff，防止 SF2 复音数耗尽
- **onTick 节流**：16分音符级 tick → 拍级 React re-render，网格高亮用 spring animation 平滑过渡
- **pending config 机制**：播放中 BPM/拍号/pattern 变更排队到下一 bar 边界生效，开关类变更立即生效

</details>

---

## v2.0 新特性 — 相比 v1.0.1 的变化

<details>
<summary><b>🏗️ 从「静态展示页面」到「完整创作工作台」的全面升级</b></summary>

v2.0 是从「静态展示页面」到「完整创作工作台」的一次全面升级。

### 技术架构重构

| 维度 | v1.0.1 | v2.0 |
|------|--------|------|
| 技术栈 | 纯 HTML/CSS/JS 单页，零依赖 | Vite + React 19 + TypeScript + TailwindCSS v4 |
| 动画 | CSS keyframes + transition | Framer Motion spring 物理引擎（12 套独立参数） |
| 和声数据 | 每个进行一个硬编码数组，~80 组 | 结构化 `ChordTemplate`，77 组，含品质/级数/描述/示例歌曲 |
| 转调引擎 | 12 调硬编码大数组 | 自底向上 rootOffset + quality 偏移系统 + 同音异名拼写算法 |

### 新增功能

- **🎹 Web Audio 试听** — 三角波合成器 + 800Hz 低通滤波器模拟 Rhodes 电钢琴音色，支持循环播放和单和弦琶音试听，速度可调（1.2-2.6s/级）
- **🎸 SVG 吉他指法图** — 点击和弦卡片展开 6 弦 5 品指位图，横按高品自适应偏移，含 TAB 文本和构成音名
- **📝 创作面板** — 每个进行绑定随笔笔记本（LocalStorage 400ms 防抖存盘）+ 哼唱录音（MediaRecorder → IndexedDB）
- **❤️ 收藏夹工作台** — 底部侧滑抽屉，行内笔记/录音管理，一键载入使用
- **🎼 双记谱模式** — 纳什维尔数字 ↔ 罗马记号即时切换
- **📖 乐理说明弹窗** — 级数概念、双记谱法、转调原理内嵌帮助

### 技术亮点

- **乐理转调引擎**：12 调不硬编码，通过半音偏移 + 调性同音异名拼写算法（preferFlat + 级数升降标志）动态计算
- **音频安全架构**：ADSR 包络消除 click 爆音、均分复音增益防 clipping、MIDI 48-80 区间锁定、严格麦克风流释放
- **双规存储**：LocalStorage（收藏/笔记/元数据 5MB 级）+ IndexedDB（录音 Blob 大容量）
- **13 种和弦品质**：从大三小三到 dim7、m7b5、7b9、13，覆盖流行/民谣/摇滚/爵士/R&B 五大风格
- **吉他指法图**：150+ 组硬编码指位，同音异名回退 + 安全兜底，baseFret 自适应高品偏移

</details>

---

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:3000）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 技术栈

| 层级 | 选型 |
|------|------|
| 构建 | Vite 6 |
| 框架 | React 19 |
| 语言 | TypeScript ~5.8 |
| 样式 | TailwindCSS v4 |
| 动画 | motion (Framer Motion) 12.x |
| 图标 | lucide-react |
| 字体 | Noto Serif SC / Inter / JetBrains Mono |
| 音频 | Web Audio API + spessasynth_lib 4.x + SF2 SoundFont |

## 项目结构

```
src/
├── types.ts              # 核心接口 + 和弦/录音类型
├── chordsData.ts         # 77 组和弦进行（5 风格）+ 调性/风格元数据
├── audio.ts              # AudioSynth: SF2采样 + 三角波fallback + 节拍器
├── utils.ts              # 乐理转调引擎（13 品质 × 12 调）
├── guitarChords.ts       # 150+ 组吉他指法数据
├── utils/
│   └── db.ts             # IndexedDB 音频 Blob 管理器
├── rhythm/               # [v2.1 新增]
│   ├── types.ts          # 节奏型类型定义（TimeSignature, BeatGrid, EngineConfig...）
│   ├── patterns.ts       # 15 套内置节奏型（4/4×7 + 3/4×5 + 6/8×3）
│   └── engine.ts         # rAF 驱动播放调度引擎（tick/预备拍/和弦切换/pending config）
├── components/
│   └── ChordCard.tsx     # 和弦卡片 + SVG 指法图 + 节奏脉动
└── App.tsx               # 主应用（25+ state + 4 ref + 节奏面板 UI）
public/
├── samples/
│   └── Acoustic_Guitars_JNv2.4.sf2  # 钢弦吉他 SF2 (92MB, .gitignore)
└── worklet/
    └── spessasynth_processor.min.js # spessasynth_lib AudioWorklet
```

## 文档

| 文档 | 版本 | 链接 |
|------|------|------|
| PRD | V2.1 | [docs/V2.1-PRD.md](docs/V2.1-PRD.md) |
| 设计规范 | V2.1 | [docs/V2.1-DESIGN_SPEC.md](docs/V2.1-DESIGN_SPEC.md) |
| 技术规范 | V2.1 | [docs/V2.1-TECHNICAL_SPEC.md](docs/V2.1-TECHNICAL_SPEC.md) |
| PRD | V2.0 | [docs/V2.0-PRD.md](docs/V2.0-PRD.md) |
| 设计规范 | V2.0 | [docs/V2.0-DESIGN_SPEC.md](docs/V2.0-DESIGN_SPEC.md) |
| 技术规范 | V2.0 | [docs/V2.0-TECHNICAL_SPEC.md](docs/V2.0-TECHNICAL_SPEC.md) |
| 和弦数据字典 | — | [docs/CHORD_DATABASE.md](docs/CHORD_DATABASE.md) |
| AI 编码指引 | — | [AGENTS.md](AGENTS.md) |

## 许可

MIT

---

**版本**：v2.1 | **在线体验**：[simooon15.github.io/chord-inspiration](https://simooon15.github.io/chord-inspiration/)
