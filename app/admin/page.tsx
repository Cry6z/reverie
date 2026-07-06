"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Story } from "../data/initialStories";
import AdminPanel from "@/components/AdminPanel";
import StarryBackdrop from "@/components/Landing/StarryBackdrop";
import { supabase } from "@/app/utils/supabaseClient";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loveLetterContent, setLoveLetterContent] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [stars, setStars] = useState<{ id: number; left: number; top: number; size: number; delay: number }[]>([]);
  const [siteSettings, setSiteSettings] = useState({
    mode: "auto" as "auto" | "open" | "closed",
    startHour: 19,
    endHour: 24,
  });

  // Check if session is already authenticated
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("admin_authenticated") === "true";
      setIsAuthenticated(isAuth);
    }
  }, []);

  // Handle password submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "reverieadmin123";
    
    if (passwordInput === correctPassword) {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Kata sandi yang Anda masukkan salah.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Starry backdrop generator
  useEffect(() => {
    const generatedStars = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
    }));
    setStars(generatedStars);
  }, []);

  // Fetch initial data from Supabase
  useEffect(() => {
    if (isAuthenticated !== true) return; // Skip fetching if not authenticated

    const fetchData = async () => {
      try {
        // Fetch Stories
        const { data: dbStories, error: storiesError } = await supabase
          .from("stories")
          .select("*")
          .order("created_at", { ascending: false });

        if (storiesError) throw storiesError;

        if (dbStories) {
          // Parse site settings
          const settingsStory = dbStories.find((s: any) => s.id === "site_settings");
          if (settingsStory) {
            try {
              const mode = settingsStory.excerpt as "auto" | "open" | "closed";
              const [startStr, endStr] = settingsStory.content.split("-");
              const start = parseInt(startStr, 10);
              const end = parseInt(endStr, 10);
              setSiteSettings({
                mode: mode || "auto",
                startHour: isNaN(start) ? 19 : start,
                endHour: isNaN(end) ? 24 : end
              });
            } catch (err) {
              console.error("Gagal parse site_settings:", err);
            }
          }

          // Filter out site_settings from list
          const publicStories = dbStories.filter((s: any) => s.id !== "site_settings");

          const mappedStories: Story[] = publicStories.map((s: any) => ({
            id: s.id,
            title: s.title,
            excerpt: s.excerpt,
            content: s.content,
            mood: s.mood,
            duration: s.duration,
            createdAt: s.created_at ? s.created_at.split("T")[0] : new Date().toISOString().split("T")[0]
          }));
          setStories(mappedStories);
        }

        // Fetch Love Letter
        const { data: dbLoveLetters, error: letterError } = await supabase
          .from("love_letters")
          .select("content")
          .order("created_at", { ascending: false })
          .limit(1);

        if (letterError) throw letterError;

        if (dbLoveLetters && dbLoveLetters.length > 0) {
          setLoveLetterContent(dbLoveLetters[0].content);
        }
      } catch (err) {
        console.error("Gagal sinkronisasi data admin dengan Supabase:", err);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Story CRUD Handlers
  const handleAddStory = async (newStoryData: Omit<Story, "id" | "createdAt">) => {
    const newStory: Story = {
      ...newStoryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0]
    };
    const updated = [newStory, ...stories];
    setStories(updated);

    try {
      const { error } = await supabase.from("stories").insert([{
        id: newStory.id,
        title: newStory.title,
        excerpt: newStory.excerpt,
        content: newStory.content,
        mood: newStory.mood,
        duration: newStory.duration,
        created_at: new Date().toISOString()
      }]);
      if (error) throw error;
    } catch (err) {
      console.error("Gagal menambahkan dongeng ke Supabase:", err);
    }
  };

  const handleEditStory = async (id: string, updatedFields: Partial<Story>) => {
    const updated = stories.map((story) => 
      story.id === id ? { ...story, ...updatedFields } : story
    );
    setStories(updated);

    try {
      const { error } = await supabase
        .from("stories")
        .update(updatedFields)
        .eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("Gagal memperbarui dongeng di Supabase:", err);
    }
  };

  const handleDeleteStory = async (id: string) => {
    const updated = stories.filter((story) => story.id !== id);
    setStories(updated);

    try {
      const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("Gagal menghapus dongeng dari Supabase:", err);
    }
  };

  const handleResetStories = async () => {
    setStories([]);
    try {
      const { error } = await supabase.from("stories").delete().neq("id", "0");
      if (error) throw error;
    } catch (err) {
      console.error("Gagal mereset database dongeng di Supabase:", err);
    }
  };

  // Love Letter Handler
  const handleSaveLoveLetter = async (content: string) => {
    setLoveLetterContent(content);
    try {
      const { error } = await supabase.from("love_letters").insert([{
        content,
        created_at: new Date().toISOString()
      }]);
      if (error) throw error;
    } catch (err) {
      console.error("Gagal menyimpan surat malam ke Supabase:", err);
    }
  };

  // Site Settings Handler
  const handleSaveSiteSettings = async (mode: "auto" | "open" | "closed", start: number, end: number) => {
    setSiteSettings({ mode, startHour: start, endHour: end });
    try {
      const { data: existing } = await supabase
        .from("stories")
        .select("id")
        .eq("id", "site_settings")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("stories")
          .update({
            excerpt: mode,
            content: `${start}-${end}`,
            created_at: new Date().toISOString()
          })
          .eq("id", "site_settings");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("stories")
          .insert([{
            id: "site_settings",
            title: "Site Settings",
            excerpt: mode,
            content: `${start}-${end}`,
            mood: "tenang",
            duration: 0,
            created_at: new Date().toISOString()
          }]);
        if (error) throw error;
      }
    } catch (err) {
      console.error("Gagal menyimpan pengaturan situs ke Supabase:", err);
    }
  };

  // Password screen when not authenticated
  if (isAuthenticated === false) {
    return (
      <main className="min-h-screen bg-background text-[#f4f4f5] relative flex flex-col items-center justify-center p-4 select-none overflow-hidden">
        {/* CSS Keyframes for Shake */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
          }
          .animate-shake {
            animation: shake 0.4s ease-in-out;
          }
        `}} />
        
        {/* Background Starry Sky */}
        <StarryBackdrop stars={stars} shootingStars={[]} />

        {/* Password Card Container */}
        <div className="relative z-10 w-full max-w-sm p-0.5 rounded-3xl bg-linear-to-b from-zinc-700/20 to-zinc-900/10 shadow-2xl">
          <div className={`bg-[#0c0a09]/90 backdrop-blur-xl p-8 rounded-[22px] flex flex-col gap-6 items-center border border-zinc-900/60 ${isShaking ? 'animate-shake' : ''}`}>
            
            {/* Logo/Icon Header */}
            <div className="w-12 h-12 rounded-full bg-linear-to-tr from-zinc-800/30 to-zinc-900/30 flex items-center justify-center border border-zinc-800 shadow-inner">
              <Lock className="w-4 h-4 text-zinc-300" />
            </div>

            {/* Title & Desc */}
            <div className="text-center flex flex-col gap-1.5">
              <h1 className="text-xl font-bold font-serif bg-linear-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Akses Terproteksi
              </h1>
              <p className="text-[11px] text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Halaman penulis dongeng dilindungi kata sandi. Silakan masukkan kata sandi Anda untuk melanjutkan.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handlePasswordSubmit} className="w-full flex flex-col gap-3">
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Kata Sandi Admin"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  className="w-full bg-[#141211] border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none transition-all duration-300 pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Error Message */}
              {passwordError && (
                <span className="text-[10px] text-red-400 text-center font-medium block">
                  {passwordError}
                </span>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-1 bg-white hover:bg-zinc-200 text-black font-semibold py-2.5 px-4 rounded-xl text-[10px] uppercase tracking-wider transition-all duration-300 shadow-md shadow-white/5 active:scale-[0.98] cursor-pointer"
              >
                Masuk
              </button>
            </form>

            {/* Back Button */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Loading check state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0d0c0b] text-white flex flex-col items-center justify-center select-none">
        <span className="text-xs text-zinc-500 animate-pulse">Memverifikasi sesi...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground relative flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Background Starry Sky */}
      <StarryBackdrop stars={stars} shootingStars={[]} />

      {/* Admin Panel Modal Canvas */}
      <AdminPanel
        stories={stories}
        onClose={() => router.push("/")}
        onAddStory={handleAddStory}
        onEditStory={handleEditStory}
        onDeleteStory={handleDeleteStory}
        onResetStories={handleResetStories}
        loveLetterContent={loveLetterContent}
        onSaveLoveLetter={handleSaveLoveLetter}
        siteSettings={siteSettings}
        onSaveSiteSettings={handleSaveSiteSettings}
      />
    </main>
  );

}
