import React from "react";
import { Volume2, SkipBack, Play, Pause, Square, SkipForward } from "lucide-react";
import { ThemeType } from "@/app/types/reader";
import { THEMES } from "@/app/constants/reader";

interface TtsPlayerProps {
  ttsActive: boolean;
  ttsPlaying: boolean;
  ttsParagraphIdx: number;
  totalParagraphs: number;
  ttsSpeed: number;
  theme: ThemeType;
  playParagraph: (idx: number) => void;
  pauseTts: () => void;
  resumeTts: () => void;
  stopTts: () => void;
  changeTtsSpeed: (speed: number) => void;
}

export default function TtsPlayer({
  ttsActive,
  ttsPlaying,
  ttsParagraphIdx,
  totalParagraphs,
  ttsSpeed,
  theme,
  playParagraph,
  pauseTts,
  resumeTts,
  stopTts,
  changeTtsSpeed,
}: TtsPlayerProps) {
  if (!ttsActive) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-[90%] max-w-lg select-none fade-in">
      <div className={`flex flex-col gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.6)] ${THEMES[theme].tooltipBg} ${THEMES[theme].border} transition-all duration-300`}>
        {/* Top Label & Info */}
        <div className={`flex items-center justify-between text-[9px] border-b pb-2 ${THEMES[theme].border}`}>
          <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase text-green-500">
            <Volume2 className="w-3 h-3 animate-pulse text-green-400" />
            <span>Asisten Baca Suara (TTS)</span>
          </div>
          <span className="opacity-60 text-foreground">
            Paragraf {ttsParagraphIdx + 1} dari {totalParagraphs}
          </span>
        </div>
        
        {/* TTS Controls Row */}
        <div className="flex items-center justify-between px-2">
          {/* Prev Paragraph */}
          <button
            onClick={() => playParagraph(ttsParagraphIdx - 1)}
            disabled={ttsParagraphIdx <= 0}
            className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 cursor-pointer text-foreground"
            title="Paragraf Sebelumnya"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          {/* Main Play/Pause / Stop Panel */}
          <div className="flex items-center gap-4">
            {ttsPlaying ? (
              <button
                onClick={pauseTts}
                className="p-3 bg-yellow-500 text-black hover:bg-yellow-400 rounded-full transition-all shadow-[0_0_15px_rgba(234,179,8,0.25)] hover:scale-105 cursor-pointer"
                title="Jeda Pembacaan"
              >
                <Pause className="w-5 h-5 fill-current" />
              </button>
            ) : (
              <button
                onClick={resumeTts}
                className="p-3 bg-green-500 text-white hover:bg-green-400 rounded-full transition-all shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:scale-105 cursor-pointer"
                title="Lanjutkan Pembacaan"
              >
                <Play className="w-5 h-5 fill-current" />
              </button>
            )}
            
            <button
              onClick={stopTts}
              className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-full transition-all border border-red-500/35 cursor-pointer"
              title="Hentikan Pembacaan"
            >
              <Square className="w-5 h-5 fill-current" />
            </button>
          </div>
          
          {/* Next Paragraph */}
          <button
            onClick={() => playParagraph(ttsParagraphIdx + 1)}
            disabled={ttsParagraphIdx >= totalParagraphs - 1}
            className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 cursor-pointer text-foreground"
            title="Paragraf Berikutnya"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls Row */}
        <div className={`flex items-center justify-between text-[9px] mt-1 pt-2 border-t ${THEMES[theme].border} text-foreground`}>
          <span className="opacity-60 font-bold uppercase tracking-wider text-foreground">Kecepatan Suara</span>
          <div className="flex gap-2">
            {([0.8, 1.0, 1.25, 1.5] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => changeTtsSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer font-medium ${
                  ttsSpeed === spd
                    ? "bg-yellow-500 text-black font-bold border border-yellow-500"
                    : "bg-white/5 hover:bg-white/10 opacity-70 text-foreground"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
