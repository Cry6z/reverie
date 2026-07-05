"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Heart, X } from "lucide-react";

interface LoveLetterModalProps {
  isOpen: boolean;
  content: string;
  onToggle: () => void;
}

export default function LoveLetterModal({
  isOpen,
  content,
  onToggle,
}: LoveLetterModalProps) {
  const [isFlapOpen, setIsFlapOpen] = useState(false);
  const [isPaperOut, setIsPaperOut] = useState(false);

  // Sequential Animation trigger
  useEffect(() => {
    if (isOpen) {
      // Step 1: Flap opens after 250ms
      const flapTimer = setTimeout(() => {
        setIsFlapOpen(true);
      }, 250);

      // Step 2: Paper slides up after 750ms (flap has fully rotated)
      const paperTimer = setTimeout(() => {
        setIsPaperOut(true);
      }, 750);

      return () => {
        clearTimeout(flapTimer);
        clearTimeout(paperTimer);
      };
    } else {
      // Step 1 (Reverse): Paper slides back inside immediately
      setIsPaperOut(false);
      
      // Step 2 (Reverse): Flap closes after 350ms (paper is inside)
      const flapTimer = setTimeout(() => {
        setIsFlapOpen(false);
      }, 350);

      return () => {
        clearTimeout(flapTimer);
      };
    }
  }, [isOpen]);

  if (!content) return null;

  return (
    <>
      <style>{`
        .envelope-wrapper {
          perspective: 1000px;
        }
        .envelope-box {
          position: relative;
          width: 290px;
          height: 180px;
          background: #d4be95; /* Inside depth color */
          border-radius: 0 0 12px 12px;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.45);
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }
        /* 3D Folded Flaps styling */
        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 90px;
          background: #d4be95;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          transform-origin: top;
          transition: transform 0.6s ease-in-out, z-index 0.6s;
          z-index: 40;
          filter: drop-shadow(0 4px 5px rgba(0,0,0,0.15));
        }
        .envelope-flap.open {
          transform: rotateX(180deg);
          z-index: 10;
          background: #eeddbb;
          filter: drop-shadow(0 -4px 5px rgba(0,0,0,0.08));
        }
        .envelope-left {
          position: absolute;
          top: 0;
          left: 0;
          width: 150px;
          height: 180px;
          background: #eeddbb;
          clip-path: polygon(0 0, 100% 50%, 0 100%);
          z-index: 30;
          border-radius: 0 0 0 12px;
          filter: drop-shadow(2px 0 3px rgba(0,0,0,0.02));
        }
        .envelope-right {
          position: absolute;
          top: 0;
          right: 0;
          width: 150px;
          height: 180px;
          background: #eeddbb;
          clip-path: polygon(100% 0, 0 50%, 100% 100%);
          z-index: 30;
          border-radius: 0 0 12px 0;
          filter: drop-shadow(-2px 0 3px rgba(0,0,0,0.02));
        }
        .envelope-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 110px;
          background: #e6d6b2;
          clip-path: polygon(0 100%, 50% 0, 100% 100%);
          z-index: 32;
          border-radius: 0 0 12px 12px;
          filter: drop-shadow(0 -3px 5px rgba(0,0,0,0.04));
        }
        .letter-paper {
          position: absolute;
          bottom: 8px;
          left: 10px;
          width: 270px;
          height: 160px;
          background: #fdfbf7;
          border: 2px border-[#f3eee0];
          border-radius: 8px;
          padding: 16px 14px 14px 14px;
          box-shadow: inset 0 0 12px rgba(243,238,224,0.3), 0 2px 10px rgba(0,0,0,0.08);
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), height 0.8s, z-index 0.8s, box-shadow 0.8s;
          z-index: 20;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0.95;
        }
        .letter-paper.open {
          transform: translateY(-145px) scale(1.04);
          height: 310px;
          z-index: 35;
          opacity: 1;
          box-shadow: 0 20px 45px rgba(0,0,0,0.35);
        }
        /* Magic Sparkle Rise Animations */
        @keyframes sparkle-rise-1 {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          50% { opacity: 0.9; }
          100% { transform: translateY(-190px) translateX(-25px) scale(1); opacity: 0; }
        }
        @keyframes sparkle-rise-2 {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          50% { opacity: 0.9; }
          100% { transform: translateY(-230px) translateX(20px) scale(0.8); opacity: 0; }
        }
        @keyframes sparkle-rise-3 {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          50% { opacity: 0.9; }
          100% { transform: translateY(-160px) translateX(-15px) scale(1.2); opacity: 0; }
        }
        .star-particle {
          pointer-events: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* ================= DESKTOP VERSION ================= */}
      <div 
        className={`hidden lg:flex fixed bottom-0 left-8 z-60 w-[290px] sm:w-[310px] border border-amber-900/10 bg-[#fbf8f3] text-[#2c2014] rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.35)] transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275) flex-col overflow-hidden pointer-events-auto ${
          isOpen 
            ? "translate-y-0" 
            : "translate-y-[calc(100%-46px)] hover:translate-y-[calc(100%-54px)]"
        }`}
      >
        {/* Envelope Flap / Header (Toggles open/close) */}
        <div 
          onClick={onToggle}
          className="h-[46px] shrink-0 px-4 flex items-center justify-between border-b border-amber-900/10 bg-[#f5f0e6] hover:bg-[#ede5d4] cursor-pointer transition-colors select-none group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse shrink-0" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-amber-900/80 group-hover:text-amber-900">
              Surat Malam Untukmu
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isOpen && (
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            )}
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-amber-900/60 group-hover:text-amber-900 group-hover:translate-y-[2px] transition-all" />
            ) : (
              <ChevronUp className="w-4 h-4 text-amber-900/60 group-hover:text-amber-900 group-hover:translate-y-[-2px] transition-all" />
            )}
          </div>
        </div>

        {/* Envelope Card Body (The Letter) */}
        <div className="flex flex-col gap-4 p-5 max-h-[350px] overflow-hidden select-text">
          <div className="flex-1 overflow-y-auto max-h-[220px] pr-2 text-justify select-text font-serif italic text-xs sm:text-[13px] leading-relaxed text-zinc-700 whitespace-pre-wrap scrollbar-thin">
            {content ? content.replace(/\\n/g, "\n") : ""}
          </div>

          <div className="border-t border-amber-900/10 pt-3 text-center select-none flex flex-col items-center gap-1.5">
            <span className="text-[9px] text-amber-900/60 italic font-serif">
              Ditulis dengan segenap cinta
            </span>
            <div className="w-6 h-6 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center">
              <Heart className="w-3 h-3 text-red-500 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE VERSION ================= */}
      <div className="lg:hidden pointer-events-none">
        {/* 1. Minimized State: Peeking Envelope Flap at the bottom-center */}
        {!isOpen && (
          <div
            onClick={onToggle}
            className="pointer-events-auto fixed bottom-0 left-1/2 transform -translate-x-1/2 z-60 w-[180px] h-[46px] bg-[#dcc69c] rounded-t-2xl shadow-[0_-5px_15px_rgba(0,0,0,0.3)] flex items-center justify-center cursor-pointer hover:bg-[#eeddbb] transition-all duration-300 animate-bounce-short"
          >
            <div className="flex items-center gap-1.5 select-none">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-current animate-pulse" />
              <span className="text-[9px] font-black tracking-widest uppercase text-amber-900/90">
                Buka Surat Cinta 💌
              </span>
            </div>
            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          </div>
        )}

        {/* 2. Expanded State: CSS Envelope Animation overlay (Always mounted, transitioned via opacity) */}
        <div 
          onClick={onToggle}
          className={`pointer-events-auto fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-500 ${
            isOpen 
              ? "opacity-100 pointer-events-auto animate-fade-in" 
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Envelope Box Container */}
          <div 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the envelope itself
            className="relative w-[290px] h-[340px] mt-[80px] flex flex-col items-center justify-end pointer-events-auto envelope-wrapper"
          >
            {/* The Envelope */}
            <div className="envelope-box">
              {/* 3D Folded Flaps */}
              <div className="envelope-left" />
              <div className="envelope-right" />
              <div className="envelope-bottom" />

              {/* Top Flap */}
              <div className={`envelope-flap ${isFlapOpen ? "open" : ""}`} />
              
              {/* Interactive Bouncy Wax Seal Button */}
              <div 
                onClick={onToggle}
                className={`absolute left-1/2 top-[90px] -translate-x-1/2 -translate-y-1/2 z-45 w-10 h-10 rounded-full bg-linear-to-br from-red-500 to-red-700 border-2 border-yellow-400/40 shadow-[0_5px_15px_rgba(220,38,38,0.45)] flex items-center justify-center cursor-pointer transition-all duration-500 select-none ${
                  isFlapOpen 
                    ? "scale-0 rotate-45 opacity-0 pointer-events-none" 
                    : "scale-100 rotate-0 opacity-100 hover:scale-110 active:scale-90"
                }`}
                title="Buka Segel Surat"
              >
                <Heart className="w-4 h-4 text-yellow-300 fill-current animate-pulse" />
              </div>

              {/* Letter Paper inside */}
              <div className={`letter-paper ${isPaperOut ? "open" : ""}`}>
                {/* Floating Header */}
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-2 mb-2 shrink-0 select-none">
                  <span className="text-[8px] font-black uppercase tracking-wider text-amber-900/50">
                    Surat Cinta Malam
                  </span>
                  <button 
                    onClick={onToggle}
                    className="p-1 hover:bg-amber-900/5 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-amber-900/50" />
                  </button>
                </div>

                {/* Scrollable Letter Content */}
                <div className="flex-1 overflow-y-auto pr-1 text-justify font-serif italic text-xs leading-relaxed text-zinc-700 whitespace-pre-wrap select-text scrollbar-thin">
                  {content ? content.replace(/\\n/g, "\n") : ""}
                </div>

                {/* Signature / Wax Seal */}
                <div className="border-t border-amber-900/10 pt-2 mt-2 text-center select-none flex flex-col items-center gap-1 shrink-0">
                  <span className="text-[8px] text-amber-900/40 italic font-serif leading-none">
                    dengan segenap cinta
                  </span>
                  <div className="w-5 h-5 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center mt-0.5">
                    <Heart className="w-2.5 h-2.5 text-red-500 fill-current" />
                  </div>
                </div>
              </div>

              {/* Magic Sparkles - Rendered only when paper is out */}
              {isPaperOut && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
                  <div className="star-particle absolute bg-yellow-300/80 rounded-full w-1.5 h-1.5 shadow-[0_0_8px_#fef08a]" style={{ left: '20%', bottom: '20px', animation: 'sparkle-rise-1 2.2s ease-out infinite' }} />
                  <div className="star-particle absolute bg-yellow-200/90 rounded-full w-2 h-2 shadow-[0_0_10px_#fef08a]" style={{ left: '50%', bottom: '20px', animation: 'sparkle-rise-2 2.6s ease-out infinite', animationDelay: '0.4s' }} />
                  <div className="star-particle absolute bg-yellow-300/80 rounded-full w-1 h-1 shadow-[0_0_6px_#fef08a]" style={{ left: '80%', bottom: '20px', animation: 'sparkle-rise-3 1.9s ease-out infinite', animationDelay: '0.2s' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
