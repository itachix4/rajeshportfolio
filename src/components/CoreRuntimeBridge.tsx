import { useEffect, useRef, useState } from "react";

export type CoreCommand = "wireframe" | "grid" | "a11y" | "metrics" | "pause" | "scrub" | "overload" | "restore" | "source-pulse" | "highlight";
export type CoreCommandDetail = { command: CoreCommand; enabled?: boolean; value?: number; selector?: string };

const CLASS_MAP: Partial<Record<CoreCommand, string>> = {
  wireframe: "core-wireframe", grid: "core-layout-grid", a11y: "core-a11y-sim", metrics: "core-metrics-on",
};

const CoreRuntimeBridge = () => {
  const [pulse, setPulse] = useState(false);
  const pulseTimer = useRef<number | null>(null);
  const overloadTimer = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const cleanupTransient = () => {
      root.classList.remove("core-source-pulse", "core-overload");
      setPulse(false);
    };
    const handle = (event: Event) => {
      const { command, enabled = true, value = 0, selector } = (event as CustomEvent<CoreCommandDetail>).detail;
      const className = CLASS_MAP[command];
      if (className) root.classList.toggle(className, enabled);
      if (command === "pause") document.getAnimations().forEach((animation) => enabled ? animation.pause() : animation.play());
      if (command === "scrub") document.getAnimations().forEach((animation) => {
        const duration = Number(animation.effect?.getTiming().duration) || 0;
        if (duration > 0) animation.currentTime = duration * value;
      });
      if (command === "highlight" && selector) {
        document.querySelectorAll(".core-runtime-highlight").forEach((node) => node.classList.remove("core-runtime-highlight"));
        document.querySelector(selector)?.classList.add("core-runtime-highlight");
      }
      if (command === "overload") {
        root.classList.add("core-overload");
        if (overloadTimer.current) window.clearTimeout(overloadTimer.current);
        overloadTimer.current = window.setTimeout(() => root.classList.remove("core-overload"), 2300);
      }
      if (command === "restore") {
        Object.values(CLASS_MAP).forEach((name) => root.classList.remove(name));
        cleanupTransient();
        document.getAnimations().forEach((animation) => animation.play());
        document.querySelectorAll(".core-runtime-highlight").forEach((node) => node.classList.remove("core-runtime-highlight"));
      }
      if (command === "source-pulse") {
        root.classList.add("core-source-pulse"); setPulse(true);
        if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
        pulseTimer.current = window.setTimeout(() => { root.classList.remove("core-source-pulse"); setPulse(false); }, 4200);
      }
    };
    window.addEventListener("parth-core-command", handle);
    try {
      const selector = window.sessionStorage.getItem("parth-core-highlight-selector");
      if (selector) {
        window.sessionStorage.removeItem("parth-core-highlight-selector");
        window.setTimeout(() => document.querySelector(selector)?.classList.add("core-runtime-highlight"), 900);
      }
    } catch { /* Highlight hand-off is optional. */ }
    return () => {
      window.removeEventListener("parth-core-command", handle); cleanupTransient();
      Object.values(CLASS_MAP).forEach((name) => root.classList.remove(name));
      if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
      if (overloadTimer.current) window.clearTimeout(overloadTimer.current);
    };
  }, []);

  return pulse ? <div className="core-pulse-overlay" aria-live="polite"><div><span>SOURCE PULSE</span><strong>RUNTIME ARCHITECTURE VISIBLE</strong></div>{Array.from({ length: 11 }, (_, index) => <i key={index} style={{ "--pulse-index": index } as React.CSSProperties} />)}</div> : null;
};

export const dispatchCoreCommand = (detail: CoreCommandDetail) => window.dispatchEvent(new CustomEvent<CoreCommandDetail>("parth-core-command", { detail }));
export default CoreRuntimeBridge;
