"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import Scramble from "./Scramble";

const STATS = [
  { value: 4, pad: 2, suffix: "", label: "Products shipped" },
  { value: 8, pad: 2, suffix: "", label: "Lab experiments live" },
  { value: 1, pad: 2, suffix: "", label: "Studio founded" },
  { value: 100, pad: 3, suffix: "%", label: "Designed + engineered solo" },
];

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* Thin instrument band: the numbers tick up once, the first time the band
   scrolls into view. The counters write textContent straight to the DOM —
   no React renders inside the frame loop — and are frame-count driven so
   the loop always terminates. */
const StatsBand = () => {
  const hostRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const numbers = Array.from(host.querySelectorAll<HTMLElement>("dd"));
    const render = (t: number) => {
      numbers.forEach((node, index) => {
        const stat = STATS[index];
        if (!stat) return;
        node.textContent = `${String(Math.round(stat.value * t)).padStart(stat.pad, "0")}${stat.suffix}`;
      });
    };
    let frame: number | null = null;

    const run = () => {
      if (reduceMotion) {
        render(1);
        return;
      }
      const totalFrames = 69;
      let elapsedFrames = 0;
      const step = () => {
        elapsedFrames += 1;
        const t = Math.min(elapsedFrames / totalFrames, 1);
        render(easeOut(t));
        frame = t < 1 ? requestAnimationFrame(step) : null;
      };
      frame = requestAnimationFrame(step);
    };

    if (!reduceMotion) render(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.35 },
    );
    observer.observe(host);
    return () => {
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
      render(1);
    };
  }, [reduceMotion]);

  return (
    <section ref={hostRef} className="mf-stats" aria-label="Practice in numbers" data-blueprint="stats / counters">
      <p className="mf-stats__label"><Scramble text="Practice / By the numbers" /></p>
      <dl>
        {STATS.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>
              {String(stat.value).padStart(stat.pad, "0")}
              {stat.suffix}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default StatsBand;
