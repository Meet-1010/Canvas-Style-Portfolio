"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/lib/siteConfig";
import { renderBold } from "@/lib/renderBold";
import { DesktopWidgets } from "./desktop-widgets";
import { RecentStatus } from "./recents";
import { DrawCanvas } from "./draw-canvas";

const folderColors = [
  { bg: "#8EB4CE", tab: "#7EA4BE", label: "white" },
  { bg: "#DEBB8E", tab: "#CEAB7E", label: "white" },
  { bg: "#8DC4AB", tab: "#7DB49B", label: "white" },
  { bg: "#E09D98", tab: "#D08D88", label: "white" },
  { bg: "#B09AD0", tab: "#A08AC0", label: "white" },
];

const folderImages = [
  "/project-udhyog.jpg",
  "/project-impulse.png",
  "/project-metherium.png",
  "/project-pokedex.jpg",
  "/project-travelms2.jpg",
  "/project-macportfolio2.jpg",
  "/ascent.jpg",
  "/Full-Stack-Playlist.jpg",
  "/cursor-kit-preview.svg",
];

const folderIcons = [
  "/folder-icon-work.svg",
  "/folder-icon-ai.svg",
  "/folder-icon-community.svg",
  "/folder-icon-lens.svg",
  "/folder-icon-sketch.svg",
];

// Outer folders = the four résumé sections
const sectionIcons = [
  "/folder-icon-work.svg",      // Projects
  "/folder-icon-ai.svg",        // Technical Skills
  "/folder-icon-community.svg", // Experience
  "/folder-icon-lens.svg",      // Education
];

// Sub-folders inside "Projects" — same shape, distinct icon each,
// unified color that differs from the outer folder colors.
const projectIcons = [
  "/folder-icon-work.svg",      // UdhyogUnity
  "/folder-icon-ai.svg",        // Impulse IDE
  "/folder-icon-sketch.svg",    // Metherium Studio
  "/folder-icon-community.svg", // Pokédex App
  "/folder-icon-work.svg",      // TravelMS
  "/folder-icon-ai.svg",        // Mac Portfolio
  "/folder-icon-community.svg", // Ascent
  "/folder-icon-sketch.svg",    // Project Playlist
  "/folder-icon-ai.svg",        // CursorKit
];

const projectFolderColor = { bg: "#B9A5D9", tab: "#A995C9", label: "white" };

const folderContent = [
  {
    title: "UdhyogUnity",
    description: "A platform dedicated to **connecting cities through local businesses** — empowering vendors and consumers through digital transformation.\n\nBuilt with React, React Router, Framer Motion, Bootstrap, and Firebase. Authored a research paper on this project published in September 2025.",
    cta: { label: "View on GitHub", url: "https://github.com/Meet-1010/UdhyogUnity" },
  },
  {
    title: "Impulse IDE",
    description: "An **AI-powered, cross-platform IDE alternative** for Arduino developers — streamlining coding, debugging, and compilation.\n\nEngineered seamless hardware integration to auto-detect connected boards and dynamically select appropriate AI chat models. Built with **Node.js, Electron, Vite, SerialPort, and AI APIs** (Gemini, OpenAI, Claude).",
    note: "Private project — reach out to learn more.",
  },
  {
    title: "Metherium Studio",
    description: "A **creative digital brand** building culture through bold art and design — more than stickers, a community-driven platform blending identity and expression.\n\nBuilt with React, React Router DOM, Tailwind CSS, and JavaScript, delivering clean UI, smooth navigation, and strong brand storytelling.",
    cta: { label: "Visit metherium.studio", url: "https://metherium.studio/" },
  },
  {
    title: "Pokédex App",
    description: "A **React-based Pokédex** integrating the PokéAPI to display comprehensive Pokémon data — stats, abilities, and types.\n\nEmphasizes component reusability, efficient state management, and responsive UI design using Tailwind CSS, Axios, and JSON data handling.",
    cta: { label: "View live demo", url: "https://pokedex-react-project.onrender.com" },
  },
  {
    title: "TravelMS",
    description: "A **Corporate Travel Management System** — dark-themed platform to manage travel requests, approvals, and expenses all in one place.\n\nFeatures employee travel request flows, manager approval dashboards, and expense tracking. Built with **React, Node.js, Express.js, and MySQL**, deployed on Render.",
    cta: { label: "View live demo", url: "https://tms-frontend-s2g6.onrender.com/" },
    cta2: { label: "View on GitHub", url: "https://github.com/Meet-1010/travel-management-system" },
  },
  {
    title: "Mac Portfolio",
    description: "A **macOS-inspired web portfolio** — a fully interactive desktop experience in the browser, complete with a Dock, draggable windows, wallpaper, and menu bar.\n\nThe first version of my portfolio. Built with **Vue.js**, recreating the macOS UI layer with apps, windows, and system-style interactions.",
    cta: { label: "View live demo", url: "https://meet-portfolio-mac.onrender.com/" },
    cta2: { label: "View on GitHub", url: "https://github.com/Meet-1010/Meet-Portfolio-Mac" },
  },
  {
    title: "Ascent",
    description: "A **college-selecting tool** built to help students navigate and compare colleges with clarity — cutting through scattered, unreliable information.\n\nDesigned to streamline the research and decision process for prospective students, presenting the data that actually matters in one place.",
    cta: { label: "View on GitHub", url: "https://github.com/Meet-1010/Ascent_-College_Selecting_Tool-" },
  },
  {
    title: "Project Playlist",
    description: "A **Spotify-style playlist page** showcasing all my projects — same accurate UI, animations, and layout behavior as Spotify's own playlist view, rebuilt from scratch.\n\nBuilt with **Next.js and TypeScript**, shipped as its own standalone app.",
    cta: { label: "View on GitHub", url: "https://github.com/Meet-1010/Project-Playlist-Spotify-Style" },
  },
  {
    title: "CursorKit",
    description: "A **custom cursor library** with 127 hand-built styles — fluid blobs, trails, geometric shapes, and reactive effects. One script tag, zero dependencies, 60fps canvas rendering.\n\nThe floating launcher on this portfolio is CursorKit itself. Open it, pick a cursor, and watch it change on this page live — then copy the embed tag for your own site.",
    cta: { label: "Try the builder", url: "https://cursor-kit-one.vercel.app/builder" },
    cta2: { label: "View on GitHub", url: "https://github.com/Meet-1010/CursorKit" },
  },
];

