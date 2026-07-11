import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const IntroSequence = () => {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    const pageRegions = [
      document.querySelector<HTMLElement>(".skip-link"),
      document.querySelector<HTMLElement>(".site-header"),
      document.getElementById("main-content"),
      document.querySelector<HTMLElement>(".contact-footer"),
    ].filter((region): region is HTMLElement => Boolean(region));

    document.body.style.overflow = "hidden";
    pageRegions.forEach((region) => {
      region.inert = true;
      region.setAttribute("aria-hidden", "true");
    });

    const timer = window.setTimeout(
      () => setVisible(false),
      reduceMotion ? 120 : 1900
    );

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      pageRegions.forEach((region) => {
        region.inert = false;
        region.removeAttribute("aria-hidden");
      });
    };
  }, [reduceMotion, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-sequence"
          role="dialog"
          aria-modal="true"
          aria-label="Opening sequence"
          initial={reduceMotion ? false : { opacity: 1 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.72, ease: [0.76, 0, 0.24, 1] } }
          }
        >
          <div className="intro-sequence__grid" aria-hidden="true" />
          <button type="button" onClick={() => setVisible(false)}>
            Skip intro
          </button>
          <div className="intro-sequence__center">
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
            >
              P.
            </motion.span>
            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.52, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Ideas, engineered.
            </motion.h2>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.58 }}
            >
              Design × Code × Strategy
            </motion.p>
          </div>
          <div className="intro-sequence__progress" aria-hidden="true">
            <motion.span
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduceMotion ? 0.01 : 1.7, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroSequence;
