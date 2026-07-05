import React from "react";

interface ChapterIntroProps {
  title: string;
  mood: string;
  duration: number;
  titleCardFadeOut: boolean;
  titleOpacity: "hidden" | "visible";
}

export default function ChapterIntro({
  title,
  mood,
  duration,
  titleCardFadeOut,
  titleOpacity,
}: ChapterIntroProps) {
  return (
    <div 
      className={`absolute inset-0 z-50 bg-[#0d0c0b] flex flex-col items-center justify-center px-6 select-none transition-opacity duration-1000 ease-in-out ${
        titleCardFadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Subtle stars backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <div className="star-blink absolute rounded-full bg-white w-1 h-1 top-[15%] left-[20%]" />
        <div className="star-blink absolute rounded-full bg-white w-1.5 h-1.5 top-[25%] left-[75%] [animation-delay:2s]" />
        <div className="star-blink absolute rounded-full bg-white w-0.5 h-0.5 top-[60%] left-[12%] [animation-delay:1.5s]" />
        <div className="star-blink absolute rounded-full bg-white w-1 h-1 top-[80%] left-[85%] [animation-delay:3.5s]" />
      </div>

      {/* Title container with smooth float-up translation */}
      <div 
        className={`max-w-md text-center flex flex-col gap-4 transition-all duration-1200 ease-in-out transform ${
          titleOpacity === "visible" 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-3"
        }`}
      >
        <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/45">
          {mood} • {duration} Menit Baca
        </span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-medium tracking-wide leading-relaxed">
          {title}
        </h1>
        <div className="w-8 h-px bg-[#fff4d6]/40 mx-auto mt-2" />
      </div>
    </div>
  );
}
