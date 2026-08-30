"use client";

import React, { useRef, useEffect } from "react";

/* ── Tech badges rendered in their real brand colors ── */
const techBadges = [
  { bg: "#F7DF1E", text: "JS", textColor: "#000000" },   // JavaScript
  { bg: "#3178C6", text: "TS", textColor: "#FFFFFF" },   // TypeScript
  { bg: "#61DAFB", text: "R", textColor: "#003847" },    // React
  { bg: "#3C873A", text: "N", textColor: "#FFFFFF" },    // Node.js
  { bg: "#E34F26", text: "5", textColor: "#FFFFFF" },    // HTML5
  { bg: "#264DE4", text: "#", textColor: "#FFFFFF" },    // CSS
];

export function ClickBurst({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  const particles = useRef(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      badge: techBadges[Math.floor(Math.random() * techBadges.length)],
      angle: (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5,
      distance: 40 + Math.random() * 50,
      size: 14 + Math.random() * 8,
    }))
  ).current;

  useEffect(() => {
    const timer = setTimeout(onDone, 800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="fixed pointer-events-none" style={{ left: x, top: y, zIndex: 50 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: 0,
            top: 0,
            animation: "burst-particle 0.7s ease-out forwards",
            ["--burst-x" as string]: `${Math.cos(p.angle) * p.distance}px`,
            ["--burst-y" as string]: `${Math.sin(p.angle) * p.distance - 30}px`,
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 24 24">
            <rect x="1" y="1" width="22" height="22" rx="6" fill={p.badge.bg} />
            <text
              x="12"
              y="12"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="13"
              fontWeight="700"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fill={p.badge.textColor}
            >
              {p.badge.text}
            </text>
          </svg>
        </div>
      ))}
    </div>
  );
}
