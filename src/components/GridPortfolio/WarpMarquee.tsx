"use client";

import { Fragment, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const ITEMS = ["FORGELANE", "BEYOND THE ORDINARY", "DESIGN × ENGINEERING", "AUTHORED — NOT ASSEMBLED"];

const RowContent = ({ ghost }: { ghost: boolean }) => (
  <>
    {[0, 1].map((copy) => (
      <Fragment key={copy}>
        {ITEMS.map((item, index) => (
          <Fragment key={`${copy}-${item}`}>
            <span className={ghost !== (index % 2 === 0) ? "mf-marquee__ghost" : undefined}>{item}</span>
            <b aria-hidden="true">✳</b>
          </Fragment>
        ))}
      </Fragment>
    ))}
  </>
);

/* Two counter-scrolling type bands that drink from scroll velocity: cruise
   slowly at rest, surge when the page moves. The whole band leans with the
   global --scroll-skew variable. */
const WarpMarquee = () => {
  const hostRef = useRef<HTMLElement>(null);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const rowA = rowARef.current;
    const rowB = rowBRef.current;
    if (!host || !rowA || !rowB || reduceMotion) return;

    let visible = false;
    let frame: number | null = null;
    let lastNow = 0;
    let lastScrollY = window.scrollY;
    let velocity = 0;
    let offsetA = 0;
    let offsetB = 0;

    const tick = (now = 0) => {
      frame = null;
      const dtn = lastNow === 0 ? 1 : Math.min(Math.max((now - lastNow) / 16.7, 0.25), 3);
      lastNow = now;
      const scrollY = window.scrollY;
      velocity += (scrollY - lastScrollY - velocity) * 0.12;
      lastScrollY = scrollY;
      const speed = (0.72 + Math.min(Math.abs(velocity) * 0.085, 7)) * dtn;
      const half = rowA.scrollWidth / 2 || 1;
      offsetA = (offsetA - speed) % half;
      offsetB = (offsetB + speed) % half;
      rowA.style.transform = `translate3d(${offsetA.toFixed(2)}px, 0, 0)`;
      rowB.style.transform = `translate3d(${(offsetB - half).toFixed(2)}px, 0, 0)`;
      if (visible) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && frame === null) {
        lastNow = 0;
        frame = requestAnimationFrame(tick);
      }
    });
    observer.observe(host);
    return () => {
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return (
    <section ref={hostRef} className="mf-marquee" aria-hidden="true" data-blueprint="marquee / velocity reactive">
      <div ref={rowARef} className="mf-marquee__row"><RowContent ghost={false} /></div>
      <div ref={rowBRef} className="mf-marquee__row mf-marquee__row--reverse"><RowContent ghost /></div>
    </section>
  );
};

export default WarpMarquee;