const appTools = [
  { label: "Claude", icon: "/app-claude.jpg" },
  { label: "GitHub", icon: "/app-github.jpg" },
  { label: "Cursor", icon: "/app-cursor.jpg" },
  { label: "Google AI Studio", icon: "/app-google-ai.jpg" },
  { label: "Codex", icon: "/app-codex.jpg" },
  { label: "ChatGPT", icon: "/app-chatgpt.jpg" },
];

const sidebarItems = [
  { id: "meet", label: "Projects", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: "desktop", label: "Snapshot", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
  { id: "recents", label: "Achievements", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: "canvas", label: "Live Canvas", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg> },
];

function FolderIcon({ color, title, onClick, isSelected, icon }: {
  color: typeof folderColors[number];
  title: string;
  onClick: () => void;
  isSelected: boolean;
  icon: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col items-center gap-2.5 group cursor-pointer w-[100px]"
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative w-[96px] h-[80px]" style={{
        filter: isSelected ? `drop-shadow(0 2px 8px ${color.bg}66)` : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
        perspective: "200px",
      }}>
        <svg viewBox="0 0 96 80" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="12" width="96" height="68" rx="8" fill={color.tab} />
          <path
            d="M0 20 C0 14.5, 4.5 10, 10 10 L32 10 Q36 10, 38 6 Q40 2, 44 2 L86 2 Q94 2, 96 10 L96 20 L0 20 Z"
            fill={color.tab}
          />
        </svg>
        {/* Inner "papers" visible when folder opens */}
        <div
          className="absolute left-[6px] right-[6px] bottom-[6px] h-[50px] rounded-[4px] transition-opacity duration-200"
          style={{
            background: "rgba(255,255,255,0.5)",
            opacity: hovered ? 1 : 0,
          }}
        />
        {/* Front panel — tilts up on hover */}
        <motion.div
          className="absolute left-[1px] right-[1px] bottom-[1px] h-[62px] rounded-[7px]"
          style={{
            backgroundColor: color.bg,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.06)",
            transformOrigin: "bottom center",
          }}
          animate={{
            rotateX: hovered ? -18 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <img
            src={icon}
            alt=""
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] object-contain pointer-events-none"
            style={{ filter: "brightness(0) saturate(0)", opacity: 0.1, mixBlendMode: "multiply" }}
          />
        </motion.div>
      </div>
      <span className={`text-[11px] leading-tight text-center whitespace-nowrap min-h-[28px] transition-colors duration-200 ${
        isSelected ? "text-stone-900 font-medium" : "text-stone-500 group-hover:text-stone-700"
      }`}>
        {title}
      </span>
    </motion.button>
  );
}

