"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Key } from "lucide-react";
import { Story } from "./data/initialStories";
import StoryReader from "@/components/StoryReader";

import WelcomeScreen from "@/components/WelcomeScreen";
import { supabase } from "@/app/utils/supabaseClient";
import SleepingScreen from "@/components/Landing/SleepingScreen";

// Sub-components
import StarryBackdrop from "@/components/Landing/StarryBackdrop";
import Navbar from "@/components/Landing/Navbar";
import Hero from "@/components/Landing/Hero";
import Catalog from "@/components/Landing/Catalog";
import LoveLetterModal from "@/components/Landing/LoveLetterModal";
import DestinyLoader from "@/components/Landing/DestinyLoader";

interface ShootingStar {
  id: number;
  top: number;
  right: number;
  scale: number;
  duration: number;
}

export default function Home() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [readStories, setReadStories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<"all" | Story["mood"]>("all");

  // Welcome & Unlock states
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [ceweName, setCeweName] = useState("");
  const [isLocalhost, setIsLocalhost] = useState(false);

  // Site scheduling settings
  const [siteMode, setSiteMode] = useState<"auto" | "open" | "closed">("auto");
  const [startHour, setStartHour] = useState(19); // 7 PM
  const [endHour, setEndHour] = useState(24); // 12 AM
  const [isSiteOpen, setIsSiteOpen] = useState(true);

  // Monitor site open/closed status based on schedule & settings
  useEffect(() => {
    const checkOpenStatus = () => {
      if (siteMode === "open") {
        setIsSiteOpen(true);
      } else if (siteMode === "closed") {
        setIsSiteOpen(false);
      } else {
        // Mode is "auto"
        const now = new Date();
        const currentHour = now.getHours();
        
        if (startHour <= endHour) {
          setIsSiteOpen(currentHour >= startHour && currentHour < endHour);
        } else {
          // Overnight schedule, e.g. 19:00 - 02:00
          setIsSiteOpen(currentHour >= startHour || currentHour < endHour);
        }
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 5000);
    return () => clearInterval(interval);
  }, [siteMode, startHour, endHour]);

  // Modal states
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  // Love Letter states
  const [showLoveLetter, setShowLoveLetter] = useState(false);
  const [loveLetterContent, setLoveLetterContent] = useState("");

  // Destiny Selection Loader states
  const [randomLoading, setRandomLoading] = useState(false);
  const [isLoadingFadeout, setIsLoadingFadeout] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState("");

  // Loader timer refs
  const loaderFadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loaderDoneTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hero Parallax, dynamic lights, and grid animation states
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isGridAnimating, setIsGridAnimating] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);


  // Backdrops
  const [stars, setStars] = useState<{ id: number; left: number; top: number; size: number; delay: number }[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  // Load initial data
  useEffect(() => {
    // 0. Check if running on localhost
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setIsLocalhost(
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1" ||
        hostname.startsWith("192.168.")
      );
    }

    // 0.5. Check if already welcomed in this tab session (prevents welcome screen on refresh!)
    const isSessionWelcomed = sessionStorage.getItem("reverie_session_welcomed") === "true";
    if (isSessionWelcomed) {
      setIsUnlocked(true);
    }

    // 0.7. Site settings local fallback
    const savedSettings = localStorage.getItem("reverie_site_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSiteMode(parsed.mode || "auto");
        setStartHour(parsed.startHour !== undefined ? parsed.startHour : 19);
        setEndHour(parsed.endHour !== undefined ? parsed.endHour : 24);
      } catch (e) {}
    }

    // 1. Stories local fallback
    const savedStories = localStorage.getItem("reverie_stories");
    if (savedStories) {
      try {
        setStories(JSON.parse(savedStories));
      } catch (e) {
        setStories([]);
      }
    } else {
      setStories([]);
    }

    // 2. Read stories
    const savedRead = localStorage.getItem("reverie_read_stories");
    if (savedRead) {
      try {
        setReadStories(JSON.parse(savedRead));
      } catch (e) { }
    }

    // 4. Name
    const savedName = localStorage.getItem("reverie_cewe_name");
    if (savedName) {
      setCeweName(savedName);
    }

    // 4.5. Love Letter local fallback
    const savedLetter = localStorage.getItem("reverie_love_letter");
    if (savedLetter) {
      setLoveLetterContent(savedLetter);
    }

    // 5. Starry Sky generation
    const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.8 + 0.6,
      delay: Math.random() * 5,
    }));
    setStars(generatedStars);

    // Fetch from Supabase asynchronously to update state
    const fetchSupabaseData = async () => {
      try {
        // Fetch Stories
        const { data: dbStories, error: storiesError } = await supabase
          .from("stories")
          .select("*")
          .order("created_at", { ascending: false });

        if (storiesError) throw storiesError;

        if (dbStories) {
          // Find settings row
          const settingsStory = dbStories.find((s: any) => s.id === "site_settings");
          if (settingsStory) {
            try {
              const mode = settingsStory.excerpt as "auto" | "open" | "closed";
              const [startStr, endStr] = settingsStory.content.split("-");
              const start = parseInt(startStr, 10);
              const end = parseInt(endStr, 10);

              setSiteMode(mode);
              setStartHour(isNaN(start) ? 19 : start);
              setEndHour(isNaN(end) ? 24 : end);

              localStorage.setItem("reverie_site_settings", JSON.stringify({
                mode,
                startHour: isNaN(start) ? 19 : start,
                endHour: isNaN(end) ? 24 : end
              }));
            } catch (err) {
              console.error("Gagal parse site_settings:", err);
            }
          }

          // Filter out site_settings from stories list
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
          localStorage.setItem("reverie_stories", JSON.stringify(mappedStories));
        }

        // Fetch Love Letter
        const { data: dbLoveLetters, error: letterError } = await supabase
          .from("love_letters")
          .select("content")
          .order("created_at", { ascending: false })
          .limit(1);

        if (letterError) throw letterError;

        if (dbLoveLetters && dbLoveLetters.length > 0) {
          const letter = dbLoveLetters[0].content;
          setLoveLetterContent(letter);
          localStorage.setItem("reverie_love_letter", letter);
        }
      } catch (err) {
        console.error("Gagal sinkronisasi data dengan Supabase, menggunakan data lokal:", err);
      }
    };

    fetchSupabaseData();
  }, []);

  // 6. Shooting star randomized generator (5 stars in 10s = 1 star every 2s)
  useEffect(() => {
    const interval = setInterval(() => {
      const newStar: ShootingStar = {
        id: Math.random(),
        top: Math.random() * 35, // top 0% to 35%
        right: Math.random() * 60 + 10, // right 10% to 70%
        scale: Math.random() * 0.7 + 0.4, // scale 0.4 to 1.1
        duration: Math.random() * 0.8 + 1.2, // duration 1.2s to 2.0s
      };

      setShootingStars((prev) => [...prev.slice(-8), newStar]); // Keep last 8 to avoid leaks
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleUnlock = (name: string) => {
    setCeweName(name);
    setIsUnlocked(true);
    sessionStorage.setItem("reverie_session_welcomed", "true");
  };

  // Admin Story Actions
  const handleAddStory = async (newStoryData: Omit<Story, "id" | "createdAt">) => {
    const newStory: Story = {
      ...newStoryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0]
    };
    const updated = [newStory, ...stories];
    setStories(updated);
    localStorage.setItem("reverie_stories", JSON.stringify(updated));

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
    localStorage.setItem("reverie_stories", JSON.stringify(updated));

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
    localStorage.setItem("reverie_stories", JSON.stringify(updated));

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
    localStorage.setItem("reverie_stories", JSON.stringify([]));

    try {
      // Clear all stories from Supabase
      const { error } = await supabase.from("stories").delete().neq("id", "0");
      if (error) throw error;
    } catch (err) {
      console.error("Gagal mereset database dongeng di Supabase:", err);
    }
  };


  const handleSaveLoveLetter = async (content: string) => {
    setLoveLetterContent(content);
    localStorage.setItem("reverie_love_letter", content);

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

  // Mark Story Read Status
  const handleMarkRead = (storyId: string) => {
    if (!readStories.includes(storyId)) {
      const updated = [...readStories, storyId];
      setReadStories(updated);
      localStorage.setItem("reverie_read_stories", JSON.stringify(updated));
    }
  };

  const bedtimeQuotes = [
    "Bintang-bintang sedang merajut kisah terindah untuk menemani tidurmu...",
    "Menyaring mimpi buruk, menyisakan dongeng paling manis sebelum matamu terpejam...",
    "Angin malam sedang berbisik kepada bulan, mencari cerita terhangat untukmu...",
    "Siapkan selimut hangatmu, takdir sedang memilihkan petualangan mimpi terindah...",
    "Menanti malam larut, memetik cerita bintang paling bersinar malam ini...",
    "Tidur yang nyenyak ya, semesta sedang membisikkan kisah rahasia untukmu..."
  ];

  // Pick a Random Story (with beautiful quote selection loading sequence)
  const handlePickRandom = () => {
    if (stories.length === 0) return;

    // Clear any existing timers
    if (loaderFadeTimerRef.current) clearTimeout(loaderFadeTimerRef.current);
    if (loaderDoneTimerRef.current) clearTimeout(loaderDoneTimerRef.current);

    // Choose a random quote
    const randomQuote = bedtimeQuotes[Math.floor(Math.random() * bedtimeQuotes.length)];
    setLoadingQuote(randomQuote);

    // Select the random story
    const randomIndex = Math.floor(Math.random() * stories.length);
    const chosenStory = stories[randomIndex];

    // Start loading sequence
    setRandomLoading(true);
    setIsLoadingFadeout(false);

    // Start fading out the loader overlay after 2.8s, and mount the story reader underneath!
    loaderFadeTimerRef.current = setTimeout(() => {
      setIsLoadingFadeout(true);
      setActiveStory(chosenStory);
    }, 2800);

    // Completely unmount the loader after it has fully faded out (700ms transition + 100ms buffer)
    loaderDoneTimerRef.current = setTimeout(() => {
      setRandomLoading(false);
      setIsLoadingFadeout(false);
    }, 3600);
  };

  // Return to library with beautiful loading sequence (5 seconds)
  const handleCloseStory = () => {
    const closeQuotes = [
      "Menyimpan lembaran dongeng ke dalam ingatan, merajut mimpi indah berikutnya...",
      "Merapikan halaman buku dongeng sebelum matamu terpejam...",
      "Menutup petualangan malam ini, membiarkan mimpimu tumbuh mekar...",
      "Kembali ke Reverie, semoga tidurmu semakin nyenyak..."
    ];
    const randomQuote = closeQuotes[Math.floor(Math.random() * closeQuotes.length)];
    setLoadingQuote(randomQuote);

    setRandomLoading(true);
    setIsLoadingFadeout(false);

    // Delay unmounting the story reader until the loading overlay has fully faded in (750ms)
    setTimeout(() => {
      setActiveStory(null);
    }, 750);

    // Start fading out at 4.3 seconds to give the 700ms transition time to complete
    loaderFadeTimerRef.current = setTimeout(() => {
      setIsLoadingFadeout(true);
    }, 4300);

    // Completely unmount after 5.1 seconds (700ms transition + 100ms buffer)
    loaderDoneTimerRef.current = setTimeout(() => {
      setRandomLoading(false);
      setIsLoadingFadeout(false);
    }, 5100);
  };

  // Cleanup loader timers on unmount
  useEffect(() => {
    return () => {
      if (loaderFadeTimerRef.current) clearTimeout(loaderFadeTimerRef.current);
      if (loaderDoneTimerRef.current) clearTimeout(loaderDoneTimerRef.current);
    };
  }, []);

  // Mouse position event handlers for parallax
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Grid entrance transition hook
  useEffect(() => {
    setIsGridAnimating(true);
    const timer = setTimeout(() => {
      setIsGridAnimating(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [selectedMood, searchQuery]);

  // Filtered stories list
  const filteredStories = stories.filter((story) => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = selectedMood === "all" || story.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  if (!isSiteOpen) {
    return (
      <SleepingScreen
        siteMode={siteMode}
        startHour={startHour}
        endHour={endHour}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col font-sans transition-colors duration-500 overflow-hidden pb-12">

      {/* Starry Sky & Shooting Stars Backdrop */}
      <StarryBackdrop stars={stars} shootingStars={shootingStars} />

      {/* Minimalist Welcome Screen overlay */}
      {!isUnlocked && (
        <WelcomeScreen onUnlock={handleUnlock} />
      )}

      {/* Floating Pill Navbar */}
      {isUnlocked && (
        <Navbar />
      )}

      {/* Main Layout Wrapper - Outer transitions container (full width) */}
      <div
        className={`relative z-10 w-full flex-1 flex flex-col transition-opacity duration-1000 ease-out ${isUnlocked ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >

        {/* Hero Section - Full Width Starry Skies */}
        <Hero
          heroRef={heroRef}
          mousePos={mousePos}
          onHeroMouseMove={handleHeroMouseMove}
          onHeroMouseLeave={handleHeroMouseLeave}
          ceweName={ceweName}
          storiesLength={stories.length}
          onPickRandom={handlePickRandom}
          isUnlocked={isUnlocked}
        />

        {/* Dashboard Grid - Stories Catalog */}
        <Catalog
          stories={stories}
          filteredStories={filteredStories}
          readStories={readStories}
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isGridAnimating={isGridAnimating}
          onStoryClick={setActiveStory}
        />

        {/* Footer Section */}
        <footer className="w-full max-w-7xl mx-auto px-6 md:px-12 mt-12 py-8 border-t border-border-custom/40 flex flex-col md:flex-row items-center justify-between gap-4 select-none shrink-0">
          <p className="text-[11px] text-muted-custom font-medium">
            © {new Date().getFullYear()} Reverie. Dibuat dengan segenap cinta.
          </p>


        </footer>

      </div>
      {/* Immersive Story Reader Modal */}
      {activeStory && (
        <StoryReader
          story={activeStory}
          isRead={readStories.includes(activeStory.id)}
          onClose={handleCloseStory}
          onMarkRead={handleMarkRead}
          startFullyVisible={randomLoading}
        />
      )}




      {/* Immersive Destiny Story Selector Loading Overlay */}
      <DestinyLoader
        isLoading={randomLoading}
        isFadeout={isLoadingFadeout}
        quote={loadingQuote}
      />

      {/* Floating Love Letter (Fixed bottom left) */}
      {isUnlocked && (
        <LoveLetterModal
          isOpen={showLoveLetter}
          content={loveLetterContent}
          onToggle={() => setShowLoveLetter(!showLoveLetter)}
        />
      )}
    </div>
  );
}
