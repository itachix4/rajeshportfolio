import { lazy, Suspense } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, MousePointer2 } from "lucide-react";
import { useBuildMode } from "../buildMode";
import { PROFILE } from "../NewSite/data";
import type { ForgeMode } from "./ForgeScene";
import ClientOnly from "../ClientOnly";

const ForgeScene = lazy(() => import("./ForgeScene"));

const FORGE_MODES: Array<{
  id: ForgeMode;
  index: string;
  label: string;
  title: string;
  description: string;
}> = [
  {
    id: "designer",
    index: "01",
    label: "Designer",
    title: "Clarity with character.",
    description:
      "Identity, interface and motion shaped into one distinctive visual language.",
  },
  {
    id: "engineer",
    index: "02",
    label: "Engineer",
    title: "Complexity, disciplined.",
    description:
      "Typed systems, clean architecture and interactions engineered to stay fast.",
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
  const { mode, setMode, cycleMode } = useBuildMode();
  const activeMode = FORGE_MODES.find((item) => item.id === mode) ?? FORGE_MODES[0];

  return (
    <section id="top" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-ambient" aria-hidden="true" />
      <div className="hero-grid portfolio-container">
        <div className="hero-copy">
          <motion.div
            className="hero-kicker"
            initial={false}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="availability-dot" aria-hidden="true" />
            <span>{PROFILE.name} — 17, founder of ForgeLane</span>
          </motion.div>

          <motion.h1
            id="hero-title"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            I design and build digital products that
            <span> refuse to blend in.</span>
          </motion.h1>

          <motion.div
            className="hero-intro"
            initial={false}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
          >
            <p>
              Strategy, UI/UX and full-stack development—from the first idea to
              a fast, production-ready launch.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#work">
                View selected work
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
            initial={false}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div>
              <dt>Building</dt>
              <dd>ForgeLane · Founder</dd>
            </div>
            <div>
              <dt>Roles</dt>
              <dd>Design × Code × Strategy</dd>
            </div>
            <div>
              <dt>Age</dt>
              <dd>17 · already shipping</dd>
            </div>
          </motion.dl>
        </div>

        <motion.aside
          className="hero-forge"
          aria-label={`Interactive 3D creative forge. Current mode: ${activeMode.label}.`}
          initial={false}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.12 }}
        >
          <div className="hero-forge__topline">
            <span>PARTH / DIGITAL FORGE</span>
            <span>REAL-TIME WEBGL</span>
          </div>

          <div className="hero-forge__viewport">
            <ClientOnly
              fallback={
                <div className="forge-canvas-fallback" aria-hidden="true">
                  <span />
                </div>
              }
            >
              <Suspense fallback={null}>
                <ForgeScene
                  mode={mode}
                  reducedMotion={Boolean(reduceMotion)}
                  onCycle={cycleMode}
                />
              </Suspense>
            </ClientOnly>
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
