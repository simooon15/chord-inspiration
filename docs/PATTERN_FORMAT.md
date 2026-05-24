# 节奏型 Pattern 格式说明

> 供 AI Agent/模型 生成节奏型数据的接口规范

## 文件位置

`src/rhythm/patterns.ts`，`ALL_PATTERNS` 数组中新增条目。

## 数据结构

```typescript
type TimeSignature = '4/4' | '3/4' | '6/8';
type StrumDirection = 'down' | 'up';
type StrumSlot = StrumDirection | null;

interface BeatGrid {
  subdivision: number;    // 每拍子分格数
  slots: StrumSlot[];     // 长度 === subdivision
  durations?: number[];   // [可选] 每个 slot 的持续时长（16分音符单位）
}

interface RhythmPattern {
  id: string;            // 唯一标识，kebab-case
  name: string;          // 中文名
  timeSignature: TimeSignature;
  beats: BeatGrid[];     // 长度 = beatsPerBar × barCount
  barCount: number;      // 1=单小节, 2=两小节
}
```

## 引擎如何读取

```
每 tick 推进一个 slot → 如果 slots[i] 非 null → 触发扫弦
  ├─ direction: 'down' → 6根弦低→高, 12ms/弦, velocity 基值=80
  └─ direction: 'up'   → 3根弦高→低, 8ms/弦, velocity 基值=56

duration → velocity 映射（在 audio.ts playStrumSF2 中计算）:
  ├─ duration=1 (150ms)  → ×1.0  基准力度
  ├─ duration=2 (300ms)  → ×1.15 中等重音（down≈92, up≈64）
  ├─ duration=3 (450ms)  → ×1.3  强重音（down≈104, up≈72）
  └─ duration=4 (600ms)  → ×1.45 超强重音（down≈116, up≈81）

beats[currentBeat].subdivision → 决定了该拍包含多少个 slot
  当 currentSlot >= subdivision 时 ➜ 进入下一拍
  当 currentBeat >= beats.length 时 ➜ 回到 beat=0（循环）
```

## slot 字符速记

有两个内置辅助函数帮你写数据：

```typescript
slots('DDU.'):  // D=down, U=up, .=null
  → ['down', 'down', 'up', null]

beat('D...', 'D.DU', '.UD.', 'D.DU'):
  // 自动取第一个字符串的长度作为 subdivision
  // 等价于 4 个 { subdivision:4, slots: ... }
```

## 拍号 × 拍数 × 格子数速查

| 拍号 | barCount | beats 长度 | 建议 subdivision | 每拍格子数 | 每小节tick数 |
|------|----------|-----------|-----------------|-----------|-------------|
| 4/4  | 1        | 4         | 4（十六分）       | 4         | 16          |
| 4/4  | 2        | 8         | 4               | 4         | 16（循环2次） |
| 3/4  | 1        | 3         | 4               | 4         | 12          |
| 6/8  | 1        | 6         | 3（三连音）       | 3         | 18          |

> `beats.length = beatsPerBar × barCount`，例如 4/4 barCount=2 → beats.length=8

## 完整模板

```typescript
{
  id: '你的唯一标识',
  name: '中文名称',
  timeSignature: '4/4',  // 支持 '4/4' | '3/4' | '6/8'
  barCount: 1,           // 支持 1 或 2
  beats: [
    // ═══ Bar 1 ═══
    { subdivision: 4, slots: slots('D...'), durations: [4, 0, 0, 0] },
    { subdivision: 4, slots: slots('D.DU'), durations: [2, 0, 1, 1] },
    { subdivision: 4, slots: slots('.UD.'), durations: [0, 1, 1, 0] },
    { subdivision: 4, slots: slots('D.DU'), durations: [2, 0, 1, 1] },
    // 如果 barCount=2，再加 4 个 beat：
    // { subdivision: 4, slots: slots('...'), durations: [...] },
    // ...
  ],
}
```

## 编写指南

### 1. slot 字符串每拍一个，长度 = subdivision

```
subdivision=4（十六分音符粒度）:
  字符串长度 4：D.U. 表示 [下, 空, 上, 空]

subdivision=3（三连音粒度，6/8 用）:
  字符串长度 3：D.. 表示 [下, 空, 空]

subdivision=2（八分音符粒度，不推荐——无法控制力度）:
  字符串长度 2：DU 表示 [下, 上]
```

> ⚠️ 尽量用 `subdivision: 4`（十六分音符），才能通过 `durations` 区分力度。
> `subdivision: 2` 的 slot duration 固定，所有 strum 力度一样。

### 2. durations 控制力度（而非精确音符时值）

`durations[i]` = 该 slot 的持续时长（单位=16分音符），传递给 audio.ts：

| duration | 对应力度 | 适用场景 |
|----------|---------|---------|
| 1（默认）| ×1.0 基准 | 普通扫弦、上扫 |
| 2        | ×1.15 中重音 | 强拍下扫 |
| 3        | ×1.30 强重音 | 重音、反拍重音 |
| 4        | ×1.45 超强 | 和弦起手、结尾 |

**不填** 则默认 `1`（基准力度）。

**规则**：
- 不同 duration 的交替产生「弹奏感」
- 同一个 pattern 内，用 duration 差异区分重音和普通音
- `null slot` 的 duration 写 0（不会被触发）

### 3. 常见的 8th note 节奏在 subdivision=4 下的写法

| 节奏型 | slot 字符串 | durations | 说明 |
|--------|-----------|-----------|------|
| 下+上 | `D.U.` | `[2,0,2,0]` | 标准8分 |
| 下+下 | `D.D.` | `[2,0,3,0]` | 下+重音下 |
| 下+下+上 | `D.DU.` | `[2,0,1,1]` | 切分 |
| 下+上+下 | `DUD.` | `[1,0,1,0]` | 十六分交替（快扫）|
| 前八后十六 | `D.DU` | `[2,0,1,1]` | 前八(2) + 十六(1) + 十六(1) |
| 全十六分 | `DDDU` | `[1,1,1,1]` | 四个连续十六分 |

### 4. 两小节 pattern 的 beats 排列

`beats[0..3]` = Bar 1 的 4 拍，`beats[4..7]` = Bar 2 的 4 拍（4/4 下）。

如果第二小节的某一拍和第一小节不同，显式写出对应的 BeatGrid。

### 5. 名称和 ID 约定

```typescript
id: 'folk_basic_2bar',      // 小写kebab，风格_描述_小节数
name: '光辉岁月·两小节',    // 中文名，可用「·」分隔风格和描述
```

## 生成例子你想让我帮你测试的话

直接给出以下格式的 pattern 数据，我会帮你：

1. 写入 `src/rhythm/patterns.ts`
2. 更新 PRD/TECHNICAL_SPEC 中的总数
3. 更新飞书知识库文档
4. commit + push + deploy 到 GitHub Pages

```typescript
{
  id: 'your_pattern_id',
  name: '你的节奏型名称',
  timeSignature: '4/4',
  barCount: 1,
  beats: [
    { subdivision: 4, slots: slots('D.U.'), durations: [2, 0, 2, 0] },
    { subdivision: 4, slots: slots('D.D.'), durations: [2, 0, 3, 0] },
    { subdivision: 4, slots: slots('D.D.'), durations: [2, 0, 3, 0] },
    { subdivision: 4, slots: slots('D.D.'), durations: [2, 0, 3, 0] },
  ],
}
```
