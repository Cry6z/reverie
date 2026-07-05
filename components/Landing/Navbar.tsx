"use client";

import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setIsLocal(
        hostname === "localhost" || 
        hostname === "127.0.0.1" || 
        hostname === "::1" || 
        hostname.startsWith("192.168.")
      );
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToCatalog = () => {
    document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40 w-[90%] max-w-xl select-none">
      <nav className="border border-white/5 bg-[#121110]/50 backdrop-blur-xl px-5 py-2.5 rounded-full flex items-center justify-between shadow-2xl relative">
        {/* Brand/Welcome Logo */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <img src="/reveriee.png" alt="Reverie Logo" className="w-5 h-5 object-contain" />
          <span className="font-serif italic font-semibold text-[13px] tracking-wide text-[#fff4d6]">Reverie</span>
        </button>

        {/* Floating Menu links */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollToCatalog}
            className="text-[9px] font-bold tracking-wider uppercase text-white/60 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition-all cursor-pointer"
          >
            Pustaka
          </button>
        </div>
      </nav>
    </div>
  );
}
