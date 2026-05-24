import { RhythmPattern, StrumSlot, BeatGrid } from './types';

function slots(s: string): StrumSlot[] {
  return s.split('').map(c => c === 'D' ? 'down' : c === 'U' ? 'up' : null);
}

function beat(...slotStrings: string[]): BeatGrid[] {
  const subdivision = slotStrings[0].length;
  return slotStrings.map(s => ({ subdivision, slots: slots(s) }));
}

export const ALL_PATTERNS: RhythmPattern[] = [
  // ════════════════════════════════════════════
  // 4/4 单小节
  // ════════════════════════════════════════════
  {
    id: 'custom_d_ddu_ud_ddu',
    name: 'D DDU UD DDU',
    timeSignature: '4/4',
    beats: [
      { subdivision: 4, slots: slots('D...'), durations: [4, 0, 0, 0] },
      { subdivision: 4, slots: slots('D.DU'), durations: [2, 0, 1, 1] },
      { subdivision: 4, slots: slots('.UD.'), durations: [0, 1, 1, 0] },
      { subdivision: 4, slots: slots('D.DU'), durations: [2, 0, 1, 1] },
    ],
    barCount: 1,
  },

  // ════════════════════════════════════════════
  // 4/4 两小节 (6 patterns)
  // ════════════════════════════════════════════
  {
    id: 'folk_basic_2bar',
    name: '光辉岁月·两小节',
    timeSignature: '4/4',
    beats: beat('D...', '.DDU', 'D...', '.DDU', 'D.D.', 'DU..', '.U..', 'D.U.'),
    barCount: 2,
  },
  {
    id: 'folk_lotus_2bar',
    name: '蓝莲花·两小节',
    timeSignature: '4/4',
    beats: beat('DD..', 'DDU.', 'D.U.', 'DUDU', 'DD..', 'DDU.', '.D..', '.U.U'),
    barCount: 2,
  },
  {
    id: 'rock_2bar_1',
    name: 'Rock 变奏 1',
    timeSignature: '4/4',
    beats: beat('D...', 'D...', 'D...', 'D...', 'D...', 'D...', 'D...', '.U..'),
    barCount: 2,
  },
  {
    id: 'rock_2bar_2',
    name: 'Rock 变奏 2',
    timeSignature: '4/4',
    beats: beat('D...', '.DU.', 'D...', 'D...', 'D.D.', 'UD..', '.D..', 'D.D.'),
    barCount: 2,
  },
  {
    id: 'disco_2bar',
    name: 'Disco 两小节',
    timeSignature: '4/4',
    beats: beat('D.U.', 'D.U.', 'D.U.', 'D.U.', 'D.U.', 'D.U.', 'D.U.', 'DUD.'),
    barCount: 2,
  },
  {
    id: 'pops_2bar',
    name: '流行两小节',
    timeSignature: '4/4',
    beats: beat('D...', 'U...', 'D...', 'U...', 'D...', 'U...', 'D.D.', 'U.D.'),
    barCount: 2,
  },
  {
    id: 'pop_flourish_2bar',
    name: '流行加花·前八后十六',
    timeSignature: '4/4',
    beats: [
      // Bar 1 — D U | D D(重) | D D(重) | D D(重)
      { subdivision: 4, slots: slots('D.U.'), durations: [2, 0, 2, 0] },  // 第1拍: 下(标准) + 上(标准)
      { subdivision: 4, slots: slots('D.D.'), durations: [2, 0, 3, 0] },  // 第2拍: 下(标准) + 下(重音,vel↑)
      { subdivision: 4, slots: slots('D.D.'), durations: [2, 0, 3, 0] },
      { subdivision: 4, slots: slots('D.D.'), durations: [2, 0, 3, 0] },
      // Bar 2 — D D(重) | D D(重) | D D(重) | D · D U(前八后十六)
      { subdivision: 4, slots: slots('D.D.'), durations: [2, 0, 3, 0] },
      { subdivision: 4, slots: slots('D.D.'), durations: [2, 0, 3, 0] },
      { subdivision: 4, slots: slots('D.D.'), durations: [2, 0, 3, 0] },
      { subdivision: 4, slots: slots('D.DU'), durations: [2, 0, 1, 1] },  // 第4拍: 前八(2) + 十六(1) + 十六(1)
    ],
    barCount: 2,
  },

  // ════════════════════════════════════════════
  // 3/4 单小节 (5 patterns)
  // ════════════════════════════════════════════
  {
    id: 'waltz_up_down',
    name: '华尔兹下上',
    timeSignature: '3/4',
    beats: beat('D.U.', 'D.U.', 'D.U.'),
    barCount: 1,
  },
  {
    id: 'waltz_syncopated',
    name: '华尔兹切分',
    timeSignature: '3/4',
    beats: beat('D...', 'D.U.', 'D.U.'),
    barCount: 1,
  },
  {
    id: 'waltz_anacrusis',
    name: '华尔兹弱起',
    timeSignature: '3/4',
    beats: beat('.U..', 'D...', 'D.U.'),
    barCount: 1,
  },
  {
    id: 'waltz_fancy',
    name: '华尔兹花式',
    timeSignature: '3/4',
    beats: beat('DD..', '..DU', 'D.U.'),
    barCount: 1,
  },
  {
    id: 'waltz_gardenia',
    name: '栀子花开',
    timeSignature: '3/4',
    beats: beat('D...', '.DU.', '.DU.'),
    barCount: 1,
  },

  // ════════════════════════════════════════════
  // 6/8 (6 beats per bar, subdivision 3)
  // ════════════════════════════════════════════
  {
    id: 'triplet_basic',
    name: '三连扫',
    timeSignature: '6/8',
    beats: beat('D..', '...', 'U..', '...', 'D..', '...'),
    barCount: 1,
  },
  {
    id: 'triplet_syncopated',
    name: '六拍切分',
    timeSignature: '6/8',
    beats: [
      { subdivision: 3, slots: slots('D..'), durations: [1, 0, 0] },
      { subdivision: 3, slots: slots('D..'), durations: [1, 0, 0] },
      { subdivision: 3, slots: slots('U..'), durations: [1, 0, 0] },
      { subdivision: 3, slots: slots('...'), durations: [0, 0, 0] },
      { subdivision: 3, slots: slots('D..'), durations: [1, 0, 0] },
      { subdivision: 3, slots: slots('U..'), durations: [1, 0, 0] },
    ],
    barCount: 1,
  },
  {
    id: 'triplet_ballad',
    name: '六拍抒情',
    timeSignature: '6/8',
    beats: [
      { subdivision: 3, slots: slots('D..'), durations: [1, 0, 0] },
      { subdivision: 3, slots: slots('D..'), durations: [1, 0, 0] },
      { subdivision: 3, slots: slots('D..'), durations: [1, 0, 0] },
      { subdivision: 3, slots: slots('D..'), durations: [1, 0, 0] },
      { subdivision: 3, slots: slots('U..'), durations: [1, 0, 0] },
      { subdivision: 3, slots: slots('U..'), durations: [1, 0, 0] },
    ],
    barCount: 1,
  },
];

export function getPatternById(id: string): RhythmPattern | undefined {
  return ALL_PATTERNS.find(p => p.id === id);
}

export function getPatternsByTimeSignature(ts: string): RhythmPattern[] {
  return ALL_PATTERNS.filter(p => p.timeSignature === ts);
}
