"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Scramble from "./Scramble";
import Magnetic from "./Magnetic";

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const FRAMES = [
  {
    id: "position",
    step: "04.1",
    title: "Position",
    lead: "Find the sentence the studio stands on.",
    copy: "Websites beyond the ordinary. The positioning came before any pixel — every later decision had to prove that sentence or get cut.",
  },
  {
    id: "system",
    step: "04.2",
    title: "System",
    lead: "Design the system, not the page.",
    copy: "A restrained monochrome identity, sharp editorial type and one deliberate flash of orange. Tokens first, so every surface agrees.",
  },
  {
    id: "build",
    step: "04.3",
    title: "Build",
    lead: "Engineer the feel.",
    copy: "Next.js, TypeScript and Motion, with a frame budget treated as part of the design. Nothing ships if it stutters.",
  },
  {
    id: "ship",
    step: "04.4",
    title: "Ship",
    lead: "Ship it, then keep forging.",
    copy: "The studio is live and taking selective work. The forge stays hot — this portfolio is built with the same hands.",
  },
];

/* Pinned chapter: vertical scroll drives the frame track horizontally.
   Below 901px (and under reduced motion) the CSS lays frames out as a
   plain vertical stack and this effect never engages. */
const ProcessChapter = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const media = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
    let frame: number | null = null;

    const update = () => {
      frame = null;
      if (!media.matches) {
        section.style.removeProperty("--process-x");
        section.style.removeProperty("--process-progress");
        return;
      }
      const rect = section.getBoundingClientRect();
      const progress = clamp01(-rect.top / Math.max(rect.height - window.innerHeight, 1));
      const shift = Math.max(track.scrollWidth - window.innerWidth, 0);
      section.style.setProperty("--process-x", `${(-progress * shift).toFixed(1)}px`);
      section.style.setProperty("--process-progress", `${progress.toFixed(4)}`);
    };

    const requestUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="mf-process" aria-label="How ForgeLane was built" data-blueprint="process / pinned horizontal">
      <div className="mf-process__sticky">
        <header className="mf-process__lead">
          <div>
            <span>04</span>
            <p><Scramble text="Process / How ForgeLane was forged" /></p>
          </div>
          <div className="mf-process__bar" aria-hidden="true"><i /></div>
        </header>
        <div ref={trackRef} className="mf-process__track">
          {FRAMES.map((item) => (
            <article key={item.id} className={`mf-process__frame mf-process__frame--${item.id}`}>
              <span className="mf-process__step">{item.step}</span>
              <b className="mf-process__ghost" aria-hidden="true">{item.title}</b>
              <h3>{item.lead}</h3>
              <p>{item.copy}</p>
              {item.id === "system" && (
                <div className="mf-process__tokens" aria-hidden="true">
                  <i style={{ background: "#0a0a0a" }} /><i style={{ background: "#f1ecdf" }} /><i style={{ background: "#ff6a00" }} />
                  <span>Aa</span><small>ARCHIVO / MONO</small>
                </div>
              )}
              {item.id === "build" && (
                <pre className="mf-process__code" aria-hidden="true">{`const feel = spring({\n  stiffness: 340,\n  budget: "60fps",\n});`}</pre>
              )}
              {item.id === "position" && (
                <div className="mf-process__sketch" aria-hidden="true"><span>“beyond the ordinary”</span><i /></div>
              )}
              {item.id === "ship" && (
                <Magnetic strength={0.2}>
                  <a className="mf-process__cta" href="https://forgelane.vercel.app" target="_blank" rel="noreferrer" data-cursor="visit">
                    Visit ForgeLane <ArrowUpRight size={17} />
                  </a>
                </Magnetic>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessChapter;
