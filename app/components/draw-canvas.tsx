"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

const RESET_INTERVAL_MS = 6 * 60 * 60 * 1000; // canvas auto-clears every 6 hours
const COLORS = ["#1c1917", "#dc2626", "#2563eb", "#16a34a", "#ea580c", "#9333ea"];
const WIDTHS = [2, 4, 8];
const ERASE_RADIUS = 16;
const SECRET_CLICKS = 12;
const SECRET_WINDOW_MS = 8000;

type Point = { x: number; y: number }; // percentages, 0-100
type Stroke = { uid: string; clientId: string; points: Point[]; color: string; width: number };

function currentWindowStart() {
  return Math.floor(Date.now() / RESET_INTERVAL_MS) * RESET_INTERVAL_MS;
}

function getClientId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("canvas-client-id");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("canvas-client-id", id);
  }
  return id;
}

function distToSegment(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const projX = a.x + t * dx, projY = a.y + t * dy;
  return Math.hypot(p.x - projX, p.y - projY);
}

export function DrawCanvas({ isMobile = false }: { isMobile?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const activeStrokeRef = useRef<Stroke | null>(null);
  const drawingRef = useRef(false);
  const erasingRef = useRef(false);
  const pendingPointRef = useRef<Point | null>(null);
  const rafRef = useRef<number | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const clientIdRef = useRef(getClientId());
  const remoteLastPointRef = useRef<Map<string, Point>>(new Map());
  const remoteBufferRef = useRef<Map<string, { points: Point[]; color: string; width: number; clientId: string }>>(new Map());
  const redClickCountRef = useRef(0);
  const redClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [color, setColor] = useState(COLORS[0]);
  const [width, setWidth] = useState(WIDTHS[1]);
  const [tool, setTool] = useState<"draw" | "erase">("draw");
  const [loading, setLoading] = useState(true);
  const [peopleCount, setPeopleCount] = useState(1);
  const [strokeCount, setStrokeCount] = useState(0);
  // "offline" means the realtime backend is unreachable. Drawing still works
  // locally, but nothing is shared or saved — say so rather than leaving the
  // board looking like it synced.
  const [connection, setConnection] = useState<"connecting" | "live" | "offline">("connecting");

  const colorRef = useRef(color);
  const widthRef = useRef(width);
  const toolRef = useRef(tool);
  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { widthRef.current = width; }, [width]);
  useEffect(() => { toolRef.current = tool; }, [tool]);

  const getCtx = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
    return ctx;
  }, []);

  const drawSegment = useCallback((from: Point, to: Point, strokeColor: string, strokeWidth: number) => {
    const ctx = getCtx();
    const wrap = wrapRef.current;
    if (!ctx || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo((from.x / 100) * rect.width, (from.y / 100) * rect.height);
    ctx.lineTo((to.x / 100) * rect.width, (to.y / 100) * rect.height);
    ctx.stroke();
  }, [getCtx]);

  const drawDot = useCallback((p: Point, strokeColor: string, strokeWidth: number) => {
    const ctx = getCtx();
    const wrap = wrapRef.current;
    if (!ctx || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc((p.x / 100) * rect.width, (p.y / 100) * rect.height, strokeWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  }, [getCtx]);

  const redrawAll = useCallback(() => {
    const ctx = getCtx();
    const wrap = wrapRef.current;
    if (!ctx || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    for (const s of strokesRef.current) {
      if (s.points.length === 0) continue;
      if (s.points.length === 1) { drawDot(s.points[0], s.color, s.width); continue; }
      for (let i = 1; i < s.points.length; i++) {
        drawSegment(s.points[i - 1], s.points[i], s.color, s.width);
      }
    }
  }, [getCtx, drawDot, drawSegment]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = getCtx();
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redrawAll();
  }, [getCtx, redrawAll]);

  // Initial load: lazily clear stale window, then fetch this window's strokes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const windowStart = new Date(currentWindowStart()).toISOString();
      await supabase.from("strokes").delete().lt("created_at", windowStart);
      const { data } = await supabase
        .from("strokes")
        .select("client_stroke_id, client_id, points, color, width")
        .order("created_at", { ascending: true })
        .limit(2000);
      if (cancelled) return;
      if (data) {
        strokesRef.current = data.map((d) => ({
          uid: d.client_stroke_id as string,
          clientId: d.client_id as string,
          points: d.points as Point[],
          color: d.color as string,
          width: d.width as number,
        }));
        setStrokeCount(strokesRef.current.length);
      }
      setLoading(false);
      resizeCanvas();
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resize observer
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const obs = new ResizeObserver(() => resizeCanvas());
    obs.observe(wrap);
    return () => obs.disconnect();
  }, [resizeCanvas]);

  // Realtime channel: live broadcast of in-progress strokes, erases, clears + presence
  useEffect(() => {
    const channel = supabase.channel("canvas-live", {
      config: { broadcast: { self: false }, presence: { key: clientIdRef.current } },
    });

    channel.on("broadcast", { event: "point" }, ({ payload }) => {
      const { uid, x, y, color: c, width: w, start, clientId } = payload as {
        uid: string; x: number; y: number; color: string; width: number; start: boolean; clientId: string;
      };
      const p = { x, y };
      if (start) {
        drawDot(p, c, w);
        remoteBufferRef.current.set(uid, { points: [p], color: c, width: w, clientId });
      } else {
        const last = remoteLastPointRef.current.get(uid);
        if (last) drawSegment(last, p, c, w);
        const buf = remoteBufferRef.current.get(uid);
        if (buf) buf.points.push(p);
      }
      remoteLastPointRef.current.set(uid, p);
    });

    channel.on("broadcast", { event: "end" }, ({ payload }) => {
      const { uid } = payload as { uid: string };
      remoteLastPointRef.current.delete(uid);
      const buf = remoteBufferRef.current.get(uid);
      if (buf) {
        strokesRef.current.push({ uid, clientId: buf.clientId, points: buf.points, color: buf.color, width: buf.width });
        setStrokeCount(strokesRef.current.length);
        remoteBufferRef.current.delete(uid);
      }
    });

    channel.on("broadcast", { event: "erase" }, ({ payload }) => {
      const { uid } = payload as { uid: string };
      strokesRef.current = strokesRef.current.filter((s) => s.uid !== uid);
      setStrokeCount(strokesRef.current.length);
      redrawAll();
    });

    channel.on("broadcast", { event: "clear-all" }, () => {
      strokesRef.current = [];
      setStrokeCount(0);
      redrawAll();
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      setPeopleCount(Math.max(1, Object.keys(state).length));
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        setConnection("live");
        await channel.track({ online_at: Date.now() });
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
        // Reached when the Supabase project is paused, deleted, or otherwise
        // unreachable. Previously this was swallowed and the board silently
        // stopped syncing while still looking healthy.
        setConnection("offline");
        setPeopleCount(1);
      }
    });

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [drawDot, drawSegment, redrawAll]);

  const pointFromEvent = useCallback((e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = wrapRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const flushPending = useCallback((uid: string) => {
    rafRef.current = null;
    const p = pendingPointRef.current;
    if (!p) return;
    pendingPointRef.current = null;
    channelRef.current?.send({
      type: "broadcast",
      event: "point",
      payload: { uid, x: p.x, y: p.y, color: colorRef.current, width: widthRef.current, start: false, clientId: clientIdRef.current },
    });
  }, []);

  const eraseAt = useCallback(async (p: Point) => {
    const mine = strokesRef.current.filter((s) => s.clientId === clientIdRef.current);
    for (const s of mine) {
      const threshold = Math.max(s.width, ERASE_RADIUS);
      let hit = s.points.length === 1 && Math.hypot(p.x - s.points[0].x, p.y - s.points[0].y) < threshold / 8;
      if (!hit) {
        for (let i = 1; i < s.points.length; i++) {
          if (distToSegment(p, s.points[i - 1], s.points[i]) < threshold / 8) { hit = true; break; }
        }
      }
      if (hit) {
        strokesRef.current = strokesRef.current.filter((x) => x.uid !== s.uid);
        setStrokeCount(strokesRef.current.length);
        redrawAll();
        channelRef.current?.send({ type: "broadcast", event: "erase", payload: { uid: s.uid } });
        await supabase.from("strokes").delete().eq("client_stroke_id", s.uid);
        return;
      }
    }
  }, [redrawAll]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (loading) return;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    const p = pointFromEvent(e);

    if (toolRef.current === "erase") {
      erasingRef.current = true;
      eraseAt(p);
      return;
    }

    drawingRef.current = true;
    const uid = clientIdRef.current + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
    const stroke: Stroke = { uid, clientId: clientIdRef.current, points: [p], color: colorRef.current, width: widthRef.current };
    activeStrokeRef.current = stroke;
    drawDot(p, stroke.color, stroke.width);
    channelRef.current?.send({
      type: "broadcast",
      event: "point",
      payload: { uid, x: p.x, y: p.y, color: stroke.color, width: stroke.width, start: true, clientId: clientIdRef.current },
    });
  }, [loading, pointFromEvent, drawDot, eraseAt]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (erasingRef.current) {
      eraseAt(pointFromEvent(e));
      return;
    }
    if (!drawingRef.current || !activeStrokeRef.current) return;
    const p = pointFromEvent(e);
    const stroke = activeStrokeRef.current;
    const last = stroke.points[stroke.points.length - 1];
    stroke.points.push(p);
    drawSegment(last, p, stroke.color, stroke.width);
    pendingPointRef.current = p;
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => flushPending(stroke.uid));
    }
  }, [pointFromEvent, drawSegment, flushPending, eraseAt]);

  const handlePointerUp = useCallback(async () => {
    if (erasingRef.current) { erasingRef.current = false; return; }
    if (!drawingRef.current || !activeStrokeRef.current) return;
    drawingRef.current = false;
    const stroke = activeStrokeRef.current;
    activeStrokeRef.current = null;
    channelRef.current?.send({ type: "broadcast", event: "end", payload: { uid: stroke.uid } });
    if (stroke.points.length === 0) return;
    strokesRef.current.push(stroke);
    setStrokeCount(strokesRef.current.length);
    await supabase.from("strokes").insert({
      client_stroke_id: stroke.uid,
      client_id: stroke.clientId,
      points: stroke.points,
      color: stroke.color,
      width: stroke.width,
    });
  }, []);

  const clearBoard = useCallback(async () => {
    strokesRef.current = [];
    setStrokeCount(0);
    redrawAll();
    channelRef.current?.send({ type: "broadcast", event: "clear-all", payload: {} });
    await supabase.from("strokes").delete().gt("id", 0);
  }, [redrawAll]);

  const handleColorClick = useCallback((c: string) => {
    setColor(c);
    setTool("draw");
    if (c === "#dc2626") {
      redClickCountRef.current += 1;
      if (redClickTimerRef.current) clearTimeout(redClickTimerRef.current);
      redClickTimerRef.current = setTimeout(() => { redClickCountRef.current = 0; }, SECRET_WINDOW_MS);
      if (redClickCountRef.current >= SECRET_CLICKS) {
        redClickCountRef.current = 0;
        if (redClickTimerRef.current) clearTimeout(redClickTimerRef.current);
        clearBoard();
      }
    } else {
      redClickCountRef.current = 0;
    }
  }, [clearBoard]);

  const sizeBtn = (active: boolean) =>
    `rounded-full transition-all ${active ? "ring-2 ring-offset-2 ring-stone-800" : "opacity-50 hover:opacity-80"}`;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 flex-wrap gap-2">
        <div>
          <div className="text-[12px] text-stone-400 uppercase tracking-[0.2em] font-mono">Live Canvas</div>
          <div className="text-[13px] text-stone-500 mt-0.5">
            {loading
              ? "Loading canvas…"
              : connection === "offline"
              ? "Offline — you can draw, but nothing is shared or saved"
              : `${peopleCount} ${peopleCount === 1 ? "person" : "people"} here now · ${strokeCount} stroke${strokeCount !== 1 ? "s" : ""}`}
          </div>
        </div>
        {!loading && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => handleColorClick(c)}
                  className={`w-5 h-5 rounded-full border border-black/10 transition-transform ${tool === "draw" && color === c ? "scale-125 ring-2 ring-offset-1 ring-stone-400" : "hover:scale-110"}`}
                  style={{ background: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {WIDTHS.map((w) => (
                <button
                  key={w}
                  onClick={() => { setWidth(w); setTool("draw"); }}
                  className={`${sizeBtn(tool === "draw" && width === w)} bg-stone-700`}
                  style={{ width: w + 8, height: w + 8 }}
                  aria-label={`Brush size ${w}`}
                />
              ))}
            </div>
            <button
              onClick={() => setTool(tool === "erase" ? "draw" : "erase")}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                tool === "erase" ? "bg-stone-800 text-white border-stone-800" : "text-stone-500 border-stone-300 hover:text-stone-700"
              }`}
              title="Erase your own strokes"
            >
              Eraser
            </button>
          </div>
        )}
      </div>

      <div
        ref={wrapRef}
        className="flex-1 relative mx-3 mb-3 rounded-lg overflow-hidden"
        style={{ background: "#FAF8F5", cursor: tool === "erase" ? "cell" : "crosshair", touchAction: "none" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        {!loading && strokeCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-[14px] text-stone-400">{isMobile ? "Draw something — visitors see it live" : "Draw something — everyone here sees it live"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
