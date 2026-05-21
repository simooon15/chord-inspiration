/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  Play, 
  Square, 
  BookOpen, 
  Heart,
  RotateCcw,
  Mic,
  MicOff,
  FileText,
  Download,
  Trash2,
  Volume2,
  Check,
  FolderHeart,
  X
} from 'lucide-react';

import { SCALE_KEYS, STYLE_META, CHORD_PROGRESSIONS } from './chordsData';
import { transposeChord } from './utils';
import { synth } from './audio';
import { ChordCard } from './components/ChordCard';
import { MusicStyle, ProgressionTemplate, TransposedChord, AudioMemoMeta } from './types';
import { saveAudioMemo, getAudioMemo, deleteAudioMemo } from './utils/db';

export default function App() {
  // --- States ---
  const [selectedKeyName, setSelectedKeyName] = useState<string>('C');
  const [selectedStyle, setSelectedStyle] = useState<MusicStyle>('pop');
  
  // The current progression being viewed. Default pre-renders on launch to prevent empty landing states
  const [currentProgression, setCurrentProgression] = useState<ProgressionTemplate | null>(() => {
    return CHORD_PROGRESSIONS.find(c => c.id === 'pop_classic_heart') || CHORD_PROGRESSIONS[0];
  });
  
  // Audio playback statuses
  const [activeChordIndex, setActiveChordIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Notation state: Nashville numbers (1,5,6,4) or Roman Numerals (I, V, vi, IV)
  const [degreeMode, setDegreeMode] = useState<'nashville' | 'roman'>('nashville');
  
  // Playback chord duration (seconds per chord)
  const [chordDuration, setChordDuration] = useState<number>(1.8);
  
  // Tips Modal state
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Interactive control action panel states on main progression module (issue 6)
  const [showMainActionPanel, setShowMainActionPanel] = useState<boolean>(false);
  const [mainActionTab, setMainActionTab] = useState<'notes' | 'rec' | null>('notes');

  // --- Songwriter's Workspace States ---
  const [showWorkshop, setShowWorkshop] = useState<boolean>(false);
  const [isNotesSaved, setIsNotesSaved] = useState<boolean>(true);
  
  // Track expanded progression card index inside favorites list
  const [expandedProgressionId, setExpandedProgressionId] = useState<string | null>(null);
  const [expandedSubSection, setExpandedSubSection] = useState<'notes' | 'rec' | null>(null);

  // Favorites list store
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('and_xian_favorite_progressions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const updated = prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id];
      localStorage.setItem('and_xian_favorite_progressions', JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  // Laptop/Mobile note dictionary (Progression ID => Lyric snippet / Chord Notes)
  const [allNotes, setAllNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('and_xian_progression_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Recording engine states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [recordingList, setRecordingList] = useState<AudioMemoMeta[]>(() => {
    try {
      const saved = localStorage.getItem('and_xian_audio_memos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [playingMemoId, setPlayingMemoId] = useState<string | null>(null);

  // References for Media Recorder, active Memo player, and the targeted progression for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const activeAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const recordingProgressionRef = useRef<ProgressionTemplate | null>(null);

  // --- Handlers & Computations ---
  
  // Open specific sub-section in the collection workshop
  const openProgressionSubSection = useCallback((progId: string, section: 'notes' | 'rec') => {
    setFavorites(prev => {
      if (!prev.includes(progId)) {
        const updated = [...prev, progId];
        localStorage.setItem('and_xian_favorite_progressions', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
    setExpandedProgressionId(progId);
    setExpandedSubSection(section);
    setShowWorkshop(true);
  }, []);
  
  // Fetch key configuration
  const currentKeyConfig = useMemo(() => {
    return SCALE_KEYS.find(k => k.name === selectedKeyName) || SCALE_KEYS[0];
  }, [selectedKeyName]);

  // Transpose the progression to the selected key
  const transposedChords = useMemo((): TransposedChord[] => {
    if (!currentProgression) return [];
    return currentProgression.chords.map(chord => 
      transposeChord(chord, currentKeyConfig)
    );
  }, [currentProgression, currentKeyConfig]);

  // Playback control useEffect
  useEffect(() => {
    if (isPlaying && transposedChords.length > 0) {
      const midiNotesList = transposedChords.map(chord => chord.midiNotes);
      synth.playProgression(midiNotesList, chordDuration, (index) => {
        setActiveChordIndex(index);
      });
    } else {
      synth.stopAll();
      setActiveChordIndex(-1);
    }

    return () => {
      synth.stopAll();
    };
  }, [isPlaying, transposedChords, chordDuration]);

  // Trigger stop on style/theme shifts or manual stop
  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setActiveChordIndex(-1);
    synth.stopAll();
  }, []);

  // Formulate a beautiful progression code name dynamically from its scale degrees
  const getProgressionDisplayName = useCallback((prog: ProgressionTemplate) => {
    const degrees = prog.chords.map(c => c.nashvilleDegree.replace('-', ''));
    return `${degrees.join('-')} 进行`;
  }, []);

  // Main Generator Trigger
  const generateInspiration = useCallback(() => {
    handleStop();
    
    // Filter progressions matching current genre
    const pool = CHORD_PROGRESSIONS.filter(item => item.style === selectedStyle);
    if (pool.length === 0) return;

    // Pick one randomly, avoiding immediate repetition
    let nextChoice = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && currentProgression && nextChoice.id === currentProgression.id) {
      const filteredPool = pool.filter(item => item.id !== currentProgression.id);
      nextChoice = filteredPool[Math.floor(Math.random() * filteredPool.length)];
    }

    setCurrentProgression(nextChoice);
  }, [selectedStyle, currentProgression, handleStop]);

  // --- Songwriting Notes Logic ---
  const handleNoteChangeForId = useCallback((progId: string, text: string) => {
    setIsNotesSaved(false);
    
    const updated = {
      ...allNotes,
      [progId]: text
    };
    setAllNotes(updated);
    localStorage.setItem('and_xian_progression_notes', JSON.stringify(updated));
    
    // Aesthetic auto-saved completion feel standard indicator
    setTimeout(() => {
      setIsNotesSaved(true);
    }, 450);
  }, [allNotes]);

  const currentNoteText = useMemo(() => {
    if (!currentProgression) return '';
    return allNotes[currentProgression.id] || '';
  }, [allNotes, currentProgression]);

  const handleNoteChange = useCallback((text: string) => {
    if (!currentProgression) return;
    handleNoteChangeForId(currentProgression.id, text);
  }, [currentProgression, handleNoteChangeForId]);

  // --- Voice Memo Multi-Recording Logic ---
  useEffect(() => {
    let timer: any = null;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  const startRecording = async (prog?: ProgressionTemplate) => {
    try {
      handleStop(); // Stop any active preview synthesizers to prevent feedback ring and pollution
      if (activeAudioElementRef.current) {
        activeAudioElementRef.current.pause();
        setPlayingMemoId(null);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      
      recordingProgressionRef.current = prog || currentProgression;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        const recordingId = 'rec_' + Date.now();
        
        // Save Blob physically to IndexedDB (prevent length limit failure)
        await saveAudioMemo(recordingId, audioBlob);

        // Compute display values
        const formattedDate = new Date().toLocaleDateString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });

        // Use custom timer format
        const finalTime = recordingTime === 0 ? 1 : recordingTime; // fallback if stopped instant
        const minutes = Math.floor(finalTime / 60).toString().padStart(2, '0');
        const seconds = (finalTime % 60).toString().padStart(2, '0');
        const finalDuration = `${minutes}:${seconds}`;

        const currentStyleName = STYLE_META.find(s => s.id === selectedStyle)?.name || selectedStyle;
        const targetProg = recordingProgressionRef.current || currentProgression;

        const newMeta: AudioMemoMeta = {
          id: recordingId,
          title: `灵感小样 #${recordingList.length + 1}`,
          date: formattedDate,
          duration: finalDuration,
          keyName: selectedKeyName,
          styleName: currentStyleName,
          progressionName: targetProg ? getProgressionDisplayName(targetProg) : '和弦进行',
          progressionId: targetProg?.id
        };

        const updatedList = [newMeta, ...recordingList];
        setRecordingList(updatedList);
        localStorage.setItem('and_xian_audio_memos', JSON.stringify(updatedList));

        // Release the microphone stream physically
        stream.getTracks().forEach(track => track.stop());
      };

      audioChunksRef.current = [];
      setRecordingTime(0);
      setIsRecording(true);
      recorder.start();
    } catch (err) {
      console.error('麦克风录取权限失败或硬件不可用:', err);
      alert('抱歉，未能启用麦克风录音，请确保浏览器录音权限已被授信允许。');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePlayMemo = async (id: string) => {
    // If clicking already playing, pause it
    if (activeAudioElementRef.current && playingMemoId === id) {
      activeAudioElementRef.current.pause();
      setPlayingMemoId(null);
      return;
    }

    // Stop current playing or synthesizer preview
    if (activeAudioElementRef.current) {
      activeAudioElementRef.current.pause();
    }
    handleStop(); // Stop piano synth playback

    const blob = await getAudioMemo(id);
    if (!blob) {
      alert('音频文件提取失败，可能已被移动或删除');
      return;
    }

    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    activeAudioElementRef.current = audio;
    setPlayingMemoId(id);

    audio.onended = () => {
      setPlayingMemoId(null);
      URL.revokeObjectURL(audioUrl);
    };

    audio.onerror = () => {
      setPlayingMemoId(null);
      URL.revokeObjectURL(audioUrl);
    };

    audio.play().catch(e => {
      console.error('Audio play error:', e);
      setPlayingMemoId(null);
    });
  };

  const handleDownloadMemo = async (memo: AudioMemoMeta) => {
    const blob = await getAudioMemo(memo.id);
    if (!blob) {
      alert('下载失败：未找到对应的音频存储。');
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${memo.title}_${memo.keyName}调_${memo.styleName}_和弦创作.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteMemo = async (id: string) => {
    if (!confirm('确认删除这段灵感小样吗？此操作无法撤销。')) return;
    
    if (activeAudioElementRef.current && playingMemoId === id) {
      activeAudioElementRef.current.pause();
      setPlayingMemoId(null);
    }

    await deleteAudioMemo(id);
    const updated = recordingList.filter(memo => memo.id !== id);
    setRecordingList(updated);
    localStorage.setItem('and_xian_audio_memos', JSON.stringify(updated));
  };

  // Clean-up refs on destroy
  useEffect(() => {
    return () => {
      if (activeAudioElementRef.current) {
        activeAudioElementRef.current.pause();
      }
      synth.stopAll();
    };
  }, [handleStop]);

  return (
    <div className="min-h-screen bg-[#e8ece4] text-[#1e2618] font-sans antialiased flex justify-center items-start pt-[calc(52px+env(safe-area-inset-top,0px))] pb-[calc(40px+env(safe-area-inset-bottom,0px))] px-4">
      
      {/* App Main Shell Container (Matching PRD Minimalist and Elegant styling) */}
      <div className="w-full max-w-[440px] flex flex-col">
        
        {/* Header Section */}
        <header className="flex items-center gap-2 mb-6 select-none animate-fade-in">
          <div className="flex items-center justify-center text-[#4f6d3a]" aria-hidden="true">
            <svg width="18" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" style={{ transform: 'scaleY(1.45)' }}>
              <path d="M3 12c6.268 0 9-2.637 9-9c0 6.363 2.713 9 9 9c-6.287 0-9 2.713-9 9c0-6.287-2.732-9-9-9Z" />
            </svg>
          </div>
          <h1 
            className="text-[22px] font-semibold tracking-wide text-[#1e2618]"
            style={{ fontFamily: "'Noto Serif SC', 'Songti SC', 'Iowan Old Style', 'Palatino', 'Georgia', serif" }}
          >
            和弦灵感
          </h1>
          
          <div className="ml-auto flex items-center gap-1.5">
            <motion.button 
              whileHover={{ scale: 1.1, y: -0.5 }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              onClick={() => {
                setShowWorkshop(true);
              }}
              className="text-[#6b7862]/65 hover:text-[#4f6d3a] p-2 rounded-full hover:bg-white/30 cursor-pointer relative focus:outline-none focus:ring-1 focus:ring-[#4f6d3a]/15 animate-none"
              title="收藏夹"
            >
              <FolderHeart size={17.5} />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.1, y: -0.5 }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              onClick={() => setShowGuide(true)}
              className="text-[#6b7862]/60 hover:text-[#4f6d3a] p-2 rounded-full hover:bg-white/30 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#4f6d3a]/20"
              title="查看乐理说明"
            >
              <HelpCircle size={17} />
            </motion.button>
          </div>
        </header>

        {/* Controls Panel: Key and Style Selectors */}
        <section className="flex gap-2.5 mb-4 animate-fade-in text-left">
          {/* Key selector */}
          <motion.div 
            whileHover={{ scale: 1.015, y: -0.5 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative flex-1 bg-white/54 backdrop-blur-xl border border-[#e4ebe0]/30 rounded-full shadow-sm hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-[#4f6d3a]/30 focus-within:border-transparent"
          >
            <select
              id="keySelect"
              value={selectedKeyName}
              onChange={(e) => {
                setSelectedKeyName(e.target.value);
              }}
              className="w-full appearance-none bg-transparent border-none py-2.5 pl-4.5 pr-10 text-[14.5px] font-medium text-[#1e2618] cursor-pointer outline-none rounded-full focus:ring-0 focus:outline-none focus:border-none focus-visible:outline-none focus-visible:ring-0 transition-all select-none"
              style={{
                fontFamily: "'Noto Serif SC', 'Songti SC', 'Iowan Old Style', serif",
                color: 'var(--accent)',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%238a8a86' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
              }}
            >
              {SCALE_KEYS.map((k) => (
                <option key={k.name} value={k.name}>
                  {k.name} 调
                </option>
              ))}
            </select>
          </motion.div>

          {/* Style Selector */}
          <motion.div 
            whileHover={{ scale: 1.015, y: -0.5 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative flex-1 bg-white/54 backdrop-blur-xl border border-[#e4ebe0]/30 rounded-full shadow-sm hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-[#4f6d3a]/30 focus-within:border-transparent"
          >
            <select
              id="styleSelect"
              value={selectedStyle}
              onChange={(e) => {
                setSelectedStyle(e.target.value as MusicStyle);
                handleStop();
              }}
              className="w-full appearance-none bg-transparent border-none py-2.5 pl-4.5 pr-10 text-[14.5px] font-medium text-[#1e2618] cursor-pointer outline-none rounded-full focus:ring-0 focus:outline-none focus:border-none focus-visible:outline-none focus-visible:ring-0 transition-all select-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%238a8a86' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
              }}
            >
              {STYLE_META.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </motion.div>
        </section>

        {/* Primary Inspiration Button */}
        <motion.button
          id="generateBtn"
          whileHover={{ scale: 1.015, y: -0.5, backgroundColor: "rgba(79, 109, 58, 0.16)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 350, damping: 15 }}
          onClick={generateInspiration}
          className="w-full py-3.5 bg-[#4f6d3a]/12 text-[#4f6d3a] font-semibold text-[15px] rounded-full cursor-pointer shadow-sm shadow-[#4f6d3a]/5 hover:shadow-md outline-none focus:outline-none select-none"
        >
          给我灵感
        </motion.button>

        {/* Sleek Compact Progression Info Header Card */}
        {currentProgression && (
          <motion.div 
            layout="position"
            animate={{
              scale: showMainActionPanel ? 1.015 : 1,
              backgroundColor: showMainActionPanel ? '#e4ebe0' : 'rgba(255, 255, 255, 0.54)',
            }}
            whileHover={{ 
              y: -1,
              scale: showMainActionPanel ? 1.015 : 1.005
            }}
            whileTap={{ scale: 0.995 }}
            transition={{
              scale: {
                type: "spring",
                stiffness: 400,
                damping: 16
              },
              backgroundColor: {
                duration: 0.2
              }
            }}
            className={`mt-6 w-full flex flex-col rounded-[20px] border border-[#e4ebe0]/30 overflow-hidden text-left transition-shadow duration-250 ${
              showMainActionPanel 
                ? 'shadow-md ring-2 ring-[#4f6d3a]/20' 
                : 'shadow-sm hover:shadow-md'
            }`}
          >
            {/* Clickable Header Card itself ("按压模块") */}
            <div 
              onClick={() => setShowMainActionPanel(prev => !prev)}
              className="flex items-center justify-between px-5 py-3.5 select-none cursor-pointer"
            >
              <div className="flex flex-col text-left pr-3">
                <span className="text-[13.5px] font-bold text-[#1e2618]">
                  {getProgressionDisplayName(currentProgression)}
                </span>
                <span className="text-[10.5px] text-[#6b7862]/60 mt-0.5 font-sans">
                  {STYLE_META.find(s => s.id === currentProgression.style)?.name || currentProgression.style} • 点击展开/收起创作面
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                {/* Document Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 450, damping: 14 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showMainActionPanel && mainActionTab === 'notes') {
                      setShowMainActionPanel(false);
                    } else {
                      setShowMainActionPanel(true);
                      setMainActionTab('notes');
                    }
                  }}
                  className={`p-2 rounded-full transition-all cursor-pointer shrink-0 ${
                    showMainActionPanel && mainActionTab === 'notes'
                      ? "bg-[#4f6d3a] text-white shadow-sm hover:bg-[#3d552d]"
                      : "text-[#6b7862]/65 hover:text-[#4f6d3a] hover:bg-[#4f6d3a]/6"
                  }`}
                  title="快速手记"
                >
                  <FileText size={16} />
                </motion.button>

                {/* Mic Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 450, damping: 14 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showMainActionPanel && mainActionTab === 'rec') {
                      setShowMainActionPanel(false);
                    } else {
                      setShowMainActionPanel(true);
                      setMainActionTab('rec');
                    }
                  }}
                  className={`p-2 rounded-full transition-all cursor-pointer shrink-0 ${
                    isRecording && recordingProgressionRef.current?.id === currentProgression.id
                      ? "bg-rose-500 text-white animate-pulse shadow-sm hover:bg-rose-600"
                      : showMainActionPanel && mainActionTab === 'rec'
                      ? "bg-[#4f6d3a] text-white shadow-sm hover:bg-[#3d552d]"
                      : "text-[#6b7862]/65 hover:text-[#4f6d3a] hover:bg-[#4f6d3a]/6"
                  }`}
                  title="快速哼唱"
                >
                  <Mic size={16} />
                </motion.button>

                {/* Heart button to favorite */}
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(244,63,94,0.05)" }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 450, damping: 14 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(currentProgression.id);
                  }}
                  className="p-1.5 rounded-full transition-all cursor-pointer shrink-0"
                  title={favorites.includes(currentProgression.id) ? "取消收藏" : "加入收藏"}
                >
                  <Heart 
                    size={16.5} 
                    className={`transition-all duration-300 ${
                      favorites.includes(currentProgression.id) 
                        ? "text-rose-500 fill-rose-500 scale-110" 
                        : "text-[#6b7862]/65 hover:text-rose-400"
                    }`}
                  />
                </motion.button>
              </div>
            </div>

            {/* Expandable Action Panel: "新界面" (Spring animation, bounciness) */}
            <AnimatePresence initial={false}>
              {showMainActionPanel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="overflow-hidden border-t border-[#4f6d3a]/12 bg-black/[0.015]"
                >
                  <div className="p-4 flex flex-col gap-3.5">
                    {/* Dual-Button row: Left & Right tabs */}
                    <div className="relative grid grid-cols-2 gap-1.5 p-1 bg-stone-200/50 rounded-full border border-[#e4ebe0]/40 select-none">
                      {/* Left Button: 随手笔记 */}
                      <button
                        onClick={() => setMainActionTab('notes')}
                        className="relative py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer z-10 transition-colors select-none focus:outline-none"
                        style={{
                          color: mainActionTab === 'notes' ? '#ffffff' : '#6b7862'
                        }}
                      >
                        {mainActionTab === 'notes' && (
                          <motion.div
                            layoutId="main_action_pillow"
                            className="absolute inset-0 bg-[#4f6d3a] rounded-full z-0 shadow-sm shadow-[#4f6d3a]/25"
                            transition={{ type: "spring", stiffness: 380, damping: 22 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center justify-center gap-1.5">
                          <FileText size={13} />
                          随手笔记
                        </span>
                      </button>

                      {/* Right Button: 哼唱小样 */}
                      <button
                        onClick={() => setMainActionTab('rec')}
                        className="relative py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer z-10 transition-colors select-none focus:outline-none"
                        style={{
                          color: mainActionTab === 'rec' ? '#ffffff' : '#6b7862'
                        }}
                      >
                        {mainActionTab === 'rec' && (
                          <motion.div
                            layoutId="main_action_pillow"
                            className="absolute inset-0 bg-[#4f6d3a] rounded-full z-0 shadow-sm shadow-[#4f6d3a]/25"
                            transition={{ type: "spring", stiffness: 380, damping: 22 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center justify-center gap-1.5">
                          <Mic size={13} />
                          哼唱小样
                          {recordingList.filter(memo => memo.progressionId === currentProgression.id).length > 0 && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold scale-90 select-none transition-colors shrink-0 ${
                              mainActionTab === 'rec' 
                                ? 'bg-white/20 text-white' 
                                : 'bg-black/10 text-[#6b7862]'
                            }`}>
                              {recordingList.filter(memo => memo.progressionId === currentProgression.id).length}
                            </span>
                          )}
                        </span>
                      </button>
                    </div>

                    {/* Specific tab panel content with spring animation */}
                    <AnimatePresence mode="wait">
                      {mainActionTab === 'notes' ? (
                        <motion.div
                          key="tab-notes"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                          className="flex flex-col gap-2 pt-1 text-left"
                        >
                          <div className="flex items-center justify-between text-[11px] select-none text-[#6b7862]/80 font-medium">
                            <span className="font-bold flex items-center gap-1">
                              <FileText size={11.5} className="text-[#4f6d3a]" />
                              和弦句段歌词拼贴
                            </span>
                            {isNotesSaved ? (
                              <span className="text-[10px] text-[#4f6d3a] font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4f6d3a] animate-pulse" />
                                已自动存盘
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400">输入中...</span>
                            )}
                          </div>
                          <textarea
                            value={allNotes[currentProgression.id] || ''}
                            onChange={(e) => handleNoteChange(e.target.value)}
                            placeholder="在这里写下这套和弦激发你的旋律歌词联想、心流随笔，或段落色彩细节安排..."
                            className="w-full h-28 p-3 rounded-xl bg-white/80 border border-[#e4ebe0]/80 resize-none focus:outline-none focus:ring-1 focus:ring-[#4f6d3a]/30 focus:bg-white text-xs text-[#1e2618] leading-relaxed placeholder:text-[#6b7862]/45 font-sans"
                          />
                        </motion.div>
                      ) : mainActionTab === 'rec' ? (
                        <motion.div
                          key="tab-rec"
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                          className="flex flex-col gap-2 pt-1 text-left"
                        >
                          <div className="flex items-center justify-between text-[11px] select-none text-[#6b7862]/80 font-medium">
                            <span className="font-bold flex items-center gap-1">
                              <Mic size={11.5} className="text-[#4f6d3a]" />
                              人声哼唱 / 乐器弹奏拾音
                            </span>
                            {isRecording && recordingProgressionRef.current?.id === currentProgression.id ? (
                              <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                                录音中 ({Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')})
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400">点击麦克风开启</span>
                            )}
                          </div>

                          {/* Microphone Panel block */}
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#e4ebe0]/60">
                            <span className="text-[10.5px] text-[#6b7862] font-sans">
                              {isRecording && recordingProgressionRef.current?.id === currentProgression.id
                                ? '🎙️ 正在捕获原生声线中...'
                                : '准备就绪，轻轻唱出脑海里的旋律句...'
                              }
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: "spring", stiffness: 400, damping: 15 }}
                              onClick={() => {
                                if (isRecording) {
                                  stopRecording();
                                } else {
                                  startRecording(currentProgression);
                                }
                              }}
                              className={`w-8 h-8 rounded-full text-white flex items-center justify-center shadow active:scale-95 cursor-pointer shrink-0 transition-all ${
                                isRecording && recordingProgressionRef.current?.id === currentProgression.id
                                  ? 'bg-rose-500 animate-pulse hover:bg-rose-600'
                                  : 'bg-[#4f6d3a] hover:bg-[#4f6d3a]/90'
                              }`}
                            >
                              {isRecording && recordingProgressionRef.current?.id === currentProgression.id ? (
                                <MicOff size={11} />
                              ) : (
                                <Mic size={11} />
                              )}
                            </motion.button>
                          </div>

                          {/* Dynamic Recording Waveform */}
                          {isRecording && recordingProgressionRef.current?.id === currentProgression.id && (
                            <div className="flex items-center justify-center gap-1.5 py-1.5 select-none">
                              {[1, 3, 2, 4, 3, 5, 2, 4, 1, 3, 2, 1].map((val, i) => (
                                <motion.span
                                  key={i}
                                  animate={{ height: [5, val * 3.5, 5] }}
                                  transition={{ repeat: Infinity, duration: 0.65, delay: i * 0.05 }}
                                  className="w-[3px] rounded-full bg-[#4f6d3a]"
                                />
                              ))}
                            </div>
                          )}

                          {/* Recorded List under current progression */}
                          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-0.5 mt-2">
                            {recordingList.filter(memo => memo.progressionId === currentProgression.id).length === 0 ? (
                              <div className="text-center py-4 text-[10px] text-[#6b7862]/50 italic border border-dashed border-[#e4ebe0]/50 rounded-xl bg-white/50 select-none">
                                此和弦下暂无哼唱小样，录制后将存放在这。
                              </div>
                            ) : (
                              recordingList.filter(memo => memo.progressionId === currentProgression.id).map(memo => (
                                <motion.div 
                                  key={memo.id}
                                  initial={{ scale: 0.96, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.96, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                                  whileHover={{ scale: 1.008 }}
                                  className={`p-2.5 rounded-xl bg-white border border-[#e4ebe0]/30 hover:border-[#4f6d3a]/20 flex items-center justify-between gap-1.5 text-[10px] select-none transition-all ${
                                    playingMemoId === memo.id ? 'ring-1 ring-[#4f6d3a]/30 bg-[#e4ebe0]/5' : ''
                                  }`}
                                >
                                  <div className="flex-1 min-w-0 pr-1 text-left">
                                    <div className="flex items-center gap-1">
                                      <span className="font-bold text-[#1e2618] truncate max-w-[124px] inline-block">{memo.title}</span>
                                      <span className="text-[8px] text-[#4f6d3a] px-1 bg-[#4f6d3a]/10 rounded font-semibold select-none transform scale-90">
                                        {memo.keyName}调
                                      </span>
                                    </div>
                                    <div className="text-[8px] text-[#6b7862]/60 mt-0.5 font-sans">
                                      {memo.date} • 时长 {memo.duration}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 select-none shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <motion.button
                                      whileHover={{ scale: 1.08 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handlePlayMemo(memo.id)}
                                      className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                                        playingMemoId === memo.id 
                                          ? 'bg-[#4f6d3a] text-white' 
                                          : 'bg-black/[0.03] hover:bg-black/[0.06] text-[#1e2618]'
                                      }`}
                                      title={playingMemoId === memo.id ? "暂停" : "播放"}
                                    >
                                      {playingMemoId === memo.id ? (
                                        <Volume2 size={9.5} className="animate-pulse" />
                                      ) : (
                                        <Play size={9} fill="currentColor" className="ml-0.5" />
                                      )}
                                    </motion.button>

                                    <motion.button
                                      whileHover={{ scale: 1.08 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleDownloadMemo(memo)}
                                      className="p-1.5 rounded-full bg-black/[0.03] hover:bg-black/[0.06] text-[#1e2618] cursor-pointer transition-all"
                                      title="下载"
                                    >
                                      <Download size={9.5} />
                                    </motion.button>

                                    <motion.button
                                      whileHover={{ scale: 1.08, backgroundColor: 'rgba(244,63,94,0.05)' }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleDeleteMemo(memo.id)}
                                      className="p-1.5 rounded-full text-stone-300 hover:text-rose-500 cursor-pointer transition-colors"
                                      title="删除"
                                    >
                                      <Trash2 size={9.5} />
                                    </motion.button>
                                  </div>
                                </motion.div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Chords Sequence Section */}
        <motion.section 
          key={`${currentProgression?.id}_${selectedKeyName}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          id="liveResult" 
          className="my-7 w-full max-w-[96%] mx-auto space-y-3.5"
        >
          {transposedChords.map((chord, index) => (
            <ChordCard
              key={index}
              chord={chord}
              index={index}
              isActive={activeChordIndex === index}
              degreeMode={degreeMode}
              onCardClick={(idx) => {
                setActiveChordIndex(prev => prev === idx ? -1 : idx);
              }}
            />
          ))}
        </motion.section>

        {/* Playback Controls and Options Desk */}
        {currentProgression && (
          <motion.div 
            whileHover={{ scale: 1.006 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-6 px-5 py-4 bg-[#fafdf6]/40 backdrop-blur-md rounded-[22px] border border-[#e4ebe0]/60 flex flex-col gap-4 text-xs text-[#6b7862] animate-fade-in select-none shadow-sm shadow-black/[0.005]"
          >
            {/* Speed slider block */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] font-bold opacity-75 uppercase tracking-wider font-mono">
                <span>试听控制 PLAYBACK</span>
                <span>速度: {chordDuration.toFixed(1)} 秒 / 级</span>
              </div>
              
              <input
                type="range"
                min="1.2"
                max="2.6"
                step="0.2"
                value={chordDuration}
                onChange={(e) => setChordDuration(parseFloat(e.target.value))}
                className="w-full accent-[#4f6d3a] cursor-pointer h-2 bg-[#e4ebe0] rounded-lg appearance-none outline-none transition-all hover:opacity-100 opacity-90"
              />
            </div>

            {/* Buttons row below slider */}
            <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#e4ebe0]/40">
              {isPlaying ? (
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(244, 63, 94, 0.15)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 450, damping: 15 }}
                  onClick={handleStop}
                  className="w-[100px] flex items-center justify-center gap-1.5 py-1.5 bg-rose-500/10 text-rose-800 font-bold text-[10.5px] uppercase tracking-wider rounded-full cursor-pointer shrink-0"
                >
                  <Square size={9} fill="currentColor" />
                  停止试听
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(79, 109, 58, 0.18)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 450, damping: 15 }}
                  onClick={() => setIsPlaying(true)}
                  className="w-[100px] flex items-center justify-center gap-1.5 py-1.5 bg-[#4f6d3a]/10 text-[#4f6d3a] font-bold text-[10.5px] uppercase tracking-wider rounded-full cursor-pointer shrink-0"
                >
                  <Play size={9} fill="currentColor" className="ml-0.5" />
                  循环播放
                </motion.button>
              )}

              {/* Notation Switch Toggle with fixed size */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#6b7862]/75 font-semibold font-mono">记谱:</span>
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(79, 109, 58, 0.18)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 450, damping: 15 }}
                  onClick={() => setDegreeMode(prev => prev === 'nashville' ? 'roman' : 'nashville')}
                  className="w-[76px] text-center py-1.5 bg-[#4f6d3a]/10 text-[#4f6d3a] text-[10.5px] font-bold rounded-full cursor-pointer shrink-0"
                >
                  {degreeMode === 'nashville' ? '纳什维尔' : '罗马'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Secondary Refresh Action Button */}
        <motion.button
          id="refreshBtn"
          whileHover={{ scale: 1.015, y: -0.5, backgroundColor: "rgba(0,0,0,0.08)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 350, damping: 15 }}
          onClick={generateInspiration}
          className="w-full py-3.5 bg-black/[0.06] text-[#1e2618] font-medium text-[15px] rounded-full cursor-pointer shadow-sm shadow-black/[0.005] select-none focus:outline-none"
        >
          再换一组
        </motion.button>

        {/* Micro Branding Footer */}
        <footer className="footer mt-8 mb-4 text-center text-xs font-semibold tracking-wider text-[#1e2618]/25 select-none">
          V2.0
        </footer>
      </div>

      {/* Songwriter's Workshop Slide-Over Drawer Overlay */}
      <AnimatePresence>
        {showWorkshop && (
          <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop Tap dismiss */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWorkshop(false)}
              className="absolute inset-0 bg-transparent" 
            />

            <motion.div
              id="songwriter-workshop-drawer"
              initial={{ y: "100%", opacity: 0.95 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.95 }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="relative w-full max-w-[420px] bg-[#fafdf6] rounded-t-[28px] sm:rounded-[28px] shadow-2xl border border-[#e4ebe0] max-h-[85vh] flex flex-col overflow-hidden z-20 rounded-b-none sm:rounded-b-[28px] pb-[env(safe-area-inset-bottom,0px)]"
            >
              {/* Decorative Drawer Bar Handle */}
              <div 
                className="w-12 h-1 bg-[#e4ebe0] rounded-full mx-auto my-3 cursor-pointer shrink-0" 
                onClick={() => setShowWorkshop(false)} 
              />

              {/* Title Section */}
              <div className="px-5 pb-3 flex items-center justify-between border-b border-[#e4ebe0]/40 shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <FolderHeart size={16.5} className="text-[#4f6d3a]" />
                  <h2 className="text-[15px] font-bold text-[#1e2618]">
                    收藏夹
                  </h2>
                </div>
                <button
                  onClick={() => setShowWorkshop(false)}
                  className="p-1.5 rounded-full bg-[#e8ece4]/50 text-[#1e2618]/70 hover:bg-[#e4ebe0]/85 transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Drawer Header Info Row */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#e4ebe0]/30 bg-[#e4ebe0]/10 text-xs font-bold shrink-0 select-none text-[#4f6d3a]">
                <div className="flex items-center gap-1.5 flex-1">
                  <Heart size={12} className="fill-current text-rose-500" />
                  <span>已收藏的进行 ({favorites.length})</span>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                {favorites.length === 0 ? (
                  <div className="text-center py-12 text-[11px] text-[#6b7862]/65 italic border border-dashed border-[#e4ebe0] rounded-[20px] p-5 select-none">
                    <Heart size={20} className="text-[#6b7862]/35 mx-auto mb-2" />
                    暂无收藏的项目
                  </div>
                ) : (
                  CHORD_PROGRESSIONS.filter(prog => favorites.includes(prog.id)).map(prog => {
                    const styleName = STYLE_META.find(s => s.id === prog.style)?.name || prog.style;
                    const isCurrentLoaded = currentProgression?.id === prog.id;
                    
                    // Show formula series
                    const formula = prog.chords.map(c => 
                      degreeMode === 'nashville' ? c.nashvilleDegree : c.romanDegree
                    ).join(' → ');

                    const isExpandedNotes = expandedProgressionId === prog.id && expandedSubSection === 'notes';
                    const isExpandedRec = expandedProgressionId === prog.id && expandedSubSection === 'rec';

                    return (
                      <motion.div 
                        layout
                        key={prog.id}
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        whileHover={{ y: -1.5, scale: 1.008 }}
                        whileTap={{ scale: 0.992 }}
                        transition={{ type: "spring", stiffness: 240, damping: 18 }}
                        className={`p-4 rounded-[18px] bg-white border flex flex-col gap-2 shadow-sm transition-all text-left ${
                          isCurrentLoaded 
                            ? 'border-[#4f6d3a]/30 bg-[#fafdf6] ring-1 ring-[#4f6d3a]/15 shadow-sm shadow-[#4f6d3a]/5' 
                            : 'border-[#e4ebe0]/30 hover:bg-[#fafdf6]/15 hover:border-[#4f6d3a]/15'
                        }`}
                      >
                        <div className="flex items-start justify-between select-none">
                          <div className="flex flex-col text-left">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold font-mono text-[#1e2618] text-[13px] tracking-wide">{formula}</span>
                              <span className="bg-[#4f6d3a]/10 border border-[#4f6d3a]/15 text-[#4f6d3a] text-[8.5px] px-1.5 py-0.2 rounded-sm transform scale-95 origin-left font-semibold">
                                {styleName}
                              </span>
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(244,63,94,0.06)" }}
                            whileTap={{ scale: 0.88 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            onClick={() => toggleFavorite(prog.id)}
                            className="text-[#6b7862]/55 hover:text-rose-600 p-1.5 rounded-full transition-colors cursor-pointer shrink-0"
                            title="取消收藏"
                          >
                            <Trash2 size={13} />
                          </motion.button>
                        </div>

                        {/* Inline Expand Triggers: Notes & Recordings */}
                        <div className="flex items-center justify-between border-t border-[#e4ebe0]/30 pt-2.5 mt-1 select-none text-left">
                          <div className="flex items-center gap-1.5">
                            {/* Handwritings Drawer button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 15 }}
                              onClick={() => {
                                if (isExpandedNotes) {
                                  setExpandedProgressionId(null);
                                  setExpandedSubSection(null);
                                } else {
                                  setExpandedProgressionId(prog.id);
                                  setExpandedSubSection('notes');
                                }
                              }}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isExpandedNotes 
                                  ? 'bg-[#4f6d3a] text-white' 
                                  : 'bg-stone-100 hover:bg-stone-200 text-[#1e2618]'
                              }`}
                            >
                              <FileText size={11} />
                              随笔手记
                            </motion.button>

                            {/* Humming Recordings Button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 15 }}
                              onClick={() => {
                                if (isExpandedRec) {
                                  setExpandedProgressionId(null);
                                  setExpandedSubSection(null);
                                } else {
                                  setExpandedProgressionId(prog.id);
                                  setExpandedSubSection('rec');
                                }
                              }}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isExpandedRec 
                                  ? 'bg-[#4f6d3a] text-white animate-pulse' 
                                  : 'bg-stone-100 hover:bg-stone-200 text-[#1e2618]'
                              }`}
                            >
                              <Mic size={11} />
                              哼唱小样 ({recordingList.filter(memo => memo.progressionId === prog.id).length})
                            </motion.button>
                          </div>

                          {/* Loading Selector Link */}
                          <div>
                            {isCurrentLoaded ? (
                              <span className="text-[9.5px] text-[#4f6d3a] font-bold flex items-center gap-0.5 select-none">
                                <Check size={11.5} />
                                已载入
                              </span>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.92 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                onClick={() => {
                                  handleStop();
                                  setCurrentProgression(prog);
                                }}
                                className="px-2.5 py-1 bg-[#4f6d3a] text-white rounded-full text-[9.5px] font-medium flex items-center gap-0.5 hover:bg-[#4f6d3a]/90 cursor-pointer transition-all"
                              >
                                载入使用
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Inline Expanded Note Editor */}
                        <AnimatePresence initial={false}>
                          {isExpandedNotes && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 220, damping: 18 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 pt-3 border-t border-[#e4ebe0]/40 space-y-2 text-left bg-stone-100/35 p-3 rounded-xl">
                                <div className="flex items-center justify-between text-[10.5px] select-none">
                                  <span className="font-bold text-[#4f6d3a] flex items-center gap-1">
                                    <FileText size={12} />
                                    词曲随笔与灵感手记
                                  </span>
                                  {isNotesSaved ? (
                                    <span className="text-[9px] text-[#4f6d3a] font-semibold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#4f6d3a] animate-pulse" />
                                      已自动存盘
                                    </span>
                                  ) : (
                                    <span className="text-[9px] text-stone-400">输入中...</span>
                                  )}
                                </div>
                                <textarea
                                  value={allNotes[prog.id] || ''}
                                  onChange={(e) => handleNoteChangeForId(prog.id, e.target.value)}
                                  placeholder="写下和弦句子的歌词拼贴、节奏分轨细节或心流随笔..."
                                  className="w-full h-24 p-2.5 rounded-[10px] bg-white border border-[#e4ebe0]/40 resize-none focus:outline-none focus:ring-1 focus:ring-[#4f6d3a]/30 text-xs text-[#1e2618] leading-relaxed placeholder:text-[#6b7862]/45 font-sans"
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Inline Expanded Recording Manager */}
                        <AnimatePresence initial={false}>
                          {isExpandedRec && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 220, damping: 18 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 pt-3 border-t border-[#e4ebe0]/40 space-y-3 text-left bg-stone-100/35 p-3 rounded-xl">
                                <div className="flex items-center justify-between select-none">
                                  <span className="font-bold text-[#4f6d3a] flex items-center gap-1 text-[10.5px]">
                                    <Mic size={12} />
                                    哼唱小样录像
                                  </span>
                                  {isRecording && recordingProgressionRef.current?.id === prog.id ? (
                                    <span className="text-[9.5px] text-rose-600 font-semibold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                                      正在录制中 ({Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')})
                                    </span>
                                  ) : (
                                    <span className="text-[9px] text-[#6b7862]/60">捕获灵动哼唱</span>
                                  )}
                                </div>

                                {/* Recorder controls row */}
                                <div className="flex items-center justify-between p-2 rounded-[10px] bg-white border border-[#e4ebe0]/40">
                                  <div className="text-[9.5px] text-[#6b7862]/80">
                                    {isRecording && recordingProgressionRef.current?.id === prog.id
                                      ? '🎙️ 麦克风录入中...'
                                      : '录制你的声线哼唱或原声吉他...'
                                    }
                                  </div>
                                  <div>
                                    {isRecording && recordingProgressionRef.current?.id === prog.id ? (
                                      <motion.button
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={stopRecording}
                                        className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center animate-pulse hover:bg-rose-600 shadow active:scale-95 cursor-pointer transition-transform shrink-0"
                                        title="停止录音"
                                      >
                                        <MicOff size={11} />
                                      </motion.button>
                                    ) : (
                                      <motion.button
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => startRecording(prog)}
                                        disabled={isRecording}
                                        className={`w-7 h-7 rounded-full text-white flex items-center justify-center shadow active:scale-95 cursor-pointer transition-transform shrink-0 ${
                                          isRecording ? 'bg-stone-300 cursor-not-allowed' : 'bg-[#4f6d3a] hover:bg-[#4f6d3a]/90'
                                        }`}
                                        title="开始录音"
                                      >
                                        <Mic size={11} />
                                      </motion.button>
                                    )}
                                  </div>
                                </div>

                                {/* Active waveform */}
                                {isRecording && recordingProgressionRef.current?.id === prog.id && (
                                  <div className="flex items-center justify-center gap-1 py-1 selection:bg-none select-none">
                                    {[1, 3, 2, 4, 3, 5, 2, 4, 1, 3, 2, 1].map((val, i) => (
                                      <motion.span
                                        key={i}
                                        animate={{ height: [5, val * 3, 5] }}
                                        transition={{ repeat: Infinity, duration: 0.65, delay: i * 0.05 }}
                                        className="w-[2.5px] rounded-full bg-[#4f6d3a]"
                                      />
                                    ))}
                                  </div>
                                )}

                                {/* Specific list */}
                                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-0.5 mt-2">
                                  {recordingList.filter(memo => memo.progressionId === prog.id).length === 0 ? (
                                    <div className="text-center py-4 text-[9.5px] text-[#6b7862]/50 italic border border-dashed border-[#e4ebe0] rounded-[8px] bg-white select-none">
                                      此进行下暂无哼唱小样。
                                    </div>
                                  ) : (
                                    recordingList.filter(memo => memo.progressionId === prog.id).map(memo => (
                                      <motion.div 
                                        key={memo.id}
                                        initial={{ opacity: 0, scale: 0.97 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.97 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                                        className={`p-2 rounded-[10px] bg-white border border-[#e4ebe0]/30 flex items-center justify-between gap-1 text-[9.5px] transition-all ${
                                          playingMemoId === memo.id ? 'ring-1 ring-[#4f6d3a]/30 bg-[#e4ebe0]/5' : ''
                                        }`}
                                      >
                                        <div className="flex-1 min-w-0 pr-1 text-left">
                                          <div className="flex items-center gap-1 w-full">
                                            <span className="font-bold text-[#1e2618] truncate max-w-[110px] block">{memo.title}</span>
                                            <span className="text-[7.5px] text-[#4f6d3a] px-1 bg-[#4f6d3a]/15 rounded-sm shrink-0 font-medium font-sans">
                                              {memo.keyName}调
                                            </span>
                                          </div>
                                          <div className="text-[7.5px] text-[#6b7862]/60 mt-0.5 font-sans">
                                            {memo.date} • 时长 {memo.duration}
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0 select-none">
                                          <motion.button
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handlePlayMemo(memo.id)}
                                            className={`p-1.2 rounded-full cursor-pointer transition-colors ${
                                              playingMemoId === memo.id 
                                                ? 'bg-[#4f6d3a] text-white font-bold' 
                                                : 'bg-black/[0.03] hover:bg-black/[0.06] text-[#1e2618]'
                                            }`}
                                            title={playingMemoId === memo.id ? "暂停" : "播放"}
                                          >
                                            {playingMemoId === memo.id ? (
                                              <Volume2 size={9} className="animate-pulse" />
                                            ) : (
                                              <Play size={8.5} fill="currentColor" className="ml-0.5" />
                                            )}
                                          </motion.button>
                                          <motion.button
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDownloadMemo(memo)}
                                            className="p-1.2 rounded-full bg-black/[0.03] hover:bg-black/[0.06] text-[#1e2618] cursor-pointer transition-colors"
                                            title="下载"
                                          >
                                            <Download size={9} />
                                          </motion.button>
                                          <motion.button
                                            whileHover={{ scale: 1.08, backgroundColor: "rgba(244,63,94,0.06)" }}
                                            whileTap={{ scale: 0.88 }}
                                            onClick={() => handleDeleteMemo(memo.id)}
                                            className="p-1.2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer transition-colors"
                                            title="删除"
                                          >
                                            <Trash2 size={9} />
                                          </motion.button>
                                        </div>
                                      </motion.div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* theory explanation dialog modal */}
      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 bg-neutral-900/35 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              id="guide-modal"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="max-w-[390px] w-full bg-[#fafdf6] rounded-[28px] overflow-hidden shadow-2xl border border-[#e4ebe0] p-6 text-xs text-[#6b7862]"
            >
              <div className="border-b border-[#e4ebe0] pb-4 mb-4">
                <h3 className="text-base font-bold text-[#1e2618] flex items-center gap-1.5 uppercase tracking-wide">
                  <BookOpen size={16} />
                  和弦级数与转调说明
                </h3>
                <p className="text-[10px] text-[#6b7862]/80 mt-1 flex items-center">
                  懂了一点后，创作会变得极其顺滑 &nbsp;<Heart size={8} fill="currentColor" className="text-rose-600/70" />
                </p>
              </div>

              <div className="space-y-4 leading-relaxed pr-1">
                <div>
                  <h4 className="font-bold text-[#1a2614] flex items-center mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4f6d3a] mr-2 block shrink-0" />
                    什么是和弦级数？
                  </h4>
                  <p className="pl-3.5 border-l border-[#e4ebe0] italic text-[#6b7862]">
                    歌是在调性中流动的。级数就是音符坐标：在 C 大调中，1 级是 C ，4 级是 F，6 级是 Am。经典的 1-5-6-4 就是 C-G-Am-F。
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#1a2614] flex items-center mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4f6d3a] mr-2 block shrink-0" />
                    纳什维尔与罗马
                  </h4>
                  <ul className="space-y-1 pl-3.5 list-disc">
                    <li>
                      <strong>纳什维尔 (1-5-6-4)</strong>：民谣、吉他即兴弹唱最常用的阿拉伯根音记号。
                    </li>
                    <li>
                      <strong>罗马记号 (I-V-vi-IV)</strong>：学术和声最爱，大写是大和弦，小写是小调和弦色调。
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-[#1a2614] flex items-center mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4f6d3a] mr-2 block shrink-0" />
                    无摩擦智能转调
                  </h4>
                  <p className="pl-3.5 border-l border-[#e4ebe0] italic text-[#6b7862]">
                    在顶部下拉框直接换调（如 C 换成 G ），卡片会自动转换根音与全部和音，省去手动演算烦恼。
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#e4ebe0] flex justify-end">
                <button
                  id="guide-close-btn"
                  onClick={() => setShowGuide(false)}
                  className="px-5 py-2.5 bg-[#4f6d3a] hover:bg-[#4f6d3a]/90 text-white text-[11px] font-bold tracking-[0.1em] uppercase rounded-full cursor-pointer transition-all shadow-sm"
                >
                  我知道了
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
