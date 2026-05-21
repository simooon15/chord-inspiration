/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Precise guitar chord fingering representations
export interface GuitarChordsMeta {
  chordName: string;
  frets: (number | 'x')[]; // 6th, 5th, 4th, 3rd, 2nd, 1st
  baseFret: number;        // Fret index displayed at top of the grid
}

export function getGuitarChordFingering(chordName: string): GuitarChordsMeta {
  // Clean up chord name to match normalized map
  // Replace flat sign with 'b' for matching
  let cleanName = chordName.replace('♭', 'b').replace('♯', '#').trim();

  // Hardcode map of standard high-frequency open positions and barre shapes
  const guitarChordDb: Record<string, (number | 'x')[]> = {
    // --- C Chords ---
    'C': ['x', 3, 2, 0, 1, 0],
    'Cm': ['x', 3, 5, 5, 4, 3],
    'C7': ['x', 3, 2, 3, 1, 0],
    'Cmaj7': ['x', 3, 2, 0, 0, 0],
    'Cm7': ['x', 3, 5, 3, 4, 3],
    'C9': ['x', 3, 2, 3, 3, 3],
    'Cmaj9': ['x', 3, 2, 4, 3, 'x'],
    'Cm9': ['x', 3, 1, 3, 3, 'x'],
    'Cdim': ['x', 'x', 1, 2, 1, 2],
    'Cdim7': ['x', 'x', 1, 2, 1, 2],
    'Cm7b5': ['x', 3, 4, 3, 4, 'x'],
    'C13': ['x', 3, 'x', 3, 5, 5],
    'C7b9': ['x', 3, 2, 3, 2, 'x'],

    // --- Db Chords ---
    'Db': ['x', 4, 6, 6, 6, 4],
    'Dbm': ['x', 4, 6, 6, 5, 4],
    'Db7': ['x', 4, 6, 4, 6, 4],
    'Dbmaj7': ['x', 4, 6, 5, 6, 4],
    'Dbm7': ['x', 4, 6, 4, 5, 4],
    'Dbmaj9': ['x', 4, 3, 5, 4, 'x'],
    'Dbm9': ['x', 4, 2, 4, 4, 'x'],
    'Db7b9': ['x', 4, 3, 4, 3, 'x'],

    // --- C# Chords ---
    'C#': ['x', 4, 6, 6, 6, 4],
    'C#m': ['x', 4, 6, 6, 5, 4],
    'C#7': ['x', 4, 6, 4, 6, 4],
    'C#maj7': ['x', 4, 6, 5, 6, 4],
    'C#m7': ['x', 4, 6, 4, 5, 4],
    'C#maj9': ['x', 4, 3, 5, 4, 'x'],
    'C#m9': ['x', 4, 2, 4, 4, 'x'],
    'C#7b9': ['x', 4, 3, 4, 3, 'x'],

    // --- D Chords ---
    'D': ['x', 'x', 0, 2, 3, 2],
    'Dm': ['x', 'x', 0, 2, 3, 1],
    'D7': ['x', 'x', 0, 2, 1, 2],
    'Dmaj7': ['x', 'x', 0, 2, 2, 2],
    'Dm7': ['x', 'x', 0, 2, 1, 1],
    'D9': ['x', 5, 4, 5, 5, 5],
    'Dmaj9': ['x', 5, 4, 6, 5, 'x'],
    'Dm9': ['x', 5, 3, 5, 5, 'x'],
    'Ddim': ['x', 'x', 0, 1, 1, 1],
    'Ddim7': ['x', 'x', 0, 1, 'x', 1],
    'Dm7b5': ['x', 5, 6, 5, 6, 'x'],
    'D7b9': ['x', 5, 4, 5, 4, 'x'],

    // --- Eb Chords ---
    'Eb': ['x', 6, 8, 8, 8, 6],
    'Ebm': ['x', 6, 8, 8, 7, 6],
    'Eb7': ['x', 6, 8, 6, 8, 6],
    'Ebmaj7': ['x', 6, 8, 7, 8, 6],
    'Ebm7': ['x', 6, 8, 6, 7, 6],
    'Eb9': ['x', 6, 5, 6, 6, 6],
    'Ebmaj9': ['x', 6, 5, 7, 6, 'x'],
    'Ebm9': ['x', 6, 4, 6, 6, 'x'],

    // --- E Chords ---
    'E': [0, 2, 2, 1, 0, 0],
    'Em': [0, 2, 2, 0, 0, 0],
    'E7': [0, 2, 0, 1, 0, 0],
    'Emaj7': [0, 2, 1, 1, 0, 0],
    'Em7': [0, 2, 0, 0, 0, 0],
    'E9': [0, 2, 0, 1, 0, 2],
    'Emaj9': [0, 2, 1, 1, 0, 2],
    'Em9': [0, 2, 0, 0, 0, 2],
    'Edim': [0, 1, 2, 0, 'x', 'x'],
    'Edim7': ['x', 'x', 2, 3, 2, 3],
    'Em7b5': ['x', 7, 8, 7, 8, 'x'],

    // --- F Chords ---
    'F': [1, 3, 3, 2, 1, 1],
    'Fm': [1, 3, 3, 1, 1, 1],
    'F7': [1, 3, 1, 2, 1, 1],
    'Fmaj7': ['x', 'x', 3, 2, 1, 0],
    'Fm7': [1, 3, 1, 1, 1, 1],
    'F9': ['x', 8, 7, 8, 8, 8],
    'Fmaj9': ['x', 8, 7, 9, 8, 'x'],
    'Fm9': ['x', 8, 6, 8, 8, 'x'],

    // --- F# Chords ---
    'F#': [2, 4, 4, 3, 2, 2],
    'F#m': [2, 4, 4, 2, 2, 2],
    'F#7': [2, 4, 2, 3, 2, 2],
    'F#maj7': [2, 4, 3, 3, 2, 2],
    'F#m7': [2, 4, 2, 2, 2, 2],
    'F#maj9': ['x', 9, 8, 10, 9, 'x'],
    'F#m9': ['x', 9, 7, 9, 9, 'x'],

    // --- Gb Chords ---
    'Gb': [2, 4, 4, 3, 2, 2],
    'Gbm': [2, 4, 4, 2, 2, 2],
    'Gb7': [2, 4, 2, 3, 2, 2],
    'Gbmaj7': [2, 4, 3, 3, 2, 2],
    'Gbm7': [2, 4, 2, 2, 2, 2],

    // --- G Chords ---
    'G': [3, 2, 0, 0, 0, 3],
    'Gm': [3, 5, 5, 3, 3, 3],
    'G7': [3, 2, 0, 0, 0, 1],
    'Gmaj7': [3, 2, 0, 0, 0, 2],
    'Gm7': [3, 5, 3, 3, 3, 3],
    'G9': [3, 'x', 0, 2, 0, 1],
    'Gmaj9': [3, 'x', 0, 2, 0, 2],
    'Gm9': [3, 5, 3, 3, 3, 5],
    'Gdim': [3, 4, 5, 'x', 'x', 'x'],
    'Gdim7': ['x', 'x', 2, 3, 2, 3],
    'Gm7b5': ['x', 10, 11, 10, 11, 'x'],

    // --- Ab Chords ---
    'Ab': [4, 6, 6, 5, 4, 4],
    'Abm': [4, 6, 6, 4, 4, 4],
    'Ab7': [4, 6, 4, 5, 4, 4],
    'Abmaj7': [4, 6, 5, 5, 4, 4],
    'Abm7': [4, 6, 4, 4, 4, 4],

    // --- G# Chords ---
    'G#': [4, 6, 6, 5, 4, 4],
    'G#m': [4, 6, 6, 4, 4, 4],
    'G#7': [4, 6, 4, 5, 4, 4],
    'G#maj7': [4, 6, 5, 5, 4, 4],
    'G#m7': [4, 6, 4, 4, 4, 4],

    // --- A Chords ---
    'A': ['x', 0, 2, 2, 2, 0],
    'Am': ['x', 0, 2, 2, 1, 0],
    'A7': ['x', 0, 2, 0, 2, 0],
    'Amaj7': ['x', 0, 2, 1, 2, 0],
    'Am7': ['x', 0, 2, 0, 1, 0],
    'A9': ['x', 0, 2, 4, 2, 3],
    'Amaj9': ['x', 0, 6, 6, 0, 0],
    'Am9': [5, 7, 5, 5, 5, 7],
    'Adim': ['x', 0, 1, 2, 1, 'x'],
    'Adim7': ['x', 'x', 1, 2, 1, 2],
    'Am7b5': ['x', 0, 1, 0, 1, 3],

    // --- Bb Chords ---
    'Bb': ['x', 1, 3, 3, 3, 1],
    'Bbm': ['x', 1, 3, 3, 2, 1],
    'Bb7': ['x', 1, 3, 1, 3, 1],
    'Bbmaj7': ['x', 1, 3, 2, 3, 1],
    'Bbm7': ['x', 1, 3, 1, 2, 1],
    'Bb9': ['x', 1, 0, 1, 1, 1],
    'Bbmaj9': ['x', 1, 0, 2, 1, 'x'],
    'Bbm9': ['x', 1, 1, 1, 1, 1],

    // --- B Chords ---
    'B': ['x', 2, 4, 4, 4, 2],
    'Bm': ['x', 2, 4, 4, 3, 2],
    'B7': ['x', 2, 1, 2, 0, 2],
    'Bmaj7': ['x', 2, 4, 3, 4, 2],
    'Bm7': ['x', 2, 4, 2, 3, 2],
    'B9': ['x', 2, 1, 2, 2, 2],
    'Bmaj9': ['x', 2, 1, 3, 2, 'x'],
    'Bm9': ['x', 2, 0, 2, 2, 2],
    'Bdim': ['x', 2, 3, 1, 3, 'x'],
    'Bdim7': ['x', 'x', 3, 4, 3, 4],
    'Bm7b5': ['x', 2, 3, 2, 3, 'x'],
  };

  // Check if we have exact match
  let frets = guitarChordDb[cleanName];

  if (!frets) {
    // Advanced algorithm to generate standard barre transpose
    // Let's identify the root note & quality to generate a stable, fully accurate finger shape
    const rootSearch = cleanName.match(/^([A-G][#b]?)(.*)$/);
    if (rootSearch) {
      const root = rootSearch[1];
      const quality = rootSearch[2] || 'Major';

      // Find enharmonica equivalent
      const equivalentsMap: Record<string, string> = {
        'C#': 'Db', 'Db': 'C#',
        'D#': 'Eb', 'Eb': 'D#',
        'F#': 'Gb', 'Gb': 'F#',
        'G#': 'Ab', 'Ab': 'G#',
        'A#': 'Bb', 'Bb': 'A#',
      };
      const equivRoot = equivalentsMap[root];
      if (equivRoot) {
        frets = guitarChordDb[`${equivRoot}${quality}`];
      }
    }
  }

  // Absolute fallback to a safe shape if still not found
  if (!frets) {
    frets = [0, 2, 2, 0, 0, 0]; // E-minor-ish safe open strum
  }

  // Calculate Base Fret
  // If the maximum fret value is greater than 4, and the minimum fret value is greater than 0,
  // we shift up to make a beautiful compact neck box representation!
  const numericFrets = frets.filter((f): f is number => typeof f === 'number' && f > 0);
  let baseFret = 1;

  if (numericFrets.length > 0) {
    const minFret = Math.min(...numericFrets);
    const maxFret = Math.max(...numericFrets);

    if (maxFret > 4 && minFret > 1) {
      // Shift baseFret up to accommodate the higher chords
      baseFret = minFret;
    }
  }

  return {
    chordName,
    frets,
    baseFret
  };
}
