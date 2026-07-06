"use client";

import React, { useEffect, useRef, useState } from "react";
import { Lock, Star, Sparkles } from "lucide-react";

interface SleepingScreenProps {
  siteMode: "auto" | "open" | "closed";
  startHour: number;
  endHour: number;
}

interface StarParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleDir: number;
}



export default function SleepingScreen({
  siteMode,
  startHour,
  endHour,
}: SleepingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [countdownText, setCountdownText] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetMousePos, setTargetMousePos] = useState({ x: 0, y: 0 });

  // Update clock & countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (siteMode === "closed") {
        setCountdownText("Website ditutup sementara oleh Penulis.");
      } else {
        // Calculate countdown to startHour
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();
        const currentSec = now.getSeconds();

        let target = new Date(now);
        target.setHours(startHour, 0, 0, 0);

        if (currentHour >= endHour || currentHour < startHour) {
          // If we are past endHour, target is today at startHour (if currentHour < startHour)
          // or tomorrow at startHour (if currentHour >= endHour)
          if (currentHour >= endHour) {
            target.setDate(target.getDate() + 1);
          }
          const diffMs = target.getTime() - now.getTime();
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

          setCountdownText(
            `Membuka kembali dalam ${diffHours} jam ${diffMins} menit ${diffSecs} detik`
          );
        } else {
          setCountdownText("Website akan segera dibuka.");
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [siteMode, startHour, endHour]);

  // Track mouse coordinates for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTargetMousePos({
        x: (e.clientX - window.innerWidth / 2) / 30,
        y: (e.clientY - window.innerHeight / 2) / 30,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth lerp mouse parallax
  useEffect(() => {
    let animId: number;
    const updateParallax = () => {
      setMousePos((prev) => ({
        x: prev.x + (targetMousePos.x - prev.x) * 0.08,
        y: prev.y + (targetMousePos.y - prev.y) * 0.08,
      }));
      animId = requestAnimationFrame(updateParallax);
    };
    updateParallax();
    return () => cancelAnimationFrame(animId);
  }, [targetMousePos]);

  // Galaxy & Twinkling Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Initialize stars
    const stars: StarParticle[] = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      twinkleSpeed: 0.005 + Math.random() * 0.015,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    }));



    // Draw Loop
    const draw = () => {
      ctx.fillStyle = "#0c0b0a";
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Twinkling Background Stars
      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed * star.twinkleDir;
        if (star.alpha >= 1) {
          star.alpha = 1;
          star.twinkleDir = -1;
        } else if (star.alpha <= 0.1) {
          star.alpha = 0.1;
          star.twinkleDir = 1;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Twinkling stars only

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Formatter for Indonesian time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Parallax transform helpers
  const getParallaxStyle = (factor: number) => {
    return {
      transform: `translate3d(${-mousePos.x * factor}px, ${-mousePos.y * factor}px, 0)`,
      transition: "transform 0.1s ease-out",
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-between select-none bg-[#0c0b0a] text-white">
      {/* Background Interactive Universe Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-auto" />



      {/* Header Area */}
      <header className="w-full max-w-7xl mx-auto px-8 py-6 z-20 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <img src="/reveriee.png" alt="Reverie Logo" className="w-6 h-6 object-contain" />
          <span className="font-serif italic font-semibold text-sm tracking-wide text-white">
            Reverie
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-500 font-serif italic text-xs">
          <span>hanya bersinar di sunyinya malam</span>
        </div>
      </header>

      {/* Main Glassmorphic Notice Card */}
      <main className="w-full px-6 z-20 flex-1 flex flex-col justify-center items-center">
        <div
          className="max-w-md w-full border border-white/10 bg-[#121110]/40 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-6 items-center text-center relative overflow-hidden"
          style={getParallaxStyle(0.3)}
        >
          {/* Subtle light streak (zinc grayscale) */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 animate-pulse">
            <Lock className="w-5 h-5" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400">
              Kamar Dongeng Beristirahat
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white leading-snug">
              Kembalilah Nanti Malam
            </h1>
            <p className="text-[11px] text-zinc-400 leading-relaxed px-2">
              Website ini hanya dapat diakses pada pukul{" "}
              <strong className="text-white font-semibold">
                {String(startHour).padStart(2, "0")}:00
              </strong>{" "}
              hingga{" "}
              <strong className="text-white font-semibold">
                {String(endHour === 24 || endHour === 0 ? "00" : endHour).padStart(2, "0")}:00
              </strong>{" "}
              setiap malam untuk memelihara mimpi indahmu.
            </p>
          </div>

          {/* Time & Countdown Display */}
          <div className="w-full bg-black/30 border border-white/5 py-4 px-5 rounded-2xl flex flex-col gap-1 items-center">
            <span className="text-[9px] font-bold tracking-wider uppercase text-zinc-500">
              Waktu Lokal Saat Ini
            </span>
            <span className="font-mono text-2xl font-bold tracking-widest text-white">
              {formatTime(currentTime)}
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5">{formatDate(currentTime)}</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300 animate-pulse bg-white/5 border border-white/10 py-2 px-4 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{countdownText}</span>
          </div>
        </div>
      </main>

      {/* Footer Area with Centered Credits */}
      <footer className="w-full max-w-7xl mx-auto px-8 py-6 z-20 flex justify-center items-center text-[10px] text-zinc-600 shrink-0">
        <span>© {new Date().getFullYear()} Reverie. All rights reserved.</span>
      </footer>
    </div>
  );
}
