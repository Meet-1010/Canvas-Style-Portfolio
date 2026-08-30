"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/siteConfig";
import { renderBold } from "@/lib/renderBold";
import { isCursorKitActive } from "@/lib/cursorkit";

import { useTypingEffect, LocalTime, StarBackground, FloatingDecorations, MacFolder, NameBadge, CodeCard } from "./components/hero";
import { DotMatrixBoard } from "./components/dot-matrix";
import { VinylCard } from "./components/vinyl-card";
import { RetroWindows, StartMenu } from "./components/retro-windows";
import { ArrowAnimated, DrawInStars, ScrollRevealText } from "./components/scroll-text";
import { RippedPaperNote } from "./components/ripped-paper";
import { PortfolioViewer } from "./components/finder-window";
import { ScatterBoard } from "./components/scatter-board";
import { ClickBurst } from "./components/click-burst";
import { NavHeader } from "./components/nav-header";
import { CursorHint } from "./components/cursor-hint";
import { OpeningAnimation } from "./components/opening-animation";
import { YellowDotCursor } from "./components/yellow-dot-cursor";
import { MobileBanner } from "./components/mobile-banner";
import { MobileHero } from "./components/mobile-hero";
import { BuildSomethingWidget } from "./components/desktop-widgets";

function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-16 w-full flex justify-center px-4 pt-16 lg:pt-24 pb-4 lg:pb-6">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <BuildSomethingWidget standalone />
      </motion.div>
    </section>
  );
}

/* ── Isolated click-burst layer — owns its own state so page-wide clicks don't re-render the whole tree ── */
function PageBurstLayer() {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest("a, button, iframe")) return;
      // CursorKit brings its own click effect — don't stack ours on top.
      if (isCursorKitActive()) return;
      const id = counter.current++;
      setBursts((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      {bursts.map((b) => (
        <ClickBurst key={b.id} x={b.x} y={b.y} onDone={() => setBursts((prev) => prev.filter((p) => p.id !== b.id))} />
      ))}
    </>
  );
}

/* ── Tab definitions ── */
const tabs = siteConfig.sections.map((s) => ({
  id: s.id,
  label: s.id
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" "),
}));

