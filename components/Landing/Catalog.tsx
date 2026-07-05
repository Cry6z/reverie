"use client";

import React from "react";
import { Search, HelpCircle, CheckCircle } from "lucide-react";
import { Story } from "@/app/data/initialStories";

interface CatalogProps {
  stories: Story[];
  filteredStories: Story[];
  readStories: string[];
  selectedMood: "all" | Story["mood"];
  setSelectedMood: (mood: "all" | Story["mood"]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isGridAnimating: boolean;
  onStoryClick: (story: Story) => void;
}

export default function Catalog({
  filteredStories,
  readStories,
  selectedMood,
  setSelectedMood,
  searchQuery,
  setSearchQuery,
  isGridAnimating,
  onStoryClick,
}: CatalogProps) {
  return (
    <main id="catalog-section" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-10 flex-1">
      
      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border-custom/30 pb-4 select-none">
        {/* Category / Mood Filter */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 order-2 md:order-1 items-center">
          {([
            { key: "all", label: "Semua Dongeng" },
            { key: "romantis", label: "Romantis" },
            { key: "tenang", label: "Tenang" },
            { key: "ajaib", label: "Ajaib" },
            { key: "lucu", label: "Lucu" },
          ] as const).map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedMood(filter.key)}
              className={`text-xs pb-2.5 transition-all cursor-pointer relative font-medium ${
                selectedMood === filter.key
                  ? "text-foreground font-semibold"
                  : "text-muted-custom hover:text-foreground"
              }`}
            >
              <span>{filter.label}</span>
              {selectedMood === filter.key && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#fff4d6] rounded-full drop-shadow-[0_0_8px_rgba(255,244,214,0.8)] fade-in" />
              )}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative flex items-center w-full md:w-56 order-1 md:order-2 border-b border-border-custom/80 focus-within:border-foreground/50 transition-colors pb-1.5 mb-1 md:mb-0">
          <Search className="w-3.5 h-3.5 text-muted-custom absolute left-0" />
          <input
            type="text"
            placeholder="Cari cerita tidur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-6 text-xs text-foreground placeholder:text-muted-custom/60 focus:outline-none"
          />
        </div>
      </div>

      {/* Stories Grid - Editorial modern cards style (with smooth grid entrance transition) */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ease-out transform ${
        isGridAnimating ? "opacity-0 translate-y-4 scale-[0.985] pointer-events-none" : "opacity-100 translate-y-0 scale-100"
      }`}>
        {filteredStories.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-border-custom rounded-2xl bg-card-bg">
            <HelpCircle className="w-10 h-10 text-muted-custom mx-auto mb-2" />
            <p className="text-sm font-serif font-bold text-foreground">
              Dongeng tidak ditemukan
            </p>
            <p className="text-xs text-muted-custom mt-1">
              Mungkin ceritanya sedang ditulis. Coba kata kunci atau kategori lainnya.
            </p>
          </div>
        ) : (
          filteredStories.map((story, index) => {
            const isRead = readStories.includes(story.id);
            return (
              <div
                key={story.id}
                onClick={() => onStoryClick(story)}
                className="group relative bg-[#151413]/30 border border-white/5 p-6 rounded-2xl flex flex-col justify-between min-h-[230px] cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:bg-[#151413]/65 hover:border-yellow-500/20 hover:shadow-[0_15px_40px_rgba(253,224,71,0.02)] overflow-hidden shadow-lg"
              >
                {/* Faint Chapter Number in Background */}
                <div className="absolute right-4 bottom-2 text-8xl font-serif font-black text-white/2 group-hover:text-yellow-500/4 transition-colors select-none leading-none pointer-events-none">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Card Header Info */}
                <div className="flex justify-between items-center select-none z-10 pointer-events-none">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#fff4d6]/60 bg-[#fff4d6]/5 px-2.5 py-1 rounded-md border border-[#fff4d6]/10">
                    {story.mood}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-custom">
                      {Math.max(1, Math.ceil((story.content || "").trim().split(/\s+/).filter(Boolean).length / 180))} Min Baca
                    </span>
                    {isRead && (
                      <CheckCircle className="w-4 h-4 text-green-500/80 fill-background animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Card Body content */}
                <div className="mt-4 flex flex-col gap-2 z-10 pointer-events-none">
                  <h3 className="text-base font-serif font-bold text-white group-hover:text-[#fff4d6] transition-colors line-clamp-1">
                    {story.title}
                  </h3>
                  <p className="text-xs text-muted-custom leading-relaxed line-clamp-3">
                    {story.excerpt}
                  </p>
                </div>

                {/* Card Footer Progress/Accent line */}
                <div className="mt-6 flex justify-between items-center z-10 select-none">
                  <div className="w-6 h-[1.5px] bg-[#fff4d6]/20 group-hover:w-16 group-hover:bg-[#fff4d6]/60 transition-all duration-500 pointer-events-none" />
                  <span className="text-[9px] font-bold tracking-wider uppercase text-muted-custom/0 group-hover:text-muted-custom/60 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0 pointer-events-none">
                    Baca Dongeng
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
