"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Story } from "../data/initialStories";
import AdminPanel from "@/components/AdminPanel";
import StarryBackdrop from "@/components/Landing/StarryBackdrop";
import { supabase } from "@/app/utils/supabaseClient";

export default function AdminPage() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loveLetterContent, setLoveLetterContent] = useState("");
  const [isLocalhost, setIsLocalhost] = useState<boolean | null>(null);
  const [stars, setStars] = useState<{ id: number; left: number; top: number; size: number; delay: number }[]>([]);
  const [siteSettings, setSiteSettings] = useState({
    mode: "auto" as "auto" | "open" | "closed",
    startHour: 19,
    endHour: 24,
  });

  // Check if access is from localhost
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const isLocal = 
        hostname === "localhost" || 
        hostname === "127.0.0.1" || 
        hostname === "::1" || 
        hostname.startsWith("192.168.");
      setIsLocalhost(isLocal);
    }
  }, []);

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
    if (isLocalhost === false) return; // Skip fetching if access denied

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
  }, [isLocalhost]);

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

  // Render Access Denied for non-localhost
  if (isLocalhost === false) {
    return (
      <div className="min-h-screen bg-[#0d0c0b] text-white flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="max-w-md w-full border border-red-950/40 bg-red-950/10 backdrop-blur-md p-8 rounded-3xl shadow-xl flex flex-col gap-4 items-center">
          <span className="text-red-500 font-bold uppercase tracking-widest text-xs">Akses Ditolak</span>
          <h1 className="text-xl font-bold font-serif">Hanya Dapat Diakses Via Localhost</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Untuk alasan keamanan, halaman penulis dongeng (admin panel) hanya dapat diakses melalui koneksi lokal (localhost).
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-2 bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Kembali Ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Loading check state
  if (isLocalhost === null) {
    return (
      <div className="min-h-screen bg-[#0d0c0b] text-white flex flex-col items-center justify-center select-none">
        <span className="text-xs text-muted-custom animate-pulse">Memeriksa hak akses...</span>
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
