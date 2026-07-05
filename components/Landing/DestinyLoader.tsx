"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface DestinyLoaderProps {
  isLoading: boolean;
  isFadeout: boolean;
  quote: string;
}

export default function DestinyLoader({
  isLoading,
  isFadeout,
  quote,
}: DestinyLoaderProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-70 flex flex-col items-center justify-center bg-[#0d0c0b]/98 backdrop-blur-md px-6 transition-opacity duration-700 ease-in-out select-none ${
        isFadeout 
          ? "opacity-0 pointer-events-none" 
          : visible 
            ? "opacity-100" 
            : "opacity-0"
      }`}
    >
      {/* Animated Glowing Magic Star Orb */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-10">
        {/* Pulsing outer glowing rings */}
        <div className="absolute inset-0 rounded-full border border-yellow-500/10 animate-ping opacity-25" />
        <div className="absolute inset-3 rounded-full border border-yellow-500/20 animate-pulse duration-2000 opacity-50" />
        
        {/* Spinning inner crescent/groove ring */}
        <div className="absolute inset-5 rounded-full border-t border-r border-[#fff4d6]/40 animate-spin duration-1500" />
        
        {/* Core magic sparkles */}
        <Sparkles className="w-8 h-8 text-[#fff4d6] animate-pulse duration-1000 drop-shadow-[0_0_12px_rgba(255,244,214,0.65)]" />
      </div>

      {/* Bedtime Quote Text */}
      <div className="max-w-sm text-center flex flex-col gap-3">
        <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/40">
          Takdir Memilih
        </span>
        <p className="text-sm md:text-base font-serif font-light text-white/80 leading-relaxed italic animate-pulse duration-3000">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </div>
  );
}
