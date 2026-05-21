# 和弦灵感生成器 — 和弦数据字典

> **五大音乐风格、七十七套和弦进行的数据字典**
> 面向对象：乐理分析师、AI 编码 Agent、全栈开发人员
> 底层准则：本数据字典使用"调性相对偏移（rootOffset）+ 和弦品质（quality）"的原子化表征，运行时通过转调引擎（见 [V2.0-TECHNICAL_SPEC.md](./V2.0-TECHNICAL_SPEC.md#3-乐理转调引擎)）计算到 12 个调性。

---

## 1. 数据结构映射

每个进行在代码中对应 `ProgressionTemplate` 接口：

```typescript
interface ProgressionTemplate {
  id: string;              // 唯一标识
  style: MusicStyle;       // 所属风格
  chords: ChordTemplate[]; // 和弦数组
  description: string;     // 情绪描述
  exampleSongs?: string[]; // 金曲示范
}

interface ChordTemplate {
  rootOffset: number;      // 离开调性根音的半音数
  quality: ChordQuality;   // 和弦品质
  nashvilleDegree: string; // 纳什维尔数字（如 "1", "6-", "b7"）
  romanDegree: string;     // 罗马数字（如 "I", "vi", "bVII"）
  description: string;     // 演奏角色描述（如 "主和弦"）
}
```

**转调渲染**：每个 `ChordTemplate` 的 `rootOffset` 经过 `transposeChord()` 计算（详见技术实现规范第 3.4 节）得到具体音名、MIDI 音符和频率。

**关于 ChordQuality 的 13 种品质定义（半音偏移公式）**：见 [V2.0-TECHNICAL_SPEC.md 第 3.2 节](./V2.0-TECHNICAL_SPEC.md#32-和弦品质偏移公式)。

---

## 2. 流行音乐 (Pop) — 17 套

### pop_classic_heart — 万能经典神级进行
- **级数**：1 - 5 - 6- - 4 | I - V - vi - IV
- **情绪**：华语乐坛和流行世界的究极顶箱，稳定、圆满
- **金曲**：《晴天》（周杰伦）、《Perfect》（Ed Sheeran）、《All of Me》（John Legend）

### pop_golden_4536 — 流行黄金 4536 进行
- **级数**：4 - 5 - 3- - 6- | IV - V - iii - vi
- **情绪**：百折千回，副歌催泪利器，悬浮开场，完美闭环
- **金曲**：《说好的幸福呢》（周杰伦）、《小幸运》（田馥甄）、《修炼爱情》（林俊杰）

### pop_epic_minor — 史诗流行小调
- **级数**：6- - 4 - 1 - 5 | vi - IV - I - V
- **情绪**：暗夜微光，豁然开朗，带有强烈的叙事公路片张力
- **金曲**：《Faded》（Alan Walker）、《Apologize》（OneRepublic）

### pop_retro_1625 — 50 年代复古回转进行
- **级数**：1 - 6- - 2- - 5 | I - vi - ii - V
- **情绪**：浪漫怀旧、慵懒质朴，带有老式摇摆乐和慢吉他的留声机感
- **金曲**：《Stand by Me》（Ben E. King）、《宝贝》（张悬）

### pop_dynamic_upward — 昂扬阶梯进行
- **级数**：1 - 3- - 4 - 5 | I - iii - IV - V
- **情绪**：顺风前行、充满希望，极适合青春叙事副歌
- **金曲**：《追光者》（岑宁儿）、《Love Story》（Taylor Swift）

### pop_sweet_acoustic — 惬意甜美进行
- **级数**：1 - 4 - 6- - 5 | I - IV - vi - V
- **情绪**：阳光斑驳、轻松活泼，小吉他弹唱的绝对甜糖
- **金曲**：《I'm Yours》（Jason Mraz）、《甜甜的》（周杰伦）

### pop_indie_ballad — 独立空间叙事进行
- **级数**：4 - 1 - 5 - 6- | IV - I - V - vi
- **情绪**：避开庸俗的 1 级主调起手，悬浮清冷，极空间感
- **金曲**：《董小姐》（宋冬野）、《夜空中最亮的星》（逃跑计划）

### pop_descent_sigh — 深伤悲落叹息进行
- **级数**：6- - 5 - 4 - 5 | vi - V - IV - V
- **情绪**：缓缓下行的释怀，大属和弦拉回，诉说离别
- **金曲**：《安静》（周杰伦）、《听海》（张惠妹）

### pop_hope_highway — 希望公路走向
- **级数**：1 - 6- - 2- - 4 | I - vi - ii - IV
- **情绪**：豁然开朗的底蕴，不落俗
- **金曲**：《如果你也听说》（张惠妹）

### pop_jazz_touch_turn — 高级流行爵士回转
- **级数**：2-7 - 57 - 1M7 - 6-7 | ii7 - V7 - IMaj7 - vi7
- **情绪**：柔和高级、大度洒脱，带有一层都市黄昏的落地窗色彩
- **金曲**：《说散就散》（JC 陈泳彤）、《泡沫》（邓紫棋）

### pop_rising_stairs — 副歌高潮推动
- **级数**：4 - 5 - 6- - 1 | IV - V - vi - I
- **情绪**：情绪节节攀高，完美托起副歌歌唱极限
- **金曲**：《最初的梦想》（范玮琪）

### pop_subtle_tension — 微妙独白进行
- **级数**：1 - 5 - 2- - 4 | I - V - ii - IV
- **情绪**：平静外表下的暗涌，诉说未完
- **金曲**：《突然好想你》（五月天）

### pop_vocal_melancholy — 伤感独白进行
- **级数**：4 - 3- - 2- - 1 | IV - iii - ii - I
- **情绪**：慢慢退让的哀婉，极致的告别
- **金曲**：《成全》（刘若英）

### pop_cloudy_sky — 多云变幻走向
- **级数**：6- - 2- - 4 - 5 | vi - ii - IV - V
- **情绪**：色彩阴晴不定，微带灰度
- **金曲**：《阴天》（莫文蔚）

### pop_bittersweet_cycle — 甜苦交织流行循环
- **级数**：3- - 6- - 4 - 5 | iii - vi - IV - V
- **情绪**：离调的纠结，略带感伤的阳光
- **金曲**：《那些年》（胡夏）

### pop_canon_pachelbel — 巴赫贝尔卡农进行
- **级数**：1 - 5 - 6- - 3- - 4 - 1 - 4 - 5 | I - V - vi - iii - IV - I - IV - V
- **情绪**：传世神作，无懈可击的安全感、神圣美
- **金曲**：《七里香》（周杰伦）、《暖暖》（梁静茹）

### pop_magical_4536 — 黄金万能四和弦
- **级数**：4 - 5 - 3- - 6- | IV - V - iii - vi（三和弦简版）
- **情绪**：情绪天然放大器，华语必备
- **金曲**：《修炼爱情》（林俊杰）

---

## 3. 民谣风格 (Folk) — 15 套

### folk_campfire — 经典营火弹唱
- **级数**：1 - 4 - 1 - 5 | I - IV - I - V
- **情绪**：淳朴、自然、风吹草动，民谣骨架
- **金曲**：《Blowin' in the Wind》（Bob Dylan）

### folk_canon_path — 半卡农指弹路
- **级数**：1 - 5 - 6- - 3- | I - V - vi - iii
- **情绪**：深情安静，大树斜阳般平顺
- **金曲**：《斑马，斑马》（宋冬野）

### folk_country_road — 经典乡村之路
- **级数**：1 - 5 - 4 - 1 | I - V - IV - I
- **情绪**：麦田旷野，驱车扬尘，舒畅无比
- **金曲**：《Take Me Home, Country Roads》

### folk_melancholy_ballad — 清冷树荫悲歌
- **级数**：6- - 4 - 5 - 6- | vi - IV - V - vi
- **情绪**：略带泪光，极致的安河桥式孤独
- **金曲**：《安和桥》（宋冬野）

### folk_steps_journey — 成长叙事脚步
- **级数**：1 - 2- - 3- - 4 | I - ii - iii - IV
- **情绪**：拾级而上的平民梦想，路漫漫

### folk_mountain_wind — 凯尔特山风悲凉
- **级数**：6- - 1 - 4 - 5 | vi - I - IV - V
- **情绪**：茫然荒原，凛风吹拂，传说重开
- **金曲**：《500 Miles》

### folk_melancholy_indie — 独立轻叹民谣
- **级数**：2- - 4 - 1 - 5 | ii - IV - I - V
- **情绪**：慵懒自卑，自我救赎
- **金曲**：《奇妙能力歌》（陈粒）

### folk_wooden_chair — 日落老旧摇椅
- **级数**：1 - 6- - 4 - 1 | I - vi - IV - I
- **情绪**：平实惬意，旧木家常，叶落风停

### folk_celtic_minor — 神秘凯尔特小调
- **级数**：6- - 4 - 5 - 6- | vi - IV - V - vi
- **情绪**：风笛回声，浓雾覆顶
- **金曲**：《Scarborough Fair》

### folk_gentle_arpeggio — 温柔分解指弹
- **级数**：1 - 3- - 6- - 4 | I - iii - vi - IV
- **情绪**：温文尔雅，抚平伤痕
- **金曲**：《这一生关于你的风景》（枯木逢春）

### folk_rainy_day — 倚窗听雨民谣
- **级数**：6- - 3- - 4 - 5 | vi - iii - IV - V
- **情绪**：屋檐雨珠，雾蒙尘嚣
- **金曲**：《儿歌》（张悬）

### folk_vagabond_wander — 流浪风沙之歌
- **级数**：6- - 1 - 5 - 4 | vi - I - V - IV
- **情绪**：烈酒残照，风衣长路
- **金曲**：《阿刁》（民谣版）

### folk_simple_nest — 柴米油盐温巢
- **级数**：1 - 4 - 5 - 4 | I - IV - V - IV
- **情绪**：平凡人家，暖和生活
- **金曲**：《生活不止眼前的苟且》副歌

### folk_harvest_sunset — 乡村丰收麦浪
- **级数**：5 - 4 - 1 - 1 | V - IV - I - I
- **情绪**：麦穗金黄，踏实归心

### folk_gently_sigh — 洒脱独立轻叹
- **级数**：6- - 1 - 4 - 5 | vi - I - IV - V
- **情绪**：杯茶淡水，跨越万山
- **金曲**：《历历万乡》（陈粒）

---

## 4. 摇滚风格 (Rock) — 15 套

### rock_basic_anthem — 狂放力量国歌
- **级数**：1 - 4 - 5 - 5 | I - IV - V - V
- **情绪**：电失真墙爆开，极富抗争高音强音
- **金曲**：《We Will Rock You》（Queen）、《无地自容》（黑豹）

### rock_mixolydian_riff — 叛逆 Mixolydian
- **级数**：1 - b7 - 4 - 1 | I - bVII - IV - I
- **情绪**：降 7 级瞬间产生的野性感，不服现状
- **金曲**：《公路之歌》（痛仰）、《Sweet Home Alabama》

### rock_power_ballad — 抒情悲烈摇滚
- **级数**：6- - 5 - 4 - 4 | vi - V - IV - IV
- **情绪**：主音声入低吼，巨轮触礁的壮美
- **金曲**：《Don't Cry》（Guns N' Roses）、《花房姑娘》

### rock_grunge_90s — 经典 Grunge 模进
- **级数**：1 - 4 - b6 - b7 | I - IV - bVI - bVII
- **情绪**：降 6、7 级的非正常模进，粗粝，歇斯底里
- **金曲**：《Smells Like Teen Spirit》（Nirvana）

### rock_secondary_tension — 英伦意外大二级
- **级数**：1 - 2 - 4 - 1 | I - II - IV - I（Dm 变 D 大和弦）
- **情绪**：本是小调的二级突然亮起为大三和弦，刺破天空
- **金曲**：《Creep》（Radiohead）、《Yellow》（Coldplay）

### rock_blues_drive — 钢骨硬摇蓝调
- **级数**：1 - 5 - b7 - 4 | I - V - bVII - IV
- **情绪**：咆哮的经典 riff 路线
- **金曲**：《Back in Black》（AC/DC）

### rock_punk_riot — 高速暴力朋克
- **级数**：1 - 5 - 6- - 4 | I - V - vi - IV
- **情绪**：三和弦高频重压，喧嚣呐喊
- **金曲**：《Basket Case》（Green Day）

### rock_gothic_dramatic — 史诗哥特宏大
- **级数**：6- - 4 - 2- - 5 | vi - IV - ii - V
- **情绪**：管风琴与底音铁轨
- **金曲**：《夜的第七章》（周杰伦）

### rock_britpop_glory — 荣耀英伦合唱
- **级数**：6- - 1 - 5 - 4 | vi - I - V - IV
- **情绪**：骄傲失落，合奏高潮
- **金曲**：《Wonderwall》（Oasis）

### rock_major_third_tension — 黄家驹大三度悲壮
- **级数**：1 - 3 - 6- - 4 | I - III - vi - IV（Em 变 E 大和弦）
- **情绪**：离调极其严重，不屈、呐喊
- **金曲**：《光辉岁月》（Beyond）

### rock_epic_darkness — 黑暗金属砸重
- **级数**：1 - b3 - 4 - b7 | I - bIII - IV - bVII
- **情绪**：钢铁重锤，裂金切角
- **金曲**：《New Born》（Muse）

### rock_screaming_guitar — 巨轮金属怒涛
- **级数**：6- - 2 - 4 - 5 | vi - II - IV - V（大二级推入）
- **情绪**：警示高音，吉他炫彩
- **金曲**：《梦回唐朝》段

### rock_stairway_blues — 深渊绝壁探海
- **级数**：6- - viio - 4 - 5 | vi - viio - IV - V
- **情绪**：攀折高阻下行，迷画怀古
- **金曲**：《Stairway to Heaven》（Led Zeppelin）

### rock_garage_dirty — 铁灰车库机油
- **级数**：6- - 6- - 4 - 5 | vi - vi - IV - V
- **情绪**：垃圾和弦，极度冷酷
- **金曲**：《Seven Nation Army》

### rock_grunge_fever — 西雅图自闭风暴
- **级数**：1 - b3 - 6- - 4 | I - bIII - vi - IV
- **情绪**：冰火交加，自我挣扎
- **金曲**：《Lithium》（Nirvana）

---

## 5. 爵士风格 (Jazz) — 15 套

### jazz_classic_2516 — 黄金二五一六
- **级数**：2-7 - 57 - 1M7 - 67 | ii7 - V7 - IMaj7 - VI7（六级大属和弦拉回二级）
- **情绪**：爵士王冠。循环柔润，昏黄慵懒
- **金曲**：《Autumn Leaves（秋叶）》

### jazz_fly_me — 月亮漫步走向
- **级数**：6-7 - 2-7 - 57 - 1M7 | vi7 - ii7 - V7 - IMaj7
- **情绪**：太空经典。圆舞顺滑，典雅高贵
- **金曲**：《Fly Me to the Moon》

### jazz_walk_up — 酒馆钢琴半阶上行
- **级数**：1M7 - #1dim7 - 2-7 - 57 | IMaj7 - #Idim7 - ii7 - V7
- **情绪**：半音上行纠缠，充满复古老黑白琴的高压张力
- **金曲**：《Take the "A" Train》

### jazz_tritone_sub — 高级三全音代五
- **级数**：2-7 - b27 - 1M7 - 6-7 | ii7 - bII7 - IMaj7 - vi7（Db7 代替 G7 下滑）
- **情绪**：融化咖啡般的极润滑，高维度和声重装
- **金曲**：《Misty》变奏

### jazz_chromatic_fall — 妖娆半音阶大下坠
- **级数**：4M7 - 4-7 - 3-7 - b3dim7 | IVMaj7 - iv7 - iiim7 - bIIIdim7
- **情绪**：精致缠绵，缓缓跌落，凄清冷调
- **金曲**：《My Funny Valentine》

### jazz_backdoor_v — 后门属七归航
- **级数**：4M7 - b77 - 1M7 - 1M7 | IVMaj7 - bVII7 - IMaj7 - IMaj7（Bb7 代替 G7）
- **情绪**：出人意料的清脆开朗，极致高雅
- **金曲**：《Just Friends》

### jazz_minor_swing — 吉普赛小调狂舞
- **级数**：6-7 - 2-7 - 57 - 6-7 | vi7 - ii7 - V7 - vi7
- **情绪**：摇摆律动，木吉他高能跳跃
- **金曲**：《Minor Swing》

### jazz_lady_bird — 波普大师空间
- **级数**：1M7 - b6M7 - 2-7 - 57 | IMaj7 - bVIMaj7 - ii7 - V7
- **情绪**：离奇错置，和声艺术的飞天之笔
- **金曲**：《Lady Bird》

### jazz_sophisticated_ballad — 萨克斯情诗慢步
- **级数**：6-7 - 27 - 4M7 - 57 | vi7 - II7 - IVMaj7 - V7（D7 副属大二级）
- **情绪**：浓情微寒，萨吹长音，杯酒浮梦
- **金曲**：《In a Sentimental Mood》

### jazz_mellow_nights — 九和九属降九奢华
- **级数**：2-9 - 57b9 - 1M9 - 613 | ii9 - V7b9 - IMaj9 - VI13（高配和声极限）
- **情绪**：太空漫步，满天碎色。极富高街都会夜晚色彩
- **金曲**：《Blue in Green》（Miles Davis）

### jazz_dorian_sunset — 多里安太空静漂
- **级数**：2-7 - 2-7 - b3-7 - 2-7 | ii7 - ii7 - biii7 - ii7
- **情绪**：太空中自由于重力，多里安悬浮色调
- **金曲**：《So What》（Miles Davis）

### jazz_autumn_breeze — 萧瑟冷酷摇摆
- **级数**：6-7 - 2-7 - 57 - 1M7 | vi7 - ii7 - V7 - IMaj7
- **情绪**：枯叶扫街，温馨风衣
- **金曲**：《Autumn Leaves》

### jazz_climb_mountain — 精致高阶下行对位
- **级数**：4M7 - 3-7 - b3dim7 - 2-7 | IVMaj7 - iiim7 - bIIIdim7 - ii7
- **情绪**：缠绵对位，大度释放
- **金曲**：《Wave》（Jobim）变奏

### jazz_mellow_blue — 慢速深夜蓝色属七
- **级数**：17 - 47 - 17 - 57 | I7 - IV7 - I7 - V7（纯属七蓝调）
- **情绪**：幽蓝叹息，烟雾升腾
- **金曲**：《Mornin' Blues》

### jazz_back_to_bar — 波普大 turnaround
- **级数**：1M7 - 67 - 2-7 - 57 | IMaj7 - VI7 - ii7 - V7
- **情绪**：斑斓折返，收放自如
- **金曲**：《Anatomy of a Turnaround》

---

## 6. R&B 与 Neo-Soul — 15 套

### rnb_neo_soul_loop — 丝绒性感 Neo-Soul
- **级数**：4M7 - 3-7 - 6-7 - 1M7 | IVMaj7 - iiim7 - vi7 - IMaj7
- **情绪**：高灵柔亮，催眠反复。深夜高阶新灵魂的代表
- **金曲**：《Just the Two of Us》

### rnb_late_night_groove — 都会微醺高贵
- **级数**：4M7 - 57 - 3-7 - 6-7 | IVMaj7 - V7 - iiim7 - vi7
- **情绪**：水汽缭绕，温香高雅，极易哼唱
- **金曲**：《How Deep Is Your Love》段

### rnb_mellow_extended — 灵魂超极高阶
- **级数**：2-9 - 59 - 1M9 - 6-9 | ii9 - V9 - IMaj9 - vi9
- **情绪**：极度奢华，九音和声产生的极宽广心神
- **金曲**：《Best Part》（Daniel Caesar）

### rnb_sensual_descent — 丝亮阶梯水流
- **级数**：4M7 - 3-7 - 2-7 - 1M7 | IVMaj7 - iiim7 - ii7 - IMaj7
- **情绪**：温存交谈，如水轻拂
- **金曲**：《No One》（Alicia Keys）

### rnb_minor_mood — 孤傲冷酷都会
- **级数**：6-7 - 4M7 - 1M7 - 27 | vi7 - IVMaj7 - IMaj7 - II7
- **情绪**：冷冰高贵，带有极强的独立自信
- **金曲**：《If I Ain't Got You》（Alicia Keys）

### rnb_mellow_retro — 80 年代爵律夜恋
- **级数**：1M9 - 6-9 - 4M7 - 59 | IMaj9 - vi9 - IVMaj7 - V9
- **情绪**：经典跳性，旧式都会霓虹
- **金曲**：《Remember the Time》

### rnb_major_minor_clash — 借用和声决堤痛
- **级数**：4M7 - 4-7 - 1M7 - 1M7 | IVMaj7 - iv7 - IMaj7 - IMaj7（借 Fm7，大四变小四）
- **情绪**：眼泪决堤的乐理催泪弹，高级借和声痛感
- **金曲**：《借口》（周杰伦）、《Creep》（Radiohead 结束部）

### rnb_step_up_intro — 深夜霓虹起步
- **级数**：2-7 - 3-7 - 4M7 - 59 | ii7 - iiim7 - IVMaj7 - V9
- **情绪**：都会暖光接力亮起，步步走高

### rnb_aerial_chill — 蒸汽波 Chillout 轻浮
- **级数**：4M7 - 1M7 - 6-7 - 57 | IVMaj7 - IMaj7 - vi7 - V7
- **情绪**：剔透冰蓝，无重状态，虚无浪漫

### rnb_soul_minor_groove — 嘻哈街头慵懒
- **级数**：6-9 - 2-9 - 59 - 59 | vi9 - ii9 - V9 - V9
- **情绪**：垮塌的街头爵士，摇晃且孤傲

### rnb_cosmic_rise — 反重力宇航漫步
- **级数**：b6M7 - b77 - 1M7 - 1M7 | bVIMaj7 - bVII7 - IMaj7 - IMaj7（Abmaj7 → Bb7）
- **情绪**：瞬间失重，进入繁星点点的宇宙，唯美宽广

### rnb_tension_love — 悲结执恋副属
- **级数**：1M7 - 37 - 4M7 - 4-7 | IMaj7 - III7 - IVMaj7 - iv7（E7 → Fm7）
- **情绪**：极强的戏剧纠结纠缠感，讲述爱情博弈
- **金曲**：《依然爱你》

### rnb_mellow_wave — 金色海岸微潮
- **级数**：4M7 - 3-7 - 2-7 - 59 | IVMaj7 - iiim7 - ii7 - V9
- **情绪**：夕阳轻抚，温暖沙滩，海水涨落

### rnb_jazzy_mood — 都会爵色夜景萨音
- **级数**：2-9 - 513 - 1M9 - 67 | ii9 - V13 - IMaj9 - VI7
- **情绪**：极度奢华诱惑，冷峻而高能

### rnb_glorious_sunset — 霞光完全褪去
- **级数**：4M7 - 3-7 - 6-9 - 6-9 | IVMaj7 - iiim7 - vi9 - vi9（小大七渐隐）
- **情绪**：晚霞消融，甜梦渐染，极富浪漫呼吸

---

## 7. 数据完整性校验

对这份数据库做程序化复制时，需确保：

1. `id` 唯一，不重复
2. 每个 `ProgressionTemplate.chords` 长度 4~8
3. 每个 `ChordTemplate.quality` 属于 13 种 `ChordQuality` 之一
4. `rootOffset` 取值 0~11
5. `nashvilleDegree` 使用标准标记法：`1`~`7` + `b`(降) + `#`(升) + `-`(小调) 后缀
6. `romanDegree` 使用罗马数字：`I`~`VII` + `b`(降) + `#`(升) 前缀，小写 = 小调和弦
7. 每个 `style` 属于 5 种 `MusicStyle` 之一
8. `exampleSongs` 为可选字段，可以为空数组或省略
