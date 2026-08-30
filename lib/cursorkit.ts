/**
 * Shared knowledge about CursorKit's presence on the page.
 *
 * CursorKit adds `cursorkit-on` to <html> whenever its engine is driving the
 * cursor, and removes it on destroy(). That class is the single source of
 * truth — read it at event time rather than mirroring it into React state, so
 * there's no stale-state window and no re-render on every toggle.
 */

export const CURSORKIT_CLASS = "cursorkit-on";

/** localStorage key for the visitor's own on/off choice. */
export const CURSORKIT_PREF_KEY = "portfolio-cursorkit";

export type CursorKitApi = {
  boot?: () => void;
  destroy?: () => void;
  dashboard?: { open?: () => void; close?: () => void };
};

declare global {
  interface Window {
    CursorKit?: CursorKitApi;
  }
}

/** True when CursorKit is currently drawing the cursor. */
export function isCursorKitActive(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains(CURSORKIT_CLASS)
  );
}
