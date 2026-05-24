import { RhythmPattern, TickInfo, EngineConfig, ChordMode } from './types';
import { AudioSynth } from '../audio';

export class RhythmEngine {
  private bpm = 100;
  private timeSignature: string = '4/4';
  private pattern: RhythmPattern | null = null;
  private metronomeOn = false;
  private rhythmOn = false;
  private chordsOn = true;
  private chordMode: ChordMode = 'bar';
  private audio: AudioSynth;

  private tickTimerId: number | null = null;
  private rafId: number | null = null;
  private startTime = 0;
  private tickCount = 0;
  private currentBeat = 0;
  private currentSlot = 0;
  private currentChordIndex = 0;
  private isRunningInternal = false;
  private tickIntervalMs = 150;

  // Pending config for next bar boundary
  private pendingBpm: number | null = null;
  private pendingTimeSignature: string | null = null;
  private pendingPattern: RhythmPattern | null = null;

  // Current chord's MIDI notes for strum dispatch
  private currentMidiNotes: number[] = [];
  // Full list of chord MIDI notes arrays (set externally, used by engine for chord changes)
  private chordMidiNotesList: number[][] = [];

  // Callbacks
  onTick?: (info: TickInfo) => void;
  onChordChange?: (index: number) => void;
  onCountInEnd?: () => void;

  constructor(audio: AudioSynth) {
    this.audio = audio;
  }

  get isRunning(): boolean {
    return this.isRunningInternal;
  }

  configure(config: EngineConfig): void {
    this.bpm = config.bpm;
    this.timeSignature = config.timeSignature;
    this.pattern = config.pattern;
    this.metronomeOn = config.metronomeOn;
    this.rhythmOn = config.rhythmOn;
    this.chordsOn = config.chordsOn;
    this.chordMode = config.chordMode;
    this.recalcTickInterval();
  }

  /** Set the current chord's MIDI notes for strum playback */
  setCurrentMidiNotes(notes: number[]): void {
    this.currentMidiNotes = notes;
    this.audio.setEngineMidiNotes(notes);
  }

  /** Set the full chord progression MIDI notes list for engine-driven chord changes */
  setChordMidiNotesList(notesList: number[][]): void {
    this.chordMidiNotesList = notesList;
  }

  /** Update params mid-playback — queued for next bar boundary */
  updateConfig(config: Partial<EngineConfig>): void {
    if (!this.isRunningInternal) {
      if (config.bpm !== undefined) this.bpm = config.bpm;
      if (config.timeSignature !== undefined) this.timeSignature = config.timeSignature;
      if (config.pattern !== undefined) this.pattern = config.pattern;
      if (config.metronomeOn !== undefined) this.metronomeOn = config.metronomeOn;
      if (config.rhythmOn !== undefined) this.rhythmOn = config.rhythmOn;
      if (config.chordsOn !== undefined) this.chordsOn = config.chordsOn;
      if (config.chordMode !== undefined) this.chordMode = config.chordMode;
      this.recalcTickInterval();
    } else {
      if (config.metronomeOn !== undefined) this.metronomeOn = config.metronomeOn;
      if (config.rhythmOn !== undefined) this.rhythmOn = config.rhythmOn;
      if (config.chordsOn !== undefined) this.chordsOn = config.chordsOn;
      if (config.bpm !== undefined) this.pendingBpm = config.bpm;
      if (config.timeSignature !== undefined) this.pendingTimeSignature = config.timeSignature;
      if (config.pattern !== undefined) this.pendingPattern = config.pattern;
    }
  }

  start(): void {
    this.stop();
    this.startTime = performance.now();
    this.tickCount = 0;
    this.currentBeat = 0;
    this.currentSlot = 0;
    this.currentChordIndex = 0;
    this.isRunningInternal = true;
    this.pendingBpm = null;
    this.pendingTimeSignature = null;
    this.pendingPattern = null;
    this.scheduleNextTick();
  }

