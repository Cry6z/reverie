import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, RotateCcw, AlertTriangle, Search } from "lucide-react";
import { Story } from "@/app/data/initialStories";

interface StoryTabProps {
  stories: Story[];
  onAddStory: (story: Omit<Story, "id" | "createdAt">) => void;
  onEditStory: (id: string, story: Partial<Story>) => void;
  onDeleteStory: (id: string) => void;
  onResetStories: () => void;
  triggerSuccess: (msg: string) => void;
}

export default function StoryTab({
  stories,
  onAddStory,
  onEditStory,
  onDeleteStory,
  onResetStories,
  triggerSuccess,
}: StoryTabProps) {
  const [storySearchQuery, setStorySearchQuery] = useState("");
  
  // Story Form states
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Story["mood"]>("tenang");
  const [duration, setDuration] = useState<number>(3);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);

  // Auto-estimate reading duration based on word count (180 WPM)
  useEffect(() => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const estimated = Math.max(1, Math.ceil(wordCount / 180));
    setDuration(estimated);
  }, [content]);

  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content) return;

    if (editingStoryId) {
      onEditStory(editingStoryId, {
        title,
        excerpt,
        content,
        mood,
        duration,
      });
      triggerSuccess("Dongeng berhasil diperbarui!");
    } else {
      onAddStory({
        title,
        excerpt,
        content,
        mood,
        duration,
      });
      triggerSuccess("Dongeng baru berhasil ditambahkan!");
    }

    handleCancelStoryEdit();
  };

  const handleStartStoryEdit = (story: Story) => {
    setEditingStoryId(story.id);
    setTitle(story.title);
    setExcerpt(story.excerpt);
    setContent(story.content);
    setMood(story.mood);
    setDuration(story.duration);
  };

  const handleCancelStoryEdit = () => {
    setEditingStoryId(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setMood("tenang");
    setDuration(3);
  };

  const handleDeleteStoryClick = (id: string, storyTitle: string) => {
    if (confirm(`Apakah kamu yakin ingin menghapus dongeng "${storyTitle}"?`)) {
      onDeleteStory(id);
      triggerSuccess("Dongeng berhasil dihapus!");
      if (editingStoryId === id) {
        handleCancelStoryEdit();
      }
    }
  };

  const handleResetStoriesClick = () => {
    if (confirm("Reset seluruh database dongeng? Semua dongeng tambahan Anda sendiri akan dihapus.")) {
      onResetStories();
      triggerSuccess("Database dongeng berhasil direset!");
      handleCancelStoryEdit();
    }
  };

  const filteredStories = stories.filter(s => 
    s.title.toLowerCase().includes(storySearchQuery.toLowerCase()) || 
    s.excerpt.toLowerCase().includes(storySearchQuery.toLowerCase()) ||
    s.mood.toLowerCase().includes(storySearchQuery.toLowerCase())
  );

  return (
    <>
      {/* Left Column: Story List (Compact) */}
      <section className="w-full md:w-[330px] lg:w-[380px] shrink-0 border-b md:border-b-0 md:border-r border-white/5 flex flex-col bg-black/10 select-none">
        
        {/* Search & Actions Bar */}
        <div className="p-5 flex flex-col gap-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">
              Koleksi Cerita ({stories.length})
            </span>
            <button
              type="button"
              onClick={handleResetStoriesClick}
              className="text-[9px] text-white/40 hover:text-[#fff4d6] flex items-center gap-1 transition-all py-1 px-2.5 border border-white/10 rounded-lg bg-white/2 hover:bg-white/8 cursor-pointer"
              title="Reset database cerita ke setelan awal"
            >
              <RotateCcw className="w-3 h-3 opacity-60" />
              <span>Reset</span>
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative flex items-center bg-black/20 border border-white/5 focus-within:border-[#fff4d6]/30 rounded-xl transition-all duration-300">
            <Search className="w-3.5 h-3.5 text-white/30 absolute left-4" />
            <input
              type="text"
              placeholder="Cari dongeng..."
              value={storySearchQuery}
              onChange={(e) => setStorySearchQuery(e.target.value)}
              className="w-full bg-transparent pl-10 pr-4 py-2.5 text-[11px] focus:outline-none text-white placeholder:text-white/20 font-medium"
            />
          </div>
 
          {/* Add Story Button Trigger */}
          <button
            type="button"
            onClick={handleCancelStoryEdit}
            className={`w-full py-2.5 rounded-xl border border-dashed text-[10px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              editingStoryId === null
                ? "border-[#fff4d6]/40 bg-[#fff4d6]/5 text-[#fff4d6] shadow-[0_4px_15px_rgba(255,244,214,0.05)] border-solid"
                : "border-white/10 bg-white/5 text-white/70 hover:border-white/35 hover:text-white"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tulis Dongeng Baru</span>
          </button>
        </div>
 
        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 scrollbar-thin">
          {filteredStories.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/1">
              <AlertTriangle className="w-6 h-6 text-white/20 mx-auto mb-2" />
              <p className="text-[11px] text-white/30 font-medium">Tidak ada cerita ditemukan.</p>
            </div>
          ) : (
            filteredStories.map((story) => (
              <div
                key={story.id}
                onClick={() => handleStartStoryEdit(story)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center gap-3 relative group ${
                  editingStoryId === story.id 
                    ? "bg-[#fff4d6]/5 border-[#fff4d6]/35 shadow-inner" 
                    : "bg-white/1 border-white/5 hover:border-white/10 hover:bg-white/3"
                }`}
              >
                {/* Active Indicator Accent Line */}
                {editingStoryId === story.id && (
                  <div className="absolute left-0 top-3 bottom-3 w-[2.5px] bg-[#fff4d6] rounded-r" />
                )}

                <div className="flex-1 min-w-0 flex flex-col gap-1 select-none pointer-events-none text-left pl-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      story.mood === "romantis" ? "bg-red-400" :
                      story.mood === "ajaib" ? "bg-purple-400" :
                      story.mood === "lucu" ? "bg-yellow-400" : "bg-teal-400"
                    }`} />
                    <span className="text-[8px] font-bold tracking-widest text-white/35 capitalize">
                      {story.mood} • {story.duration} Menit
                    </span>
                  </div>
                  <h4 className={`text-[12px] font-serif font-bold truncate tracking-wide ${
                    editingStoryId === story.id ? "text-[#fff4d6]" : "text-white/85"
                  }`}>
                    {story.title}
                  </h4>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStoryClick(story.id, story.title);
                  }}
                  className="p-1.5 hover:bg-red-500/10 text-white/20 hover:text-red-400 rounded-lg transition-colors cursor-pointer shrink-0 opacity-80 md:opacity-0 group-hover:opacity-100"
                  title="Hapus Dongeng"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
 
      {/* Right Column: Story Editor Canvas */}
      <section className="flex-1 overflow-y-auto p-8 md:p-10 lg:p-12 flex flex-col bg-[#0e0d0c]/40 scrollbar-thin">
        <div className="max-w-2xl w-full flex flex-col gap-6">
          <div className="flex flex-col select-none text-left border-b border-white/5 pb-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Kanvas Menulis</span>
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2 mt-0.5">
              {editingStoryId ? <Edit2 className="w-4 h-4 text-[#fff4d6]" /> : <Plus className="w-4 h-4 text-green-400" />}
              <span>{editingStoryId ? `Edit: ${title || "Judul"}` : "Tulis Dongeng Baru"}</span>
            </h2>
          </div>
 
          <form onSubmit={handleSaveStory} className="flex flex-col gap-5 select-text text-left">
            
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-bold tracking-widest uppercase text-white/40 select-none">Judul Cerita</label>
              <input
                type="text"
                placeholder="Masukkan judul dongeng..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/25 border border-white/5 focus:border-[#fff4d6]/40 focus:bg-black/40 focus:ring-4 focus:ring-[#fff4d6]/5 px-4 py-3 rounded-xl text-xs focus:outline-none text-white transition-all placeholder:text-white/10 font-bold font-serif"
                required
              />
            </div>
 
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-bold tracking-widest uppercase text-white/40 select-none">Ringkasan Kutipan (Tampil di beranda)</label>
              <input
                type="text"
                placeholder="Ketik kutipan sinopsis singkat..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-black/25 border border-white/5 focus:border-[#fff4d6]/40 focus:bg-black/40 focus:ring-4 focus:ring-[#fff4d6]/5 px-4 py-3 rounded-xl text-xs focus:outline-none text-white transition-all placeholder:text-white/10"
                required
              />
            </div>
 
            <div className="grid grid-cols-2 gap-4 select-none">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold tracking-widest uppercase text-white/40">Kategori Mood</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value as Story["mood"])}
                  className="w-full bg-black/25 border border-white/5 focus:border-[#fff4d6]/40 focus:bg-black/40 focus:ring-4 focus:ring-[#fff4d6]/5 px-4 py-3 rounded-xl text-xs focus:outline-none text-white transition-all cursor-pointer font-semibold"
                >
                  <option value="tenang" className="bg-[#121110] text-white">Tenang</option>
                  <option value="romantis" className="bg-[#121110] text-white">Romantis</option>
                  <option value="ajaib" className="bg-[#121110] text-white">Ajaib</option>
                  <option value="lucu" className="bg-[#121110] text-white">Lucu</option>
                </select>
              </div>
 
              <div className="flex flex-col gap-2 opacity-75">
                <label className="text-[9px] font-bold tracking-widest uppercase text-white/40 select-none">Estimasi Baca (Menit)</label>
                <input
                  type="text"
                  value={`${duration} Menit (Dihitung Otomatis)`}
                  readOnly
                  className="w-full bg-black/15 border border-white/5 px-4 py-3 rounded-xl text-xs text-white/60 font-medium select-none cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>
 
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center select-none">
                <label className="text-[9px] font-bold tracking-widest uppercase text-white/40">Isi Dongeng Utama</label>
                <span className="text-[8px] opacity-30 italic">Gunakan baris kosong ganda (Enter 2x) untuk paragraf baru.</span>
              </div>
              <textarea
                placeholder="Mulai menulis kisah ajaibmu di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={11}
                className="w-full bg-black/25 border border-white/5 focus:border-[#fff4d6]/40 focus:bg-black/40 focus:ring-4 focus:ring-[#fff4d6]/5 p-4 rounded-xl text-[13px] focus:outline-none text-white transition-all placeholder:text-white/10 font-serif leading-relaxed"
                required
              />
            </div>
 
            <div className="flex items-center gap-3 pt-3 select-none">
              <button
                type="submit"
                className="bg-[#fff4d6] hover:bg-[#ffe3a8] text-[#0d0c0b] px-6 py-3 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all active:scale-[0.97] cursor-pointer shadow-md shadow-yellow-500/5 hover:shadow-yellow-500/10"
              >
                {editingStoryId ? "Perbarui Cerita" : "Simpan & Terbitkan"}
              </button>
 
              {editingStoryId && (
                <button
                  type="button"
                  onClick={handleCancelStoryEdit}
                  className="bg-transparent border border-white/10 text-white/70 hover:text-white hover:bg-white/5 px-6 py-3 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer"
                >
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
