"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { YellowDotCursor } from "../components/yellow-dot-cursor";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

type Track = {
  title: string;
  madeWith: string;
  duration: number; // seconds
  image: string;
  description: React.ReactNode;
  tryIt?: string; // live demo url → "Try it" pill
};

const TITLE_TEXT = "FULL STACK VIBES";

const tracks: Track[] = [
  {
    title: "UdhyogUnity",
    madeWith: "React + Firebase",
    duration: 192,
    image: "/project-udhyog.jpg",
    description: (
      <>
        A platform dedicated to connecting cities through local businesses — empowering vendors and consumers through digital
        transformation. Built with React, React Router, Framer Motion, Bootstrap, and Firebase. Authored a research paper on this
        project, published in September 2025.{" "}
        <a href="https://github.com/Meet-1010/UdhyogUnity" target="_blank" rel="noopener noreferrer">View on GitHub</a>
      </>
    ),
  },
  {
    title: "Impulse IDE",
    madeWith: "Electron + AI APIs",
    duration: 165,
    image: "/project-impulse.png",
    description: (
      <>
        An AI-powered, cross-platform IDE alternative for Arduino developers — streamlining coding, debugging, and compilation.
        Auto-detects connected boards and dynamically selects AI chat models. Built with Node.js, Electron, Vite, SerialPort, and AI
        APIs (Gemini, OpenAI, Claude). Private project —{" "}
        <a href="mailto:meetsc04@gmail.com">reach out to learn more</a>.
      </>
    ),
  },
  {
    title: "Metherium Studio",
    madeWith: "React + Tailwind CSS",
    duration: 178,
    image: "/project-metherium.png",
    tryIt: "https://metherium.studio/",
    description: (
      <>
        A creative digital brand building culture through bold art and design — more than stickers, a community-driven platform
        blending identity and expression. Built with React, React Router DOM, Tailwind CSS, and JavaScript.{" "}
        <a href="https://metherium.studio/" target="_blank" rel="noopener noreferrer">Visit metherium.studio</a>
      </>
    ),
  },
  {
    title: "Pokédex App",
    madeWith: "React + PokéAPI",
    duration: 107,
    image: "/project-pokedex.jpg",
    tryIt: "https://pokedex-react-project.onrender.com",
    description: (
      <>
        A React-based Pokédex integrating the PokéAPI to display comprehensive Pokémon data — stats, abilities, and types.
        Emphasizes component reusability, efficient state management, and responsive UI design using Tailwind CSS and Axios.
      </>
    ),
  },
  {
    title: "TravelMS",
    madeWith: "React + Node.js + MySQL",
    duration: 185,
    image: "/project-travelms2.jpg",
    tryIt: "https://tms-frontend-s2g6.onrender.com/",
    description: (
      <>
        A Corporate Travel Management System — dark-themed platform to manage travel requests, approvals, and expenses all in one
        place. Features employee travel request flows, manager approval dashboards, and expense tracking. Built with React, Node.js,
        Express.js, and MySQL, deployed on Render.{" "}
        <a href="https://github.com/Meet-1010/travel-management-system" target="_blank" rel="noopener noreferrer">View on GitHub</a>
      </>
    ),
  },
  {
    title: "Mac Portfolio",
    madeWith: "Vue.js",
    duration: 141,
    image: "/project-macportfolio2.jpg",
    tryIt: "https://meet-portfolio-mac.onrender.com/",
    description: (
      <>
        A macOS-inspired web portfolio — a fully interactive desktop experience in the browser, complete with a Dock, draggable
        windows, wallpaper, and menu bar. The first version of my portfolio, built with Vue.js.{" "}
        <a href="https://github.com/Meet-1010/Meet-Portfolio-Mac" target="_blank" rel="noopener noreferrer">View on GitHub</a>
      </>
    ),
  },
  {
    title: "Ascent",
    madeWith: "College Selection Tool",
    duration: 154,
    image: "/ascent.jpg",
    description: (
      <>
        A college-selecting tool built to help students navigate and compare colleges with clarity — cutting through scattered,
        unreliable information. Designed to streamline the research and decision process, surfacing the data that actually matters
        in one place.{" "}
        <a href="https://github.com/Meet-1010/Ascent_-College_Selecting_Tool-" target="_blank" rel="noopener noreferrer">View on GitHub</a>
      </>
    ),
  },
  {
    title: "CursorKit",
    madeWith: "Canvas API · Zero Deps",
    duration: 178,
    image: "/cursor-kit-preview.svg",
    description: (
      <>
        A custom cursor library with 127 hand-built styles — fluid blobs, trails, geometric shapes, and reactive effects.
        One script tag, zero dependencies, 60fps canvas rendering. The floating launcher on this portfolio is CursorKit.{" "}
        <a href="https://cursor-kit-one.vercel.app/builder" target="_blank" rel="noopener noreferrer">Try the builder</a>
      </>
    ),
    tryIt: "https://cursor-kit-one.vercel.app/builder",
  },
  {
    title: "This Portfolio",
    madeWith: "Next.js + Claude Code",
    duration: 213,
    image: "/Vinyl.png",
    description: (
      <>
        The site you came from — a desk-inspired portfolio with a Finder window, physics widgets, a garden, and this playlist. Built
        with Next.js 14, Tailwind CSS, Framer Motion, and a lot of vibe coding with Claude Code. You&apos;re listening to it right
        now. <Link href="/">Back to the site</Link>
      </>
    ),
  },
];