  stop(): void {
    this.isRunningInternal = false;
    if (this.tickTimerId !== null) {
      clearTimeout(this.tickTimerId);
      this.tickTimerId = null;
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.audio.stopAll();
  }

  // ── private ──

  private recalcTickInterval(): void {
    const subdivision = this.pattern ? this.pattern.beats[0]?.subdivision ?? 4 : 4;
    // 6/8 BPM means dotted quarter = value, so multiply by 3 for eighth-note beats
    const bpmFactor = this.timeSignature === '6/8' ? 3 : 1;
    this.tickIntervalMs = (60000 / (this.bpm * bpmFactor)) / subdivision;
  }

  private get beatsPerBar(): number {
    const parts = this.timeSignature.split('/');
    return parseInt(parts[0]) || 4;
  }

  /** Total ticks in one bar (beats × subdivision) */
  private get ticksPerBar(): number {
    if (!this.pattern) return this.beatsPerBar * 4;
    return this.pattern.beats.reduce((sum, b) => sum + b.subdivision, 0) / (this.pattern.barCount || 1);
  }

  /** Number of ticks per beat based on pattern */
  private get subdivision(): number {
    if (!this.pattern) return 4;
    return this.pattern.beats[0]?.subdivision ?? 4;
  }

  /** rAF-based tick loop — fires when elapsed time matches the next tick boundary */
  private scheduleNextTick(): void {
    if (!this.isRunningInternal) return;
    this.rafId = requestAnimationFrame(() => {
      if (!this.isRunningInternal) return;
      const nextTickTime = this.tickCount * this.tickIntervalMs;
      const elapsed = performance.now() - this.startTime;
      if (elapsed >= nextTickTime) {
        this.fireTick();
      } else {
        this.scheduleNextTick();
      }
    });
  }

  private fireTick(): void {
    if (!this.isRunningInternal) return;

    const ticksPerBarTotal = this.ticksPerBar;
    const isCountIn = this.tickCount < ticksPerBarTotal;

    if (isCountIn) {
      // Count-in phase: only metronome
      const beatsPerBarTotal = this.beatsPerBar;
      const countInBeat = this.tickCount % this.subdivision === 0 ? Math.floor(this.tickCount / this.subdivision) : -1;
      if (countInBeat >= 0 && this.metronomeOn) {
        this.audio.playClick(countInBeat === 0, 1.3);
      }

      this.tickCount++;

      // Fire onTick with count-in info
      this.onTick?.({
        beat: this.tickCount % this.subdivision === 0 ? Math.floor(this.tickCount / this.subdivision) : -1,
        slot: this.tickCount % this.subdivision,
        chordIndex: -1,
        isCountIn: true,
        measure: 0,
        beatInBar: 0,
      });

      // Count-in ended
      if (this.tickCount >= ticksPerBarTotal) {

        this.currentBeat = 0;
        this.currentSlot = 0;
        this.currentChordIndex = 0;
        this.onCountInEnd?.();
      }

      this.scheduleNextTick();
      return;
    }

    // ── Normal playback phase ──

    // Apply pending config at bar boundary
    if (this.currentBeat === 0 && this.currentSlot === 0) {
      if (this.pendingBpm !== null) {
        this.bpm = this.pendingBpm;
        this.pendingBpm = null;
        this.recalcTickInterval();
      }
      if (this.pendingTimeSignature !== null) {
        this.timeSignature = this.pendingTimeSignature;
        this.pendingTimeSignature = null;
      }
      if (this.pendingPattern !== null) {
        this.pattern = this.pendingPattern;
        this.pendingPattern = null;
        this.recalcTickInterval();
      }
    }

    const pattern = this.pattern;
    const beats = pattern?.beats ?? [];
    const totalBeats = beats.length;
    const barCount = pattern?.barCount ?? 1;
    const beatInBar = this.currentBeat % this.beatsPerBar;
    const measure = Math.floor(this.tickCount / ticksPerBarTotal);
    const beatIdx = this.currentBeat % (totalBeats || 1);

    // 1. Chord change before strum (new chord rings on downbeat)
    if (this.chordsOn && this.currentSlot === 0 && this.currentBeat === 0 && this.tickCount >= ticksPerBarTotal * 2) {
      const chordIntervalBars = this.chordMode === 'pattern' ? barCount : 1;
      const barsSincePlayback = Math.floor(this.tickCount / ticksPerBarTotal) - 1;
      if (barsSincePlayback > 0 && barsSincePlayback % chordIntervalBars === 0) {
        this.currentChordIndex++;
        // Set MIDI notes directly from engine list — no rely on callback timing
        const list = this.chordMidiNotesList;
        if (list.length > 0) {
          const idx = this.currentChordIndex % list.length;
          this.setCurrentMidiNotes(list[idx]);
        }
        this.onChordChange?.(this.currentChordIndex);
      }
    }

    // 2. Metronome tick
    if (this.metronomeOn && this.currentSlot === 0) {
      const isStrongBeat = beatInBar === 0;
      const vol = this.chordsOn ? 0.8 : 1.3;
      this.audio.playClick(isStrongBeat, vol);
    }

    // 3. Rhythm strum
    if (this.rhythmOn && totalBeats > 0) {
      const beatGrid = beats[beatIdx];
      if (beatGrid && this.currentSlot < beatGrid.slots.length) {
        const slot = beatGrid.slots[this.currentSlot];
        if (slot !== null) {
          // Note duration from pattern (in 16th-note units), default to 1 tick
          const durUnits = beatGrid.durations?.[this.currentSlot] ?? 1;
          if (this.chordsOn) {
            this.audio.playStrumFromEngine(slot, durUnits * this.tickIntervalMs);
          } else {
            this.audio.playMutedStrumFromEngine();
          }
        }
      }
    }

    // Fire onTick
    this.onTick?.({
      beat: this.currentBeat,
      slot: this.currentSlot,
      chordIndex: this.currentChordIndex,
      isCountIn: false,
      measure,
      beatInBar,
    });

    // Advance to next slot/beat
    this.currentSlot++;
    if (beatIdx < totalBeats) {
      const beatGrid = beats[beatIdx];
      if (beatGrid && this.currentSlot >= beatGrid.subdivision) {
        this.currentSlot = 0;
        this.currentBeat++;
        // Wrap around
        if (this.currentBeat >= totalBeats) {
          this.currentBeat = 0;
        }
      }
    } else {
      if (this.currentSlot >= this.subdivision) {
        this.currentSlot = 0;
        this.currentBeat++;
      }
    }

    this.tickCount++;
    this.scheduleNextTick();
  }
}
