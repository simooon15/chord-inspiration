/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple Synth using Web Audio API
class AudioSynth {
  private ctx: AudioContext | null = null;
  private activeNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private sequenceIntervalId: number | null = null;

  // Lazy initialize AudioContext on user interaction to comply with browser autoplay policies
  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume context if suspended
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Convert MIDI note number to Frequency
  private midiToFreq(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  /**
   * Stop all currently playing notes
   */
  public stopAll() {
    // Clear any active sequence loops
    if (this.sequenceIntervalId !== null) {
      window.clearInterval(this.sequenceIntervalId);
      this.sequenceIntervalId = null;
    }

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
  }

  /**
   * Plays a single chord with a strum/arpeggiated effect
   * @param midiNotes The MIDI notes belonging to the chord
   * @param duration Duration to play in seconds
   * @param strum Whether to strum the chords or play them as a block
   */
  public playChord(midiNotes: number[], duration = 2.0, strum = true) {
    const audioCtx = this.getContext();
    const now = audioCtx.currentTime;

    // Master Low-pass filter to make it sound warm (Fender Rhodes / Synth Pad vibe)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(1, now);
    filter.connect(audioCtx.destination);

    // Play each note in the chord
    midiNotes.forEach((note, index) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      // Use a warm triangle wave
      osc.type = 'triangle';
      
      // Calculate frequency with safe octave limits
      let adjustedNote = note;
      // In R&B or Jazz, some MIDI notes go high. Let's make sure they stay in an elegant singing range (36 to 84)
      while (adjustedNote < 36) adjustedNote += 12;
      while (adjustedNote > 80) adjustedNote -= 12;

      osc.frequency.setValueAtTime(this.midiToFreq(adjustedNote), now);

      // Soft ADSR envelope for that dreamy ambient synth pad
      // Divide gain among voices to prevent clipping/distortion
      const maxVolume = 0.15 / Math.max(3, midiNotes.length);
      
      // Calculate individual note start time (strum/arpeggio delay)
      const noteDelay = strum ? index * 0.06 : 0;
      const noteStartTime = now + noteDelay;

      gainNode.gain.setValueAtTime(0, now);
      // Attack
      gainNode.gain.linearRampToValueAtTime(maxVolume, noteStartTime + 0.1);
      // Sustain / Decay
      gainNode.gain.setValueAtTime(maxVolume, noteStartTime + duration - 0.5);
      // Release
      gainNode.gain.exponentialRampToValueAtTime(0.0001, noteStartTime + duration);

      osc.connect(gainNode);
      gainNode.connect(filter);

      osc.start(noteStartTime);
      osc.stop(noteStartTime + duration);

      this.activeNodes.push({ osc, gain: gainNode });

      // Clean up reference after note finish
      setTimeout(() => {
        this.activeNodes = this.activeNodes.filter(item => item.osc !== osc);
      }, (duration + noteDelay + 0.5) * 1000);
    });
  }

  /**
   * Play a full chord progression sequence
   * @param progressions List of chords (MIDI notes arrays)
   * @param chordDurSec Duration for each chord in seconds
   * @param onChordActive Callback triggered whenever a chord starts playing, supplying its active index (-1 when stopped)
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
        // Enforce loop behavior
        currentIndex = 0;
      }

      onChordActive(currentIndex);
      this.playChord(progressions[currentIndex], chordDurSec, true);
      currentIndex++;
    };

    // Play first immediately
    playCurrent();

    // Repeat at specified interval
    this.sequenceIntervalId = window.setInterval(playCurrent, chordDurSec * 1000);
  }
}

export const synth = new AudioSynth();
