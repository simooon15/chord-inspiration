// 和弦数据 · 独立文件
// 后续更新只改这个文件，不改 HTML
// 格式：{ degrees: [级数数组], chords: [C调基准和弦], notes: [构成音] }
const progressions = {
  pop: [
    { degrees: [1,5,6,4], chords: ['C','G','Am','F'], notes: ['C-E-G','G-B-D','A-C-E','F-A-C'] },
    { degrees: [1,6,4,5], chords: ['C','Am','F','G'], notes: ['C-E-G','A-C-E','F-A-C','G-B-D'] },
    { degrees: [6,4,1,5], chords: ['Am','F','C','G'], notes: ['A-C-E','F-A-C','C-E-G','G-B-D'] },
    { degrees: [1,5,4,4], chords: ['C','G','F','F'], notes: ['C-E-G','G-B-D','F-A-C','F-A-C'] },
    { degrees: [4,5,6,6], chords: ['F','G','Am','Am'], notes: ['F-A-C','G-B-D','A-C-E','A-C-E'] },
    { degrees: [1,4,6,5], chords: ['C','F','Am','G'], notes: ['C-E-G','F-A-C','A-C-E','G-B-D'] },
    { degrees: [1,3,4,4], chords: ['C','Em','F','F'], notes: ['C-E-G','E-G-B','F-A-C','F-A-C'] },
    { degrees: [6,5,4,4], chords: ['Am','G','F','F'], notes: ['A-C-E','G-B-D','F-A-C','F-A-C'] },
    { degrees: [4,1,5,6], chords: ['F','C','G','Am'], notes: ['F-A-C','C-E-G','G-B-D','A-C-E'] },
    { degrees: [1,6,4,4], chords: ['C','Am','F','F'], notes: ['C-E-G','A-C-E','F-A-C','F-A-C'] },
    { degrees: [1,5,4,6], chords: ['C','G','F','Am'], notes: ['C-E-G','G-B-D','F-A-C','A-C-E'] },
    { degrees: [6,4,5,1], chords: ['Am','F','G','C'], notes: ['A-C-E','F-A-C','G-B-D','C-E-G'] },
    { degrees: [1,6,5,4], chords: ['C','Am','G','F'], notes: ['C-E-G','A-C-E','G-B-D','F-A-C'] },
    { degrees: [4,5,1,1], chords: ['F','G','C','C'], notes: ['F-A-C','G-B-D','C-E-G','C-E-G'] },
    { degrees: [1,4,5,4], chords: ['C','F','G','F'], notes: ['C-E-G','F-A-C','G-B-D','F-A-C'] },
  ],
  folk: [
    { degrees: [1,4,1,5], chords: ['C','F','C','G'], notes: ['C-E-G','F-A-C','C-E-G','G-B-D'] },
    { degrees: [1,5,4,4], chords: ['C','G','F','F'], notes: ['C-E-G','G-B-D','F-A-C','F-A-C'] },
    { degrees: [1,6,5,5], chords: ['C','Am','G','G'], notes: ['C-E-G','A-C-E','G-B-D','G-B-D'] },
    { degrees: [1,4,5,1], chords: ['C','F','G','C'], notes: ['C-E-G','F-A-C','G-B-D','C-E-G'] },
    { degrees: [1,5,6,4], chords: ['C','G','Am','F'], notes: ['C-E-G','G-B-D','A-C-E','F-A-C'] },
    { degrees: [6,4,1,5], chords: ['Am','F','C','G'], notes: ['A-C-E','F-A-C','C-E-G','G-B-D'] },
    { degrees: [1,6,4,5], chords: ['C','Am','F','G'], notes: ['C-E-G','A-C-E','F-A-C','G-B-D'] },
    { degrees: [4,1,6,5], chords: ['F','C','Am','G'], notes: ['F-A-C','C-E-G','A-C-E','G-B-D'] },
    { degrees: [1,4,5,5], chords: ['C','F','G','G'], notes: ['C-E-G','F-A-C','G-B-D','G-B-D'] },
    { degrees: [1,4,1,1], chords: ['C','F','C','C'], notes: ['C-E-G','F-A-C','C-E-G','C-E-G'] },
    { degrees: [6,1,4,5], chords: ['Am','C','F','G'], notes: ['A-C-E','C-E-G','F-A-C','G-B-D'] },
    { degrees: [1,6,4,1], chords: ['C','Am','F','C'], notes: ['C-E-G','A-C-E','F-A-C','C-E-G'] },
    { degrees: [1,5,4,6], chords: ['C','G','F','Am'], notes: ['C-E-G','G-B-D','F-A-C','A-C-E'] },
    { degrees: [4,5,6,6], chords: ['F','G','Am','Am'], notes: ['F-A-C','G-B-D','A-C-E','A-C-E'] },
    { degrees: [1,2,4,5], chords: ['C','Dm','F','G'], notes: ['C-E-G','D-F-A','F-A-C','G-B-D'] },
    { degrees: [1,4,6,5], chords: ['C','F','Am','G'], notes: ['C-E-G','F-A-C','A-C-E','G-B-D'] },
  ],
  rock: [
    { degrees: [1,4,5,5], chords: ['C','F','G','G'], notes: ['C-E-G','F-A-C','G-B-D','G-B-D'] },
    { degrees: [1,5,6,4], chords: ['C','G','Am','F'], notes: ['C-E-G','G-B-D','A-C-E','F-A-C'] },
    { degrees: [1,'♭7',4,1], chords: ['C','Bb','F','C'], notes: ['C-E-G','Bb-D-F','F-A-C','C-E-G'] },
    { degrees: [1,4,6,5], chords: ['C','F','Am','G'], notes: ['C-E-G','F-A-C','A-C-E','G-B-D'] },
    { degrees: [1,'♭3',4,'♭3'], chords: ['C','Eb','F','Eb'], notes: ['C-E-G','Eb-G-Bb','F-A-C','Eb-G-Bb'] },
    { degrees: [6,4,1,5], chords: ['Am','F','C','G'], notes: ['A-C-E','F-A-C','C-E-G','G-B-D'] },
    { degrees: [1,4,'♭7',4], chords: ['C','F','Bb','F'], notes: ['C-E-G','F-A-C','Bb-D-F','F-A-C'] },
    { degrees: [1,5,4,4], chords: ['C','G','F','F'], notes: ['C-E-G','G-B-D','F-A-C','F-A-C'] },
    { degrees: [1,4,4,4], chords: ['C','F','F','F'], notes: ['C-E-G','F-A-C','F-A-C','F-A-C'] },
    { degrees: [1,6,5,5], chords: ['C','Am','G','G'], notes: ['C-E-G','A-C-E','G-B-D','G-B-D'] },
    { degrees: [1,5,'♭7',4], chords: ['C','G','Bb','F'], notes: ['C-E-G','G-B-D','Bb-D-F','F-A-C'] },
    { degrees: [6,5,4,4], chords: ['Am','G','F','F'], notes: ['A-C-E','G-B-D','F-A-C','F-A-C'] },
    { degrees: [1,'♭7',5,4], chords: ['C','Bb','G','F'], notes: ['C-E-G','Bb-D-F','G-B-D','F-A-C'] },
    { degrees: [4,1,5,6], chords: ['F','C','G','Am'], notes: ['F-A-C','C-E-G','G-B-D','A-C-E'] },
    { degrees: [1,5,1,4], chords: ['C','G','C','F'], notes: ['C-E-G','G-B-D','C-E-G','F-A-C'] },
    { degrees: [1,4,5,'♭7'], chords: ['C','F','G','Bb'], notes: ['C-E-G','F-A-C','G-B-D','Bb-D-F'] },
  ],
  jazz: [
    { degrees: [2,5,1,1], chords: ['Dm7','G7','Cmaj7','Cmaj7'], notes: ['D-F-A-C','G-B-D-F','C-E-G-B','C-E-G-B'] },
    { degrees: [1,6,2,5], chords: ['Cmaj7','Am7','Dm7','G7'], notes: ['C-E-G-B','A-C-E-G','D-F-A-C','G-B-D-F'] },
    { degrees: [2,5,1,6], chords: ['Dm7','G7','Cmaj7','Am7'], notes: ['D-F-A-C','G-B-D-F','C-E-G-B','A-C-E-G'] },
    { degrees: [2,5,3,6], chords: ['Dm7','G7','Em7','Am7'], notes: ['D-F-A-C','G-B-D-F','E-G-B-D','A-C-E-G'] },
    { degrees: [1,4,3,6], chords: ['Cmaj7','Fmaj7','Em7','Am7'], notes: ['C-E-G-B','F-A-C-E','E-G-B-D','A-C-E-G'] },
    { degrees: [2,5,1,4], chords: ['Dm7','G7','Cmaj7','Fmaj7'], notes: ['D-F-A-C','G-B-D-F','C-E-G-B','F-A-C-E'] },
    { degrees: [3,6,2,5], chords: ['Em7','Am7','Dm7','G7'], notes: ['E-G-B-D','A-C-E-G','D-F-A-C','G-B-D-F'] },
    { degrees: [1,6,4,5], chords: ['Cmaj7','Am7','Fmaj7','G7'], notes: ['C-E-G-B','A-C-E-G','F-A-C-E','G-B-D-F'] },
    { degrees: [2,5,1,1], chords: ['Dm9','G13','Cmaj9','Cmaj9'], notes: ['D-F-A-C-E','G-B-D-F-E','C-E-G-B-D','C-E-G-B-D'] },
    { degrees: [1,2,3,4], chords: ['Cmaj7','Dm7','Em7','Fmaj7'], notes: ['C-E-G-B','D-F-A-C','E-G-B-D','F-A-C-E'] },
    { degrees: [2,5,1,3], chords: ['Dm7','G7♭9','Cmaj7','Em7'], notes: ['D-F-A-C','G-B-D-F-Ab','C-E-G-B','E-G-B-D'] },
    { degrees: [4,5,3,6], chords: ['Fmaj7','G7','Em7','Am7'], notes: ['F-A-C-E','G-B-D-F','E-G-B-D','A-C-E-G'] },
    { degrees: [2,5,6,1], chords: ['Dm7♭5','G7♭9','Am7','Cmaj7'], notes: ['D-F-Ab-C','G-B-D-F-Ab','A-C-E-G','C-E-G-B'] },
    { degrees: [1,4,2,5], chords: ['Cmaj7','Fmaj7','Dm7','G7'], notes: ['C-E-G-B','F-A-C-E','D-F-A-C','G-B-D-F'] },
    { degrees: [2,5,1,1], chords: ['Dm7','G7','C6','C6'], notes: ['D-F-A-C','G-B-D-F','C-E-G-A','C-E-G-A'] },
    { degrees: [1,'♭3',2,5], chords: ['Cmaj7','Ebm7','Dm7','G7'], notes: ['C-E-G-B','Eb-Gb-Bb-Db','D-F-A-C','G-B-D-F'] },
  ],
  rnb: [
    { degrees: [1,4,3,6], chords: ['Cmaj7','Fmaj7','Em7','Am7'], notes: ['C-E-G-B','F-A-C-E','E-G-B-D','A-C-E-G'] },
    { degrees: [4,3,6,2], chords: ['Fmaj7','Em7','Am7','Dm7'], notes: ['F-A-C-E','E-G-B-D','A-C-E-G','D-F-A-C'] },
    { degrees: [2,5,1,6], chords: ['Dm9','G13','Cmaj9','Am9'], notes: ['D-F-A-C-E','G-B-D-F-E','C-E-G-B-D','A-C-E-G-B'] },
    { degrees: [1,6,4,5], chords: ['Cmaj7','Am7','Fmaj7','G7'], notes: ['C-E-G-B','A-C-E-G','F-A-C-E','G-B-D-F'] },
    { degrees: [6,4,1,5], chords: ['Am7','Fmaj7','Cmaj7','G7'], notes: ['A-C-E-G','F-A-C-E','C-E-G-B','G-B-D-F'] },
    { degrees: [1,4,5,4], chords: ['Cmaj7','Fmaj7','G7','Fmaj7'], notes: ['C-E-G-B','F-A-C-E','G-B-D-F','F-A-C-E'] },
    { degrees: [2,5,1,1], chords: ['Dm9','G13','Cmaj9','Am7'], notes: ['D-F-A-C-E','G-B-D-F-E','C-E-G-B-D','A-C-E-G'] },
    { degrees: [1,3,4,4], chords: ['Cmaj7','Em7','Fmaj7','Fmaj7'], notes: ['C-E-G-B','E-G-B-D','F-A-C-E','F-A-C-E'] },
    { degrees: [4,5,6,6], chords: ['Fmaj7','G7','Am7','Am7'], notes: ['F-A-C-E','G-B-D-F','A-C-E-G','A-C-E-G'] },
    { degrees: [1,6,2,5], chords: ['Cmaj7','Am7','Dm7','G7'], notes: ['C-E-G-B','A-C-E-G','D-F-A-C','G-B-D-F'] },
    { degrees: [6,5,4,3], chords: ['Am9','G13','Fmaj7','Em9'], notes: ['A-C-E-G-B','G-B-D-F-E','F-A-C-E','E-G-B-D-F#'] },
    { degrees: [2,5,3,6], chords: ['Dm7','G7','Em7','Am7'], notes: ['D-F-A-C','G-B-D-F','E-G-B-D','A-C-E-G'] },
    { degrees: [1,4,6,5], chords: ['Cmaj7','Fmaj7','Am7','G7'], notes: ['C-E-G-B','F-A-C-E','A-C-E-G','G-B-D-F'] },
    { degrees: [4,3,2,5], chords: ['Fmaj7','Em7','Dm7','G7'], notes: ['F-A-C-E','E-G-B-D','D-F-A-C','G-B-D-F'] },
    { degrees: [1,1,4,5], chords: ['Cmaj7','Cmaj7','Fmaj7','G7sus4'], notes: ['C-E-G-B','C-E-G-B','F-A-C-E','G-C-D-F'] },
    { degrees: [6,4,5,1], chords: ['Am9','Fmaj7','G7','Cmaj9'], notes: ['A-C-E-G-B','F-A-C-E','G-B-D-F','C-E-G-B-D'] },
  ],
};

