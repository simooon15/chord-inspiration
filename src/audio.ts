/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkletSynthesizer } from 'spessasynth_lib';

export type StrumDirection = 'down' | 'up';

// Simple Synth using Web Audio API
export class AudioSynth {
  private ctx: AudioContext | null = null;
  private activeNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private sequenceIntervalId: number | null = null;

  // spessasynth_lib guitar synth state
  private guitarSynth: WorkletSynthesizer | null = null;
  private guitarReady = false;
  private guitarInitPromise: Promise<void> | null = null;

  // Held note tracking for engine-driven strum/chord
  private strumHeldNotes: number[] = [];
  /** All unique MIDI notes played since last chord change — released at next change to free SF2 polyphony */
  private allStrumNotes: Set<number> = new Set();
  private strumTimers: ReturnType<typeof setTimeout>[] = [];
  private mutedHeldNotes: number[] = [];
  private chordHeldNotes: number[] = [];

  // Current engine midi notes (set by engine when chord changes)
  private engineMidiNotes: number[] = [];

  // Lazy initialize AudioContext on user interaction to comply with browser autoplay policies
  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private midiToFreq(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  // ── SF2 Initialization ──

  /** Initialize spessasynth_lib + SF2 guitar sampler. Safe to call multiple times. */
  async initGuitarSampler(): Promise<void> {
    if (this.guitarSynth) return;
    if (this.guitarInitPromise) return this.guitarInitPromise;

    this.guitarInitPromise = (async () => {
      try {
        const ctx = this.getContext();
        const basePath = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';

        console.log('[Guitar] Loading worklet processor...');
        await ctx.audioWorklet.addModule(`${basePath}worklet/spessasynth_processor.min.js`);
        console.log('[Guitar] Worklet processor loaded');

        // Load SF2 data (stripped 34MB version — contains essential guitar presets)
        console.log('[Guitar] Loading SoundFont...');
        const resp = await fetch(`${basePath}samples/Guitar_Acoustic_Stripped.sf2`);
        if (!resp.ok) throw new Error(`SF2 load failed: HTTP ${resp.status}`);
        const sf2Data = await resp.arrayBuffer();
        console.log('[Guitar] SoundFont loaded:', (sf2Data.byteLength / 1024 / 1024).toFixed(1), 'MB');

        // Create synthesizer
        console.log('[Guitar] Creating WorkletSynthesizer...');
        const ws = new WorkletSynthesizer(ctx);
        ws.connect(ctx.destination);

        // Must wait for the worklet to be ready BEFORE sending the sound bank
        await ws.isReady;
        console.log('[Guitar] Synthesizer ready, loading sound bank...');

        // Load the sound bank into the worklet
        await ws.soundBankManager.addSoundBank(sf2Data, 'guitar');
        console.log('[Guitar] Sound bank loaded');

        // Select first preset (in a dedicated guitar SF2, program 0 is the main guitar)
        ws.programChange(0, 0);
        console.log('[Guitar] Guitar sampler ready!');

        this.guitarSynth = ws;
        this.guitarReady = true;
      } catch (err) {
        console.warn('[Guitar] SF2 init failed, using fallback synth:', err);
        this.guitarReady = false;
      }
    })();

    return this.guitarInitPromise;
  }

  /** Returns true once SF2 synths is loaded and ready */
  get isGuitarReady(): boolean {
    return this.guitarReady;
  }

  // ── Engine MIDI notes ──

  /** Store the current chord's MIDI notes for engine strumming.
   *  Release all tracked notes to free SF2 polyphony at chord change,
   *  but NO per-strum noteOff so strums within a chord ring naturally. */
  setEngineMidiNotes(notes: number[]): void {
    // Release ALL unique notes played since last chord change
    this.allStrumNotes.forEach(n => this.guitarSynth?.noteOff(0, n));
    this.allStrumNotes.clear();
    this.strumHeldNotes = [];
    this.engineMidiNotes = notes;
  }

  // ── Stop All ──

  /**
   * Stop all currently playing notes
   */
  public stopAll() {
    if (this.sequenceIntervalId !== null) {
      window.clearInterval(this.sequenceIntervalId);
      this.sequenceIntervalId = null;
    }

    // Clear pending strum release timers
    this.strumTimers.forEach(t => clearTimeout(t));
    this.strumTimers = [];

    this.activeNodes.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {
        // Safe check for already stopped nodes
      }
    });
    this.activeNodes = [];

