/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KeyConfig, MusicStyle, ProgressionTemplate, StyleMeta } from './types';

export const SCALE_KEYS: KeyConfig[] = [
  { name: 'C', semitones: 0, preferFlat: false },
  { name: 'Db', semitones: 1, preferFlat: true },
  { name: 'D', semitones: 2, preferFlat: false },
  { name: 'Eb', semitones: 3, preferFlat: true },
  { name: 'E', semitones: 4, preferFlat: false },
  { name: 'F', semitones: 5, preferFlat: true },
  { name: 'F#', semitones: 6, preferFlat: false },
  { name: 'G', semitones: 7, preferFlat: false },
  { name: 'Ab', semitones: 8, preferFlat: true },
  { name: 'A', semitones: 9, preferFlat: false },
  { name: 'Bb', semitones: 10, preferFlat: true },
  { name: 'B', semitones: 11, preferFlat: false }
];

export const STYLE_META: StyleMeta[] = [
  {
    id: 'pop',
    name: '流行',
    desc: '洗脑抓耳、情感递进强烈、大众接受度极高',
    emoji: '✨',
    accentClass: 'from-emerald-500/20 to-teal-500/20 text-emerald-800 border-emerald-500/30'
  },
  {
    id: 'folk',
    name: '民谣',
    desc: '质朴温暖、忧郁舒缓，适合吉他指弹与轻哼叙事',
    emoji: '🍃',
    accentClass: 'from-amber-500/20 to-orange-500/20 text-amber-900 border-amber-500/30'
  },
  {
    id: 'rock',
    name: '摇滚',
    desc: '情绪饱满、充满力量感、伴有离调和弦的独特张力',
    emoji: '🎸',
    accentClass: 'from-rose-500/20 to-red-500/20 text-rose-900 border-rose-500/30'
  },
  {
    id: 'jazz',
    name: '爵士',
    desc: '优雅慵懒、和声复杂，充满变化音与和弦离调转折',
    emoji: '🎷',
    accentClass: 'from-purple-500/20 to-indigo-500/20 text-purple-900 border-purple-500/30'
  },
  {
    id: 'rnb',
    name: 'R&B',
    desc: '都市律动、顺滑性感、常带高阶九和弦与新灵魂循环',
    emoji: '🍷',
    accentClass: 'from-pink-500/20 to-violet-500/20 text-pink-900 border-pink-500/30'
  }
];

