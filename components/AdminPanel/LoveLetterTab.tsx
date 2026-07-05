import React from "react";
import { Edit3, Heart } from "lucide-react";

interface LoveLetterTabProps {
  loveLetter: string;
  setLoveLetter: (l: string) => void;
  handleSaveLoveLetter: (e: React.FormEvent) => void;
}

export default function LoveLetterTab({
  loveLetter,
  setLoveLetter,
  handleSaveLoveLetter,
}: LoveLetterTabProps) {
  return (
    <section className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col justify-start items-center bg-[#121110]/30 scrollbar-thin">
      <div className="max-w-2xl w-full flex flex-col gap-6 select-text text-left">
        
        {/* Editor Title */}
        <div className="flex flex-col select-none">
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/45">Bilik Romansa</span>
          <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2 mt-0.5">
            <Heart className="w-4.5 h-4.5 text-red-400 fill-red-400/20" />
            <span>Terbitkan Surat Malam</span>
          </h2>
          <p className="text-[11px] text-white/40 mt-1">
            Tulis pesan romantis atau puisi penenang hati yang akan langsung terbit di halaman depan untuk dibaca sebelum tidur.
          </p>
        </div>

        <form onSubmit={handleSaveLoveLetter} className="flex flex-col gap-5">
          {/* Parchment Styled Textarea */}
          <div className="relative w-full rounded-3xl overflow-hidden border border-[#d8c59f]/30 shadow-[0_20px_50px_rgba(0,0,0,0.4)] bg-[#fbf8f3] text-[#433422] p-8 md:p-10 transition-transform duration-300">
            {/* Lofi glowing lines indicator in parchment */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#8c5a3c]/30" />
            
            <div className="flex flex-col gap-4 font-handwriting text-xl tracking-wide leading-relaxed">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] font-sans text-[#8c5a3c]/60 select-none">
                ~ Surat Cinta Malam Ini ~
              </span>
              <textarea
                placeholder="Tuliskan bait puisi atau kalimat hangatmu di sini..."
                value={loveLetter}
                onChange={(e) => setLoveLetter(e.target.value)}
                rows={7}
                className="w-full bg-transparent border-none focus:outline-none resize-none font-handwriting text-lg md:text-xl placeholder:text-[#8c5a3c]/30 text-[#433422]"
                required
              />
            </div>

            {/* Heart Wax Seal stamp absolute decoration */}
            <div className="absolute bottom-6 right-8 flex items-center justify-center select-none opacity-90">
              <div className="w-9 h-9 rounded-full bg-red-600/90 border border-red-700 flex items-center justify-center shadow-md animate-glow-pulse relative">
                <Heart className="w-3.5 h-3.5 text-white fill-white/80" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 select-none">
            <button
              type="submit"
              className="bg-[#fff4d6] hover:bg-[#ffe3a8] text-[#0d0c0b] px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all active:scale-[0.97] flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Terbitkan Surat</span>
            </button>
          </div>
        </form>

      </div>
    </section>
  );
}
