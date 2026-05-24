export type TimeSignature = '4/4' | '3/4' | '6/8';
export type StrumDirection = 'down' | 'up';
export type StrumSlot = StrumDirection | null;

export interface BeatGrid {
  subdivision: number;
  slots: StrumSlot[];
  /** Hold duration for each non-null slot, in 16th-note units.
   *  If undefined, defaults to "release on next strum" (current behavior). */
  durations?: number[];

  // V2.1.1 — Strum realism dimensions
  /** Velocity random fluctuation for each slot (±N, default 0 = no variance) */
  variance?: number[];
  /** String range for each slot: [lowString, highString] where 0=low E, 5=high E. Default [0,5] */
  stringRange?: [number, number][];
  /** Strum speed multiplier for each slot: >1 = slower/looser, <1 = faster. Default 1.0 */
  strumSpeed?: number[];
}

export interface StrumOptions {
  direction: StrumDirection;
  holdDurationMs: number;
  midiNotes: number[];
  variance: number;
  stringRange: [number, number];
  strumSpeed: number;
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
