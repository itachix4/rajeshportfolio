"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* Custom cursor: a snappy dot and a trailing ring. The ring grows over
   interactive elements and morphs into a labelled chip over surfaces that
   declare [data-cursor]. Position is written straight to the DOM inside one
   rAF loop — React state never runs at pointer speed. */
const SiteCursor = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    if (!root || !label || reduceMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("mf-cursor-on");
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let dotX = pointerX;
    let dotY = pointerY;
    let ringX = pointerX;
    let ringY = pointerY;
    let frame: number | null = null;
    let idle = true;

    const tick = () => {
      dotX += (pointerX - dotX) * 0.55;
      dotY += (pointerY - dotY) * 0.55;
      ringX += (pointerX - ringX) * 0.16;
      ringY += (pointerY - ringY) * 0.16;
      root.style.setProperty("--cursor-dot-x", `${dotX.toFixed(1)}px`);
      root.style.setProperty("--cursor-dot-y", `${dotY.toFixed(1)}px`);
      root.style.setProperty("--cursor-ring-x", `${ringX.toFixed(1)}px`);
      root.style.setProperty("--cursor-ring-y", `${ringY.toFixed(1)}px`);
      const settled = Math.abs(pointerX - ringX) < 0.1 && Math.abs(pointerY - ringY) < 0.1;
      frame = settled ? null : requestAnimationFrame(tick);
    };

    const resolveState = (target: Element | null) => {
      const surface = target?.closest<HTMLElement>("[data-cursor]");
      if (surface) {
        root.dataset.state = "label";
        label.textContent = surface.dataset.cursor ?? "";
        return;
      }
      root.dataset.state = target?.closest("a, button, [role='button']") ? "hover" : "idle";
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (idle) {
        idle = false;
        dotX = ringX = pointerX;
        dotY = ringY = pointerY;
        root.dataset.visible = "true";
      }
      resolveState(event.target instanceof Element ? event.target : null);
      if (frame === null) frame = requestAnimationFrame(tick);
    };

    const onDown = () => root.setAttribute("data-pressed", "true");
    const onUp = () => root.removeAttribute("data-pressed");
    const onLeave = () => {
      idle = true;
      root.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      document.documentElement.classList.remove("mf-cursor-on");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return (
    <div ref={rootRef} className="mf-cursor" data-visible="false" data-state="idle" aria-hidden="true">
      <i className="mf-cursor__dot" />
      <span className="mf-cursor__ring">
        <span ref={labelRef} className="mf-cursor__label" />
      </span>
    </div>
  );
};

export default SiteCursor;