    // Release held SF2 notes
    if (this.guitarSynth) {
      this.releaseAllHeldNotes();
    }
  }

  private releaseAllHeldNotes(): void {
    const all = [...this.strumHeldNotes, ...this.mutedHeldNotes, ...this.chordHeldNotes];
    const uniq = [...new Set(all)];
    uniq.forEach(n => this.guitarSynth?.noteOff(0, n));
    this.strumHeldNotes = [];
    this.strumTimers = [];
    this.mutedHeldNotes = [];
    this.chordHeldNotes = [];
  }

  // ── Metronome (woodblock) ──

  /**
   * Woodblock metronome click: sine tone with fast decay
   * @param isStrongBeat true = higher pitch accent
   * @param volumeMultiplier overall volume scaling
   */
  public playClick(isStrongBeat: boolean, volumeMultiplier = 1.0): void {
    const audioCtx = this.getContext();
    const now = audioCtx.currentTime;

    const freq = isStrongBeat ? 1000 : 700;
    const vol = (isStrongBeat ? 0.3 : 0.18) * volumeMultiplier;

    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // ── SF2 Strum ──

  /**
   * Called by RhythmEngine: strum using SF2 if ready, else fallback
   * @param direction down or up
   * @param holdDurationMs how long the strummed notes should sustain (ms)
   */
  public playStrumFromEngine(direction: StrumDirection, holdDurationMs: number = 150): void {
    if (this.guitarReady && this.guitarSynth) {
      this.playStrumSF2(this.engineMidiNotes, direction, holdDurationMs);
    } else {
      this.playStrum(this.engineMidiNotes, direction, holdDurationMs);
    }
  }

  /**
   * Called by RhythmEngine: muted strum using SF2 if ready, else fallback to noise
   */
  public playMutedStrumFromEngine(): void {
    if (this.guitarReady && this.guitarSynth) {
      this.playMutedStrumSF2();
    } else {
      this.playMutedStrum();
    }
  }

  /**
   * SF2-based strum: plays notes and lets them ring naturally.
   * No per-strum noteOff — real guitar strings sustain across strums.
   * Old notes are only cleaned up when chord changes or playback stops.
   */
  private playStrumSF2(midiNotes: number[], direction: StrumDirection, _holdDurationMs: number): void {
    if (!this.guitarSynth || !this.guitarReady) return;

    const sorted = direction === 'down'
      ? [...midiNotes].sort((a, b) => a - b)
      : [...midiNotes].sort((a, b) => b - a).slice(0, 3);

    const perStringDelay = direction === 'down' ? 12 : 8;
    const velocity = direction === 'down' ? 80 : 56;

    // Spread noteOn over time per string to avoid AudioWorklet processing spike
    sorted.forEach((note, i) => {
      setTimeout(() => {
        if (this.guitarSynth) {
          this.guitarSynth.noteOn(0, note, velocity);
        }
      }, i * perStringDelay);
    });

    // Track held notes for cleanup on chord change / stop
    // Track all played notes for voice cleanup at chord change
    for (const n of sorted) {
      this.strumHeldNotes.push(n);
      this.allStrumNotes.add(n);
    }
  }

  /**
   * SF2-based muted strum (low velocity staccato)
   */
  private playMutedStrumSF2(): void {
    if (!this.guitarSynth) return;

    this.mutedHeldNotes.forEach(n => this.guitarSynth!.noteOff(0, n));
    this.mutedHeldNotes = [];

    const mutedNotes = [48, 52, 55, 60, 64, 67];
    mutedNotes.forEach((note, i) => {
      setTimeout(() => {
        if (this.guitarSynth) {
          this.guitarSynth.noteOn(0, note, 30);
        }
      }, i * 8);
      this.mutedHeldNotes.push(note);
    });
  }

  /**
   * SF2-based chord playback (all notes simultaneously)
   */
  public playChordSF2(midiNotes: number[]): void {
    if (this.guitarReady && this.guitarSynth) {
      this.chordHeldNotes.forEach(n => this.guitarSynth!.noteOff(0, n));
      this.chordHeldNotes = [];
      midiNotes.forEach(n => {
        this.guitarSynth!.noteOn(0, n, 75);
        this.chordHeldNotes.push(n);
      });
    } else {
      this.playChord(midiNotes, 2.0, true);
    }
  }

  // ── Guitar-style fallback synthesis ──

  /** Create a shared filter chain for guitar-like body resonance */
  private createGuitarOutputChain(ctx: AudioContext): AudioNode {
    const lowCut = ctx.createBiquadFilter();
    lowCut.type = 'highpass';
    lowCut.frequency.value = 75;
    lowCut.Q.value = 0.7;

    const body = ctx.createBiquadFilter();
    body.type = 'peaking';
    body.frequency.value = 220;
    body.Q.value = 1.2;
    body.gain.value = 7;

    const presence = ctx.createBiquadFilter();
    presence.type = 'peaking';
    presence.frequency.value = 2800;
    presence.Q.value = 1.2;
    presence.gain.value = 5;

    lowCut.connect(body);
    body.connect(presence);
    presence.connect(ctx.destination);
    return lowCut;
  }

  /** Play a single note with guitar-like timbre (dual detuned sawtooth + pick noise) */
  private scheduleGuitarNote(
    ctx: AudioContext, midiNote: number, startTime: number,
    volume: number, duration: number, outputNode: AudioNode
  ): void {
    let n = midiNote;
    while (n < 36) n += 12;
    while (n > 80) n -= 12;
    const freq = this.midiToFreq(n);

    // Two slightly detuned sawtooth oscillators for string-body chorus
    for (const detuneCent of [0, 4]) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.detune.setValueAtTime(detuneCent, startTime);
      // Pluck envelope: attack → sustain with overlap tail
      g.gain.setValueAtTime(0, startTime);
      g.gain.linearRampToValueAtTime(volume, startTime + 0.003);
      g.gain.exponentialRampToValueAtTime(volume * 0.55, startTime + 0.08);
      g.gain.setValueAtTime(volume * 0.55, startTime + Math.max(duration - 0.04, 0.08));
      g.gain.exponentialRampToValueAtTime(0.001, startTime + duration + 0.04);
      osc.connect(g);
      g.connect(outputNode);
      osc.start(startTime);
      osc.stop(startTime + duration);
    }

    // Short noise burst for pick/string attack transient
    const noiseLen = Math.floor(ctx.sampleRate * 0.005);
    const buf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) d[i] = Math.random() * 2 - 1;
    const ns = ctx.createBufferSource();
    ns.buffer = buf;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(volume * 0.3, startTime);
    ng.gain.exponentialRampToValueAtTime(0.001, startTime + 0.006);
    const nhp = ctx.createBiquadFilter();
    nhp.type = 'highpass';
    nhp.frequency.value = 2000;
    ns.connect(nhp);
    nhp.connect(ng);
    ng.connect(outputNode);
    ns.start(startTime);
  }

  // ── V2.0 methods ──

  /**
   * Plays a single chord (original triangle-wave version)
   */
  public playChord(midiNotes: number[], duration = 2.0, strum = true) {
    const audioCtx = this.getContext();
    const now = audioCtx.currentTime;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(1, now);
    filter.connect(audioCtx.destination);

    midiNotes.forEach((note, index) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'triangle';

      let adjustedNote = note;
      while (adjustedNote < 36) adjustedNote += 12;
      while (adjustedNote > 80) adjustedNote -= 12;

      osc.frequency.setValueAtTime(this.midiToFreq(adjustedNote), now);

      const maxVolume = 0.15 / Math.max(3, midiNotes.length);
      const noteDelay = strum ? index * 0.06 : 0;
      const noteStartTime = now + noteDelay;

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(maxVolume, noteStartTime + 0.1);
      gainNode.gain.setValueAtTime(maxVolume, noteStartTime + duration - 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, noteStartTime + duration);

      osc.connect(gainNode);
      gainNode.connect(filter);

      osc.start(noteStartTime);
      osc.stop(noteStartTime + duration);

      this.activeNodes.push({ osc, gain: gainNode });

      setTimeout(() => {
        this.activeNodes = this.activeNodes.filter(item => item.osc !== osc);
      }, (duration + noteDelay + 0.5) * 1000);
    });
  }

  /**
   * Guitar-style strum fallback (used when SF2 not ready)
   */
  public playStrum(midiNotes: number[], direction: StrumDirection, holdDurationMs: number = 150): void {
    const audioCtx = this.getContext();
    const now = audioCtx.currentTime;
    const chain = this.createGuitarOutputChain(audioCtx);

    const sortedNotes = direction === 'down'
      ? [...midiNotes].sort((a, b) => a - b)
      : [...midiNotes].sort((a, b) => b - a);

    const perStringDelay = direction === 'down' ? 0.012 : 0.008;
    const vol = (direction === 'down' ? 0.12 : 0.08) / Math.max(3, midiNotes.length);
    const durationSec = holdDurationMs / 1000;

    sortedNotes.forEach((note, i) => {
      this.scheduleGuitarNote(audioCtx, note, now + i * perStringDelay, vol, durationSec, chain);
    });
  }

  /**
   * Muted strum: short filtered noise burst (fallback when SF2 not ready)
   */
  public playMutedStrum(): void {
    const audioCtx = this.getContext();
    const now = audioCtx.currentTime;

    const bufferSize = Math.floor(audioCtx.sampleRate * 0.025);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(0.5, now);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    source.start(now);
  }

  /**
   * Play a full chord progression sequence (V2.0 non-rhythm mode)
   */
  public playProgression(
    progressions: number[][],
    chordDurSec = 1.8,
    onChordActive: (index: number) => void
  ) {
    this.stopAll();

    let currentIndex = 0;
    const playCurrent = () => {
      if (currentIndex >= progressions.length) {
        currentIndex = 0;
      }

      onChordActive(currentIndex);
      this.playChord(progressions[currentIndex], chordDurSec, true);
      currentIndex++;
    };

    playCurrent();

    this.sequenceIntervalId = window.setInterval(playCurrent, chordDurSec * 1000);
  }
}

export const synth = new AudioSynth();