/* ── Main page ── */
export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const { displayed, done } = useTypingEffect(siteConfig.name, 80);
  const activeSection = siteConfig.sections[activeTab];
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [imgZIndex, setImgZIndex] = useState<number[]>([1, 1, 2, 3, 3, 1, 1, 4, 1, 1, 1]);
  const zCounterRef = useRef(10);
  const [arrowVisible, setArrowVisible] = useState(false);
  const onArrowVisible = useRef(() => setArrowVisible(true)).current;
  const [showOpening, setShowOpening] = useState(false);

  return (
    <div className="relative" style={{ overflowX: "clip" }}>
      {showOpening && <OpeningAnimation onComplete={() => setShowOpening(false)} />}
      <YellowDotCursor active={!showOpening} />
      <div style={{ opacity: showOpening ? 0 : 1 }}><NavHeader /></div>
      <StarBackground />
      <PageBurstLayer />

      {/* Mobile banner — only visible on small screens */}
      {!showOpening && <MobileBanner />}

      {/* Mobile hero — stacked layout for small screens */}
      <MobileHero />

      {/* Hero — full viewport, centered (desktop only) */}
      <CursorHint label="Hover on items" delay={5} duration={5}>
      <div className="hidden lg:flex min-h-screen items-center justify-center px-4 relative z-10">
      <div className="relative w-[1400px] h-[900px] overflow-visible" style={{ maxWidth: "100vw", transform: "translateX(-25px)" }}>
        <MacFolder />
        <VinylCard />
        <NameBadge />
        <RetroWindows />
        <CodeCard />
        {/* Center text */}
        <div className="absolute top-[22%] left-[calc(50%+30px)] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="relative mb-4 hero-entrance overflow-hidden" style={{ animation: "hero-blur-in 0.6s ease-out 0.3s both" }}>
            <h1 className="font-[family-name:var(--font-noto)] text-[72px] md:text-[90px] font-black text-stone-900 leading-none tracking-tight select-none theme-heading">Meet Chauhan</h1>
            {/* Glare sweep */}
            <div className="absolute inset-0 pointer-events-none" style={{ animation: "hero-glare 1.2s ease-in-out 5s both" }}>
              <div className="absolute top-0 h-full w-[60%] -skew-x-12" style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 25%, rgba(255,255,255,0.8) 48%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 52%, rgba(255,255,255,0.25) 75%, transparent 100%)",
              }} />
            </div>
          </div>
          <p className="font-[family-name:var(--font-noto)] text-xs md:text-base text-stone-500 text-center tracking-[0.2em] uppercase hero-entrance ml-3 theme-subtext" style={{ lineHeight: "1.8", animation: "hero-fade-in 0.5s cubic-bezier(0.4,0,0.2,1) 1.9s both" }}>
            I think in systems · I build for humans
          </p>
        </div>
      </div>
      </div>
      </CursorHint>

      {/* Ripped paper quote + bio with decorative images */}
      <div id="about" className="mt-[120px] scroll-mt-16" />
      <div className="relative translate-x-0 lg:-translate-x-[20px]">
        <RippedPaperNote />
        <ScrollRevealText />
      </div>

      {/* Portfolio — folder view / book view */}
      <PortfolioViewer />

      {/* Bulletin board */}
      <div id="playground" className="mt-8 lg:mt-12 scroll-mt-16" />
      <ScatterBoard
        imgZIndex={imgZIndex}
        setImgZIndex={setImgZIndex}
        zCounterRef={zCounterRef}
        arrowVisible={arrowVisible}
        setBursts={setBursts}
        bursts={bursts}
      />

      {/* Contact section */}
      <ContactSection />

      {/* Social icons */}
      <motion.div
        className="flex justify-center gap-6 pt-2 pb-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {/* LinkedIn */}
        <motion.a variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.4 }} href="https://linkedin.com/in/meet-chauhan-5574a4264/" target="_blank" rel="noopener noreferrer" className="relative font-[family-name:var(--font-noto)] text-[14px] text-stone-500 flex items-center justify-center social-morph">
          <span className="social-morph-text">{`{LinkedIn}`}</span>
          <svg className="social-morph-icon w-[16px] h-[16px]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </motion.a>
        {/* Github */}
        <motion.a variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.4 }} href="https://github.com/Meet-1010" target="_blank" rel="noopener noreferrer" className="relative font-[family-name:var(--font-noto)] text-[14px] text-stone-500 flex items-center justify-center social-morph">
          <span className="social-morph-text">{`{Github}`}</span>
          <svg className="social-morph-icon w-[16px] h-[16px]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </motion.a>
        {/* Email */}
        <motion.a variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.4 }} href="mailto:meetsc04@gmail.com" className="relative font-[family-name:var(--font-noto)] text-[14px] text-stone-500 flex items-center justify-center social-morph">
          <span className="social-morph-text">{`{Email}`}</span>
          <svg className="social-morph-icon w-[16px] h-[16px]" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.908 1.528-1.147C21.69 2.28 24 3.434 24 5.457z"/></svg>
        </motion.a>
        {/* Resume */}
        <motion.a variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.4 }} href="/MeetChauhan_FullStackDeveloper.pdf" target="_blank" rel="noopener noreferrer" className="relative font-[family-name:var(--font-noto)] text-[14px] text-stone-500 flex items-center justify-center social-morph">
          <span className="social-morph-text">{`{Resume}`}</span>
          <svg className="social-morph-icon w-[16px] h-[16px]" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/></svg>
        </motion.a>
      </motion.div>




      {/* Sections — hidden for now */}
      <div className="hidden flex-col items-center px-4 pb-24 relative z-10">
        {/* Navigation pills */}
        <nav className="flex flex-wrap justify-center gap-3 mb-16">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-2 rounded-full font-mono text-xs transition-all ${
                i === activeTab
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-text-muted hover:text-text-secondary border border-editor-border hover:border-text-muted/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Section content card */}
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h2 className="font-sans text-4xl md:text-5xl text-text-primary">
                {activeSection.title}
              </h2>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg">
                {renderBold(activeSection.description)}
              </p>
              {activeSection.highlights.length > 0 && (
                <ul className="space-y-3">
                  {activeSection.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3 text-text-secondary/90 leading-relaxed">
                      <span className="text-accent mt-1 shrink-0">-</span>
                      <span>{renderBold(h.text)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {activeSection.cta && activeSection.cta.url && (
                <a
                  href={activeSection.cta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-mono text-sm text-accent hover:text-accent/80 transition-colors underline decoration-accent/30 hover:decoration-accent underline-offset-4"
                >
                  {activeSection.cta.label} &rarr;
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-24 text-center">
          <p className="font-mono text-xs text-text-muted">
            Build with Claude Code · Shipped on Vercel
          </p>
        </footer>
      </div>
    </div>
  );
}
