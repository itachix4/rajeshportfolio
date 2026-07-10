import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

/**
 * Accent cursor ring for fine-pointer devices. The native cursor stays
 * visible — this trails it and swells over interactive elements.
 * mix-blend-difference keeps it visible on light and dark sections.
 */
const Cursor = () => {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 35 });
  const springY = useSpring(y, { stiffness: 400, damping: 35 });

  useEffect(() => {
    if (reducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    setEnabled(true);

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as Element | null;
      setActive(Boolean(target?.closest("a, button")));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[70] pointer-events-none mix-blend-difference"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2"
        animate={{
          width: active ? 44 : 24,
          height: active ? 44 : 24,
          opacity: active ? 1 : 0.7,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
    </motion.div>
  );
};

export default Cursor;
