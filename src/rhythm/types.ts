export type TimeSignature = '4/4' | '3/4' | '6/8';
export type StrumDirection = 'down' | 'up';
export type StrumSlot = StrumDirection | null;

export interface BeatGrid {
  subdivision: number;
  slots: StrumSlot[];
  /** Hold duration for each non-null slot, in 16th-note units.
   *  If undefined, defaults to "release on next strum" (current behavior). */
  durations?: number[];
}

export interface RhythmPattern {
  id: string;
  name: string;
  timeSignature: TimeSignature;
  beats: BeatGrid[];
  barCount: number;
}

export interface TickInfo {
  beat: number;
  slot: number;
  chordIndex: number;
  isCountIn: boolean;
  measure: number;
  beatInBar: number;
}

export type ChordMode = 'pattern' | 'bar';

export interface EngineConfig {
  bpm: number;
  timeSignature: TimeSignature;
  pattern: RhythmPattern | null;
  metronomeOn: boolean;
  rhythmOn: boolean;
  chordsOn: boolean;
  chordMode: ChordMode;
}