// 12 调音名映射
const noteMap = {
  C: ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'],
  Db: ['Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B','C'],
  D: ['D','Eb','E','F','F#','G','Ab','A','Bb','B','C','Db'],
  Eb: ['Eb','E','F','Gb','G','Ab','A','Bb','B','C','Db','D'],
  E: ['E','F','F#','G','Ab','A','Bb','B','C','Db','D','Eb'],
  F: ['F','Gb','G','Ab','A','Bb','B','C','Db','D','Eb','E'],
  'F#': ['F#','G','Ab','A','Bb','B','C','Db','D','Eb','E','F'],
  G: ['G','Ab','A','Bb','B','C','Db','D','Eb','E','F','F#'],
  Ab: ['Ab','A','Bb','B','C','Db','D','Eb','E','F','Gb','G'],
  A: ['A','Bb','B','C','Db','D','Eb','E','F','F#','G','Ab'],
  Bb: ['Bb','B','C','Db','D','Eb','E','F','Gb','G','Ab','A'],
  B: ['B','C','Db','D','Eb','E','F','F#','G','Ab','A','Bb'],
};

const rootOrder = ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];

function transposeChord(name, fromK, toK) {
  if (fromK === toK) return name;
  const root = name.match(/^[A-G][b#]?/)[0];
  const suffix = name.slice(root.length);
  const idx = rootOrder.indexOf(root);
  if (idx === -1) return name;
  return noteMap[toK][idx] + suffix;
}

function transposeNote(str, fromK, toK) {
  if (fromK === toK) return str;
  return str.split('-').map(n => {
    const m = n.match(/^([A-G][b#]?)(.*)/);
    if (!m) return n;
    const idx = rootOrder.indexOf(m[1]);
    return idx === -1 ? n : noteMap[toK][idx] + m[2];
  }).join('-');
}