export const CHORD_PROGRESSIONS: ProgressionTemplate[] = [
  // ==================== POP (流行) ====================
  {
    id: 'pop_classic_heart',
    style: 'pop',
    description: '万能流行神级进行，极具推动力与情绪张力，写歌即成爆款。',
    exampleSongs: ['《晴天》- 周杰伦', '《Perfect》- Ed Sheeran', '《All of Me》- John Legend'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '根基的主和弦，确立情绪起点' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '属和弦，带来向前的跃动张力' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '小调和弦，注入一丝柔和的忧伤' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '下属和弦，完美的终结和再启航' }
    ]
  },
  {
    id: 'pop_golden_4536',
    style: 'pop',
    description: '华语乐坛黄金级流行进行，情绪百折千回，副歌催泪利器。',
    exampleSongs: ['《说好的幸福呢》- 周杰伦', '《小幸运》- 田馥甄', '《修炼爱情》- 林俊杰'],
    chords: [
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '情绪在四级爆发，轻微的悬浮感' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '属和弦，起到强烈的连接和引导' },
      { rootOffset: 4, quality: 'm', nashvilleDegree: '3-', romanDegree: 'iii', description: '平缓的情绪回落，色彩温婉' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '稳住根基，为下次循环蓄力' }
    ]
  },
  {
    id: 'pop_epic_minor',
    style: 'pop',
    description: '史诗感流行进行，以小调为主音色彩开场，旋律凄美大气。',
    exampleSongs: ['《Faded》- Alan Walker', '《Apologize》- OneRepublic', '《爱拼才会赢》'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '感伤黑暗的小调主音，气氛瞬间凝固' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '开阔明亮的四级，犹如曙光闪现' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '回归温暖的大调，情绪释怀' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '高昂的属音，悬而未决的离岸感' }
    ]
  },
  {
    id: 'pop_retro_1625',
    style: 'pop',
    description: '50年代经典复古进行，又名「回转进行」，带有浪漫怀旧滤镜。',
    exampleSongs: ['《Stand by Me》- Ben E. King', '《宝贝》- 张悬', '《Last Christmas》'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '明亮舒适的安全起点' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '小调叹息，增加浪漫的叙事感' },
      { rootOffset: 2, quality: 'm', nashvilleDegree: '2-', romanDegree: 'ii', description: '丝滑桥梁，弱化的功能性过渡' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '半回终止，推着旋律重回主和弦' }
    ]
  },
  {
    id: 'pop_dynamic_upward',
    style: 'pop',
    description: '稳步上升、满怀希望的流行进行，听感昂扬而积极。',
    exampleSongs: ['《追光者》- 岑宁儿', '《Love Story》- Taylor Swift'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '坚实的根基起音' },
      { rootOffset: 4, quality: 'm', nashvilleDegree: '3-', romanDegree: 'iii', description: '小调色彩的递进过渡' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '大调情绪的进一步开阔' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '激情积攒，准备迈向下一个乐句' }
    ]
  },
  {
    id: 'pop_sweet_acoustic',
    style: 'pop',
    description: '清新、略带慵懒甜美感的进行，非常适合轻松活泼的小情歌。',
    exampleSongs: ['《I\'m Yours》- Jason Mraz', '《甜甜的》- 周杰伦'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '轻快甜美的开头' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '舒展的下属和弦' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '慵懒的情绪沉淀' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '呼应结尾，充满阳光气息' }
    ]
  },
  {
    id: 'pop_indie_ballad',
    style: 'pop',
    description: '清冷、带有独立气质和空间感的流行叙事曲走向。',
    exampleSongs: ['《董小姐》- 宋冬野', '《夜空中最亮的星》- 逃跑计划'],
    chords: [
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '不直接起在主和弦，多了一层悬念' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '回归主和弦，一种踏实和安稳' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '舒展向前的向心张力' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '落脚在暗色小调，意境深远' }
    ]
  },
  {
    id: 'pop_descent_sigh',
    style: 'pop',
    description: '深情、悲伤，下行中带着一声温柔叹息的慢歌走向。',
    exampleSongs: ['《安静》- 周杰伦', '《听海》- 张惠妹'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '叹息般的小调悲伤开场' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '略带无奈的下行呼应' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '大调平复情绪，释怀痛楚' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '重新拾起力量的大属和弦' }
    ]
  },
  {
    id: 'pop_hope_highway',
    style: 'pop',
    description: '舒展豁朗的流行旋律走向，有强烈的「出发、公路片」般的心旷神怡感。',
    exampleSongs: ['《如果你也听说》- 张惠妹', '《High Highway》'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '平稳启程' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '情绪的纵深探索' },
      { rootOffset: 2, quality: 'm', nashvilleDegree: '2-', romanDegree: 'ii', description: '滑顺过渡' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '冲向终点大调，阳光明媚' }
    ]
  },
  {
    id: 'pop_jazz_touch_turn',
    style: 'pop',
    description: '带有轻微都市爵士色彩的高级流行进行，和声色彩丰富。',
    exampleSongs: ['《说散就散》- JC 陈泳彤', '《泡沫》- G.E.M.邓紫棋'],
    chords: [
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '略带忧郁的高级二级七和弦起' },
      { rootOffset: 7, quality: '7', nashvilleDegree: '57', romanDegree: 'V7', description: '紧张度极高的传统五级属七' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '明亮尊华的一级大七和弦回到常轨' },
      { rootOffset: 9, quality: 'm7', nashvilleDegree: '6-7', romanDegree: 'vi7', description: '叹息收尾，不至空虚' }
    ]
  },
  {
    id: 'pop_rising_stairs',
    style: 'pop',
    description: '层层往上攀爬，用于构建情绪爆发、推动副歌高潮的和声进行。',
    exampleSongs: ['《最初的梦想》- 范玮琪'],
    chords: [
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '蓄积底蕴' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '迈进一步' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '承前启后' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '踏上最高台阶' }
    ]
  },
  {
    id: 'pop_subtle_tension',
    style: 'pop',
    description: '情绪极为微妙的进行，明暗交织，非常适合内心独白式歌曲。',
    exampleSongs: ['《突然好想你》- 五月天', '《当冬夜渐暖》- 孙燕姿'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '淡然平静' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '微妙前行' },
      { rootOffset: 2, quality: 'm', nashvilleDegree: '2-', romanDegree: 'ii', description: '温和地叹息' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '最后释怀的下属，余味悠长' }
    ]
  },
  {
    id: 'pop_vocal_melancholy',
    style: 'pop',
    description: '专为悲伤独唱、情感真挚的情歌所设计的和声轮廓。',
    exampleSongs: ['《成全》- 刘若英', '《我知道》- BY2'],
    chords: [
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '一缕幽怨的色彩' },
      { rootOffset: 4, quality: 'm', nashvilleDegree: '3-', romanDegree: 'iii', description: '回落至黯淡、释然' },
      { rootOffset: 2, quality: 'm', nashvilleDegree: '2-', romanDegree: 'ii', description: '缓缓诉说的桥梁' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '微光初显的主和弦' }
    ]
  },
  {
    id: 'pop_cloudy_sky',
    style: 'pop',
    description: '和声色彩犹如多云的天空，时而放晴，时而阴郁的律动进行。',
    exampleSongs: ['《阴天》- 莫文蔚', '《路过人间》- 郁可唯'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '静谧阴郁的小调' },
      { rootOffset: 2, quality: 'm', nashvilleDegree: '2-', romanDegree: 'ii', description: '深沉过渡' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '大调阳光穿透乌云' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '属七的推动力' }
    ]
  },
  {
    id: 'pop_bittersweet_cycle',
    style: 'pop',
    description: '带有轻微纠结感，甜中带苦、苦中带甜的完美流行循环。',
    exampleSongs: ['《那些年》- 胡夏', '《晴天》过渡乐段'],
    chords: [
      { rootOffset: 4, quality: 'm', nashvilleDegree: '3-', romanDegree: 'iii', description: '忧伤而克制的触碰' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '深陷于纠结的小调' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '大调下属的开朗释怀' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '呼唤重聚的张力' }
    ]
  },

  // ==================== FOLK (民谣) ====================
  {
    id: 'folk_campfire',
    style: 'folk',
    description: '最经典的篝火吉他弹唱进行，和声色彩淳朴、亲切、踏实。',
    exampleSongs: ['《Blowin\' in the Wind》- Bob Dylan', '《Take Me Home, Country Roads》'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '归于自然的主机调' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '欢快、开阔的大地和弦' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '再次落脚舒坦地根基' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '如风般的轻盈属和弦呼应' }
    ]
  },
  {
    id: 'folk_canon_path',
    style: 'folk',
    description: '卡农进行在民谣里的指弹化身，舒缓、深情、富有故事感。',
    exampleSongs: ['《南山南》- 马頔', '《斑马，斑马》- 宋冬野'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '安宁惬意的清晨' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '下行的金色斜阳' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '夜幕降临的小调忧郁' },
      { rootOffset: 4, quality: 'm', nashvilleDegree: '3-', romanDegree: 'iii', description: '微弱的心灵火光' }
    ]
  },
  {
    id: 'folk_country_road',
    style: 'folk',
    description: '经典的乡村民谣进行，有强烈地在麦田中骑行驱车、阳光和煦的画面感。',
    exampleSongs: ['《Leaving on a Jet Plane》- John Denver', '《大美》'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '平坦无垠的原野' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '柔和的风轻轻刮起' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '奔放温暖的金色阳光' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '平安无事地到家了' }
    ]
  },
  {
    id: 'folk_melancholy_ballad',
    style: 'folk',
    description: '清冷、深沉，带有点点泪光般抚慰色彩的伤感民谣。',
    exampleSongs: ['《莉莉安》- 宋冬野', '《安和桥》- 宋冬野'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '深夜独白般的小调起音' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '克制流露地开阔眼界' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '情绪淡淡地舒展与呼唤' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '重回寂静小调叹息' }
    ]
  },
  {
    id: 'folk_steps_journey',
    style: 'folk',
    description: '缓慢向上攀登的和弦，极其适合展现路程、漫步、成长的叙事段落。',
    exampleSongs: ['《时光旅行》', '《青春》'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '第一步，最初的憧憬' },
      { rootOffset: 2, quality: 'm', nashvilleDegree: '2-', romanDegree: 'ii', description: '第二步，迷茫但坚持的小调' },
      { rootOffset: 4, quality: 'm', nashvilleDegree: '3-', romanDegree: 'iii', description: '第三步，稍显沉重的远方' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '终点，天高地阔的回归' }
    ]
  },
  {
    id: 'folk_mountain_wind',
    style: 'folk',
    description: '带有爱尔兰或凯尔特山地民谣风情的开阔、苍茫的和弦走向。',
    exampleSongs: ['《五百里》- 经典译曲', '《500 Miles》- Peter, Paul and Mary'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '山风拂过荒野般悲凉' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '温暖木屋的火光闪耀' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '连绵起伏地山川叠起' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '终而复始的悠远回甘' }
    ]
  },
  {
    id: 'folk_melancholy_indie',
    style: 'folk',
    description: '清冷、孤独，适合自弹自唱倾诉心声的独立民谣声线。',
    exampleSongs: ['《奇妙能力歌》- 陈粒', '《我用什么把你留住》'],
    chords: [
      { rootOffset: 2, quality: 'm', nashvilleDegree: '2-', romanDegree: 'ii', description: '轻叹、自卑的小调诉说' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '大调张开双眸' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '平凡、平实的自我接纳' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '属音悠远带过' }
    ]
  },
  {
    id: 'folk_wooden_chair',
    style: 'folk',
    description: '坐在摇摇椅上听落叶飞舞般的惬意、怀旧民谣进行。',
    exampleSongs: ['《平淡生活》', '《秋意浓》民谣版'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '质朴而慵懒' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '温柔的回忆' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '风扬起地落叶' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '平静地回归摇椅' }
    ]
  },
  {
    id: 'folk_celtic_minor',
    style: 'folk',
    description: '浓厚的凯尔特神秘悲壮感民谣进行，极富沧桑的传说色彩。',
    exampleSongs: ['《斯卡布罗集市》指弹段', '《Scarborough Fair》'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '浓雾笼罩的山庄' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '大调的开阔山脊' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '寒冷地行风划过' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '尘土终归泥泞' }
    ]
  },
  {
    id: 'folk_gentle_arpeggio',
    style: 'folk',
    description: '最温柔舒适的指弹分解和弦走向，极易上手且听感柔和。',
    exampleSongs: ['《这一生关于你的风景》- 枯木逢春'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '明亮恬静' },
      { rootOffset: 4, quality: 'm', nashvilleDegree: '3-', romanDegree: 'iii', description: '温文尔雅、稍带忧悒' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '心事沉沉地分解' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '舒缓抚平一切的一段吉他拂弦' }
    ]
  },
  {
    id: 'folk_rainy_day',
    style: 'folk',
    description: '温和细腻的小调民谣进行，静谧、柔和，像倚窗听着屋外的雨点。',
    exampleSongs: ['《儿歌》- 张悬'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '细雨打在屋檐上' },
      { rootOffset: 4, quality: 'm', nashvilleDegree: '3-', romanDegree: 'iii', description: '雾气弥漫的窗框' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '雨后冒出的绿芽' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '天空中温和的彩虹' }
    ]
  },
  {
    id: 'folk_vagabond_wander',
    style: 'folk',
    description: '流浪歌手式的洒脱、沧桑和对大自然的赞歌。',
    exampleSongs: ['《九月》', '《阿刁》民谣小调版'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '孤独的风沙' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '远方草原的绿' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '烈酒般的残照' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '继续未完的长路' }
    ]
  },
  {
    id: 'folk_simple_nest',
    style: 'folk',
    description: '最简单质朴的三和室家常民谣，给生活一缕宁静释然。',
    exampleSongs: ['《生活不止眼前的苟且》副歌'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '简单生活' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '柴米油盐' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '暖心话语' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '安宁惬意' }
    ]
  },
  {
    id: 'folk_harvest_sunset',
    style: 'folk',
    description: '富有泥土气息、秋季丰收乡村麦田斜阳映照的节奏和弦。',
    exampleSongs: ['《丰收歌》- 民间乐曲'],
    chords: [
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '金燦燦的斜阳' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '微风中沉甸甸的麦穗' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '踏实满足的土地归属' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '一抹微风拂面的平静' }
    ]
  },
  {
    id: 'folk_gently_sigh',
    style: 'folk',
    description: '带有典型独立民谣那种轻叹、松弛，又不乏明媚豁朗感的调性循环。',
    exampleSongs: ['《历历万乡》- 陈粒'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '踏破万乡的背影' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '一杯温热的好茶' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '江河湖海的辽阔' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '化作天边的流云' }
    ]
  },

  // ==================== ROCK (摇滚) ====================
  {
    id: 'rock_basic_anthem',
    style: 'rock',
    description: '力量感十足的传统摇滚必刷进行，高亢昂扬、极适合狂放扫弦。',
    exampleSongs: ['《We Will Rock You》- Queen', '《无地自容》- 黑豹乐队', '《Rock and Roll All Nite》'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '力量爆发的主和弦根弦' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '狂飙突进的高抗四级' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '推到顶点的属和弦电吉他嘶鸣' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '继续维持高能释放' }
    ]
  },
  {
    id: 'rock_mixolydian_riff',
    style: 'rock',
    description: '经典的离调混合利底亚（Mixolydian）摇滚进行，带有不羁叛逆的摇滚基因。',
    exampleSongs: ['《Sweet Home Alabama》- Lynyrd Skynyrd', '《公路之歌》- 痛仰乐队'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '狂野坚硬的主轴起步' },
      { rootOffset: 10, quality: 'Major', nashvilleDegree: 'b7', romanDegree: 'bVII', description: '离调降七级大和弦，瞬间点燃粗犷叛逆感' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '流畅承接的经典下属' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '狂热平息，重振旗鼓' }
    ]
  },
  {
    id: 'rock_power_ballad',
    style: 'rock',
    description: '抒情摇滚神级走向，暗色下行情绪，高潮时嘶吼煽情之王。',
    exampleSongs: ['《All Along the Watchtower》- Jimi Hendrix', '《花房姑娘》- 崔健', '《Don\'t Cry》- Guns N\' Roses'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '苍凉寂寞的大提琴/重低音进入' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '平缓下坠的沉郁过渡' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '悲烈释怀的大调咆哮' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '余力犹存的狂怒尾奏' }
    ]
  },
  {
    id: 'rock_grunge_90s',
    style: 'rock',
    description: '90年代西雅图垃圾摇滚/涅槃乐队风格，使用冷酷怪异的大三度模进。',
    exampleSongs: ['《Smells Like Teen Spirit》- Nirvana', '《In Bloom》- Nirvana'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '暴戾沉闷的重低音切音' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '刺耳的四级猛烈擦弦' },
      { rootOffset: 8, quality: 'Major', nashvilleDegree: 'b6', romanDegree: 'bVI', description: '降六级离调和弦，阴暗、非自然金属光泽' },
      { rootOffset: 10, quality: 'Major', nashvilleDegree: 'b7', romanDegree: 'bVII', description: '降七级摩擦而上，狂乱炸裂' }
    ]
  },
  {
    id: 'rock_secondary_tension',
    style: 'rock',
    description: '经典的英伦前卫摇滚走向，使用奇特的二级大和弦，极富张力和旋律性。',
    exampleSongs: ['《Yellow》- Coldplay', '《Creep》- Radiohead (前半段)'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '温暖舒展的一级纯白底色' },
      { rootOffset: 2, quality: 'Major', nashvilleDegree: '2', romanDegree: 'II', description: '本应是Dm，意外用D大和弦！刺破天际的明亮张力' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '情绪在四级得以释放和喘息' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '再次落网，心安理得' }
    ]
  },
  {
    id: 'rock_blues_drive',
    style: 'rock',
    description: '粗狂狂野的硬摇滚/蓝调摇滚riff必配走向，带有浓厚底色。',
    exampleSongs: ['《Can\'t Stop》- RHCP', '《Back in Black》- AC/DC'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '铿锵重击' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '推动高走' },
      { rootOffset: 10, quality: 'Major', nashvilleDegree: 'b7', romanDegree: 'bVII', description: '降七度狂放横扫' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '顺滑回归下属' }
    ]
  },
  {
    id: 'rock_punk_riot',
    style: 'rock',
    description: '简单粗暴、高速冲撞的朋克摇滚三和弦经典公式。',
    exampleSongs: ['《Basket Case》- Green Day', '《无聊军队》'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '直白的主战线拉开' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '狂飙吉他切音' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '稍微妥协的小调阴影' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '高速呐喊般的四级落音' }
    ]
  },
  {
    id: 'rock_gothic_dramatic',
    style: 'rock',
    description: '戏剧性、哥特式宏大激昂的金属/硬摇滚史诗走向。',
    exampleSongs: ['《The Phantom of the Opera》重金属版', '《夜的第七章》'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '冷酷教堂里管风琴响起' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '石破天惊的大调崛起' },
      { rootOffset: 2, quality: 'm', nashvilleDegree: '2-', romanDegree: 'ii', description: '黑暗长廊小调挣扎' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '刺破黑暗的高亢审判' }
    ]
  },
  {
    id: 'rock_britpop_glory',
    style: 'rock',
    description: '高耸、骄傲而又略带失落感的经典英伦摇滚（Britpop）曲风。',
    exampleSongs: ['《Wonderwall》- Oasis', '《Live Forever》- Oasis'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '清冷内省的高级失真' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '骄傲豁朗的阳光闪耀' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '大气的英伦大合唱色彩' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '坚定不回的大调终章' }
    ]
  },
  {
    id: 'rock_major_third_tension',
    style: 'rock',
    description: '非同寻常的抒情摇滚，通过大三度进行（III）制造悲壮到极致的终结感。',
    exampleSongs: ['《光辉岁月》- Beyond', '《海阔天空》副歌'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '自豪、广袤的黄家驹式开头' },
      { rootOffset: 4, quality: 'Major', nashvilleDegree: '3', romanDegree: 'III', description: '本应Em变大三度E！犹如火山喷发般的极速张力' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '泪洒祭坛的小调呜咽' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '重归风雨后的自由宽广' }
    ]
  },
  {
    id: 'rock_epic_darkness',
    style: 'rock',
    description: '重型摇滚或暗系史诗摇滚的奇特降三级离调和声链。',
    exampleSongs: ['《New Born》- Muse', '《红旗下的蛋》'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '低重狂躁起音' },
      { rootOffset: 3, quality: 'Major', nashvilleDegree: 'b3', romanDegree: 'bIII', description: '降三级大和弦，重金属般冷酷撞击' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '开阔突重' },
      { rootOffset: 10, quality: 'Major', nashvilleDegree: 'b7', romanDegree: 'bVII', description: '重犁砸碎一切的结尾' }
    ]
  },
  {
    id: 'rock_screaming_guitar',
    style: 'rock',
    description: '在吉他高能失真单音solo下铺垫的坚实力量金属墙走向。',
    exampleSongs: ['《Painkiller》节奏背景', '《梦回唐朝》段'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '重沉暗冷铁蹄' },
      { rootOffset: 2, quality: 'Major', nashvilleDegree: '2', romanDegree: 'II', description: '金属突刺大二级拉响警报' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '重锤砸向地面' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '属七火光喷溅' }
    ]
  },
  {
    id: 'rock_stairway_blues',
    style: 'rock',
    description: '复古迷幻、层层下行，宛如沿着绝壁攀下的吉他慢摇滚进行。',
    exampleSongs: ['《Stairway to Heaven》- Led Zeppelin', '《新长征路上的摇滚》'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '幽深神秘、冷雨敲窗' },
      { rootOffset: 11, quality: 'dim', nashvilleDegree: '7o', romanDegree: 'viio', description: '刺骨冰冷的减和声颤抖' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '风衣扬起的瞬间' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '远方不灭的灯塔' }
    ]
  },
  {
    id: 'rock_garage_dirty',
    style: 'rock',
    description: '肮脏、充满底层车库、机油与高增益野性的朋克/车库摇滚走向。',
    exampleSongs: ['《Seven Nation Army》- The White Stripes'],
    chords: [
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '极简电吉他经典重低音 riff' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '继续用单音/强力和弦重压' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '粗鲁的大噪音宣泄' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '尖叫着冲过界碑' }
    ]
  },
  {
    id: 'rock_grunge_fever',
    style: 'rock',
    description: '典型西雅图 Grunge 调性，带着自闭、愤怒与歇斯底里的交织。',
    exampleSongs: ['《Lithium》- Nirvana', '《Black Hole Sun》- Soundgarden'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '略带死寂的低声呢喃' },
      { rootOffset: 3, quality: 'Major', nashvilleDegree: 'b3', romanDegree: 'bIII', description: '降三度情绪意外爆发' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '回到内心深处的自我拉扯' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '撕心裂肺、无路可走的发泄' }
    ]
  },

  // ==================== JAZZ (爵士) ====================
  {
    id: 'jazz_classic_2516',
    style: 'jazz',
    description: '爵士乐至高无上的黄金定律进行（ii-V-I-VI），构成无数标准的骨架。',
    exampleSongs: ['《Autumn Leaves》- 经典爵士标准', '《Fly Me to the Moon》'],
    chords: [
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '慵懒忧郁的小七二级，微闭双眼' },
      { rootOffset: 7, quality: '7', nashvilleDegree: '57', romanDegree: 'V7', description: '充满引导和期待感的经典属七' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '高贵宽广的大七主和弦，柔光弥散' },
      { rootOffset: 9, quality: '7', nashvilleDegree: '67', romanDegree: 'VI7', description: '本用Am7，改用A7重属！强烈的暗示，准备迎接二次循环' }
    ]
  },
  {
    id: 'jazz_fly_me',
    style: 'jazz',
    description: '经典爵士标准《Fly Me to the Moon》的主干走向，顺滑流畅。',
    exampleSongs: ['《Fly Me to the Moon》- Frank Sinatra', '《L-O-V-E》- Nat King Cole'],
    chords: [
      { rootOffset: 9, quality: 'm7', nashvilleDegree: '6-7', romanDegree: 'vi7', description: '夜色浪漫的小调起音' },
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '顺滑递进的级数过渡' },
      { rootOffset: 7, quality: '7', nashvilleDegree: '57', romanDegree: 'V7', description: '摇摆氛围满分地呼唤' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '回到温馨安宁的一级港湾' }
    ]
  },
  {
    id: 'jazz_walk_up',
    style: 'jazz',
    description: '经典的半音阶半步上升进行，极具老爵士酒馆黑白钢琴的高级神秘感。',
    exampleSongs: ['《Take the "A" Train》- Duke Ellington'],
    chords: [
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '高华的主和弦，奠定优雅基调' },
      { rootOffset: 1, quality: 'dim7', nashvilleDegree: '#1o7', romanDegree: '#Idim7', description: '半音过渡减七，极其扭曲的精致张力' },
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '水润滑顺的二级过渡' },
      { rootOffset: 7, quality: '7', nashvilleDegree: '57', romanDegree: 'V7', description: '属七引导，准备返航' }
    ]
  },
  {
    id: 'jazz_tritone_sub',
    style: 'jazz',
    description: '使用了大名鼎鼎地「三度音替代（Tritone Substitution）」的现代爵士经典降二代五走向。',
    exampleSongs: ['《Moody\'s Mood for Love》', '《Misty》变奏'],
    chords: [
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '舒展优雅的爵士开端' },
      { rootOffset: 1, quality: '7', nashvilleDegree: 'b27', romanDegree: 'bII7', description: '不弹G7！弹高贵的Db7三度音替代和弦，半音下滑至一级、极度滑润' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '宛如黄油溶于热咖啡般的顺爽解开' },
      { rootOffset: 9, quality: 'm7', nashvilleDegree: '6-7', romanDegree: 'vi7', description: '悠扬的小调落幕' }
    ]
  },
  {
    id: 'jazz_chromatic_fall',
    style: 'jazz',
    description: '半音阶一路向下坠落的极其妖娆的走势，充斥着优雅的慵懒。',
    exampleSongs: ['《My Funny Valentine》降调乐段', '《Cry Me a River》- Ella Fitzgerald'],
    chords: [
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '奢华、如梦如幻的开场' },
      { rootOffset: 5, quality: 'm7', nashvilleDegree: '4-7', romanDegree: 'iv7', description: '同主音小调借和弦，一抹高级的凄清冷色' },
      { rootOffset: 4, quality: 'm7', nashvilleDegree: '3-7', romanDegree: 'iii7', description: '缓慢闭合的宁静眼眸' },
      { rootOffset: 3, quality: 'dim7', nashvilleDegree: 'b3o7', romanDegree: 'bIIIdim7', description: '半音下行过渡减七，极致的缠绵和沉迷' }
    ]
  },
  {
    id: 'jazz_backdoor_v',
    style: 'jazz',
    description: '使用了极其经典的「后门属七（Backdoor Dominant）」和声，性感又充满意外。',
    exampleSongs: ['《All of You》- Cole Porter', '《Just Friends》'],
    chords: [
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '浪漫的大七和声铺垫' },
      { rootOffset: 10, quality: '7', nashvilleDegree: 'b77', romanDegree: 'bVII7', description: '后门属七（Bb7代替G7），完全意想不到的清脆离调 resolution' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '清澈温暖的终结' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '久久回味根音' }
    ]
  },
  {
    id: 'jazz_minor_swing',
    style: 'jazz',
    description: '热情、复古的吉普赛摇摆爵士（Gypsy Jazz）核心进行，富有舞性律动。',
    exampleSongs: ['《Minor Swing》- Django Reinhardt', '《吉普赛的回响》'],
    chords: [
      { rootOffset: 9, quality: 'm7', nashvilleDegree: '6-7', romanDegree: 'vi7', description: '神秘而富有弹跳力的小调' },
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '摇摆跳动的二级小七' },
      { rootOffset: 7, quality: '7', nashvilleDegree: '57', romanDegree: 'V7', description: '张力十足的属七狂舞' },
      { rootOffset: 9, quality: 'm7', nashvilleDegree: '6-7', romanDegree: 'vi7', description: '热烈戛然而止，重回寂静' }
    ]
  },
  {
    id: 'jazz_lady_bird',
    style: 'jazz',
    description: '著名的《Lady Bird》回转进行，代表着比博普（Bebop）时代的最高和声艺术。',
    exampleSongs: ['《Lady Bird》- Tadd Dameron', '《Half Nelson》- Miles Davis'],
    chords: [
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '明亮尊严的一级' },
      { rootOffset: 8, quality: 'maj7', nashvilleDegree: 'b6M7', romanDegree: 'bVIMaj7', description: '降六级大七和弦，离奇的空间错位感' },
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '强行拉回到调内的二级缓冲' },
      { rootOffset: 7, quality: '7', nashvilleDegree: '57', romanDegree: 'V7', description: '狂飙属七，推向极致' }
    ]
  },
  {
    id: 'jazz_sophisticated_ballad',
    style: 'jazz',
    description: '高级深情、略带哀伤的慢速爵士叙事和声，极宜萨克斯吹奏。',
    exampleSongs: ['《In a Sentimental Mood》- Duke Ellington'],
    chords: [
      { rootOffset: 9, quality: 'm7', nashvilleDegree: '6-7', romanDegree: 'vi7', description: '红酒在杯中摇晃，烟雾微茫' },
      { rootOffset: 2, quality: '7', nashvilleDegree: '27', romanDegree: 'II7', description: '副属和弦D7，注入一股酸楚的热切' },
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '大调大七徐徐展开，如同回忆浮现' },
      { rootOffset: 7, quality: '7', nashvilleDegree: '57', romanDegree: 'V7', description: '轻叹一气，默默喝下属七' }
    ]
  },
  {
    id: 'jazz_mellow_nights',
    style: 'jazz',
    description: '经典、顺滑的酷派（Cool Jazz）都市深夜高阶和弦链。',
    exampleSongs: ['《Blue in Green》- Miles Davis', '《Round Midnight》变奏'],
    chords: [
      { rootOffset: 2, quality: 'm9', nashvilleDegree: '2-9', romanDegree: 'ii9', description: '二级九和弦，泛着淡蓝色的微光' },
      { rootOffset: 7, quality: '7b9', nashvilleDegree: '57(b9)', romanDegree: 'V7b9', description: '降九属和弦，极富情绪张力的暗色刺痛' },
      { rootOffset: 0, quality: 'maj9', nashvilleDegree: '1M9', romanDegree: 'IMaj9', description: '安详清澈的一级九和弦，星辰满天' },
      { rootOffset: 9, quality: '13', nashvilleDegree: '6(13)', romanDegree: 'VI13', description: '十三属和弦，绝美的尾部余温' }
    ]
  },
  {
    id: 'jazz_dorian_sunset',
    style: 'jazz',
    description: '充满了多里安调式（Dorian）古典爵士风味，超凡脱俗，宛如太空漫步。',
    exampleSongs: ['《So What》- Miles Davis', '《Impressions》- John Coltrane'],
    chords: [
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '多里安调性的静止漂浮' },
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '继续悬浮在凉爽星空' },
      { rootOffset: 3, quality: 'm7', nashvilleDegree: 'b3-7', romanDegree: 'biii7', description: '半音上移，如同飞船在星云中穿梭' },
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '降回原级，舒爽释放' }
    ]
  },
  {
    id: 'jazz_autumn_breeze',
    style: 'jazz',
    description: '经典的冷爵士摇摆进行，温婉优雅，自带秋风萧瑟的文艺质感。',
    exampleSongs: ['《Autumn Leaves》主歌骨架'],
    chords: [
      { rootOffset: 9, quality: 'm7', nashvilleDegree: '6-7', romanDegree: 'vi7', description: '枯叶在深秋小径飘落' },
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '小七度过渡，不惊波澜' },
      { rootOffset: 7, quality: '7', nashvilleDegree: '57', romanDegree: 'V7', description: '落寞斜阳映在窗扉上' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '一抹温馨的大调围巾' }
    ]
  },
  {
    id: 'jazz_climb_mountain',
    style: 'jazz',
    description: '通过密集的半音下行过渡，展示极为现代的和声对位技巧。',
    exampleSongs: ['《Giant Steps》极简切段', '《Lush Life》'],
    chords: [
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '华美的开场' },
      { rootOffset: 4, quality: 'm7', nashvilleDegree: '3-7', romanDegree: 'iii7', description: '半音滑入的凉意' },
      { rootOffset: 3, quality: 'dim7', nashvilleDegree: 'b3o7', romanDegree: 'bIIIdim7', description: '痛苦扭动的减七和弦' },
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '再次落脚到安全的二级' }
    ]
  },
  {
    id: 'jazz_mellow_blue',
    style: 'jazz',
    description: '忧郁缠绵的爵士慢速蓝调经典和声。',
    exampleSongs: ['《Blue Monk》- Thelonious Monk'],
    chords: [
      { rootOffset: 0, quality: '7', nashvilleDegree: '17', romanDegree: 'I7', description: '蓝调色彩十足的一级属七' },
      { rootOffset: 5, quality: '7', nashvilleDegree: '47', romanDegree: 'IV7', description: '滑向四级属七爆发' },
      { rootOffset: 0, quality: '7', nashvilleDegree: '17', romanDegree: 'I7', description: '重回主干属七' },
      { rootOffset: 7, quality: '7', nashvilleDegree: '57', romanDegree: 'V7', description: '属七引导全场' }
    ]
  },
  {
    id: 'jazz_back_to_bar',
    style: 'jazz',
    description: '经典的波普乐大 turnaround，展现眼花缭乱的和声变化。',
    exampleSongs: ['《Scrapple from the Apple》', '《Thriving on a Riff》'],
    chords: [
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '高级优雅起跑' },
      { rootOffset: 9, quality: '7', nashvilleDegree: '67', romanDegree: 'VI7', description: '带副属特性的离调属七' },
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '丝滑小七级数' },
      { rootOffset: 7, quality: '7', nashvilleDegree: '57', romanDegree: 'V7', description: '属终止迎风收帆' }
    ]
  },

  // ==================== RNB (R&B / Soul) ====================
  {
    id: 'rnb_neo_soul_loop',
    style: 'rnb',
    description: '现代新灵魂乐（Neo-Soul）最经典，极其性感、深邃和具有催眠感的循环。',
    exampleSongs: ['《Untitled》- D\'Angelo', '《Redbone》- Childish Gambino', '《Best Part》- Daniel Caesar'],
    chords: [
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '梦幻般的大七下属起音，高级都市感' },
      { rootOffset: 4, quality: 'm7', nashvilleDegree: '3-7', romanDegree: 'iii7', description: '丝滑半音下行，忧郁温暖的小七和弦' },
      { rootOffset: 9, quality: 'm7', nashvilleDegree: '6-7', romanDegree: 'vi7', description: '灵魂乐的温床，极为慵懒的六级小七' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '一级大七在末尾温柔闪现，令人欲罢不能' }
    ]
  },
  {
    id: 'rnb_late_night_groove',
    style: 'rnb',
    description: '经典的都市深夜 R&B 律动进行，微醺、高贵，极为顺滑。',
    exampleSongs: ['《Location》- Khalid', '《B.S.》- Jhené Aiko'],
    chords: [
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '水汽氤氲地深夜开端' },
      { rootOffset: 7, quality: '7', nashvilleDegree: '57', romanDegree: 'V7', description: '轻轻滑过属和弦七阶' },
      { rootOffset: 4, quality: 'm7', nashvilleDegree: '3-7', romanDegree: 'iii7', description: '小调平复焦躁' },
      { rootOffset: 9, quality: 'm7', nashvilleDegree: '6-7', romanDegree: 'vi7', description: '陷入醉人、性感的六级循环' }
    ]
  },
  {
    id: 'rnb_mellow_extended',
    style: 'rnb',
    description: '采用高阶九和弦的新灵魂超高级进行，声音宽广、和声张力拉满。',
    exampleSongs: ['《If I Ain\'t Got You》- Alicia Keys', '《Ordinary People》- John Legend'],
    chords: [
      { rootOffset: 2, quality: 'm9', nashvilleDegree: '2-9', romanDegree: 'ii9', description: '醇厚奢华的二级九和弦，充满灵魂底蕴' },
      { rootOffset: 7, quality: '9', nashvilleDegree: '59', romanDegree: 'V9', description: '现代感十足的新属九和弦，充满期待' },
      { rootOffset: 0, quality: 'maj9', nashvilleDegree: '1M9', romanDegree: 'IMaj9', description: '一级大九主和弦，犹如在太空中漂浮' },
      { rootOffset: 9, quality: 'm9', nashvilleDegree: '6-9', romanDegree: 'vi9', description: '六级九和弦叹息，优雅到骨子里' }
    ]
  },
  {
    id: 'rnb_sensual_descent',
    style: 'rnb',
    description: '极其顺滑性感地向下阶梯式走势，经典的丝滑 R&B 招牌。',
    exampleSongs: ['《At Your Best》- Aaliyah', '《By Your Side》- Sade'],
    chords: [
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '水一般的轻抚' },
      { rootOffset: 4, quality: 'm7', nashvilleDegree: '3-7', romanDegree: 'iii7', description: '轻轻颤抖的小三度' },
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '温热的二级对话' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '释怀躺平在主基调上' }
    ]
  },
  {
    id: 'rnb_minor_mood',
    style: 'rnb',
    description: '略带清高、情绪冷而孤傲的时髦都会小调 R&B 轮廓。',
    exampleSongs: ['《Hotline Bling》- Drake', '《Earned It》- The Weeknd'],
    chords: [
      { rootOffset: 9, quality: 'm7', nashvilleDegree: '6-7', romanDegree: 'vi7', description: '冷若磐石的暗色小调' },
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '大调闪现的一丝希翼' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '平静的水面' },
      { rootOffset: 2, quality: '7', nashvilleDegree: '27', romanDegree: 'II7', description: '意外用D7副属，注入微妙的、充满都市气息的挑逗' }
    ]
  },
  {
    id: 'rnb_mellow_retro',
    style: 'rnb',
    description: '兼顾了复古与时尚的极有律动感的 80s/90s 高级和声。',
    exampleSongs: ['《Remember the Time》- Michael Jackson'],
    chords: [
      { rootOffset: 0, quality: 'maj9', nashvilleDegree: '1M9', romanDegree: 'IMaj9', description: '华美的起音' },
      { rootOffset: 9, quality: 'm9', nashvilleDegree: '6-9', romanDegree: 'vi9', description: '深遂的六级小九' },
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '轻快阳光的大七' },
      { rootOffset: 7, quality: '9', nashvilleDegree: '59', romanDegree: 'V9', description: '弹性的属九推进' }
    ]
  },
  {
    id: 'rnb_major_minor_clash',
    style: 'rnb',
    description: '通过小属和弦（Fm7）的强烈撞击，创造催人泪下的极度深情效果。',
    exampleSongs: ['《爱我别走》- 张震岳 R&B改编版', '《One Last Cry》'],
    chords: [
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '情绪激荡的大七' },
      { rootOffset: 5, quality: 'm7', nashvilleDegree: '4-7', romanDegree: 'iv7', description: '同名小调借四级！眼泪瞬间决堤的高频痛感' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '缓缓平复的释怀' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '依旧留在原点' }
    ]
  },
  {
    id: 'rnb_step_up_intro',
    style: 'rnb',
    description: '和弦步步高升，如同深夜漫步在璀璨霓虹下的都会街道。',
    exampleSongs: ['《That\'s What I Like》- Bruno Mars', '《说好的幸福呢》改编'],
    chords: [
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '微风轻叩寂寞' },
      { rootOffset: 4, quality: 'm7', nashvilleDegree: '3-7', romanDegree: 'iii7', description: '夜更深、更沉' },
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '霓虹灯突然亮起' },
      { rootOffset: 7, quality: '9', nashvilleDegree: '59', romanDegree: 'V9', description: '融入整座城市的律动' }
    ]
  },
  {
    id: 'rnb_aerial_chill',
    style: 'rnb',
    description: '充满漂浮悬空感的轻盈、冷色系 Chillout R&B / 蒸汽波走向。',
    exampleSongs: ['《Chillhop Nights》', '《路过》'],
    chords: [
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '冰凉剔透的水汽' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '微风温和轻抚' },
      { rootOffset: 9, quality: 'm7', nashvilleDegree: '6-7', romanDegree: 'vi7', description: '小调舒缓沉淀' },
      { rootOffset: 7, quality: '7', nashvilleDegree: '57', romanDegree: 'V7', description: '悬而未决的离岸感' }
    ]
  },
  {
    id: 'rnb_soul_minor_groove',
    style: 'rnb',
    description: '浓厚的传统新灵魂小调，带有些许街头、爵士和嘻哈融合的质地。',
    exampleSongs: ['《Erykah\'s Jam》', '《Appletree》- Erykah Badu'],
    chords: [
      { rootOffset: 9, quality: 'm9', nashvilleDegree: '6-9', romanDegree: 'vi9', description: '有些傲气、非常街头的小调九和弦' },
      { rootOffset: 2, quality: 'm9', nashvilleDegree: '2-9', romanDegree: 'ii9', description: '极为醇厚的回应' },
      { rootOffset: 7, quality: '9', nashvilleDegree: '59', romanDegree: 'V9', description: '随性摇摆的九属' },
      { rootOffset: 7, quality: '9', nashvilleDegree: '59', romanDegree: 'V9', description: '保持放松不换属' }
    ]
  },
  {
    id: 'rnb_cosmic_rise',
    style: 'rnb',
    description: '极富空间感、宇航员漫步太空般开阔辽远的现代 R&B 走向。',
    exampleSongs: ['《Space Trip》', '《星云》- 灵魂乐版'],
    chords: [
      { rootOffset: 8, quality: 'maj7', nashvilleDegree: 'b6M7', romanDegree: 'bVIMaj7', description: '降六度起音，瞬间失重' },
      { rootOffset: 10, quality: '7', nashvilleDegree: 'b77', romanDegree: 'bVII7', description: '降七属，星河斑驳' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '平稳降落在温暖星球' },
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '深深地舒口气' }
    ]
  },
  {
    id: 'rnb_tension_love',
    style: 'rnb',
    description: '带有古典爵士痕迹的高张力 R&B，讲述爱情的复杂与执迷。',
    exampleSongs: ['《眼色》- 林宥嘉 R&B变奏', '《If I Ain\'t Got You》变奏'],
    chords: [
      { rootOffset: 0, quality: 'maj7', nashvilleDegree: '1M7', romanDegree: 'IMaj7', description: '看似平静一如往常' },
      { rootOffset: 4, quality: '7', nashvilleDegree: '37', romanDegree: 'III7', description: '副属三级，情绪瞬间纠结、狂热' },
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '明亮大七解围，令人感动' },
      { rootOffset: 5, quality: 'm7', nashvilleDegree: '4-7', romanDegree: 'iv7', description: '反手又是同主音小四级，徒留下半声叹息' }
    ]
  },
  {
    id: 'rnb_mellow_wave',
    style: 'rnb',
    description: '极度舒缓柔美、犹如躺在温热潮水里的新灵魂情歌。',
    exampleSongs: ['《Best Part》- Daniel Caesar (B段部分)'],
    chords: [
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '潮水轻轻涌来' },
      { rootOffset: 4, quality: 'm7', nashvilleDegree: '3-7', romanDegree: 'iii7', description: '细腻的浪花吻在脚踝上' },
      { rootOffset: 2, quality: 'm7', nashvilleDegree: '2-7', romanDegree: 'ii7', description: '慵懒而温暖的沙滩' },
      { rootOffset: 7, quality: '9', nashvilleDegree: '59', romanDegree: 'V9', description: '金色夕阳轻轻搂抱' }
    ]
  },
  {
    id: 'rnb_jazzy_mood',
    style: 'rnb',
    description: '带有重度爵士化延伸音、极其高冷而醇厚的都会夜曲。',
    exampleSongs: ['《Nights》- Frank Ocean', '《都会幽香》'],
    chords: [
      { rootOffset: 2, quality: 'm9', nashvilleDegree: '2-9', romanDegree: 'ii9', description: '二级九和弦，咖啡香飘起' },
      { rootOffset: 7, quality: '13', nashvilleDegree: '5(13)', romanDegree: 'VI13', description: '属十三，带着微醺的闪耀' },
      { rootOffset: 9, quality: 'm9', nashvilleDegree: '6-9', romanDegree: 'vi9', description: '小九，温柔地拉上夜幕' },
      { rootOffset: 9, quality: 'm9', nashvilleDegree: '6-9', romanDegree: 'vi9', description: '夜已归于深寂' }
    ]
  },
  {
    id: 'rnb_glorious_sunset',
    style: 'rnb',
    description: '情绪广阔豪迈又不失温存、灿烂绚丽至极的 Neo-Soul 尾曲。',
    exampleSongs: ['《Best Part》- Daniel Caesar ( outro )', '《夕阳斜下》'],
    chords: [
      { rootOffset: 5, quality: 'maj7', nashvilleDegree: '4M7', romanDegree: 'IVMaj7', description: '漫溢天边的火烧云' },
      { rootOffset: 4, quality: 'm7', nashvilleDegree: '3-7', romanDegree: 'iii7', description: '温柔掩饰白天的喧嚣' },
      { rootOffset: 9, quality: 'm9', nashvilleDegree: '6-9', romanDegree: 'vi9', description: '高级小九，晚霞完全消褪' },
      { rootOffset: 9, quality: 'm9', nashvilleDegree: '6-9', romanDegree: 'vi9', description: '彻底陷入甜美的梦境' }
    ]
  },
  {
    id: 'pop_canon_pachelbel',
    style: 'pop',
    description: '世上最经典的伟大家和弦进行，又名卡农进行，温暖宽厚、极富安全感与治愈能量。',
    exampleSongs: ['《七里香》- 周杰伦', '《暖暖》- 梁静茹', '《勇气》- 梁静茹'],
    chords: [
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '安稳而包容的母港起航' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '向外舒展、宽广平稳的过渡' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '叹一口气，展现内敛的抒情美学' },
      { rootOffset: 4, quality: 'm', nashvilleDegree: '3-', romanDegree: 'iii', description: '沉静回落，心绪缓缓平复' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '温柔地托起旋律，充满希望' },
      { rootOffset: 0, quality: 'Major', nashvilleDegree: '1', romanDegree: 'I', description: '返璞归真，再次回到温暖的源头' },
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '纯净的依恋，真情实感流露' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '半回终止，完美引导下一个段落循环' }
    ]
  },
  {
    id: 'pop_magical_4536',
    style: 'pop',
    description: '风靡亚洲流行乐坛的万能黄金四和弦，情绪丰富婉转、略带感伤，是天然的高潮推进器。',
    exampleSongs: ['《修炼爱情》- 林俊杰', '《晴天》- 周杰伦', '《说好不哭》- 周杰伦'],
    chords: [
      { rootOffset: 5, quality: 'Major', nashvilleDegree: '4', romanDegree: 'IV', description: '不直接从1级起声，多一分淡淡的忧郁悬悬' },
      { rootOffset: 7, quality: 'Major', nashvilleDegree: '5', romanDegree: 'V', description: '功能性推进，情绪缓缓汇聚' },
      { rootOffset: 4, quality: 'm', nashvilleDegree: '3-', romanDegree: 'iii', description: '回落跌入暗色小调，诉说遗憾与深情' },
      { rootOffset: 9, quality: 'm', nashvilleDegree: '6-', romanDegree: 'vi', description: '情绪在6级沉淀，回味悠长' }
    ]
  }
];
