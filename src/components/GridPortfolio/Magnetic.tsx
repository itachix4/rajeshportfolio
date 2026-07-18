"use client";

import { type PointerEvent, type ReactNode, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/* Wraps any interactive child in a span that leans toward the cursor.
   Sibling of MagneticLink, but element-agnostic so buttons work too. */
const Magnetic = ({ children, strength = 0.16 }: { children: ReactNode; strength?: number }) => {
  const reduceMotion = useReducedMotion();
  const bounds = useRef<DOMRect | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 340, damping: 24, mass: 0.42 });
  const y = useSpring(rawY, { stiffness: 340, damping: 24, mass: 0.42 });

  const cacheBounds = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    bounds.current = event.currentTarget.getBoundingClientRect();
  };

  const attract = (event: PointerEvent<HTMLSpanElement>) => {
    if (!bounds.current || reduceMotion || event.pointerType !== "mouse") return;
    const centerX = bounds.current.left + bounds.current.width / 2;
    const centerY = bounds.current.top + bounds.current.height / 2;
    rawX.set((event.clientX - centerX) * strength);
    rawY.set((event.clientY - centerY) * strength);
  };

  const release = () => {
    bounds.current = null;
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.span
      className="mf-magnetic"
      style={reduceMotion ? undefined : { x, y }}
      onPointerEnter={cacheBounds}
      onPointerMove={attract}
      onPointerLeave={release}
      onBlur={release}
    >
      {children}
    </motion.span>
  );
};

export default Magnetic;
