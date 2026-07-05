"use client";

import React, { useState, useEffect } from "react";
import { X, BookOpen, Heart, LogOut, CheckCircle2 } from "lucide-react";
import { Story } from "@/app/data/initialStories";

import LoginScreen from "./LoginScreen";
import StoryTab from "./StoryTab";
import LoveLetterTab from "./LoveLetterTab";

interface AdminPanelProps {
  stories: Story[];
  onClose: () => void;
  onAddStory: (story: Omit<Story, "id" | "createdAt">) => void;
  onEditStory: (id: string, story: Partial<Story>) => void;
  onDeleteStory: (id: string) => void;
  onResetStories: () => void;

  loveLetterContent: string;
  onSaveLoveLetter: (content: string) => void;
}

type Tab = "stories" | "loveletter";

export default function AdminPanel({
  stories,
  onClose,
  onAddStory,
  onEditStory,
  onDeleteStory,
  onResetStories,
  loveLetterContent,
  onSaveLoveLetter,
}: AdminPanelProps) {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  
  // Tab control
  const [activeTab, setActiveTab] = useState<Tab>("stories");

  // Love Letter states
  const [loveLetter, setLoveLetter] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Sync love letter from prop
  useEffect(() => {
    if (loveLetterContent) {
      setLoveLetter(loveLetterContent);
    }
  }, [loveLetterContent]);

  // Check session auth on load
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("reverie_admin_authed");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase().trim() === "sayang") {
      setIsAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem("reverie_admin_authed", "true");
      triggerSuccess("Berhasil masuk ke kamar menulis!");
    } else {
      setAuthError(true);
      setPasscode("");
    }
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    const timer = setTimeout(() => {
      setSuccessMsg("");
    }, 2800);
    return () => clearTimeout(timer);
  };

  const handleSaveLoveLetter = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLoveLetter(loveLetter);
    triggerSuccess("Surat malam berhasil terbit!");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("reverie_admin_authed");
  };

  // Lock body scroll when admin modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <LoginScreen
        passcode={passcode}
        setPasscode={setPasscode}
        handleLogin={handleLogin}
        authError={authError}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0c0b]/80 backdrop-blur-md flex items-center justify-center p-2 md:p-4 select-none animate-fade-in">
      
      {/* Floating Success Toast Alert */}
      {successMsg && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-100 flex items-center gap-2 bg-[#fff4d6] text-[#0d0c0b] px-5 py-3 rounded-full shadow-[0_10px_35px_rgba(255,244,214,0.3)] font-bold text-xs select-none animate-bounce-short">
          <CheckCircle2 className="w-4 h-4 text-green-600 fill-green-600/10" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Glassmorphic Panel Container (Floating Laptop-App Frame) */}
      <div className="w-[95%] max-w-5xl h-[88vh] border border-white/10 bg-[#121110]/80 backdrop-blur-2xl rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden relative animate-scale-up-bounce">
        
        {/* Floating Background Stars & Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-size-[24px_24px] z-0" />

        {/* Panel Header */}
        <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between z-10 shrink-0 relative bg-black/20">
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#fff4d6]/60">Penulis Sistem</span>
            <h1 className="text-sm font-bold font-serif text-white tracking-wide mt-0.5">Kamar Menulis Mimpi</h1>
          </div>

          {/* Navigation Tab Selectors (Pill Slider) */}
          <div className="relative flex bg-white/5 border border-white/5 p-1 rounded-full items-center select-none">
            {/* Sliding Pill Indicator */}
            <div 
              className={`absolute top-1 bottom-1 rounded-full bg-white/10 transition-all duration-300 ease-out`}
              style={{
                left: activeTab === "stories" ? "4px" : "50%",
                width: activeTab === "stories" ? "48%" : "46%"
              }}
            />

            <button
              onClick={() => setActiveTab("stories")}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 z-10 cursor-pointer ${
                activeTab === "stories" ? "text-[#fff4d6]" : "text-white/40 hover:text-white/70"
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Dongeng</span>
            </button>
            <button
              onClick={() => setActiveTab("loveletter")}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 z-10 cursor-pointer ${
                activeTab === "loveletter" ? "text-[#fff4d6]" : "text-white/40 hover:text-white/70"
              }`}
            >
              <Heart className="w-3 h-3" />
              <span>Surat</span>
            </button>
          </div>

          {/* Action Row: Close and Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/10 text-white/40 hover:text-red-400 rounded-full transition-all cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 text-white/40 hover:text-white rounded-full transition-all cursor-pointer"
              title="Tutup Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Tab Canvas Content Wrapper */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
          {activeTab === "stories" && (
            <StoryTab
              stories={stories}
              onAddStory={onAddStory}
              onEditStory={onEditStory}
              onDeleteStory={onDeleteStory}
              onResetStories={onResetStories}
              triggerSuccess={triggerSuccess}
            />
          )}

          {activeTab === "loveletter" && (
            <LoveLetterTab
              loveLetter={loveLetter}
              setLoveLetter={setLoveLetter}
              handleSaveLoveLetter={handleSaveLoveLetter}
            />
          )}
        </div>

      </div>
    </div>
  );
}
