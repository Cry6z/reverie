import React from "react";
import { ThemeType, FontType, LineHeightType, PageWidthType } from "@/app/types/reader";

export const THEMES: Record<ThemeType, {
  name: string;
  bg: string;
  text: string;
  muted: string;
  border: string;
  dropCap: string;
  accent: string;
  card: string;
  headerBg: string;
  accentBtn: string;
  tooltipBg: string;
}> = {
  "cozy-night": {
    name: "Malam Tenang",
    bg: "bg-[#161513]",
    text: "text-[#e4e4e7]",
    muted: "text-[#8e8e93]",
    border: "border-[#27272a]/70",
    dropCap: "text-[#fff4d6] drop-shadow-[0_2px_8px_rgba(255,244,214,0.35)]",
    accent: "bg-white/5 hover:bg-white/10 text-white border-white/10",
    card: "bg-white/5",
    headerBg: "bg-[#161513]/90 backdrop-blur-md",
    accentBtn: "bg-[#fff4d6] text-[#161513] hover:bg-[#ffe3a8]",
    tooltipBg: "bg-[#1f1e1c] text-[#e4e4e7] border-[#27272a]",
  },
  midnight: {
    name: "Gelap Gulita",
    bg: "bg-[#000000]",
    text: "text-[#d4d4d8]",
    muted: "text-[#71717a]",
    border: "border-[#18181b]",
    dropCap: "text-[#ffffff] drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]",
    accent: "bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 border-zinc-800",
    card: "bg-zinc-900/30",
    headerBg: "bg-black/90 backdrop-blur-md",
    accentBtn: "bg-white text-black hover:bg-zinc-200",
    tooltipBg: "bg-zinc-950 text-zinc-300 border-zinc-850",
  },
  sepia: {
    name: "Sepia Klasik",
    bg: "bg-[#f4ecd8]",
    text: "text-[#433422]",
    muted: "text-[#7d654a]",
    border: "border-[#e5d7ba]",
    dropCap: "text-[#8c5a3c] drop-shadow-[0_2px_6px_rgba(140,90,60,0.2)]",
    accent: "bg-[#8c5a3c]/5 hover:bg-[#8c5a3c]/10 text-[#8c5a3c] border-[#8c5a3c]/20",
    card: "bg-[#eae0c8]",
    headerBg: "bg-[#f4ecd8]/95 backdrop-blur-md",
    accentBtn: "bg-[#8c5a3c] text-[#f4ecd8] hover:bg-[#73482f]",
    tooltipBg: "bg-[#eaddc2] text-[#433422] border-[#d8c59f]",
  },
  forest: {
    name: "Hutan Teduh",
    bg: "bg-[#0f1912]",
    text: "text-[#d1e2d6]",
    muted: "text-[#6e8a77]",
    border: "border-[#1d2f23]",
    dropCap: "text-[#86efac] drop-shadow-[0_2px_8px_rgba(134,239,172,0.35)]",
    accent: "bg-[#86efac]/5 hover:bg-[#86efac]/10 text-[#86efac] border-[#86efac]/20",
    card: "bg-[#16241a]",
    headerBg: "bg-[#0f1912]/90 backdrop-blur-md",
    accentBtn: "bg-[#86efac] text-[#0f1912] hover:bg-[#6ee7b7]",
    tooltipBg: "bg-[#142319] text-[#d1e2d6] border-[#1d2f23]",
  },
  "soft-light": {
    name: "Terang Lembut",
    bg: "bg-[#fbfaf7]",
    text: "text-[#27272a]",
    muted: "text-[#71717a]",
    border: "border-[#e4e4e7]",
    dropCap: "text-[#b45309] drop-shadow-[0_2px_6px_rgba(180,83,9,0.15)]",
    accent: "bg-[#b45309]/5 hover:bg-[#b45309]/10 text-[#b45309] border-[#b45309]/20",
    card: "bg-[#f4f2ed]",
    headerBg: "bg-[#fbfaf7]/95 backdrop-blur-md",
    accentBtn: "bg-[#b45309] text-[#fbfaf7] hover:bg-[#92400e]",
    tooltipBg: "bg-[#f3f0e8] text-[#27272a] border-[#e4e4e7]",
  },
};

export const FONTS: Record<FontType, {
  name: string;
  className: string;
  style: React.CSSProperties;
}> = {
  serif: {
    name: "Lora Serif",
    className: "font-serif",
    style: {},
  },
  sans: {
    name: "Jakarta Sans",
    className: "font-sans",
    style: {},
  },
  handwriting: {
    name: "Aksara Indah",
    className: "font-handwriting tracking-wide",
    style: {},
  },
  mono: {
    name: "Monospace",
    className: "font-mono text-[0.92em] tracking-tight",
    style: {},
  },
  dyslexic: {
    name: "Disleksia Helper",
    className: "font-sans font-medium",
    style: {
      letterSpacing: "0.06em",
      wordSpacing: "0.18em",
    },
  },
};

export const LINE_HEIGHTS: Record<LineHeightType, { name: string; value: number }> = {
  normal: { name: "Rapat", value: 1.55 },
  cozy: { name: "Sedang", value: 1.85 },
  airy: { name: "Renggang", value: 2.25 },
};

export const PAGE_WIDTHS: Record<PageWidthType, { name: string; className: string }> = {
  narrow: { name: "Sempit", className: "max-w-md" },
  medium: { name: "Sedang", className: "max-w-2xl" },
  wide: { name: "Lebar", className: "max-w-4xl" },
};
