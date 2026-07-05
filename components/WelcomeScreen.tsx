"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, BookOpen, Lock } from "lucide-react";

interface WelcomeScreenProps {
  onUnlock: (name: string) => void;
}

type ScreenState = "lock" | "input" | "intro" | "fadeout";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  dx: number;
}

export default function WelcomeScreen({ onUnlock }: WelcomeScreenProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);
  const [screenState, setScreenState] = useState<ScreenState>("lock");
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Passcode states
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  
  // Name states
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState<string | null>(null);
  const [activeName, setActiveName] = useState("");
  
  // Intro text states
  const [introText, setIntroText] = useState("");
  const [textOpacity, setTextOpacity] = useState<"hidden" | "visible" | "initial">("initial");

  // Interactive particles
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastParticleTime = useRef(0);

  // Mount logic
  useEffect(() => {
    setIsMounted(true);
    
    // Check lock state
    const isSiteUnlocked = localStorage.getItem("reverie_site_unlocked") === "true";
    const saved = localStorage.getItem("reverie_cewe_name");
    
    if (saved) {
      setSavedName(saved);
      setName(saved);
      setActiveName(saved);
    }
    
    if (isSiteUnlocked) {
      if (saved) {
        setScreenState("intro");
      } else {
        setScreenState("input");
      }
    } else {
      setScreenState("lock");
    }

    // Smooth fade-in of the welcome overlay
    const fadeTimer = setTimeout(() => {
      setIsFadingIn(false);
    }, 100);

    return () => clearTimeout(fadeTimer);
  }, []);

  // Multi-phase timeline intro transition
  useEffect(() => {
    if (!isMounted || screenState !== "intro") return;

    // Phase 1: Slide 1 Text & Fade In
    setIntroText(`Selamat malam, ${activeName}.`);
    setTextOpacity("hidden"); // start invisible
    
    const timer1 = setTimeout(() => {
      setTextOpacity("visible");
    }, 100);

    // Phase 2: Slide 1 Fade Out
    const timer2 = setTimeout(() => {
      setTextOpacity("hidden");
    }, 2800);

    // Phase 3: Slide 2 Text & Fade In
    const timer3 = setTimeout(() => {
      setIntroText("Siapkan selimutmu, dan mari memilih dongeng malam ini...");
      setTextOpacity("visible");
    }, 3900);

    // Phase 4: Slide 2 Fade Out
    const timer4 = setTimeout(() => {
      setTextOpacity("hidden");
    }, 6700);

    // Phase 5: Transition to overall fadeout
    const timer5 = setTimeout(() => {
      setScreenState("fadeout");
    }, 7700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [screenState, activeName, isMounted]);

  // Timed transition for final Unlock Fadeout
  useEffect(() => {
    if (!isMounted || screenState !== "fadeout") return;

    const timer = setTimeout(() => {
      onUnlock(activeName || "Sayang");
    }, 1100);

    return () => clearTimeout(timer);
  }, [screenState, activeName, onUnlock, isMounted]);

  // Smooth state transition bridge
  const transitionTo = (nextState: ScreenState, customActiveName?: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (customActiveName) {
        setActiveName(customActiveName);
      }
      setScreenState(nextState);
      setIsTransitioning(false);
    }, 500); // 500ms smooth fadeout
  };

  // Handle Passcode Submit
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase().trim() === "love") {
      localStorage.setItem("reverie_site_unlocked", "true");
      setPasscodeError(false);
      
      const next = "input";
      transitionTo(next);
    } else {
      setPasscodeError(true);
      setPasscode("");
    }
  };

  // Handle Name Submit
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim();
    if (!finalName) return;
    localStorage.setItem("reverie_cewe_name", finalName);
    setSavedName(finalName);
    
    transitionTo("intro", finalName);
  };

  const handleSkip = () => {
    onUnlock(activeName || name.trim() || savedName || "Sayang");
  };

  // Particle stardust trail on hover/touch
  const addParticle = (x: number, y: number) => {
    const now = Date.now();
    if (now - lastParticleTime.current < 35) return;
    lastParticleTime.current = now;

    const newParticle: Particle = {
      id: Math.random(),
      x,
      y,
      size: Math.random() * 6 + 4,
      dx: (Math.random() * 80) - 40
    };

    setParticles((prev) => [...prev.slice(-25), newParticle]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (screenState === "lock" || screenState === "input") return;
    addParticle(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (screenState === "lock" || screenState === "input") return;
    const touch = e.touches[0];
    if (touch) {
      addParticle(touch.clientX, touch.clientY);
    }
  };

  useEffect(() => {
    if (screenState === "intro") {
      setParticles([]);
    }
  }, [screenState]);

  if (!isMounted) {
    return <div className="fixed inset-0 z-50" style={{ backgroundColor: "#0d0c0b" }} />;
  }

  return (
    <div 
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6 transition-all duration-1200 ease-in-out select-none ${
        isFadingIn 
          ? "opacity-0 scale-105" 
          : screenState === "fadeout" 
            ? "opacity-0 scale-95 pointer-events-none" 
            : "opacity-100 scale-100"
      }`}
      style={{ backgroundColor: "#0d0c0b" }}
    >
      {/* Twilight stars backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <div className="star-blink absolute rounded-full bg-white w-1 h-1 top-[15%] left-[20%]" />
        <div className="star-blink absolute rounded-full bg-white w-1.5 h-1.5 top-[25%] left-[75%] [animation-delay:2s]" />
        <div className="star-blink absolute rounded-full bg-white w-0.5 h-0.5 top-[60%] left-[12%] [animation-delay:1.5s]" />
        <div className="star-blink absolute rounded-full bg-white w-1 h-1 top-[80%] left-[85%] [animation-delay:3.5s]" />
        <div className="star-blink absolute rounded-full bg-white w-0.5 h-0.5 top-[45%] left-[48%] [animation-delay:0.8s]" />
      </div>

      {/* Twinkling stardust on user moves */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="glow-particle"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.size}px`,
            height: `${p.size}px`,
            "--dx": `${p.dx}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Screen State Content Area */}
      <div 
        className={`max-w-md w-full flex flex-col items-center text-center z-10 transition-all duration-500 ease-in-out ${
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        
        {/* Passcode Lock Screen */}
        {screenState === "lock" && (
          <form onSubmit={handlePasscodeSubmit} className="w-full flex flex-col items-center gap-8 fade-in">
            <div className="flex items-center gap-1.5 text-white/40 mb-2">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">
                Reverie Terkunci
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
                Selamat Datang ke Reverie
              </h1>
              <p className="text-xs text-white/40 leading-relaxed max-w-xs mx-auto">
                Website ini dilindungi. Masukkan kata sandi untuk masuk ke ruang mimpi.
              </p>
            </div>

            <div className="relative flex flex-col items-center w-full max-w-xs mx-auto">
              <input
                type="password"
                placeholder="Kata sandi..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-transparent border-b border-white/25 px-2 py-3 text-center text-lg text-white focus:outline-none focus:border-white transition-all placeholder:text-white/20"
                required
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-0 bottom-3 text-white/50 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {passcodeError && (
              <span className="text-[10px] text-red-400 font-semibold tracking-wider uppercase fade-in">
                Kata sandi salah.
              </span>
            )}
          </form>
        )}

        {/* Name Input Screen */}
        {screenState === "input" && (
          <form onSubmit={handleNameSubmit} className="w-full flex flex-col items-center gap-8 fade-in">
            <div className="flex items-center gap-1.5 text-white/40 mb-2">
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-serif italic text-white/75 tracking-wider">
                Reverie
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
                Siapa namamu, Sayang?
              </h1>
              <p className="text-xs text-white/40 leading-relaxed max-w-xs mx-auto">
                Tulis nama panggilanmu agar ruang dongeng tidur ini bisa menyapamu dengan hangat.
              </p>
            </div>

            <div className="relative flex flex-col items-center w-full max-w-xs mx-auto">
              <input
                type="text"
                placeholder="Tulis namamu..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-white/25 px-2 py-3 text-center text-lg text-white focus:outline-none focus:border-white transition-all placeholder:text-white/20"
                required
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-0 bottom-3 text-white/50 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {/* Multi-phase intro text with vertical floating transition */}
        {screenState === "intro" && (
          <div 
            className={`transition-all duration-1000 ease-in-out transform ${
              textOpacity === "visible" 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 -translate-y-2"
            }`}
          >
            <h1 className="text-xl md:text-3xl font-serif text-white font-light tracking-wide leading-relaxed max-w-sm mx-auto px-4">
              {introText}
            </h1>
          </div>
        )}
      </div>

      {/* Skip button during intro slide play */}
      {screenState === "intro" && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 text-[10px] tracking-widest uppercase text-white/40 hover:text-white transition-opacity duration-300 cursor-pointer"
        >
          Lewati Intro →
        </button>
      )}
    </div>
  );
}
