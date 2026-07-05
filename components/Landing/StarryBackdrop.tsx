"use client";

import React from "react";

export interface Star {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
}

export interface ShootingStar {
  id: number;
  top: number;
  right: number;
  scale: number;
  duration: number;
}

interface StarryBackdropProps {
  stars: Star[];
  shootingStars: ShootingStar[];
}

export default function StarryBackdrop({ stars, shootingStars }: StarryBackdropProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star-blink absolute rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            opacity: 0.25,
          }}
        />
      ))}

      {/* Dynamic Randomized Shooting Stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="shooting-star-layer"
          style={{
            top: `${star.top}%`,
            right: `${star.right}%`,
            "--scale": star.scale,
            "--duration": `${star.duration}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Subtle slow night glows */}
      <div className="night-glow top-[-100px] left-[5%]" />
      <div className="night-glow bottom-[-50px] right-[10%]" />
    </div>
  );
}
