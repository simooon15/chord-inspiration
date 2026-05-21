/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ChordQuality =
  | 'Major'      // Triad: [0, 4, 7] (e.g., C, F, G)
  | 'm'          // Minor Triad: [0, 3, 7] (e.g., Am, Dm, Em)
  | '7'          // Dominant 7: [0, 4, 7, 10] (e.g., G7, D7)
  | 'maj7'       // Major 7: [0, 4, 7, 11] (e.g., Cmaj7, Fmaj7)
  | 'm7'         // Minor 7: [0, 3, 7, 10] (e.g., Am7, Dm7)
  | 'm9'         // Minor 9: [0, 3, 7, 10, 14]
  | 'maj9'       // Major 9: [0, 4, 7, 11, 14]
  | '9'          // Dominant 9: [0, 4, 7, 10, 14]
  | 'dim'        // Diminished Triad: [0, 3, 6]
  | 'dim7'       // Diminished 7th: [0, 3, 6, 9] (e.g., F#dim7)
  | 'm7b5'       // Half-diminished 7th: [0, 3, 6, 10] (e.g., Bm7b5)
  | '7b9'        // Dominant 7 flat 9: [0, 4, 7, 10, 13]
  | '13';        // Dominant 13: [0, 4, 7, 10, 9]

export type MusicStyle = 'pop' | 'folk' | 'rock' | 'jazz' | 'rnb';

export interface StyleMeta {
  id: MusicStyle;
  name: string;
  desc: string;
  emoji: string;
  accentClass: string;
}

export interface ChordTemplate {
  rootOffset: number;     // Semitone offset from Key Root (0 = Key Root, e.g. 5 = IV in major)
  quality: ChordQuality;  // Quality of the chord
  nashvilleDegree: string;// Nashville scale degree (e.g., "1", "6-", "5", "4", "b7", "b3")
  romanDegree: string;    // Roman numeral scale degree (e.g., "I", "vi", "V", "IV", "bVII", "bIII")
  description?: string;   // Optional description of this specific chord's role (e.g. "主和弦", "通往下一级")
}

export interface ProgressionTemplate {
  id: string;
  style: MusicStyle;
  chords: ChordTemplate[];
  description: string;    // Story or feel of the progression (e.g., "悲壮而激昂的经典流行曲走向", "温暖的民谣指弹律动")
  exampleSongs?: string[]; // Example songs that use this progression (e.g. ["《晴天》", "《Lemon》"])
}

export interface TransposedChord {
  chordName: string;      // Spelling of the chord (e.g., "C", "Am7", "Fmaj7")
  rootName: string;       // Chord root note (e.g., "C", "A", "F")
  memberNotes: string[];  // Spelling of individual note names (e.g., ["C", "E", "G"])
  quality: ChordQuality;
  nashvilleDegree: string;
  romanDegree: string;
  description?: string;
  rootFrequency: number;  // Base audio frequency for the synth
  midiNotes: number[];    // MIDI note numbers for playback key
}

export interface KeyConfig {
  name: string;           // Key root note (e.g., "C", "Db", "D", "Eb")
  semitones: number;      // Semitone index in chromatic scale starting at C (C=0)
  preferFlat: boolean;    // Whether flat notes are preferred for spelling (e.g., Db is true, D is false)
}

export interface AudioMemoMeta {
  id: string;
  title: string;
  date: string;
  duration: string;
  keyName: string;
  styleName: string;
  progressionName: string;
  progressionId?: string;
}