function FolderSideSheet({ folderIndex, onClose, onNavigate }: {
  folderIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const content = folderContent[folderIndex];
  const color = folderColors[folderIndex];
  const image = folderImages[folderIndex];
  const icon = folderIcons[folderIndex];
  const nextIndex = (folderIndex + 1) % folderContent.length;
  const dirRef = useRef(1);
  const prevIndexRef = useRef(folderIndex);
  if (folderIndex !== prevIndexRef.current) {
    dirRef.current = folderIndex > prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = folderIndex;
  }

  return (
    <motion.div
      className="absolute inset-0 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/5 cursor-pointer"
        onClick={onClose}
      />
      <motion.div
        className="absolute top-0 right-0 z-20 h-full w-[480px] border-l border-stone-200 shadow-xl overflow-hidden rounded-l-xl"
        style={{ backgroundColor: "#FAF8F5" }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] rounded-l-xl overflow-hidden" style={{
          backgroundImage: "url(/noise-texture.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }} />

        <div className="relative flex items-center justify-between px-5 py-3 border-b border-stone-200/60 z-10" style={{ backgroundColor: `${color.bg}08` }}>
          <div className="flex items-center gap-2.5">
            <img src={icon} alt="" className="w-5 h-5 object-contain" style={{ filter: `brightness(0) saturate(0) opacity(0.5)` }} />
            <span className="text-[14px] text-stone-700 font-medium">
              {content.title}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="relative h-[calc(100%-45px)] overflow-hidden">
          <AnimatePresence initial={false} custom={dirRef.current}>
            <motion.div
              key={folderIndex}
              custom={dirRef.current}
              initial="enter"
              animate="center"
              exit="exit"
              variants={{
                enter: (dir: number) => ({ x: dir * -480 }),
                center: { x: 0 },
                exit: (dir: number) => ({ x: dir * 480 }),
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ position: "absolute", top: 0, left: 0, right: 0 }}
            >
              <div className="relative w-full">
                <Image src={image} alt={content.title} width={480} height={300} className="w-full h-auto object-contain" priority unoptimized />
              </div>

              <div className="relative p-5 space-y-4">
                {content.description.split("\n\n").map((para, i) => (
                  <p key={i} className="text-stone-600 leading-relaxed text-[14px]">
                    {renderBold(para)}
                  </p>
                ))}
                {"note" in content && content.note && (
                  <p className="text-stone-500 italic text-[13px] leading-relaxed">
                    {content.note}
                  </p>
                )}
                {content.cta && (
                  <div className="flex gap-4">
                    {(Array.isArray(content.cta) ? content.cta : [content.cta]).map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-[13px] px-4 py-1.5 rounded-md border border-stone-700 text-stone-700 hover:bg-stone-700 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute bottom-4 right-5 flex items-center gap-3 z-10">
          {folderIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate(folderIndex - 1); }}
              className="flex items-center gap-1 text-[13px] text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Back</span>
            </button>
          )}
          {folderIndex < folderContent.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate(folderIndex + 1); }}
              className="flex items-center gap-1 text-[13px] text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <span>Next</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function LockNotification({ onUnlock }: { onUnlock: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 px-6 py-5 w-[340px] text-center"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.97 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
        <div className="flex justify-center mb-3">
          <div className="bg-stone-100 rounded-full px-3 py-1.5 flex items-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-500 bell-shake">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
        </div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-stone-500 mb-1.5">Reminder</p>
        <p className="text-[14px] text-stone-700 leading-snug mb-4">
          Tools evolve. Curiosity stays.<br />Small steps move things forward.
        </p>
        <div className="flex border-t border-stone-200">
          <button
            onClick={onUnlock}
            className="flex-1 py-2.5 text-[14px] text-blue-500 font-medium hover:bg-stone-50 transition-colors border-r border-stone-200 rounded-bl-2xl"
          >
            Okay!
          </button>
          <button
            onClick={onUnlock}
            className="flex-1 py-2.5 text-[14px] text-blue-500 font-medium hover:bg-stone-50 transition-colors rounded-br-2xl"
          >
            Got it!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FolderWindowContent() {
  const [openFolder, setOpenFolder] = useState<number | null>(null);
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [unlocked, setUnlocked] = useState(true);
  const [activeSidebar, setActiveSidebar] = useState("meet");
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  return (
    <div className="flex justify-center px-4 lg:px-0">
      <div className="w-[calc(100vw-32px)] lg:w-full max-w-[1200px] font-[family-name:var(--font-noto)]">
        <div className="relative bg-[#F5F5F4] rounded-2xl overflow-hidden border border-stone-300/40" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)" }}>
          {/* Paper texture overlay */}
          <div className="absolute inset-0 pointer-events-none z-[1] rounded-2xl overflow-hidden" style={{
            backgroundImage: "url(/paper-texture.jpg)",
            backgroundSize: "500px",
            backgroundRepeat: "repeat",
            mixBlendMode: "multiply",
            opacity: 0.3,
          }} />
          <div className="relative z-[2] flex items-center gap-2 px-4 py-2.5 border-b border-stone-300/30 bg-[#F0EDE6]/80">
            <div className="flex gap-1.5">
              <div className="w-[11px] h-[11px] rounded-full bg-[#FF5F57] border border-[#E0443E]" />
              <div className="w-[11px] h-[11px] rounded-full bg-[#FEBC2E] border border-[#DEA123]" />
              <div className="w-[11px] h-[11px] rounded-full bg-[#28C840] border border-[#1AAB29]" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[11px] text-stone-400">
                ~/meet/{{ meet: "project", desktop: "snapshot", canvas: "canvas", recents: "achievements" }[activeSidebar] || activeSidebar}
              </span>
            </div>
            <div className="w-[52px]" />
          </div>

          {/* Mobile top tabs */}
          <div className="relative z-[2] lg:hidden flex border-b border-stone-300/30 bg-[#EDE9E2]/60">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveSidebar(item.id); setOpenFolder(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] cursor-pointer transition-colors ${
                  activeSidebar === item.id
                    ? "bg-[#E8E0D4] text-stone-800 font-medium"
                    : "text-stone-500"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="relative z-[2] h-[500px] lg:h-[700px] lg:min-w-[1200px] overflow-hidden flex w-full">
            {/* Desktop sidebar */}
            <div className="hidden lg:block w-[170px] shrink-0 bg-[#EDE9E2]/60 backdrop-blur-sm border-r border-stone-300/30 py-3 px-2">
              <p className="text-[11px] font-medium text-stone-400 px-2 mb-1">Favorites</p>
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveSidebar(item.id); setOpenFolder(null); }}
                  className={`w-full flex items-center gap-2 px-2 py-[5px] rounded-md text-[12px] text-left cursor-pointer transition-colors ${
                    activeSidebar === item.id
                      ? "bg-[#E8E0D4] text-stone-800"
                      : "text-stone-600 hover:bg-stone-200/40"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="relative flex-1 min-h-[500px] lg:min-h-[700px] overflow-hidden min-w-0 w-full">
              <AnimatePresence>
                {!unlocked && (
                  <motion.div
                    className="absolute inset-0 z-10 backdrop-blur-md bg-white/30"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {!unlocked && (
                  <LockNotification onUnlock={() => setUnlocked(true)} />
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {activeSidebar === "meet" ? (
                  <motion.div
                    key="meet"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-full flex"
                  >
                    {/* Left: Section folders */}
                    <div
                      className="pt-6 lg:pt-8 pl-4 lg:pl-8 pr-4 lg:pr-6 w-full lg:shrink-0 lg:transition-[width] lg:duration-[350ms] lg:ease-out"
                      style={!isMobile ? { width: openFolder !== null ? 420 : "100%" } : undefined}
                    >
                      <div className={`grid grid-cols-3 ${openFolder !== null ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-x-4 lg:gap-x-10 gap-y-4 lg:gap-y-6 content-start w-fit`}>
                        {siteConfig.sections.map((section, i) => (
                          <FolderIcon
                            key={section.id}
                            color={folderColors[i]}
                            title={section.title}
                            icon={sectionIcons[i]}
                            isSelected={openFolder === i}
                            onClick={() => { setOpenFolder(openFolder === i ? null : i); setOpenProject(null); }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right: Content preview */}
                    <AnimatePresence>
                      {openFolder !== null && (
                        <motion.div
                          key="preview"
                          className="absolute lg:relative inset-0 lg:inset-auto border-l-0 lg:border-l border-stone-200/60 h-full lg:h-[700px] w-full lg:w-[580px] shrink-0 ml-auto flex flex-col z-10"
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          style={{ backgroundColor: "#FAF8F5" }}
                        >
                          <button
                            onClick={() => { setOpenFolder(null); setOpenProject(null); }}
                            className="absolute top-2 right-2 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/70 text-stone-600 hover:text-stone-800 transition-colors cursor-pointer"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                          <div className="flex-1 overflow-y-auto">
                            {openFolder === 0 ? (
                              openProject === null ? (
                                /* Projects → grid of project sub-folders */
                                <motion.div
                                  key="proj-grid"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                  className="p-6 lg:p-8"
                                >
                                  <h3 className="text-[16px] font-medium text-stone-800 mb-1">Projects</h3>
                                  <p className="text-stone-500 text-[13px] mb-6">Open a folder to explore each build.</p>
                                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5">
                                    {folderContent.map((proj, pi) => (
                                      <FolderIcon
                                        key={proj.title}
                                        color={projectFolderColor}
                                        title={proj.title}
                                        icon={projectIcons[pi]}
                                        isSelected={false}
                                        onClick={() => setOpenProject(pi)}
                                      />
                                    ))}
                                  </div>
                                </motion.div>
                              ) : (
                                /* Project detail */
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={openProject}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }}
                                  >
                                    <button
                                      onClick={() => setOpenProject(null)}
                                      className="flex items-center gap-1 text-[13px] text-stone-600 hover:text-stone-900 transition-colors cursor-pointer px-5 pt-4"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                      </svg>
                                      <span>All projects</span>
                                    </button>
                                    <div className="relative w-full aspect-video lg:aspect-auto lg:h-[320px] overflow-hidden mt-3">
                                      <Image src={folderImages[openProject]} alt={folderContent[openProject].title} width={1200} height={640} quality={95} sizes="(max-width: 768px) 100vw, 620px" className="w-full h-full object-cover" priority unoptimized />
                                    </div>
                                    <div className="p-5 space-y-4">
                                      <h3 className="text-[16px] font-medium text-stone-800">{folderContent[openProject].title}</h3>
                                      {folderContent[openProject].description.split("\n\n").map((para, i) => (
                                        <p key={i} className="text-stone-600 leading-relaxed text-[14px]">
                                          {renderBold(para)}
                                        </p>
                                      ))}
                                      {"note" in folderContent[openProject] && folderContent[openProject].note && (
                                        <p className="text-stone-500 italic text-[13px] leading-relaxed">
                                          {folderContent[openProject].note}
                                        </p>
                                      )}
                                      {folderContent[openProject]?.cta && (() => {
                                        const proj = folderContent[openProject] as typeof folderContent[number] & { cta2?: {label:string;url:string} };
                                        const cta = proj.cta;
                                        const links = Array.isArray(cta) ? cta.flat() : [cta];
                                        if (proj.cta2) links.push(proj.cta2);
                                        return (
                                          <div className="flex gap-4 flex-wrap pt-2">
                                            {links.map((link, li) => (
                                              <a
                                                key={li}
                                                href={(link as {label: string; url: string}).url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block text-[13px] px-4 py-1.5 rounded-md border border-stone-700 text-stone-700 hover:bg-stone-700 hover:text-white transition-colors"
                                              >
                                                {(link as {label: string; url: string}).label}
                                              </a>
                                            ))}
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </motion.div>
                                </AnimatePresence>
                              )
                            ) : (
                              /* Section detail — Technical Skills / Experience / Education */
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={openFolder}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="p-6 lg:p-8"
                                >
                                  <div className="flex items-center gap-2.5 mb-4">
                                    <img src={sectionIcons[openFolder]} alt="" className="w-6 h-6 object-contain" style={{ filter: "brightness(0) saturate(0) opacity(0.5)" }} />
                                    <h3 className="text-[17px] font-medium text-stone-800">{siteConfig.sections[openFolder].title}</h3>
                                  </div>
                                  <p className="text-stone-600 leading-relaxed text-[14px] mb-5">
                                    {renderBold(siteConfig.sections[openFolder].description)}
                                  </p>
                                  <ul className="space-y-3 mb-6">
                                    {siteConfig.sections[openFolder].highlights.map((h, i) => (
                                      <li key={i} className="flex gap-2.5 text-stone-600 leading-relaxed text-[14px]">
                                        <span className="text-stone-400 mt-[2px] shrink-0">–</span>
                                        <span>{renderBold(h.text)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  {siteConfig.sections[openFolder].cta && (
                                    <a
                                      href={siteConfig.sections[openFolder].cta.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-block text-[13px] px-4 py-1.5 rounded-md border border-stone-700 text-stone-700 hover:bg-stone-700 hover:text-white transition-colors"
                                    >
                                      {siteConfig.sections[openFolder].cta.label}
                                    </a>
                                  )}
                                </motion.div>
                              </AnimatePresence>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : activeSidebar === "applications" ? (
                  <motion.div
                    key="applications"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-hidden"
                  >
                    <div className="grid grid-cols-5 gap-y-6 gap-x-2 px-8 py-8 justify-items-center">
                      {appTools.map((tool, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                          <img src={tool.icon} alt={tool.label} className="w-[56px] h-[56px] object-cover rounded-[13px] shadow-sm" />
                          <span className="text-[11px] text-stone-600 text-center leading-tight">{tool.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : activeSidebar === "documents" ? (
                  <motion.div
                    key="documents"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-[700px] overflow-hidden"
                  >
                    <div className="grid grid-cols-4 gap-x-2 gap-y-4 p-5 items-start content-start">
                      {[
                        { name: "Meet Chauhan\nresume.pdf", color: "#3b82f6" },
                        { name: "GitHub\nProfile", color: "#24292e" },
                      ].map((doc, i) => (
                        <motion.a
                          key={doc.name}
                          href={i === 0 ? "/MeetChauhan_FullStackDeveloper.pdf" : "https://github.com/Meet-1010"}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ y: -4 }}
                          className="flex flex-col items-center gap-1.5 cursor-pointer group"
                        >
                          <div className="relative w-[90px] h-[110px]">
                            <svg width="90" height="110" viewBox="0 0 90 110" fill="none">
                              <path d="M6 2h58l20 20v82a4 4 0 01-4 4H6a4 4 0 01-4-4V6a4 4 0 014-4z" fill="white" stroke="#d4d4d4" strokeWidth="0.8"/>
                              <path d="M64 2v16a4 4 0 004 4h16" fill="#ebebeb" stroke="#d4d4d4" strokeWidth="0.8" strokeLinejoin="round"/>
                              <rect x="12" y="28" width="30" height="3" rx="1.5" fill="#c8c8c8"/>
                              <rect x="12" y="36" width="56" height="2" rx="1" fill="#e0e0e0"/>
                              <rect x="12" y="42" width="50" height="2" rx="1" fill="#e0e0e0"/>
                              <rect x="12" y="48" width="54" height="2" rx="1" fill="#e0e0e0"/>
                              <rect x="12" y="54" width="42" height="2" rx="1" fill="#e0e0e0"/>
                              <rect x="12" y="60" width="56" height="2" rx="1" fill="#e0e0e0"/>
                              <rect x="12" y="66" width="38" height="2" rx="1" fill="#e0e0e0"/>
                              <rect x="12" y="72" width="48" height="2" rx="1" fill="#e0e0e0"/>
                              <text x="45" y="95" textAnchor="middle" fill="#a8a29e" fontSize="12" fontWeight="500">PDF</text>
                            </svg>
                          </div>
                          <span className="text-[11px] text-stone-600 group-hover:text-stone-800 text-center leading-tight max-w-[100px] transition-colors whitespace-pre-line">{doc.name}</span>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                ) : activeSidebar === "desktop" ? (
                  <motion.div
                    key="desktop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-[500px] lg:h-[700px] overflow-y-auto origin-top-left"
                  >
                    <DesktopWidgets isMobile={isMobile} />
                  </motion.div>
                ) : activeSidebar === "recents" ? (
                  <motion.div
                    key="recents"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-[500px] lg:h-[700px] overflow-y-auto origin-top-left"
                  >
                    <RecentStatus />
                  </motion.div>
                ) : activeSidebar === "canvas" ? (
                  <motion.div
                    key="canvas"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-[500px] lg:h-[700px] overflow-hidden"
                  >
                    <DrawCanvas isMobile={isMobile} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-[700px]"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PortfolioViewer() {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  React.useEffect(() => { setIsMobileView(window.innerWidth < 1024); }, []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const rotate = useTransform(scrollYProgress, [0, 0.5], [2, 0]);

  return (
    <section
      ref={ref}
      id="work"
      className="flex flex-col items-center px-0 lg:px-6 pt-20 lg:pt-52 pb-12 overflow-hidden lg:overflow-visible scroll-mt-16"
      style={!isMobileView ? { scrollMarginTop: "-180px" } : undefined}
    >
      <motion.div style={{ y, scale, rotate }}>
        <FolderWindowContent />
      </motion.div>
    </section>
  );
}
