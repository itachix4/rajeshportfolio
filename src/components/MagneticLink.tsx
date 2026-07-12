import { PointerEvent, ReactNode, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type MagneticLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  strength?: number;
};

const MagneticLink = ({ href, className, children, strength = 0.14 }: MagneticLinkProps) => {
  const reducedMotion = useReducedMotion();
  const bounds = useRef<DOMRect | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 340, damping: 24, mass: 0.42 });
  const y = useSpring(rawY, { stiffness: 340, damping: 24, mass: 0.42 });

  const cacheBounds = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;
    // Read layout once on entry; pointer moves only write to motion values.
    bounds.current = event.currentTarget.getBoundingClientRect();
  };

  const attract = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!bounds.current || reducedMotion || event.pointerType !== "mouse") return;
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
    <motion.a
      className={className}
      href={href}
      style={reducedMotion ? undefined : { x, y }}
      onPointerEnter={cacheBounds}
      onPointerMove={attract}
      onPointerLeave={release}
      onBlur={release}
    >
      {children}
    </motion.a>
  );
};

export default MagneticLink;
