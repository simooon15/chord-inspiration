import { RhythmPattern, StrumSlot } from './types';

function slots(s: string): StrumSlot[] {
  return s.split('').map(c => c === 'D' ? 'down' : c === 'U' ? 'up' : null);
}

export const ALL_PATTERNS: RhythmPattern[] = [
  // ════════════════════════════════════════════
  // 4/4 单小节 | 流行扫弦基础律动
  // 力度波动 + 速度变化
  // ════════════════════════════════════════════
  {
    id: 'custom_d_ddu_ud_ddu',
    name: 'D DDU UD DDU',
    timeSignature: '4/4',
    beats: [
      {
        subdivision: 4, slots: slots('D...'), durations: [4, 0, 0, 0],
        variance: [4, 0, 0, 0],
        strumSpeed: [0.7, 1, 1, 1],
      },
      {
        subdivision: 4, slots: slots('D.DU'), durations: [2, 0, 1, 1],
        variance: [3, 0, 2, 2],
        strumSpeed: [0.85, 1, 0.95, 1.05],
      },
      {
        subdivision: 4, slots: slots('.UD.'), durations: [0, 1, 1, 0],
        variance: [0, 2, 3, 0],
        strumSpeed: [1, 1.0, 0.9, 1],
      },
      {
        subdivision: 4, slots: slots('D.DU'), durations: [2, 0, 1, 1],
        variance: [3, 0, 2, 2],
        strumSpeed: [0.85, 1, 0.95, 1.05],
      },
    ],
    barCount: 1,
  },

  // ════════════════════════════════════════════
  // 4/4 两小节 | The Cure · 原版高动态版 — 节奏变化 + 弦域对比
  // ════════════════════════════════════════════
  {
    id: 'alternative_the_cure_pro',
    name: 'The Cure · 原版高动态版',
    timeSignature: '4/4',
    barCount: 2,
    beats: [
      // ═══ Bar 1 (主歌循环第一小节) ═══
      {
        subdivision: 4, slots: slots('D.D.'), durations: [3, 0, 1, 0],
        variance: [4, 0, 1, 0],
        stringRange: [[0,5],[0,0],[0,3],[0,0]],
        strumSpeed: [0.7, 1, 1, 1],
      },
      {
        subdivision: 4, slots: slots('D.DU'), durations: [1, 0, 3, 1],
        variance: [1, 0, 4, 1],
        stringRange: [[0,3],[0,0],[0,5],[0,5]],
        strumSpeed: [1, 1, 0.7, 0.9],
      },
      {
        subdivision: 4, slots: slots('D.D.'), durations: [1, 0, 1, 0],
        variance: [1, 0, 1, 0],
        stringRange: [[0,3],[0,0],[0,3],[0,0]],
      },
      {
        subdivision: 4, slots: slots('D.DU'), durations: [1, 0, 3, 1],
        variance: [1, 0, 4, 1],
        stringRange: [[0,3],[0,0],[0,5],[0,5]],
        strumSpeed: [1, 1, 0.7, 0.9],
      },

      // ═══ Bar 2 (主歌循环第二小节) ═══
      {
        subdivision: 4, slots: slots('D.D.'), durations: [3, 0, 1, 0],
        variance: [4, 0, 1, 0],
        stringRange: [[0,5],[0,0],[0,3],[0,0]],
        strumSpeed: [0.7, 1, 1, 1],
      },
      {
        subdivision: 4, slots: slots('D.DU'), durations: [1, 0, 3, 1],
        variance: [1, 0, 4, 1],
        stringRange: [[0,3],[0,0],[0,5],[0,5]],
        strumSpeed: [1, 1, 0.7, 0.9],
      },
      {
        subdivision: 4, slots: slots('D.D.'), durations: [1, 0, 1, 0],
        variance: [1, 0, 1, 0],
        stringRange: [[0,3],[0,0],[0,3],[0,0]],
      },
      {
        subdivision: 4, slots: slots('DUDU'), durations: [1, 1, 2, 1],
        variance: [1, 1, 3, 1],
        stringRange: [[0,5],[0,5],[0,5],[0,5]],
        strumSpeed: [1, 1, 0.85, 1],
      },
    ],
  },

  // ════════════════════════════════════════════
  // 4/4 两小节 | The Cure · 简易民谣版 — 自然力度波动
  // ════════════════════════════════════════════
  {
    id: 'pop_the_cure_easy',
    name: 'The Cure · 简易民谣版',
    timeSignature: '4/4',
    barCount: 2,
    beats: [
      // ═══ Bar 1 (标准 Asus2 律动) ═══
      {
        subdivision: 4, slots: slots('DUD.'), durations: [1, 1, 2, 0],
        variance: [1, 1, 2, 0],
      },
      {
        subdivision: 4, slots: slots('D.D.'), durations: [2, 0, 2, 0],
        variance: [2, 0, 2, 0],
      },
      {
        subdivision: 4, slots: slots('D.D.'), durations: [3, 0, 1, 0],
        variance: [3, 0, 1, 0],
      },
      {
        subdivision: 4, slots: slots('DDD.'), durations: [1, 1, 3, 0],
        variance: [1, 1, 3, 0],
      },

      // ═══ Bar 2 (Asus2 准备过渡到 Cmaj7) ═══
      {
        subdivision: 4, slots: slots('DDD.'), durations: [1, 1, 2, 0],
        variance: [1, 1, 2, 0],
      },
      {
        subdivision: 4, slots: slots('D.D.'), durations: [2, 0, 2, 0],
        variance: [2, 0, 2, 0],
      },
      {
        subdivision: 4, slots: slots('D.D.'), durations: [3, 0, 1, 0],
        variance: [3, 0, 1, 0],
      },
      {
        subdivision: 4, slots: slots('DDDU'), durations: [1, 1, 1, 1],
        variance: [1, 1, 1, 1],
      },
    ],
  },
];

export function getPatternById(id: string): RhythmPattern | undefined {
  return ALL_PATTERNS.find(p => p.id === id);
}

export function getPatternsByTimeSignature(ts: string): RhythmPattern[] {
  return ALL_PATTERNS.filter(p => p.timeSignature === ts);
}
