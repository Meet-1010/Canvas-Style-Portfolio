"use client";

import React, { useState, useEffect, useRef } from "react";

const PIXAR_IMAGES = ["/Pixar_1.png", "/Pixar_2.png", "/Pixar_3.png", "/Pixar_4.png"];

export const easterEggCells = [
  { col: -2, row: -4, animIdx: 0, cardOffset: [64, -80] as [number, number], cardRotate: 2, imgW: 230 },
  { col: -3, row: 5,  animIdx: 1, cardOffset: [70, -150] as [number, number], cardRotate: -2, imgW: 205 },
  { col: 16, row: -4, animIdx: 2, cardOffset: [-240, -80] as [number, number], cardRotate: -2, imgW: 230 },
  { col: 17, row: 5,  animIdx: 3, cardOffset: [-240, -90] as [number, number], cardRotate: 2, imgW: 230 },
];

export function EasterEggCell({ containerRef, col, row, animIdx, cardOffset, cardRotate, imgW = 230 }: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  col: number; row: number; animIdx: number;
  cardOffset: [number, number]; cardRotate: number; imgW?: number;
}) {
  const GRID = 56;
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [snapOffset, setSnapOffset] = useState({ x: 0, y: 0 });
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cellRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          setRevealed(true);
          setBlinking(true);
          setTimeout(() => setBlinking(false), 1200);
        }, animIdx * 300);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [animIdx]);

  useEffect(() => {
    let raf: number | null = null;
    const compute = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const bodyX = rect.left;
      const bodyY = rect.top + scrollY;
      const offX = ((bodyX % GRID) + GRID) % GRID;
      const offY = ((bodyY % GRID) + GRID) % GRID;
      setSnapOffset({ x: -offX, y: -offY });
    };
    const onResize = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(() => { raf = null; compute(); });
    };
    const timers = [100, 500, 1000, 2000].map(ms => setTimeout(compute, ms));
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", onResize);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [containerRef]);

  const cellX = snapOffset.x + col * GRID;
  const cellY = snapOffset.y + row * GRID;

  return (
    <div
      ref={cellRef}
      className="absolute hidden lg:block z-10 cursor-pointer"
      style={{ left: cellX, top: cellY, width: GRID, height: GRID }}
      onClick={() => { if (revealed) setOpen(!open); }}
    >
      {/* Dashed trigger cell */}
      <div
        className="w-full h-full relative border border-dashed rounded-[1px] egg-border"
        style={{
          borderColor: blinking ? "var(--egg-border-blink)" : revealed ? "var(--egg-border-revealed)" : "var(--egg-border-idle)",
          transition: "border-color 0.2s",
        }}
      >
        {revealed && !open && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-light select-none" style={{ color: "var(--nav-text-strong)" }}>+</span>
          </div>
        )}
        {revealed && open && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[16px] h-[16px]" style={{ background: "var(--nav-text-strong)" }} />
          </div>
        )}
      </div>

      {/* Pixar sticker — bare transparent PNG, no card */}
      {open && (
        <img
          src={PIXAR_IMAGES[animIdx]}
          alt=""
          draggable={false}
          className="absolute z-30 pointer-events-none select-none"
          style={{
            left: cardOffset[0],
            top: cardOffset[1],
            width: imgW,
            maxWidth: "none",
            height: "auto",
            rotate: `${cardRotate}deg`,
            filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.15))",
            animation: "pixar-pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        />
      )}
    </div>
  );
}
