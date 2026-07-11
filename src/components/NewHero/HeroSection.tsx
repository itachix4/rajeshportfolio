import { lazy, Suspense, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, MousePointer2 } from "lucide-react";
import { PROFILE } from "../NewSite/data";
import type { ForgeMode } from "./ForgeScene";

const ForgeScene = lazy(() => import("./ForgeScene"));

const FORGE_MODES: Array<{
  id: ForgeMode;
  index: string;
  label: string;
  title: string;
  description: string;
}> = [
  {
    id: "engineer",
    index: "01",
    label: "Engineer",
    title: "Complexity, disciplined.",
    description:
      "Typed systems, clean architecture and interactions engineered to stay fast.",
  },
  {
    id: "designer",
    index: "02",
    label: "Designer",
    title: "Clarity with character.",
    description:
      "Identity, interface and motion shaped into one distinctive visual language.",
  },
  {
    id: "founder",
    index: "03",
    label: "Founder",
    title: "Built to create value.",
    description:
      "Every creative decision connected to positioning, product and what happens next.",
  },
];

const HeroSection = () => {
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<ForgeMode>("engineer");
  const activeMode = FORGE_MODES.find((item) => item.id === mode) ?? FORGE_MODES[0];

  const cycleMode = () => {
    const activeIndex = FORGE_MODES.findIndex((item) => item.id === mode);
    setMode(FORGE_MODES[(activeIndex + 1) % FORGE_MODES.length].id);
  };

  return (
    <section id="top" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-ambient" aria-hidden="true" />
      <div className="hero-grid portfolio-container">
        <div className="hero-copy">
          <motion.div
            className="hero-kicker"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="availability-dot" aria-hidden="true" />
            {PROFILE.availability}
          </motion.div>

          <motion.h1
            id="hero-title"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
          >
            I design the feeling.
            <span>Then engineer</span>
            the proof.
          </motion.h1>

          <motion.div
            className="hero-intro"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
          >
            <p>{PROFILE.introduction}</p>
            <div className="hero-actions">
              <a className="button button--primary" href="#work">
                Explore my work
                <ArrowDownRight size={18} aria-hidden="true" />
              </a>
              <a className="button button--ghost" href={`mailto:${PROFILE.email}`}>
                Start a project
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </motion.div>

          <motion.dl
            className="hero-facts"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div>
              <dt>Building</dt>
              <dd>ForgeLane</dd>
            </div>
            <div>
              <dt>Roles</dt>
              <dd>Design × Code × Strategy</dd>
            </div>
            <div>
              <dt>Age</dt>
              <dd>17 — just getting started</dd>
            </div>
          </motion.dl>
        </div>

        <motion.aside
          className="hero-forge"
          aria-label={`Interactive 3D creative forge. Current mode: ${activeMode.label}.`}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.12 }}
        >
          <div className="hero-forge__topline">
            <span>PARTH / DIGITAL FORGE</span>
            <span>REAL-TIME WEBGL</span>
          </div>

          <div className="hero-forge__viewport">
            <Suspense
              fallback={
                <div className="forge-canvas-fallback" aria-hidden="true">
                  <span />
                </div>
              }
            >
              <ForgeScene
                mode={mode}
                reducedMotion={Boolean(reduceMotion)}
                onCycle={cycleMode}
              />
            </Suspense>
            <div className="forge-reticle" aria-hidden="true" />
            <p className="forge-interaction-hint">
              <MousePointer2 size={13} aria-hidden="true" />
              Move to bend · click to shift
            </p>
          </div>

          <div className="hero-forge__controls">
            <div className="forge-mode-buttons" role="group" aria-label="Select a creative role">
              {FORGE_MODES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={mode === item.id ? "is-active" : undefined}
                  aria-pressed={mode === item.id}
                  onClick={() => setMode(item.id)}
                >
                  <span>{item.index}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="forge-mode-copy" aria-live="polite">
              <span>MODE / {activeMode.index}</span>
              <strong>{activeMode.title}</strong>
              <p>{activeMode.description}</p>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
};

export default HeroSection;
