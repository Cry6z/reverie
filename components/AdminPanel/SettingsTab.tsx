"use client";

import React, { useState, useEffect } from "react";
import { Settings, Clock, Eye, EyeOff, Save, ShieldAlert } from "lucide-react";

interface SettingsTabProps {
  siteSettings: {
    mode: "auto" | "open" | "closed";
    startHour: number;
    endHour: number;
  };
  onSaveSiteSettings: (
    mode: "auto" | "open" | "closed",
    startHour: number,
    endHour: number
  ) => void;
  triggerSuccess: (msg: string) => void;
}

export default function SettingsTab({
  siteSettings,
  onSaveSiteSettings,
  triggerSuccess,
}: SettingsTabProps) {
  const [mode, setMode] = useState<"auto" | "open" | "closed">("auto");
  const [startHour, setStartHour] = useState(19);
  const [endHour, setEndHour] = useState(24);

  // Sync from props
  useEffect(() => {
    if (siteSettings) {
      setMode(siteSettings.mode);
      setStartHour(siteSettings.startHour);
      setEndHour(siteSettings.endHour);
    }
  }, [siteSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSiteSettings(mode, startHour, endHour);
    triggerSuccess("Pengaturan situs berhasil disimpan!");
  };

  // Generate hour options 0-23
  const hoursList = Array.from({ length: 24 }).map((_, i) => ({
    value: i,
    label: `${String(i).padStart(2, "0")}:00`,
  }));

  // Generate hour options for end time (can include 24 for midnight)
  const endHoursList = Array.from({ length: 25 }).map((_, i) => ({
    value: i === 0 ? 24 : i, // map 0 to 24 for ease, or keep index
    label: i === 24 || i === 0 ? "00:00 (Tengah Malam)" : `${String(i).padStart(2, "0")}:00`,
  }));

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 text-white bg-black/10">
      <form onSubmit={handleSubmit} className="max-w-2xl w-full mx-auto flex flex-col gap-8">
        
        {/* Intro */}
        <div className="flex flex-col gap-1.5 text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#fff4d6]/60">Konfigurasi Akses</span>
          <h2 className="text-xl font-bold font-serif flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-300" />
            <span>Pengaturan Website</span>
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Atur status operasional website. Kamu bisa memilih untuk mengotomatisasi jam buka website atau menguncinya secara manual.
          </p>
        </div>

        {/* Mode Selector Cards */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold tracking-wider uppercase text-zinc-400 text-left">
            Mode Akses Website
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Auto Schedule Card */}
            <button
              type="button"
              onClick={() => setMode("auto")}
              className={`p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer select-none ${
                mode === "auto"
                  ? "border-amber-300/40 bg-amber-300/5 shadow-[0_4px_20px_rgba(252,211,77,0.05)]"
                  : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
              }`}
            >
              <div className={`p-2 rounded-xl w-fit ${mode === "auto" ? "bg-amber-300/10 text-amber-300" : "bg-white/5 text-zinc-400"}`}>
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-white">Sesuai Jadwal</span>
                <span className="text-[10px] text-zinc-400 leading-normal">
                  Situs hanya dapat diakses pada jam malam yang dikonfigurasi.
                </span>
              </div>
            </button>

            {/* Always Open Card */}
            <button
              type="button"
              onClick={() => setMode("open")}
              className={`p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer select-none ${
                mode === "open"
                  ? "border-green-500/40 bg-green-500/5 shadow-[0_4px_20px_rgba(34,197,94,0.05)]"
                  : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
              }`}
            >
              <div className={`p-2 rounded-xl w-fit ${mode === "open" ? "bg-green-500/10 text-green-400" : "bg-white/5 text-zinc-400"}`}>
                <Eye className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-white">Selalu Terbuka</span>
                <span className="text-[10px] text-zinc-400 leading-normal">
                  Situs terbuka 24 jam untuk dibaca pengunjung kapan saja.
                </span>
              </div>
            </button>

            {/* Always Closed Card */}
            <button
              type="button"
              onClick={() => setMode("closed")}
              className={`p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer select-none ${
                mode === "closed"
                  ? "border-red-500/40 bg-red-500/5 shadow-[0_4px_20px_rgba(239,68,68,0.05)]"
                  : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
              }`}
            >
              <div className={`p-2 rounded-xl w-fit ${mode === "closed" ? "bg-red-500/10 text-red-400" : "bg-white/5 text-zinc-400"}`}>
                <EyeOff className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-white">Selalu Tertutup</span>
                <span className="text-[10px] text-zinc-400 leading-normal">
                  Situs ditutup total dan langsung menampilkan layar tidur.
                </span>
              </div>
            </button>

          </div>
        </div>

        {/* Schedule Inputs (Only shown if mode === auto) */}
        {mode === "auto" && (
          <div className="p-5 border border-white/5 bg-white/5 rounded-2xl flex flex-col gap-4 animate-fade-in text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300/80 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Jadwal Operasional Harian</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Start Hour */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                  Jam Buka (Mulai)
                </label>
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(parseInt(e.target.value, 10))}
                  className="bg-[#121110] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-300 transition-colors"
                >
                  {hoursList.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* End Hour */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                  Jam Tutup (Selesai)
                </label>
                <select
                  value={endHour === 0 ? 24 : endHour}
                  onChange={(e) => setEndHour(parseInt(e.target.value, 10))}
                  className="bg-[#121110] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-300 transition-colors"
                >
                  {endHoursList.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>
            
            <span className="text-[10px] text-zinc-500 italic mt-1 leading-normal">
              * Jam operasional menggunakan waktu lokal perangkat pengunjung. Rekomendasi: Jam 19:00 - 00:00 (7 Malam - 12 Malam).
            </span>
          </div>
        )}

        {/* Warning Indicator when Site is Closed */}
        {mode === "closed" && (
          <div className="p-4 bg-red-950/10 border border-red-950/30 text-red-300/80 rounded-2xl flex gap-3 text-left items-start">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold">Perhatian</span>
              <span className="text-[10px] leading-relaxed">
                Memilih mode &quot;Selalu Tertutup&quot; akan langsung memblokir akses ke halaman utama website bagi semua pengunjung biasa dan menggantinya dengan layar astronomi tidur.
              </span>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button
          type="submit"
          className="mt-2 bg-[#fff4d6] hover:bg-[#fff4d6]/95 text-[#0d0c0b] font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2 justify-center w-full sm:w-fit self-end shadow-lg active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Konfigurasi</span>
        </button>

      </form>
    </div>
  );
}
