import React from "react";
import { Sliders, ZoomOut, ZoomIn, AlignLeft, AlignJustify, Eye, EyeOff, Moon } from "lucide-react";
import { ThemeType, FontType, LineHeightType, PageWidthType, TextAlignType } from "@/app/types/reader";
import { THEMES, FONTS, LINE_HEIGHTS, PAGE_WIDTHS } from "@/app/constants/reader";

interface ReaderSettingsProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
  fontType: FontType;
  setFontType: (f: FontType) => void;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  lineHeight: LineHeightType;
  setLineHeight: (l: LineHeightType) => void;
  pageWidth: PageWidthType;
  setPageWidth: (w: PageWidthType) => void;
  textAlign: TextAlignType;
  setTextAlign: (a: TextAlignType) => void;
  focusMode: boolean;
  setFocusMode: (f: boolean) => void;
  dimLevel: number;
  setDimLevel: React.Dispatch<React.SetStateAction<number>>;
  autoScrollSpeed: 0 | 1 | 2 | 3;
  setAutoScrollSpeed: (s: 0 | 1 | 2 | 3) => void;
  stopTts: () => void;
}

export default function ReaderSettings({
  showSettings,
  setShowSettings,
  theme,
  setTheme,
  fontType,
  setFontType,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  pageWidth,
  setPageWidth,
  textAlign,
  setTextAlign,
  focusMode,
  setFocusMode,
  dimLevel,
  setDimLevel,
  autoScrollSpeed,
  setAutoScrollSpeed,
  stopTts,
}: ReaderSettingsProps) {
  return (
    <>
      {/* Settings Backdrop */}
      <div 
        onClick={() => setShowSettings(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          showSettings ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      
      {/* Settings Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 max-w-full z-50 p-6 flex flex-col gap-6 shadow-2xl transition-transform duration-500 ease-out border-l backdrop-blur-md ${THEMES[theme].bg} ${THEMES[theme].border} ${
          showSettings ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between border-b pb-4 ${THEMES[theme].border} select-none`}>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <h3 className="text-[11px] font-bold tracking-wider uppercase">Pengaturan Tampilan</h3>
          </div>
          <button 
            onClick={() => setShowSettings(false)}
            className="text-[10px] font-bold uppercase tracking-wider opacity-60 hover:opacity-100 cursor-pointer text-current"
          >
            Tutup
          </button>
        </div>
        
        {/* Sidebar Body */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5 select-none scrollbar-thin text-xs">
          {/* Tema Membaca */}
          <div className="flex flex-col gap-2">
            <span className={`font-semibold uppercase tracking-wider text-[9px] ${THEMES[theme].muted}`}>Tema Membaca</span>
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.keys(THEMES) as ThemeType[]).map((tKey) => {
                const t = THEMES[tKey];
                let circleBg = "bg-[#161513]";
                if (tKey === "midnight") circleBg = "bg-black";
                if (tKey === "sepia") circleBg = "bg-[#f4ecd8]";
                if (tKey === "forest") circleBg = "bg-[#0f1912]";
                if (tKey === "soft-light") circleBg = "bg-[#fbfaf7]";
                
                return (
                  <button
                    key={tKey}
                    onClick={() => setTheme(tKey)}
                    className={`h-9 rounded-md border flex items-center justify-center transition-all cursor-pointer relative ${circleBg} ${
                      theme === tKey ? "border-yellow-500 scale-105 shadow-sm" : "border-current/10 hover:border-current/30"
                    }`}
                    title={t.name}
                  >
                    <span className={`text-[9px] font-bold ${tKey === "soft-light" ? "text-zinc-800" : "text-white/80"}`}>
                      {t.name.split(" ")[0]}
                    </span>
                    {theme === tKey && (
                      <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gaya Huruf */}
          <div className="flex flex-col gap-2">
            <span className={`font-semibold uppercase tracking-wider text-[9px] ${THEMES[theme].muted}`}>Gaya Huruf</span>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(FONTS) as FontType[]).map((fKey) => (
                <button
                  key={fKey}
                  onClick={() => setFontType(fKey)}
                  className={`py-2 px-2.5 rounded-md border text-center transition-all cursor-pointer text-[10px] ${
                    fontType === fKey 
                      ? "bg-current/10 border-yellow-500 font-semibold" 
                      : "border-current/10 hover:bg-current/5"
                  }`}
                >
                  <span className={FONTS[fKey].className}>{FONTS[fKey].name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ukuran Huruf */}
          <div className="flex flex-col gap-2">
            <span className={`font-semibold uppercase tracking-wider text-[9px] ${THEMES[theme].muted}`}>Ukuran Huruf</span>
            <div className="flex items-center justify-between bg-current/5 border border-current/10 px-3 py-2 rounded-md">
              <button
                onClick={() => setFontSize(s => Math.max(14, s - 2))}
                disabled={fontSize <= 14}
                className="p-1 hover:bg-current/10 rounded-full transition-colors disabled:opacity-30 cursor-pointer text-current"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono font-medium">{fontSize}px</span>
              <button
                onClick={() => setFontSize(s => Math.min(32, s + 2))}
                disabled={fontSize >= 32}
                className="p-1 hover:bg-current/10 rounded-full transition-colors disabled:opacity-30 cursor-pointer text-current"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Jarak Baris */}
          <div className="flex flex-col gap-2">
            <span className={`font-semibold uppercase tracking-wider text-[9px] ${THEMES[theme].muted}`}>Jarak Baris</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(LINE_HEIGHTS) as LineHeightType[]).map((lhKey) => (
                <button
                  key={lhKey}
                  onClick={() => setLineHeight(lhKey)}
                  className={`py-2 rounded-md border text-center transition-all cursor-pointer text-[10px] ${
                    lineHeight === lhKey 
                      ? "bg-current/10 border-yellow-500 font-semibold" 
                      : "border-current/10 hover:bg-current/5"
                  }`}
                >
                  {LINE_HEIGHTS[lhKey].name}
                </button>
              ))}
            </div>
          </div>

          {/* Lebar Halaman */}
          <div className="flex flex-col gap-2">
            <span className={`font-semibold uppercase tracking-wider text-[9px] ${THEMES[theme].muted}`}>Lebar Halaman</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(PAGE_WIDTHS) as PageWidthType[]).map((pwKey) => (
                <button
                  key={pwKey}
                  onClick={() => setPageWidth(pwKey)}
                  className={`py-2 rounded-md border text-center transition-all cursor-pointer text-[10px] ${
                    pageWidth === pwKey 
                      ? "bg-current/10 border-yellow-500 font-semibold" 
                      : "border-current/10 hover:bg-current/5"
                  }`}
                >
                  {PAGE_WIDTHS[pwKey].name}
                </button>
              ))}
            </div>
          </div>

          {/* Perataan Teks */}
          <div className="flex flex-col gap-2">
            <span className={`font-semibold uppercase tracking-wider text-[9px] ${THEMES[theme].muted}`}>Perataan Teks</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setTextAlign("left")}
                className={`py-2 px-3 rounded-md border flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[10px] ${
                  textAlign === "left" 
                    ? "bg-current/10 border-yellow-500 font-semibold" 
                    : "border-current/10 hover:bg-current/5"
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>Rata Kiri</span>
              </button>
              <button
                onClick={() => setTextAlign("justify")}
                className={`py-2 px-3 rounded-md border flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[10px] ${
                  textAlign === "justify" 
                    ? "bg-current/10 border-yellow-500 font-semibold" 
                    : "border-current/10 hover:bg-current/5"
                }`}
              >
                <AlignJustify className="w-3.5 h-3.5" />
                <span>Rata Kanan-Kiri</span>
              </button>
            </div>
          </div>

          {/* Gulir Otomatis (Auto-Scroll) */}
          <div className="flex flex-col gap-2">
            <span className={`font-semibold uppercase tracking-wider text-[9px] ${THEMES[theme].muted}`}>Gulir Otomatis (Auto-Scroll)</span>
            <div className="grid grid-cols-4 gap-1">
              {([
                { val: 0, label: "Mati" },
                { val: 1, label: "Lambat" },
                { val: 2, label: "Sedang" },
                { val: 3, label: "Cepat" },
              ] as const).map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => {
                    setAutoScrollSpeed(opt.val);
                    if (opt.val > 0) {
                      stopTts();
                    }
                  }}
                  className={`py-2 rounded-md border text-center transition-all text-[10px] cursor-pointer ${
                    autoScrollSpeed === opt.val 
                      ? "bg-current/10 border-yellow-500 font-semibold" 
                      : "border-current/10 hover:bg-current/5"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Fokus & Mode Redup */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            {/* Mode Fokus */}
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`py-2 px-3 rounded-md border flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[10px] ${
                focusMode 
                  ? "bg-amber-500/10 border-amber-500 text-amber-500 font-semibold" 
                  : "border-current/10 hover:bg-current/5"
              }`}
              title="Fokus membaca paragraf aktif"
            >
              {focusMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Mode Fokus</span>
            </button>

            {/* Mode Redup */}
            <button
              onClick={() => setDimLevel(d => (d === 0 ? 20 : d === 20 ? 40 : d === 40 ? 60 : 0))}
              className={`py-2 px-3 rounded-md border flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[10px] ${
                dimLevel > 0 
                  ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 font-semibold" 
                  : "border-current/10 hover:bg-current/5"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Redup Mata</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
