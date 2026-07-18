"use client";

import { Fragment, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* Pointer-reactive display type: characters near the cursor lift, widen and
   swell like keys under a finger. Archivo's variable wdth axis does the
   widening; transforms do the rest. Characters are grouped into nowrap word
   boxes so line wrapping stays identical to plain text, and all writes go
   straight to the DOM inside one decaying rAF loop. */
const KineticLine = ({ text }: { text: string }) => {
  const hostRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduceMotion) return;
    if (!window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine)").matches) return;
    const hero = host.closest<HTMLElement>(".motionfolio-hero");
    if (!hero) return;
    const chars = Array.from(host.querySelectorAll<HTMLElement>(".mf-kinetic__word > span"));
    if (!chars.length) return;

    let centers: Array<{ x: number; y: number }> | null = null;
    const current = new Float32Array(chars.length);
    const target = new Float32Array(chars.length);
    let frame: number | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let inside = false;

    const measure = () => {
      centers = chars.map((char) => {
        const rect = char.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
    };

    const tick = () => {
      frame = null;
      if (!centers) return;
      let live = false;
      for (let index = 0; index < chars.length; index += 1) {
        if (inside) {
          const dx = (pointerX - centers[index].x) / 210;
          const dy = (pointerY - centers[index].y) / 210;
          target[index] = Math.max(0, 1 - Math.hypot(dx, dy));
        } else {
          target[index] = 0;
        }
        current[index] += (target[index] - current[index]) * 0.17;
        const v = current[index];
        if (v < 0.004 && target[index] === 0) {
          if (current[index] !== 0) {
            current[index] = 0;
            chars[index].style.fontStretch = "";
            chars[index].style.transform = "";
          }
          continue;
        }
        live = true;
        chars[index].style.fontStretch = `${(115 + v * 10).toFixed(1)}%`;
        chars[index].style.transform = `translateY(${(-v * 0.085).toFixed(3)}em) scale(${(1 + v * 0.055).toFixed(3)})`;
      }
      if (live) frame = requestAnimationFrame(tick);
    };
    const requestTick = () => {
      if (frame === null) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (!centers) measure();
      pointerX = event.clientX;
      pointerY = event.clientY;
      inside = true;
      requestTick();
    };
    const onLeave = () => {
      inside = false;
      requestTick();
    };
    const invalidate = () => {
      centers = null;
    };

    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("resize", invalidate);
    window.addEventListener("scroll", invalidate, { passive: true });
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("scroll", invalidate);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return (
    <span ref={hostRef} className="mf-kinetic" aria-label={text}>
      {text.split(" ").map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          {wordIndex > 0 && " "}
          <span className="mf-kinetic__word" aria-hidden="true">
            {word.split("").map((char, charIndex) => (
              <span key={charIndex}>{char}</span>
            ))}
          </span>
        </Fragment>
      ))}
    </span>
  );
};

export default KineticLine;
