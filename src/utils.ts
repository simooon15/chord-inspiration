/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChordTemplate, ChordQuality, TransposedChord, KeyConfig } from './types';

// Standard chromatic scales
export const SHARP_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const FLAT_SCALE = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Chord quality formulas (offsets from the chord root)
export const CHORD_FORMULAS: Record<ChordQuality, number[]> = {
  'Major': [0, 4, 7],
  'm': [0, 3, 7],
  '7': [0, 4, 7, 10],
  'maj7': [0, 4, 7, 11],
  'm7': [0, 3, 7, 10],
  'm9': [0, 3, 7, 10, 14],
  'maj9': [0, 4, 7, 11, 14],
  '9': [0, 4, 7, 10, 14],
  'dim': [0, 3, 6],
  'dim7': [0, 3, 6, 9],
  'm7b5': [0, 3, 6, 10],
  '7b9': [0, 4, 7, 10, 13],
  '13': [0, 4, 7, 10, 9]
};

// Chord suffixes for writing the formatted chord name
export const CHORD_SUFFIXES: Record<ChordQuality, string> = {
  'Major': '',
  'm': 'm',
  '7': '7',
  'maj7': 'maj7',
  'm7': 'm7',
  'm9': 'm9',
  'maj9': 'maj9',
  '9': '9',
  'dim': 'dim',
  'dim7': 'dim7',
  'm7b5': 'm7b5',
  '7b9': '7♭9',
  '13': '13'
};

/**
 * Transposes a chord template based on the chosen key config
 */
export function transposeChord(template: ChordTemplate, key: KeyConfig): TransposedChord {
  const rootIndex = (key.semitones + template.rootOffset) % 12;
  
  // Decide if we should prefer spelling as a flat or sharp chord
  // If the key is flat-preferring, use flat scale
  // Or, if this specific scale degree is flat-marked (starts with 'b'), use flat scale
  // But if the scale degree has a sharp '#', force sharp spelling
  const scaleDegreeHasFlat = template.nashvilleDegree.includes('b') || template.romanDegree.startsWith('b');
  const scaleDegreeHasSharp = template.nashvilleDegree.includes('#') || template.romanDegree.includes('#');
  
  const prefersFlat = (key.preferFlat || scaleDegreeHasFlat) && !scaleDegreeHasSharp;
  const rootName = prefersFlat ? FLAT_SCALE[rootIndex] : SHARP_SCALE[rootIndex];
  
  // Quality suffix (e.g. m, maj7, m9)
  const suffix = CHORD_SUFFIXES[template.quality];
  const chordName = `${rootName}${suffix}`;
  
  // Determine chord constituent note offsets
  const offsets = CHORD_FORMULAS[template.quality] || [0, 4, 7];
  
  // Spell constituent notes
  // If the chord root itself is flat, we spell constituent notes using the flat scale
  const isChordRootFlat = rootName.includes('b') || (key.preferFlat && !rootName.includes('#'));
  const noteSpellingScale = isChordRootFlat ? FLAT_SCALE : SHARP_SCALE;
  
  const memberNotes = offsets.map(offset => {
    const noteIndex = (rootIndex + offset) % 12;
    return noteSpellingScale[noteIndex];
  });
  
  // Voicing logic: Centered around an attractive MIDI range
  // Let's place the root in Octave 3 (MIDI 48-59) or Octave 4 if needed
  // C3 is 48.
  const baseMidiRoot = 48 + rootIndex;
  
  const midiNotes = offsets.map(offset => {
    // Standard voicing: root note is fundamental. 
    // Extensions/other notes sit nicely above the root offset
    return baseMidiRoot + offset;
  });
  
  // Root frequency for individual chord playing fundamental
  const rootFrequency = 440 * Math.pow(2, ((baseMidiRoot + (offsets[1] || 4) - 69) / 12)); // frequency centering

  return {
    chordName,
    rootName,
    memberNotes,
    quality: template.quality,
    nashvilleDegree: template.nashvilleDegree,
    romanDegree: template.romanDegree,
    description: template.description,
    rootFrequency,
    midiNotes
  };
}
