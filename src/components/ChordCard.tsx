/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TransposedChord } from '../types';
import { synth } from '../audio';
import { getGuitarChordFingering } from '../guitarChords';

interface ChordCardProps {
  key?: React.Key;
  chord: TransposedChord;
  index: number;
  isActive: boolean;
  degreeMode: 'nashville' | 'roman';
  isRhythmMode?: boolean;
  suppressFingering?: boolean;
  onCardClick: (index: number) => void;
}

export const ChordCard = React.memo(function ChordCard({ chord, index, isActive, degreeMode, isRhythmMode, suppressFingering, onCardClick }: ChordCardProps) {
  // Play single chord on tap
  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    synth.stopAll();
    synth.playChord(chord.midiNotes, 1.4, true);
    onCardClick(index);
  };

  // Determine what to display as degree (e.g. replace 'b' with '♭' for beautiful serif formatting)
  let degreeLabel = degreeMode === 'nashville' ? chord.nashvilleDegree : chord.romanDegree;
  degreeLabel = degreeLabel.replace('b', '♭');

  // Look up guitar chord fingering
  const fingering = useMemo(() => {
    return getGuitarChordFingering(chord.chordName);
  }, [chord.chordName]);

  return (
    <motion.div
      layout="position"
      id={`chord-card-${index}`}
      onClick={handleTap}
      initial={{ opacity: 0, x: -8 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: isActive && isRhythmMode ? [1, 1.008, 1] : isActive ? 1.015 : 1,
        backgroundColor: isActive ? '#e4ebe0' : '#fafdf6'
      }}
      exit={{ opacity: 0, x: 8 }}
      whileHover={{ y: -1, scale: 1.005 }}
      transition={{
        x: {
          type: "spring",
          stiffness: 110,
          damping: 15,
          mass: 0.85,
          delay: index * 0.06
        },
        opacity: {
          duration: 0.45,
          ease: "easeOut",
          delay: index * 0.06
        },
        scale: {
          type: "spring",
          stiffness: 400,
          damping: 16,
          repeat: isActive && isRhythmMode ? Infinity : 0,
          duration: 0.6,
          ease: "easeInOut"
        },
        backgroundColor: {
          duration: 0.2
        }
      }}
      className={`flex flex-col px-6 py-4 rounded-[20px] shadow-sm select-none cursor-pointer ${
        isActive 
          ? 'shadow-md ring-2 ring-[#4f6d3a]/20' 
          : 'hover:bg-[#fafdf6]/95 hover:shadow-md shadow-black/[0.01]'
      }`}
    >
      {/* Top Main Row */}
      <div className="flex items-center justify-between w-full">
        {/* Chord Name (Left) */}
        <div 
          className="w-[85px] text-[32px] font-bold text-[#1e2618] leading-none select-none"
          style={{ fontFamily: "'Iowan Old Style', 'Palatino Linotype', 'Palatino', 'Georgia', 'Noto Serif SC', 'Songti SC', serif" }}
        >
          {chord.chordName}
        </div>

        {/* Member Notes (Center) */}
        <div className="flex-1 text-center text-sm font-normal text-[#6b7862] tracking-wider leading-none select-none">
          {chord.memberNotes.join(' - ')}
        </div>

        {/* Chord Degree (Right) */}
        <div 
          className="w-12 text-right text-[17px] font-semibold text-[#6b7862] select-none"
          style={{ fontFamily: "'Iowan Old Style', 'Palatino Linotype', 'Palatino', 'Georgia', 'Noto Serif SC', 'Songti SC', serif" }}
        >
          {degreeLabel}
        </div>
      </div>

      {/* Expandable Guitar Chord Fingerboard Overlay — hidden during rhythmic playback */}
      <AnimatePresence initial={false}>
        {isActive && !suppressFingering && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{
              type: "spring",
              stiffness: 105,
              damping: 11,
              mass: 0.85
            }}
            className="overflow-hidden border-t border-[#4f6d3a]/15 pt-3.5 flex items-center gap-5"
            onClick={(e) => e.stopPropagation()} // Stop clicking on fingering info from triggering sound again
          >
            {/* SVG Fretboard Graphical Representation */}
            <div className="shrink-0 bg-white/70 p-2 rounded-[16px] border border-[#e4ebe0]/50 flex items-center justify-center select-none shadow-sm shadow-black/[0.005]">
              <svg width="98" height="106" viewBox="0 0 100 110" className="text-[#6b7862]">
                {/* Draw string vertical lines (6 strings) */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <line
                    key={`str-${i}`}
                    x1={24 + i * 12}
                    y1={24}
                    x2={24 + i * 12}
                    y2={88}
                    stroke="#6b7862"
                    strokeWidth={i === 0 ? 1.6 : 0.9} // Thicker low E bass string
                    strokeOpacity={0.35}
                  />
                ))}

                {/* Draw fret horizontal lines (5 fret paths) */}
                {Array.from({ length: 5 }).map((_, j) => (
                  <line
                    key={`fret-${j}`}
                    x1={24}
                    y1={24 + j * 16}
                    x2={84}
                    y2={24 + j * 16}
                    stroke="#6b7862"
                    strokeWidth={j === 0 && fingering.baseFret === 1 ? 3 : 0.9} // Thick nut row if baseFret is 1
                    strokeOpacity={j === 0 && fingering.baseFret === 1 ? 0.8 : 0.35}
                  />
                ))}

                {/* Indicators above nut (Open string O or Muted X) */}
                {fingering.frets.map((val, i) => {
                  const cx = 24 + i * 12;
                  if (val === 'x') {
                    return (
                      <g key={`mute-${i}`} stroke="#dc2626" strokeWidth="1.35" strokeLinecap="round" opacity="0.65">
                        <line x1={cx - 2.5} y1={10.5} x2={cx + 2.5} y2={15.5} />
                        <line x1={cx + 2.5} y1={10.5} x2={cx - 2.5} y2={15.5} />
                      </g>
                    );
                  } else if (val === 0) {
                    return (
                      <circle
                        key={`open-${i}`}
                        cx={cx}
                        cy={13}
                        r="2.5"
                        fill="none"
                        stroke="#6b7862"
                        strokeWidth="1"
                        strokeOpacity={0.7}
                      />
                    );
                  }
                  return null;
                })}

                {/* Pressing dots */}
                {fingering.frets.map((val, i) => {
                  if (typeof val === 'number' && val > 0) {
                    const relativeFret = val - fingering.baseFret;
                    const cx = 24 + i * 12;
                    const cy = 24 + (relativeFret + 0.5) * 16;
                    return (
                      <circle
                        key={`dot-${i}`}
                        cx={cx}
                        cy={cy}
                        r="4.2"
                        fill="#4f6d3a"
                        stroke="#fafdf6"
                        strokeWidth="0.8"
                      />
                    );
                  }
                  return null;
                })}

                {/* Left high-register base fret number label */}
                {fingering.baseFret > 1 && (
                  <text
                    x="5"
                    y="36"
                    fontSize="9.5"
                    fontWeight="bold"
                    fill="#4f6d3a"
                    className="font-mono text-left"
                  >
                    {fingering.baseFret}f
                  </text>
                )}
              </svg>
            </div>

            {/* Fretboard textual finger guiding description panel */}
            <div className="flex-1 flex flex-col items-start text-left gap-1 mt-0.5">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#4f6d3a]">
                吉他指法 GUITAR TAB
              </span>
              <div className="flex items-center gap-1">
                <span className="font-sans font-bold text-[#1e2618] text-[12px]">
                  {chord.chordName}
                </span>
                <span className="text-[9px] text-[#6b7862]/80 bg-black/[0.04] px-1.5 py-0.2 rounded-md font-mono">
                  {fingering.frets.map(f => f === 'x' ? 'X' : f).join('-')}
                </span>
              </div>
              <div className="text-[10px] text-[#6b7862]/80 font-mono mt-0.5">
                成分音: {chord.memberNotes.join(' ')}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