const totalSeconds = tracks.reduce((s, t) => s + t.duration, 0);

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const fmtLong = (s: number) => `${Math.floor(s / 60)}m ${Math.floor(s % 60)}s`;

/* ---------- icons (Spotify-style) ---------- */

const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="icon-play"><polygon points="5,3 19,12 5,21" /></svg>
);
const IconPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="icon-pause"><rect x="5" y="3" width="4" height="18" /><rect x="15" y="3" width="4" height="18" /></svg>
);
const IconPrev = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="2.5" height="16" /><polygon points="20,4 20,20 8,12" /></svg>
);
const IconNext = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><rect x="17.5" y="4" width="2.5" height="16" /><polygon points="4,4 4,20 16,12" /></svg>
);

/* ---------- page ---------- */

export default function PlaylistPage() {
  const [current, setCurrent] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);
  const [dropKey, setDropKey] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectTrack = useCallback((i: number) => {
    setCurrent(i);
    setProgress(0);
    setPlaying(true);
    setPanelOpen((open) => {
      if (!open) setDropKey((k) => k + 1); // vinyl-drop animation on open
      return true;
    });
  }, []);

  const step = useCallback((dir: 1 | -1) => {
    setCurrent((c) => {
      const n = c === null ? 0 : (c + dir + tracks.length) % tracks.length;
      setProgress(0);
      setPlaying(true);
      return n;
    });
  }, []);

  useEffect(() => {
    if (!playing || current === null) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p + 1 >= tracks[current].duration) {
          step(1);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, current, step]);

  // star burst easter egg
  const burst = (e: React.MouseEvent) => {
    const root = rootRef.current;
    if (!root) return;
    for (let i = 0; i < 8; i++) {
      const p = document.createElement("span");
      p.className = "star-particle";
      p.textContent = i % 2 ? "✨" : "⭐";
      p.style.left = `${e.clientX}px`;
      p.style.top = `${e.clientY}px`;
      p.style.setProperty("--tx", `${(Math.random() - 0.5) * 220}px`);
      p.style.setProperty("--ty", `${(Math.random() - 0.5) * 220}px`);
      root.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
  };

  const track = current !== null ? tracks[current] : null;

  return (
    <div ref={rootRef} className={`${inter.className} pl-root${panelOpen ? " panel-open" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <YellowDotCursor active />

      {/* ambient blobs + grain */}
      <div className="gradient-blobs" aria-hidden>
        <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" /><div className="blob blob-4" />
      </div>
      <div className="grain" aria-hidden />

      {/* back link */}
      <nav className="social-nav"><Link href="/">← BACK</Link></nav>

      <div className="playlist-container">
        <header className="playlist-header">
          {/* twinkling star easter egg */}
          <svg className="scribble-star" viewBox="0 0 40 40" fill="none" onClick={burst} aria-hidden>
            <path d="M20 3 L24.5 14.5 L37 15.5 L27.5 23.5 L30.8 35.8 L20 29 L9.2 35.8 L12.5 23.5 L3 15.5 L15.5 14.5 Z" stroke="#FF6B9D" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          </svg>

          <div className="playlist-cover">
            <div className="cover-art" />
            <div className="tonearm">
              <div className="tonearm-base" />
              <div className="tonearm-arm"><div className="tonearm-head" /></div>
            </div>
          </div>

          <div className="playlist-info">
            <span className="playlist-label">PLAYLIST</span>
            <h1 className="playlist-title">
              {(() => {
                let g = 0;
                return TITLE_TEXT.split(" ").map((word, wi) => (
                  <React.Fragment key={wi}>
                    {wi > 0 && " "}
                    <span className="word">
                      {word.split("").map((ch, ci) => (
                        <span key={ci} className="letter" style={{ animationDelay: `${0.5 + g++ * 0.08}s` }}>
                          {ch}
                        </span>
                      ))}
                    </span>
                  </React.Fragment>
                ));
              })()}
            </h1>
            <p className="playlist-meta">
              <img src="/profile.jpg" alt="Meet Chauhan" className="artist-avatar" style={{ objectPosition: "center 10%" }} />
              <span className="artist-name" onClick={() => setSecretOpen((s) => !s)}>Created by Meet</span>
              <span className="meta-dot">•</span>
              <span>{tracks.length} projects</span>
              <span className="meta-dot">•</span>
              <span>{fmtLong(totalSeconds)}</span>
            </p>

            {/* secret popover */}
            <div className={`secret-popover${secretOpen ? " active" : ""}`}>
              <button className="secret-close" onClick={() => setSecretOpen(false)} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
              <div className="secret-header">
                <img src="/profile.jpg" alt="Meet Chauhan" className="secret-avatar" style={{ objectPosition: "center 10%" }} />
                <p className="secret-message">Hi, I&apos;m Meet, a full stack developer.<br />Have fun exploring. Thank you!</p>
              </div>
            </div>

            <p className="playlist-desc">
              A playlist of everything I&apos;ve built.<br className="mobile-break" /> Shipped with curiosity and way too much chai.
            </p>
            <div className="playlist-actions">
              <button className="play-btn" onClick={() => (current === null ? selectTrack(0) : setPlaying((p) => !p))} aria-label={playing ? "Pause" : "Play"}>
                {playing && current !== null ? <IconPause /> : <IconPlay />}
              </button>
              <div className="social-icons">
                <a href="https://github.com/Meet-1010" target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" /></svg>
                </a>
                <a href="https://linkedin.com/in/meet-chauhan-5574a4264/" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
                <a href="mailto:meetsc04@gmail.com" className="social-icon" title="Email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
                </a>
                <a href="/MeetChauhan_FullStackDeveloper.pdf" target="_blank" rel="noopener noreferrer" className="social-icon" title="Resume">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* track list */}
        <div className="track-list">
          <div className="track-header">
            <span className="track-num">#</span>
            <span className="track-title-header">TITLE</span>
            <span className="track-tool">MADE WITH</span>
            <span className="track-duration">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </span>
          </div>

          {tracks.map((t, i) => (
            <div
              key={t.title}
              className={`track${current === i ? " active" : ""}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => selectTrack(i)}
            >
              <span className="track-num">{i + 1}</span>
              <div className="track-info">
                <span className="track-title">{t.title}</span>
                <span className="track-artist">{t.madeWith}</span>
              </div>
              <span className="track-tool">{t.madeWith}</span>
              <span className="track-duration">{fmt(t.duration)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* video panel (right side) */}
      <aside className={`video-panel${panelOpen && track ? " active" : ""}`}>
        {track && (
          <div className="panel-content">
            <button className="panel-close" onClick={() => setPanelOpen(false)} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
            <div className="panel-video">
              <img src={track.image} alt={track.title} />
            </div>
            <div className="panel-info">
              <div className="panel-title-row">
                <h2 className="panel-title">{track.title}</h2>
                {track.tryIt && (
                  <a className="try-it-btn" href={track.tryIt} target="_blank" rel="noopener noreferrer">Try it</a>
                )}
              </div>
              <p className="panel-artist">{track.madeWith}</p>
              <p className="panel-desc">{track.description}</p>
              <div className="panel-controls">
                <button className="panel-control-btn" onClick={() => step(-1)} aria-label="Previous"><IconPrev /></button>
                <button className={`panel-control-btn panel-play-btn${playing ? " playing" : ""}`} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>
                  <IconPlay /><IconPause />
                </button>
                <button className="panel-control-btn" onClick={() => step(1)} aria-label="Next"><IconNext /></button>
              </div>
              <div className="panel-progress">
                <span className="panel-time">{fmt(progress)}</span>
                <div className="panel-progress-bar"><div className="panel-progress-fill" style={{ width: `${(progress / track.duration) * 100}%` }} /></div>
                <span className="panel-time">{fmt(track.duration)}</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* vinyl drop animation */}
      {panelOpen && dropKey > 0 && (
        <div key={dropKey} className="panel-vinyl-drop">
          <div className="panel-vinyl-record">
            <div className="panel-vinyl-grooves" />
            <div className="panel-vinyl-label" />
          </div>
        </div>
      )}

      {/* now playing bar */}
      <div className="now-playing">
        <div className="now-playing-left">
          <div className={`now-playing-thumb${playing && track ? " playing" : ""}`}>
            <div className="mini-vinyl">
              <div className="mini-vinyl-groove" />
              <div className="mini-vinyl-label" />
            </div>
          </div>
          <div className="now-playing-text">
            <span className="now-playing-title">{track ? track.title : "Select a track"}</span>
            <span className="now-playing-artist">{track ? track.madeWith : "—"}</span>
          </div>
        </div>
        <div className="now-playing-controls">
          <button className="control-btn" onClick={() => step(-1)} aria-label="Previous"><IconPrev /></button>
          <button className={`control-btn play-pause${playing ? " playing" : ""}`} onClick={() => (current === null ? selectTrack(0) : setPlaying((p) => !p))} aria-label={playing ? "Pause" : "Play"}>
            <IconPlay /><IconPause />
          </button>
          <button className="control-btn" onClick={() => step(1)} aria-label="Next"><IconNext /></button>
        </div>
        <div className="now-playing-progress">
          <span className="progress-time">{track ? fmt(progress) : "0:00"}</span>
          <div className="progress-bar"><div className="progress-fill" style={{ width: track ? `${(progress / track.duration) * 100}%` : "0%" }} /></div>
          <span className="progress-time">{track ? fmt(track.duration) : "0:00"}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- exact-spec styles ---------- */

const PAGE_CSS = `
.pl-root {
  --bg: #121212;
  --bg-elevated: #181818;
  --bg-highlight: #282828;
  --white: #ffffff;
  --text-muted: #b3b3b3;
  --text-subdued: #6a6a6a;
  --green: #1DB954;
  --green-bright: #1ed760;
  --pink: #FF6B9D;
  background: var(--bg);
  color: var(--white);
  min-height: 100vh;
  line-height: 1.5;
}
.pl-root * { margin: 0; padding: 0; box-sizing: border-box; }
.pl-root, .pl-root * { cursor: none !important; }
.pl-root button { font-family: inherit; }
.pl-root a { color: inherit; }

/* grain */
.pl-root .grain {
  position: fixed; inset: 0; pointer-events: none; z-index: 1000; opacity: 0.06;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* blobs */
.pl-root .gradient-blobs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.pl-root .blob { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.2; }
.pl-root .blob-1 { width: 600px; height: 600px; background: #F5A623; top: -200px; left: -100px; }
.pl-root .blob-2 { width: 500px; height: 500px; background: #4ABDAC; top: 10%; right: -150px; }
.pl-root .blob-3 { width: 450px; height: 450px; background: #FC6E51; bottom: 30%; left: 20%; }
.pl-root .blob-4 { width: 400px; height: 400px; background: #F7B733; bottom: -100px; right: 10%; }

/* back nav */
.pl-root .social-nav { position: fixed; top: 24px; left: 24px; display: flex; gap: 20px; z-index: 100; }
.pl-root .social-nav a { font-size: 12px; font-weight: 600; color: var(--text-muted); text-decoration: none; letter-spacing: 0.1em; transition: color 0.2s ease; }
.pl-root .social-nav a:hover { color: var(--white); }
.pl-root.panel-open .social-nav { opacity: 0; pointer-events: none; }
.pl-root .social-nav { transition: opacity 0.3s ease; }

/* container */
.pl-root .playlist-container {
  max-width: 1200px; margin: 0 auto; padding: 24px; padding-bottom: 120px;
  position: relative; z-index: 1;
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1), margin 0.6s cubic-bezier(0.22, 1, 0.36, 1), max-width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.pl-root.panel-open .playlist-container { width: 50%; max-width: 50%; margin: 0; }

/* header */
.pl-root .playlist-header {
  display: flex; gap: 32px; position: relative;
  background: linear-gradient(180deg, #1a3a2a 0%, var(--bg) 100%);
  margin: -24px -24px 0; padding: 60px 40px 40px;
  border-radius: 8px 8px 0 0;
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.pl-root.panel-open .playlist-header { flex-direction: row; align-items: center; gap: 20px; padding: 24px; }

/* vinyl cover */
.pl-root .playlist-cover { flex-shrink: 0; position: relative; cursor: pointer; transition: opacity 0.3s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.pl-root.panel-open .playlist-cover { opacity: 0; transform: scale(0.5); pointer-events: none; position: absolute; }
.pl-root .cover-art {
  width: 232px; height: 232px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 100%);
  border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.3);
  cursor: pointer;
}
.pl-root .cover-art::before {
  content: ''; position: absolute; width: 92%; height: 92%; border-radius: 50%;
  background: repeating-radial-gradient(circle at center, transparent 0px, transparent 2px, rgba(40,40,40,0.8) 2px, rgba(40,40,40,0.8) 3px, rgba(20,20,20,0.9) 3px, rgba(20,20,20,0.9) 4px);
  pointer-events: none;
}
.pl-root .cover-art::after {
  content: ''; position: absolute; width: 80px; height: 80px; border-radius: 50%;
  background: radial-gradient(circle at center, #1a1a1a 8px, transparent 9px), linear-gradient(135deg, var(--green) 0%, #0a5a2a 100%);
  box-shadow: inset 0 2px 4px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.4);
  z-index: 2;
}
.pl-root .playlist-cover::after {
  content: ''; position: absolute; top: 0; left: 0; width: 232px; height: 232px; border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%);
  pointer-events: none; opacity: 0.5; transition: opacity 0.3s ease;
}
.pl-root .playlist-cover:hover::after { opacity: 1; }
.pl-root .cover-art:hover { animation: vinylSpinPl 2s linear infinite; }
@keyframes vinylSpinPl { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* tonearm */
.pl-root .tonearm { position: absolute; top: -5px; right: 5px; z-index: 10; }
.pl-root .tonearm-base { width: 24px; height: 24px; background: radial-gradient(circle, #666 0%, #333 100%); border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.5); position: relative; z-index: 2; }
.pl-root .tonearm-arm {
  position: absolute; top: 8px; left: 8px; width: 130px; height: 6px;
  background: linear-gradient(180deg, #777 0%, #444 50%, #555 100%);
  border-radius: 3px; transform-origin: 4px center; transform: rotate(90deg);
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}
.pl-root .tonearm-head { position: absolute; right: -4px; top: -4px; width: 14px; height: 14px; background: linear-gradient(135deg, #888 0%, #555 100%); border-radius: 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.4); }

/* info */
.pl-root .playlist-info { position: relative; display: flex; flex-direction: column; justify-content: flex-end; }
.pl-root .playlist-label { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 8px; }
.pl-root.panel-open .playlist-label { display: none; }
.pl-root .playlist-title {
  font-size: 96px; font-weight: 900; letter-spacing: 2px; line-height: 1; margin-bottom: 16px;
  transition: font-size 0.6s cubic-bezier(0.22, 1, 0.36, 1), letter-spacing 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.pl-root.panel-open .playlist-title { font-size: 24px; letter-spacing: 1px; margin-bottom: 4px; }
.pl-root .playlist-title .word { display: inline-block; white-space: nowrap; }
.pl-root .playlist-title .letter { display: inline-block; opacity: 0; transform: translateY(20px); animation: letterRevealPl 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes letterRevealPl { to { opacity: 1; transform: translateY(0); } }
.pl-root .playlist-meta { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text-muted); margin-bottom: 8px; }
.pl-root.panel-open .playlist-meta { font-size: 12px; margin-bottom: 0; }
.pl-root .artist-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.pl-root .artist-name { color: var(--white); font-weight: 600; cursor: pointer; transition: color 0.2s ease; }
.pl-root .artist-name:hover { color: var(--green); }
.pl-root .meta-dot { color: var(--text-subdued); }
.pl-root .playlist-desc { font-size: 14px; color: var(--text-muted); margin-bottom: 24px; max-width: 500px; transition: opacity 0.3s ease; }
.pl-root.panel-open .playlist-desc { opacity: 0; height: 0; margin: 0; overflow: hidden; }
.pl-root .mobile-break { display: none; }
.pl-root .playlist-actions { display: flex; align-items: center; gap: 24px; transition: opacity 0.3s ease; }
.pl-root.panel-open .playlist-actions { opacity: 0; height: 0; overflow: hidden; }

.pl-root .play-btn { width: 56px; height: 56px; border-radius: 50%; background: var(--green); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
.pl-root .play-btn:hover { transform: scale(1.06); background: var(--green-bright); }
.pl-root .play-btn svg { width: 24px; height: 24px; margin-left: 4px; color: var(--bg); }
.pl-root .play-btn svg.icon-pause { margin-left: 0; }

.pl-root .social-icons { display: flex; align-items: center; gap: 16px; margin-left: 8px; }
.pl-root .social-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: color 0.2s ease, transform 0.2s ease; }
.pl-root .social-icon:hover { color: var(--white); transform: scale(1.1); }
.pl-root .social-icon svg { width: 20px; height: 20px; }

/* star easter egg */
.pl-root .scribble-star { position: absolute; top: 40px; right: 60px; width: 40px; height: 40px; animation: twinklePl 2s ease-in-out infinite; cursor: pointer; transition: transform 0.3s ease; z-index: 20; }
.pl-root .scribble-star:hover { transform: scale(1.2) rotate(15deg); }
.pl-root .scribble-star:active { transform: scale(0.9); }
.pl-root.panel-open .scribble-star { display: none; }
@keyframes twinklePl { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
.star-particle { position: fixed; pointer-events: none; z-index: 1001; font-size: 20px; animation: starBurstPl 1s ease-out forwards; }
@keyframes starBurstPl {
  0% { opacity: 1; transform: translate(0, 0) scale(1) rotate(0deg); }
  100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0) rotate(360deg); }
}

/* secret popover */
.pl-root .secret-popover {
  position: absolute; top: 160px; left: 0; width: 400px; border-radius: 20px; overflow: hidden;
  background: rgba(30, 30, 30, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 40px rgba(29, 185, 84, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  opacity: 0; visibility: hidden; transform: translateY(-10px) scale(0.95);
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); z-index: 1000;
}
.pl-root .secret-popover.active { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
.pl-root .secret-close { position: absolute; top: 10px; right: 10px; width: 32px; height: 32px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; z-index: 10; }
.pl-root .secret-close:hover { color: var(--white); background: rgba(255,255,255,0.2); transform: rotate(90deg) scale(1.1); }
.pl-root .secret-close svg { width: 16px; height: 16px; }
.pl-root .secret-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; }
.pl-root .secret-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.pl-root .secret-message { color: #b3b3b3; font-size: 14px; font-weight: 400; text-align: left; line-height: 1.5; }

/* track list */
.pl-root .track-list { padding-top: 16px; }
.pl-root .track-header {
  display: grid; grid-template-columns: 48px 1fr 200px 80px; gap: 16px; padding: 8px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 8px;
  color: var(--text-subdued); font-size: 12px; font-weight: 500; letter-spacing: 0.1em;
}
.pl-root .track-header svg { width: 16px; height: 16px; }
.pl-root .track {
  display: grid; grid-template-columns: 48px 1fr 200px 80px; gap: 16px; padding: 12px 16px;
  border-radius: 8px; cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease;
  position: relative; opacity: 0; transform: translateY(20px);
  animation: trackFadeInPl 0.5s ease forwards;
}
@keyframes trackFadeInPl { to { opacity: 1; transform: translateY(0); } }
.pl-root .track:hover { background: var(--bg-highlight); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(29, 185, 84, 0.1); }
.pl-root .track.active { background: rgba(29, 185, 84, 0.1); }
.pl-root .track.active .track-title { color: var(--green); }
.pl-root .track.active .track-num { color: var(--green); }
.pl-root .track-num { font-size: 16px; color: var(--text-muted); display: flex; align-items: center; justify-content: center; }
.pl-root .track-header .track-num { font-size: 12px; }
.pl-root .track-info { display: flex; flex-direction: column; justify-content: center; min-width: 0; }
.pl-root .track-title { font-size: 16px; font-weight: 500; color: var(--white); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pl-root .track-artist { font-size: 14px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pl-root .track-tool { font-size: 14px; color: var(--text-muted); display: flex; align-items: center; }
.pl-root .track-header .track-tool { font-size: 12px; color: var(--text-subdued); }
.pl-root .track-duration { font-size: 14px; color: var(--text-muted); display: flex; align-items: center; justify-content: flex-end; }
.pl-root .track-header .track-duration { font-size: 12px; }

/* video panel */
.pl-root .video-panel {
  position: fixed; top: 16px; right: 16px; width: calc(50% - 32px); height: calc(100vh - 32px);
  background: linear-gradient(160deg, rgba(40, 40, 40, 0.35) 0%, rgba(24, 24, 24, 0.45) 50%, rgba(30, 40, 35, 0.4) 100%);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  transform: translateX(calc(100% + 32px));
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
  z-index: 50; display: flex; flex-direction: column;
  border-radius: 16px; border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 100px rgba(29, 185, 84, 0.08);
  overflow: hidden; opacity: 0;
}
.pl-root .video-panel.active { transform: translateX(0); opacity: 1; }
.pl-root .panel-close {
  position: absolute; top: 24px; right: 24px; width: 40px; height: 40px;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); border-radius: 50%;
  cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); z-index: 10; backdrop-filter: blur(10px);
}
.pl-root .panel-close:hover { color: var(--white); background: rgba(255,255,255,0.2); transform: rotate(90deg) scale(1.1); }
.pl-root .panel-close svg { width: 20px; height: 20px; }
.pl-root .panel-content { flex: 1; display: flex; flex-direction: column; padding: 40px 40px 24px; overflow-y: auto; }
.pl-root .panel-video { width: 100%; aspect-ratio: 16/9; background: var(--bg); border-radius: 12px; overflow: hidden; margin-bottom: 20px; position: relative; flex-shrink: 0; }
.pl-root .panel-video img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; background: var(--bg); }
.pl-root .panel-info { flex: 1; display: flex; flex-direction: column; }
.pl-root .panel-title-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 8px; }
.pl-root .panel-title { font-size: 32px; font-weight: 700; color: var(--white); flex: 1; min-width: 0; }
.pl-root .try-it-btn {
  padding: 8px 16px; background: transparent; border: 1px solid var(--green); border-radius: 20px; color: var(--green);
  font-size: 14px; font-weight: 500; white-space: nowrap; cursor: pointer; text-decoration: none; line-height: 1.2; flex-shrink: 0;
  transition: background 0.2s ease, color 0.2s ease;
}
.pl-root .try-it-btn:hover { background: var(--green); color: var(--bg); }
.pl-root .panel-artist { font-size: 16px; color: var(--green); margin-bottom: 16px; }
.pl-root .panel-desc { font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 20px; flex: 1; }
.pl-root .panel-desc a { color: var(--green); text-decoration: none; font-weight: 500; transition: color 0.2s ease; }
.pl-root .panel-desc a:hover { color: var(--green-bright); text-decoration: underline; }
.pl-root .panel-controls { display: flex; align-items: center; justify-content: center; gap: 24px; margin-bottom: 24px; }
.pl-root .panel-control-btn { width: 48px; height: 48px; background: none; border: none; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
.pl-root .panel-control-btn:hover { color: var(--white); transform: scale(1.1); }
.pl-root .panel-control-btn svg { width: 24px; height: 24px; }
.pl-root .panel-play-btn { width: 64px; height: 64px; background: var(--green); border-radius: 50%; color: var(--bg); }
.pl-root .panel-play-btn:hover { background: var(--green-bright); color: var(--bg); }
.pl-root .panel-play-btn svg { width: 28px; height: 28px; }
.pl-root .panel-play-btn .icon-play { transform: translateX(2px); }
.pl-root .panel-play-btn .icon-pause { display: none; }
.pl-root .panel-play-btn.playing .icon-play { display: none; }
.pl-root .panel-play-btn.playing .icon-pause { display: block; }
.pl-root .panel-progress { display: flex; align-items: center; gap: 12px; }
.pl-root .panel-time { font-size: 12px; color: var(--text-muted); font-variant-numeric: tabular-nums; min-width: 40px; }
.pl-root .panel-time:last-child { text-align: right; }
.pl-root .panel-progress-bar { flex: 1; height: 4px; background: var(--bg-highlight); border-radius: 2px; cursor: pointer; overflow: hidden; }
.pl-root .panel-progress-fill { height: 100%; background: var(--green); transition: width 0.1s linear; }
.pl-root .panel-progress-bar:hover .panel-progress-fill { background: var(--green-bright); }

/* vinyl drop */
.pl-root .panel-vinyl-drop {
  position: fixed; top: -100px; left: 44px; transform: translate(-50%, 0) rotate(0deg) scale(1);
  width: 100px; height: 100px; opacity: 0; pointer-events: none; z-index: 999;
  animation: vinylDropPl 1.4s ease-out forwards; animation-delay: 0.1s;
}
.pl-root .panel-vinyl-record {
  width: 100%; height: 100%; border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, transparent 18%, #1a1a1a 19%, #1a1a1a 21%, transparent 22%),
    radial-gradient(circle at 50% 50%, transparent 35%, rgba(30,30,30,0.8) 36%, rgba(30,30,30,0.8) 38%, transparent 39%),
    radial-gradient(circle at 50% 50%, transparent 55%, rgba(25,25,25,0.6) 56%, rgba(25,25,25,0.6) 58%, transparent 59%),
    radial-gradient(circle at 50% 50%, transparent 75%, rgba(20,20,20,0.4) 76%, rgba(20,20,20,0.4) 78%, transparent 79%),
    linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 50%, #1a1a1a 100%);
  box-shadow: 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
  animation: vinylSpinPl 3s linear infinite;
}
.pl-root .panel-vinyl-grooves { position: absolute; top: 10%; left: 10%; width: 80%; height: 80%; border-radius: 50%; background: repeating-radial-gradient(circle at center, transparent 0px, transparent 1px, rgba(0,0,0,0.3) 2px, transparent 3px); }
.pl-root .panel-vinyl-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 35%; height: 35%; border-radius: 50%; background: linear-gradient(145deg, var(--green) 0%, #15803d 100%); box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); }
.pl-root .panel-vinyl-label::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 15%; height: 15%; border-radius: 50%; background: #111; }
@keyframes vinylDropPl {
  0% { top: -100px; left: 44px; transform: translate(-50%, 0) rotate(0deg) scale(1); opacity: 0; }
  5% { opacity: 1; }
  85% { opacity: 1; }
  100% { top: calc(100vh - 52px); left: 44px; transform: translate(-50%, -50%) rotate(720deg) scale(0.35); opacity: 0; }
}

/* now playing bar */
.pl-root .now-playing {
  position: fixed; bottom: 0; left: 0; right: 0; height: 72px; background: var(--bg-elevated);
  border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; z-index: 100;
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1), left 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.4s ease, opacity 0.4s ease;
}
.pl-root.panel-open .now-playing { width: 50%; right: auto; }
.pl-root .now-playing-left { display: flex; align-items: center; gap: 16px; min-width: 0; }
.pl-root .now-playing-thumb { width: 56px; height: 56px; min-width: 56px; background: var(--bg-highlight); border-radius: 4px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.pl-root .mini-vinyl {
  width: 48px; height: 48px; border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 100%);
  position: relative; opacity: 0.3; transition: opacity 0.3s ease;
}
.pl-root .mini-vinyl-groove { position: absolute; inset: 4px; border-radius: 50%; background: repeating-radial-gradient(circle at center, transparent 0px, transparent 2px, rgba(40,40,40,0.8) 2px, rgba(40,40,40,0.8) 3px); }
.pl-root .mini-vinyl-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 18px; height: 18px; border-radius: 50%; background: radial-gradient(circle at center, #1a1a1a 3px, transparent 4px), linear-gradient(135deg, var(--green) 0%, #0a5a2a 100%); box-shadow: inset 0 1px 2px rgba(255,255,255,0.2); }
.pl-root .now-playing-thumb.playing .mini-vinyl { opacity: 1; animation: miniVinylSpinPl 2s linear infinite; }
@keyframes miniVinylSpinPl { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.pl-root .now-playing-text { display: flex; flex-direction: column; min-width: 0; max-width: 200px; }
.pl-root .now-playing-title { font-size: 14px; font-weight: 500; color: var(--white); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pl-root .now-playing-artist { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pl-root .now-playing-controls { display: flex; align-items: center; gap: 16px; }
.pl-root .control-btn { width: 32px; height: 32px; background: none; border: none; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: color 0.2s ease; }
.pl-root .control-btn:hover { color: var(--white); }
.pl-root .control-btn svg { width: 16px; height: 16px; }
.pl-root .control-btn.play-pause { width: 40px; height: 40px; background: var(--white); border-radius: 50%; color: var(--bg); }
.pl-root .control-btn.play-pause:hover { transform: scale(1.06); color: var(--bg); }
.pl-root .control-btn.play-pause svg { width: 18px; height: 18px; }
.pl-root .control-btn.play-pause .icon-pause { display: none; }
.pl-root .control-btn.play-pause.playing .icon-play { display: none; }
.pl-root .control-btn.play-pause.playing .icon-pause { display: block; }
.pl-root .now-playing-progress { display: flex; align-items: center; gap: 12px; justify-content: flex-end; }
.pl-root .progress-time { font-size: 12px; color: var(--text-muted); font-variant-numeric: tabular-nums; min-width: 40px; }
.pl-root .progress-bar { width: 200px; height: 4px; background: var(--bg-highlight); border-radius: 2px; overflow: hidden; cursor: pointer; }
.pl-root .progress-fill { height: 100%; background: var(--green); transition: width 0.1s linear; }
.pl-root .progress-bar:hover .progress-fill { background: var(--green-bright); }

/* responsive */
@media (max-width: 900px) {
  .pl-root .playlist-header { flex-direction: column; align-items: center; text-align: center; padding: 40px 24px; }
  .pl-root .playlist-info { align-items: center; }
  .pl-root .playlist-title { font-size: 48px; }
  .pl-root .scribble-star { top: 60px; right: 20px; width: 35px; height: 35px; }
  .pl-root .playlist-cover::after { display: none; }
  .pl-root .track-header, .pl-root .track { grid-template-columns: 32px 1fr 60px; }
  .pl-root .track-tool { display: none; }
  .pl-root .video-panel { width: calc(100% - 32px); }
  .pl-root.panel-open .now-playing { transform: translateY(100%); opacity: 0; pointer-events: none; }
  .pl-root .now-playing-progress { display: none; }
}
@media (max-width: 600px) {
  .pl-root .cover-art { width: 160px; height: 160px; }
  .pl-root .playlist-title { font-size: 36px; letter-spacing: -1px; }
  .pl-root .mobile-break { display: block; }
  .pl-root .playlist-container { padding: 16px; padding-bottom: 100px; }
  .pl-root .video-panel { top: 0; right: 0; width: 100%; height: 100vh; border-radius: 0; transform: translateY(100%); }
  .pl-root .video-panel.active { transform: translateY(0); }
  .pl-root.panel-open .playlist-container { width: 100%; max-width: 100%; }
  .pl-root .panel-content { padding: 50px 20px 16px; }
  .pl-root .panel-video { margin-bottom: 16px; }
  .pl-root .panel-title { font-size: 24px; }
  .pl-root .panel-artist { margin-bottom: 10px; }
  .pl-root .panel-desc { font-size: 14px; flex: 0; margin-bottom: 24px; }
  .pl-root .try-it-btn { padding: 6px 14px; font-size: 13px; }
  .pl-root .panel-controls { gap: 16px; }
  .pl-root .panel-control-btn { width: 44px; height: 44px; }
  .pl-root .panel-play-btn { width: 56px; height: 56px; }
  .pl-root .track-title { font-size: 14px; max-width: 150px; }
  .pl-root .track-artist { font-size: 12px; max-width: 150px; }
  .pl-root .now-playing { padding: 8px 12px; gap: 8px; }
  .pl-root .now-playing-thumb { width: 40px; height: 40px; min-width: 40px; }
  .pl-root .mini-vinyl { width: 34px; height: 34px; }
  .pl-root .now-playing-title { font-size: 12px; }
  .pl-root .now-playing-artist { font-size: 10px; }
  .pl-root .panel-vinyl-drop { display: none; }
  .pl-root .secret-popover { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95); width: calc(100vw - 32px); max-width: 350px; }
  .pl-root .secret-popover.active { transform: translate(-50%, -50%) scale(1); }
  .pl-root .video-panel::after { content: ''; position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 40px; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; }
  .pl-root .grain { z-index: 1; }
}
`;
