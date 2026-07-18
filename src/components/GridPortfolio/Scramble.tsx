"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/_-<>";

/* Mono labels decode from noise the first time they scroll into view.
   Characters resolve left to right; spaces and slashes stay put so the line
   never changes width. The animation writes textContent straight to the DOM
   node — no React renders inside the frame loop — and is frame-count driven
   so it always terminates. */
const Scramble = ({ text, className }: { text: string; className?: string }) => {
  const reduceMotion = useReducedMotion();
  const glyphRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = glyphRef.current;
    if (!node || reduceMotion) return;
    let frame: number | null = null;

    const run = () => {
      const totalFrames = Math.max(Math.round((620 + text.length * 26) / 16.7), 1);
      let elapsedFrames = 0;
      const step = () => {
        elapsedFrames += 1;
        const progress = Math.min(elapsedFrames / totalFrames, 1);
        const settled = Math.floor(progress * text.length);
        node.textContent = text
          .split("")
          .map((char, index) => {
            if (index < settled || char === " " || char === "/") return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");
        if (progress < 1) frame = requestAnimationFrame(step);
        else {
          node.textContent = text;
          frame = null;
        }
      };
      frame = requestAnimationFrame(step);
    };

    /* Decode only once the visitor is actually scrolling: labels revealed by
       the scroll choreography animate when reached, and nothing competes with
       the page load itself. */
    let started = false;
    const begin = () => {
      if (started) return;
      started = true;
      run();
    };
    const onFirstScroll = () => {
      window.removeEventListener("scroll", onFirstScroll);
      begin();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (window.scrollY > 4) begin();
        else window.addEventListener("scroll", onFirstScroll, { passive: true });
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onFirstScroll);
      if (frame !== null) cancelAnimationFrame(frame);
      node.textContent = text;
    };
  }, [reduceMotion, text]);

  return (
    <span className={className} aria-label={text}>
      <span ref={glyphRef} aria-hidden="true">{text}</span>
    </span>
  );
};

export default Scramble;
