import { PropsWithChildren } from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export const Reveal = ({
  children,
  delay = 0,
  className,
}: PropsWithChildren<{ delay?: number; className?: string }>) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-56px" }}
      transition={{ duration: 0.45, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

export const SectionHeading = ({
  index,
  eyebrow,
  title,
  description,
  inverted = false,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  inverted?: boolean;
}) => (
  <Reveal className={`section-heading${inverted ? " section-heading--inverted" : ""}`}>
    <div className="section-heading__meta">
      <span>{index}</span>
      <span>{eyebrow}</span>
    </div>
    <div className="section-heading__copy">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  </Reveal>
);
