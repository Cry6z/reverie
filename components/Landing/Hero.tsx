"use client";

import React, { RefObject } from "react";
import { Sparkles, ChevronDown } from "lucide-react";

interface HeroProps {
  heroRef: RefObject<HTMLDivElement | null>;
  mousePos: { x: number; y: number };
  onHeroMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onHeroMouseLeave: () => void;
  ceweName: string;
  storiesLength: number;
  onPickRandom: () => void;
  isUnlocked: boolean;
}

export default function Hero({
  heroRef,
  mousePos,
  onHeroMouseMove,
  onHeroMouseLeave,
  ceweName,
  storiesLength,
  onPickRandom,
  isUnlocked,
}: HeroProps) {
  const scrollToCatalog = () => {
    document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      ref={heroRef}
      onMouseMove={onHeroMouseMove}
      onMouseLeave={onHeroMouseLeave}
      className="relative w-full min-h-[85vh] lg:min-h-screen overflow-hidden border-b border-border-custom/20 bg-linear-to-b from-[#090807] via-[#0d0c0b] to-[#121110] select-none flex flex-col justify-center items-center pt-28 pb-12 lg:pb-16"
    >
      {/* Dynamic morphing aurora space background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-45">
        <div 
          className={`aurora-blob-1 top-[-25%] left-[-15%] transition-all duration-2500 ease-out ${
            isUnlocked ? "scale-100 opacity-45 blur-[80px]" : "scale-50 opacity-0 blur-[120px]"
          }`} 
        />
        <div 
          className={`aurora-blob-2 bottom-[-15%] right-[-10%] transition-all duration-2500 ease-out ${
            isUnlocked ? "scale-100 opacity-45 blur-[80px]" : "scale-50 opacity-0 blur-[120px]"
          }`} 
        />
      </div>

      {/* Mouse tracking radial spotlight light-cast */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-300 select-none"
        style={{
          background: `radial-gradient(circle 380px at ${((mousePos.x + 0.5) * 100).toFixed(1)}% ${((mousePos.y + 0.5) * 100).toFixed(1)}%, rgba(255, 244, 214, 0.08), transparent)`,
        }}
      />

      {/* Mobile Floating Moon (Absolute top-right, decorative and compact watermark) */}
      <div 
        className={`block lg:hidden absolute top-27.5 right-4 z-0 origin-top-right pointer-events-auto transition-all duration-1500 delay-700 cubic-bezier(0.175, 0.885, 0.32, 1.275) transform ${
          isUnlocked ? "opacity-30 scale-[0.6] rotate-0" : "opacity-0 scale-0 -rotate-45"
        }`}
        style={{
          transform: isUnlocked 
            ? `scale(0.6) translate3d(${mousePos.x * 10}px, ${mousePos.y * 10}px, 0)` 
            : `scale(0) rotate(-45deg)`,
          transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.5s delay-[700ms]"
        }}
      >
        <div className="relative flex items-center justify-center w-45 h-45 orb-container cursor-pointer select-none">
          {/* Orbiting star dots */}
          <div className="orbiting-star orbit-star-1" />
          <div className="orbiting-star orbit-star-2" />
          <div className="orbiting-star orbit-star-3" />
          
          <div 
            onClick={onPickRandom}
            className="celestial-orb" 
            title="Ketuk bulan untuk memilih dongeng acak..."
          />
        </div>
      </div>

      {/* Centered layout row */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Typography & Quick Random */}
        <div 
          className="lg:col-span-8 flex flex-col gap-6 text-left"
          style={{
            transform: `translate3d(${mousePos.x * -14}px, ${mousePos.y * -14}px, 0)`,
            transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          <span 
            className={`text-[9px] font-bold tracking-[0.3em] uppercase text-white/45 transition-all duration-1000 delay-200 ease-out transform ${
              isUnlocked ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            Pustaka Dongeng Pengantar Tidur
          </span>
          
          <h2 
            className={`text-4xl md:text-6xl font-serif font-light tracking-tight text-white leading-[1.12] transition-all duration-1000 delay-400 ease-out transform ${
              isUnlocked ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Selamat malam, <span className="font-semibold italic text-[#fff4d6] drop-shadow-[0_0_20px_rgba(255,244,214,0.2)] relative inline-block">
              {ceweName || "Sayang"}
              <span className="absolute bottom-1 left-0 h-[1.5px] bg-[#fff4d6] rounded-full welcome-underline" />
            </span>.<br />
            Pilih dongeng tidurmu.
          </h2>
          
          <p 
            className={`text-xs md:text-sm text-muted-custom leading-relaxed max-w-xl font-light transition-all duration-1000 delay-600 ease-out transform ${
              isUnlocked ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Membacakan cerita indah sebelum matamu terpejam rapat. Semoga kisah-kisah sederhana ini membawamu terbang tinggi ke negeri awan dan mengantarkan mimpi paling indah.
          </p>
          

        </div>

        {/* Right Interactive Celestial Moon (Desktop/Tablet column only) */}
        <div 
          className={`hidden lg:flex lg:col-span-4 items-center justify-center lg:justify-end shrink-0 transition-all duration-1500 delay-700 cubic-bezier(0.175, 0.885, 0.32, 1.275) transform ${
            isUnlocked ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-[-30deg]"
          }`}
          style={{
            transform: isUnlocked 
              ? `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0)` 
              : `scale(0.5) rotate(-30deg)`,
            transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.5s delay-[700ms]"
          }}
        >
          <div className="relative flex items-center justify-center w-45 h-45 orb-container cursor-pointer select-none">
            {/* Orbiting star dots */}
            <div className="orbiting-star orbit-star-1" />
            <div className="orbiting-star orbit-star-2" />
            <div className="orbiting-star orbit-star-3" />
            
            <div 
              onClick={onPickRandom}
              className="celestial-orb" 
              title="Ketuk bulan untuk memilih dongeng acak..."
            />
          </div>
        </div>

      </div>

      {/* Glowing Sleepy Scroll Indicator */}
      <div 
        onClick={scrollToCatalog}
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white/70 cursor-pointer select-none z-20 group transition-all duration-1000 delay-1000 ${
          isUnlocked ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <span className="text-[8px] font-bold tracking-[0.3em] uppercase select-none transition-colors group-hover:text-white/60">
          Jelajahi Pustaka
        </span>
        <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white/70 animate-bounce duration-2000" />
      </div>
    </section>
  );
}
