"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { CURSORKIT_CLASS, CURSORKIT_PREF_KEY } from "@/lib/cursorkit";

/**
 * Off/on switch for CursorKit, parked just left of CursorKit's own launcher.
 *
 * Only renders once the (lazy-loaded) CursorKit script is present — a switch
 * with nothing behind it would just be a dead button.
 */
export function CursorToggle() {
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(false);
  // Guards the observer from persisting CursorKit's own boot before we've had
  // a chance to apply the saved preference — otherwise "off" gets overwritten
  // by the very boot we're about to undo.
  const settled = useRef(false);

  // Apply the saved preference as soon as CursorKit shows up.
  useEffect(() => {
    let pref: string | null = null;
    try {
      pref = localStorage.getItem(CURSORKIT_PREF_KEY);
    } catch {}

    let cancelled = false;
    let timer: number | undefined;
    const startedAt = Date.now();

    const settle = () => {
      settled.current = true;
      setReady(true);
    };

    const tick = () => {
      if (cancelled) return;
      const ck = window.CursorKit;
      if (ck) {
        if (pref === "off") ck.destroy?.();
        settle();
        return;
      }
      // lazyOnload means the script lands after page load; give up eventually
      // rather than polling forever on a blocked/failed fetch.
      if (Date.now() - startedAt > 15000) return;
      timer = window.setTimeout(tick, 120);
    };

    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Mirror CursorKit's actual state, whichever way it was changed — our button
  // or the visitor picking a cursor in CursorKit's own panel.
  useEffect(() => {
    const html = document.documentElement;
    const sync = () => {
      const active = html.classList.contains(CURSORKIT_CLASS);
      setOn(active);
      if (settled.current) {
        try {
          localStorage.setItem(CURSORKIT_PREF_KEY, active ? "on" : "off");
        } catch {}
      }
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const ck = window.CursorKit;
    if (!ck) return;
    if (document.documentElement.classList.contains(CURSORKIT_CLASS)) {
      ck.destroy?.();
    } else {
      ck.boot?.();
    }
    // The MutationObserver above handles state + persistence.
  }, []);

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      // Keep the native arrow on this control: choosing a cursor is easier
      // when the switch itself isn't wearing one.
      data-cursor="native"
      aria-pressed={on}
      title={on ? "Switch back to the portfolio cursor" : "Turn the CursorKit cursor back on"}
      aria-label={on ? "Turn off CursorKit cursor" : "Turn on CursorKit cursor"}
      className="cursor-toggle-btn"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 3l7.5 17 2.3-6.7 6.7-2.3z" />
        {!on && <line x1="3" y1="21" x2="21" y2="3" />}
      </svg>
    </button>
  );
}
