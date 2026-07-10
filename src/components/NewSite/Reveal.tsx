import { Fragment, PropsWithChildren } from "react";
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade-up reveal once the element scrolls into view. */
export const Reveal = ({
  children,
  delay = 0,
  className,
}: PropsWithChildren<{ delay?: number; className?: string }>) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

/** Oversized statement that reveals word by word on scroll.
 *  Words listed in `accents` render in the italic serif accent face. */
export const WordReveal = ({
  text,
  className,
  accents = [],
}: {
  text: string;
  className?: string;
  accents?: string[];
}) => {
  const words = text.split(" ");
  const isAccent = (word: string) =>
    accents.includes(word.toLowerCase().replace(/[^a-z']/g, ""));
  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: 0.045 }}
    >
      {words.map((word, index) => (
        <Fragment key={index}>
          <span className="inline-block overflow-hidden align-bottom">
            <motion.span
              className={`inline-block ${
                isAccent(word) ? "font-accent text-[#4D6D47]" : ""
              }`}
              variants={{
                hidden: { y: "110%" },
                visible: {
                  y: 0,
                  transition: { duration: 0.6, ease: EASE },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
          {/* Space must live OUTSIDE the overflow-hidden inline-block —
              trailing spaces inside it collapse to zero width */}
          {index < words.length - 1 && " "}
        </Fragment>
      ))}
    </motion.p>
  );
};

/** Numbered editorial section heading, e.g. “01 — About”. */
export const SectionHeading = ({
  index,
  label,
}: {
  index: string;
  label: string;
}) => (
  <Reveal className="flex items-baseline gap-4 mb-10 md:mb-16">
    <span className="text-sm md:text-base font-medium tracking-widest uppercase text-[#657464]">
      {index}
    </span>
    <span className="h-px flex-none w-10 md:w-16 bg-[#1C2E1E]/20 self-center" />
    <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-[#1C2E1E]">
      {label}
    </h2>
  </Reveal>
);
