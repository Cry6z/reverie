"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check, Sliders, Volume2, VolumeX } from "lucide-react";
import confetti from "canvas-confetti";

import { StoryReaderProps, ThemeType, FontType, LineHeightType, PageWidthType, TextAlignType } from "@/app/types/reader";
import { THEMES, FONTS, LINE_HEIGHTS, PAGE_WIDTHS } from "@/app/constants/reader";

import ChapterIntro from "./ChapterIntro";
import ReaderSettings from "./ReaderSettings";
import TtsPlayer from "./TtsPlayer";

export default function StoryReader({ story, onClose, onMarkRead, isRead, startFullyVisible }: StoryReaderProps) {
  const [theme, setTheme] = useState<ThemeType>("cozy-night");
  const [fontType, setFontType] = useState<FontType>("serif");
  const [fontSize, setFontSize] = useState<number>(20);
  const [lineHeight, setLineHeight] = useState<LineHeightType>("cozy");
  const [pageWidth, setPageWidth] = useState<PageWidthType>("medium");
  const [textAlign, setTextAlign] = useState<TextAlignType>("justify");
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Auto-scroll states
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<0 | 1 | 2 | 3>(0);
  
  // TTS (Text-to-Speech) states
  const [ttsActive, setTtsActive] = useState<boolean>(false);
  const [ttsPlaying, setTtsPlaying] = useState<boolean>(false);
  const [ttsParagraphIdx, setTtsParagraphIdx] = useState<number>(0);
  const [ttsSpeed, setTtsSpeed] = useState<number>(1);
  
  // Settings Panel state
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [storyCompleted, setStoryCompleted] = useState<boolean>(isRead);
  
  // Entrance & Exit transitions states
  const [isVisible, setIsVisible] = useState(startFullyVisible || false);
  const [isClosing, setIsClosing] = useState(false);

  // Chapter Welcoming Title Card & Page Entry states
  const [showChapterTitle, setShowChapterTitle] = useState(true);
  const [titleOpacity, setTitleOpacity] = useState<"hidden" | "visible">("hidden");
  const [titleCardFadeOut, setTitleCardFadeOut] = useState(false);
  const [animateParagraphs, setAnimateParagraphs] = useState(false);

  // Dimmer states
  const [dimLevel, setDimLevel] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Split content by paragraphs (normalize literal '\n' sequences first)
  const normalizedContent = story.content.replace(/\\n/g, "\n");
  const paragraphs = normalizedContent.split("\n\n").filter(p => p.trim().length > 0);
  const firstParagraph = paragraphs[0] || "";
  const firstLetter = firstParagraph.charAt(0);
  const restOfFirstParagraph = firstParagraph.slice(1);

  // Initialize SpeechSynthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Handle Auto-Scroll with high-performance requestAnimationFrame
  useEffect(() => {
    if (autoScrollSpeed === 0) return;
    if (ttsPlaying) return; // Pause scroll if reading aloud, TTS has its own scroll centerer

    let lastTime = performance.now();
    let frameId: number;
    
    // Pixels per millisecond: speed 1 (slow) ~12px/s, 2 (med) ~24px/s, 3 (fast) ~48px/s
    const speedMultiplier = autoScrollSpeed === 1 ? 0.012 : autoScrollSpeed === 2 ? 0.024 : 0.048;
    
    const scroll = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollTop += delta * speedMultiplier;
        
        // Stop scroll if reached bottom
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5) {
          setAutoScrollSpeed(0);
          return;
        }
      }
      frameId = requestAnimationFrame(scroll);
    };
    
    frameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frameId);
  }, [autoScrollSpeed, ttsPlaying]);

  // Scroll to paragraph and center it
  const scrollToParagraph = (idx: number) => {
    const el = paragraphRefs.current[idx];
    const container = scrollContainerRef.current;
    if (el && container) {
      const elOffsetTop = el.offsetTop;
      const elHeight = el.clientHeight;
      const containerHeight = container.clientHeight;
      
      const targetScrollTop = elOffsetTop - (containerHeight / 2) + (elHeight / 2);
      
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth"
      });
    }
  };

  // TTS Control Functions
  const playParagraph = (idx: number) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    
    if (idx < 0 || idx >= paragraphs.length) {
      stopTts();
      if (!storyCompleted) {
        handleComplete();
      }
      return;
    }
    
    setTtsParagraphIdx(idx);
    setTtsActive(true);
    setTtsPlaying(true);
    
    const textToSpeak = paragraphs[idx];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;
    utterance.rate = ttsSpeed;
    
    const voices = synthRef.current.getVoices();
    const idVoice = voices.find(v => v.lang.startsWith("id") || v.lang.startsWith("in"));
    if (idVoice) {
      utterance.voice = idVoice;
    }
    
    utterance.onend = () => {
      playParagraph(idx + 1);
    };
    
    utterance.onerror = (e) => {
      // Normal flow events (interrupted, canceled) are fired when skipping or stopping speech
      const isNormalEvent = e.error === "interrupted" || e.error === "canceled";
      if (!isNormalEvent) {
        console.error("SpeechSynthesis error:", e.error, e);
        setTtsPlaying(false);
      }
    };
    
    synthRef.current.speak(utterance);
    scrollToParagraph(idx);
  };

  const pauseTts = () => {
    if (synthRef.current && ttsPlaying) {
      synthRef.current.pause();
      setTtsPlaying(false);
    }
  };

  const resumeTts = () => {
    if (synthRef.current) {
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setTtsPlaying(true);
      } else {
        playParagraph(ttsParagraphIdx);
      }
    }
  };

  const stopTts = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setTtsActive(false);
    setTtsPlaying(false);
  };

  const changeTtsSpeed = (newSpeed: number) => {
    setTtsSpeed(newSpeed);
    if (ttsActive && ttsPlaying) {
      setTimeout(() => {
        playParagraph(ttsParagraphIdx);
      }, 50);
    }
  };

  // Monitor scroll progress in the story container
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    
    if (scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(progress);
      
      // Auto complete story if scrolled near the bottom (92%+)
      if (progress > 92 && !storyCompleted) {
        handleComplete();
      }
    }
  };

  const handleComplete = () => {
    setStoryCompleted(true);
    onMarkRead(story.id);
    
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#d4af37", "#f3e5ab", "#ffffff", "#e5e7eb"]
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#d4af37", "#f3e5ab", "#ffffff", "#e5e7eb"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  };

  // Lock body scroll and trigger entrance fade-in
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => {
      document.body.style.overflow = "unset";
      clearTimeout(timer);
    };
  }, []);

  // Exit transition handler (invokes onClose immediately to trigger the loading overlay)
  const handleClose = () => {
    onClose();
  };

  // Multi-phase title card timer chain for smooth overlay reveals
  useEffect(() => {
    // Delay animations by 700ms to wait for the container / loading screen transitions to complete
    const timer1 = setTimeout(() => {
      setTitleOpacity("visible");
    }, 800);

    const timer2 = setTimeout(() => {
      setTitleOpacity("hidden");
    }, 3500);

    const timer3 = setTimeout(() => {
      setTitleCardFadeOut(true);
    }, 4400);

    const timer4 = setTimeout(() => {
      setAnimateParagraphs(true);
    }, 4700);

    const timer5 = setTimeout(() => {
      setShowChapterTitle(false);
    }, 5600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  const isCurrentParaActive = (idx: number) => {
    if (ttsActive && ttsParagraphIdx === idx) return true;
    if (focusMode && hoveredIdx === idx) return true;
    return false;
  };

  return (
    <div className={`fixed inset-0 z-50 ${THEMES[theme].bg} ${THEMES[theme].text} flex flex-col h-screen w-screen overflow-hidden select-none transition-all duration-800 cubic-bezier(0.16, 1, 0.3, 1) ${
      isVisible && !isClosing ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
    }`}>
      
      {/* Scroll Progress Bar */}
      <div 
        className="h-1 bg-current transition-all duration-100 absolute top-0 left-0 z-50 opacity-60"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Reader Controls Header */}
      <header className={`flex items-center justify-between px-6 py-4 border-b ${THEMES[theme].border} ${THEMES[theme].headerBg} z-40 transition-colors duration-500 select-none`}>

        <button
          onClick={handleClose}
          className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-current/80 hover:text-current transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali</span>
        </button>

        {/* Text Customization & TTS Controls */}
        <div className="flex items-center gap-3 select-none">
          {/* Read Aloud Button */}
          <button
            onClick={() => {
              if (ttsActive) {
                stopTts();
              } else {
                playParagraph(0);
              }
            }}
            className={`p-2 rounded-full transition-all flex items-center justify-center cursor-pointer border ${
              ttsActive
                ? "bg-green-500/20 border-green-500/40 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.15)] animate-pulse"
                : `${THEMES[theme].accent} border-transparent`
            }`}
            title={ttsActive ? "Matikan Asisten Baca Suara" : "Aktifkan Asisten Baca Suara (TTS)"}
          >
            {ttsActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          {/* Appearance Settings Panel Toggle */}
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-full transition-all flex items-center justify-center cursor-pointer border ${
              showSettings 
                ? "bg-amber-500/20 border-amber-500/40 text-amber-400" 
                : `${THEMES[theme].accent} border-transparent`
            }`}
            title="Pengaturan Tampilan"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Scrollable Story Content Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-12 md:py-20 select-text scrollbar-thin transition-colors duration-500"
      >
        <article className={`${PAGE_WIDTHS[pageWidth].className} mx-auto flex flex-col gap-8`}>
          
          {/* Header Metas */}
          <div 
            className={`flex flex-col gap-2 items-center text-center pb-8 border-b ${THEMES[theme].border} select-none transition-all duration-1000 transform ${
              animateParagraphs ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${THEMES[theme].muted} transition-colors duration-500`}>
              {story.mood} • {Math.max(1, Math.ceil((story.content || "").trim().split(/\s+/).filter(Boolean).length / 180))} Menit Baca
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold transition-colors duration-500">
              {story.title}
            </h2>
          </div>

          {/* Story Body Paragraphs */}
          <div 
            className={`flex flex-col gap-6 md:gap-8 ${FONTS[fontType].className} transition-all duration-500`}
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: LINE_HEIGHTS[lineHeight].value,
              textAlign: textAlign === "justify" ? "justify" : "left",
              ...FONTS[fontType].style
            }}
          >
            {/* First paragraph with pulsing drop cap */}
            {(() => {
              const isActive = isCurrentParaActive(0);
              const isTtsCurrent = ttsActive && ttsParagraphIdx === 0;
              
              const focusOpacityClass = focusMode 
                ? (isActive ? "opacity-100 scale-100" : "opacity-30 scale-[0.985] blur-[0.2px]")
                : "opacity-90";
              
              const highlightBgClass = isTtsCurrent
                ? "bg-yellow-500/5 border-l-2 border-yellow-500/80 px-4 py-2 -mx-4 rounded-r-md transition-all duration-300"
                : focusMode && hoveredIdx === 0
                  ? "border-l-2 border-yellow-500/30 px-4 py-2 -mx-4 transition-all duration-300"
                  : "px-4 py-2 -mx-4 border-l-2 border-transparent transition-all duration-300";

              return (
                <p 
                  ref={(el) => { paragraphRefs.current[0] = el; }}
                  onMouseEnter={() => setHoveredIdx(0)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`indent-0 transition-all duration-500 transform ${
                    animateParagraphs ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  } ${focusOpacityClass} ${highlightBgClass}`}
                  style={{ transitionDelay: "100ms" }}
                >
                  <span className={`float-left text-5xl md:text-6xl font-black mr-2.5 mt-1 leading-[0.8] ${THEMES[theme].dropCap} animate-glow-pulse ${
                    FONTS[fontType].className
                  }`}>
                    {firstLetter}
                  </span>
                  {restOfFirstParagraph}
                </p>
              );
            })()}

            {/* Remaining paragraphs */}
            {paragraphs.slice(1).map((para, idx) => {
              const pIdx = idx + 1;
              const isActive = isCurrentParaActive(pIdx);
              const isTtsCurrent = ttsActive && ttsParagraphIdx === pIdx;
              
              const focusOpacityClass = focusMode 
                ? (isActive ? "opacity-100 scale-100" : "opacity-30 scale-[0.985] blur-[0.2px]")
                : "opacity-90";
              
              const highlightBgClass = isTtsCurrent
                ? "bg-yellow-500/5 border-l-2 border-yellow-500/80 px-4 py-2 -mx-4 rounded-r-md transition-all duration-300"
                : focusMode && hoveredIdx === pIdx
                  ? "border-l-2 border-yellow-500/30 px-4 py-2 -mx-4 transition-all duration-300"
                  : "px-4 py-2 -mx-4 border-l-2 border-transparent transition-all duration-300";

              return (
                <p 
                  ref={(el) => { paragraphRefs.current[pIdx] = el; }}
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(pIdx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`indent-4 md:indent-8 transition-all duration-500 transform ${
                    animateParagraphs ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  } ${focusOpacityClass} ${highlightBgClass}`}
                  style={{ 
                    transitionDelay: `${Math.min(1000, (idx + 2) * 100)}ms`,
                  }}
                >
                  {para}
                </p>
              );
            })}
          </div>

          {/* Finished Checklist Mark */}
          <div 
            className={`mt-16 pt-8 border-t ${THEMES[theme].border} flex flex-col items-center gap-4 select-none pb-12 transition-all duration-1000 transform ${
              animateParagraphs ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${Math.min(1200, (paragraphs.length + 1) * 100)}ms` }}
          >
            {storyCompleted ? (
              <div className="flex flex-col items-center gap-2 text-center text-green-500/80 animate-glow-pulse">
                <Check className="w-10 h-10 border border-green-500/30 p-2 rounded-full" />
                <span className="text-xs font-semibold tracking-wider uppercase">Dongeng Selesai Dibaca</span>
              </div>
            ) : (
              <button
                onClick={handleComplete}
                className={`px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 active:scale-95 cursor-pointer ${THEMES[theme].accentBtn}`}
              >
                Tandai Selesai Membaca
              </button>
            )}
          </div>

        </article>
      </div>

      {/* Chapter Welcoming Title Card Overlay */}
      {showChapterTitle && (
        <ChapterIntro
          title={story.title}
          mood={story.mood}
          duration={Math.max(1, Math.ceil((story.content || "").trim().split(/\s+/).filter(Boolean).length / 180))}
          titleCardFadeOut={titleCardFadeOut}
          titleOpacity={titleOpacity}
        />
      )}

      {/* Reader Appearance Sidebar Panel */}
      <ReaderSettings
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        theme={theme}
        setTheme={setTheme}
        fontType={fontType}
        setFontType={setFontType}
        fontSize={fontSize}
        setFontSize={setFontSize}
        lineHeight={lineHeight}
        setLineHeight={setLineHeight}
        pageWidth={pageWidth}
        setPageWidth={setPageWidth}
        textAlign={textAlign}
        setTextAlign={setTextAlign}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
        dimLevel={dimLevel}
        setDimLevel={setDimLevel}
        autoScrollSpeed={autoScrollSpeed}
        setAutoScrollSpeed={setAutoScrollSpeed}
        stopTts={stopTts}
      />

      {/* Floating TTS Player Widget */}
      <TtsPlayer
        ttsActive={ttsActive}
        ttsPlaying={ttsPlaying}
        ttsParagraphIdx={ttsParagraphIdx}
        totalParagraphs={paragraphs.length}
        ttsSpeed={ttsSpeed}
        theme={theme}
        playParagraph={playParagraph}
        pauseTts={pauseTts}
        resumeTts={resumeTts}
        stopTts={stopTts}
        changeTtsSpeed={changeTtsSpeed}
      />

      {/* Eye-Care Dimmer Filter Overlay */}
      <div 
        className="fixed inset-0 bg-black pointer-events-none z-9999 transition-opacity duration-300"
        style={{ opacity: dimLevel / 100 }}
      />
    </div>
  );
}
