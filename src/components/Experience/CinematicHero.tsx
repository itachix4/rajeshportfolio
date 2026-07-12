import { lazy, Suspense, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight, Command, MousePointer2 } from "lucide-react";
import ClientOnly from "../ClientOnly";
import MagneticLink from "../MagneticLink";
import RenderBoundary from "../RenderBoundary";
import useAdaptiveWebGL from "../useAdaptiveWebGL";
import { useBuildMode } from "../buildMode";

const CinematicHeroScene = lazy(() => import("./CinematicHeroScene"));

const ROLES = ["Creative Developer", "UI Engineer", "Digital Product Designer"];

const openAssistant = () => {
  window.dispatchEvent(new CustomEvent("parth:assistant-open"));
};

const CinematicHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const animationFrame = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const allowWebGL = useAdaptiveWebGL();
  const heroVisible = useInView(heroRef, { margin: "220px 0px" });
  const { mode } = useBuildMode();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 0.82], [0, -130]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.66, 0.94], [1, 0.9, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.78, 1], [1, 0.76, 0]);
  const bridgeY = useTransform(scrollYProgress, [0.45, 1], [120, 0]);

  const trackPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current);
    animationFrame.current = window.requestAnimationFrame(() => {
      target.style.setProperty("--hero-cursor-x", `${x}%`);
      target.style.setProperty("--hero-cursor-y", `${y}%`);
    });
  };

  return (
    <section
      ref={heroRef}
      id="top"
      className="experience-hero"
      aria-labelledby="experience-hero-title"
      onPointerMove={trackPointer}
    >
      <motion.div
        className="experience-hero__world"
        aria-hidden="true"
        style={reduceMotion ? undefined : { scale: sceneScale, opacity: sceneOpacity }}
      >
        <div className="experience-hero__fallback">
          <span />
          <i />
        </div>
        <ClientOnly fallback={null}>
          {allowWebGL && !reduceMotion && heroVisible ? (
            <RenderBoundary fallback={null}>
              <Suspense fallback={null}>
                <CinematicHeroScene mode={mode} scrollProgress={scrollYProgress} />
              </Suspense>
            </RenderBoundary>
          ) : null}
        </ClientOnly>
      </motion.div>

      <div className="experience-hero__cursor-light" aria-hidden="true" />
      <div className="experience-hero__grid" aria-hidden="true" />

      <motion.div
        className="experience-hero__content portfolio-container"
        style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <motion.div
          className="experience-hero__eyebrow"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="experience-hero__signal" aria-hidden="true" />
          <span>Independent product practice / 2026</span>
          <span>Founder of ForgeLane</span>
        </motion.div>

        <div className="experience-hero__title-row">
          <h1 id="experience-hero-title" aria-label="Parth Parwani">
            {["PARTH", "PARWANI"].map((line, index) => (
              <span className="experience-hero__line" key={line}>
                <motion.span
                  initial={reduceMotion ? false : { y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.92,
                    delay: 0.08 + index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            className="experience-hero__roles"
            initial={reduceMotion ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.62, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>Three lenses. One practice.</span>
            <ul>
              {ROLES.map((role, index) => (
                <li key={role}>
                  <span>0{index + 1}</span>
                  {role}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="experience-hero__lower"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.64, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
        >
          <p>
            I turn ambitious ideas into <strong>distinct digital products</strong>—uniting
            strategy, interface, motion and production engineering.
          </p>

          <div className="experience-hero__actions">
            <MagneticLink className="button button--primary" href="#work" strength={0.12}>
              Enter project orbit
              <ArrowDown size={17} aria-hidden="true" />
            </MagneticLink>
            <button className="experience-hero__assistant" type="button" onClick={openAssistant}>
              <Command size={16} aria-hidden="true" />
              Ask Parth AI
              <span>⌘ K</span>
            </button>
          </div>
        </motion.div>

        <div className="experience-hero__telemetry" aria-hidden="true">
          <span>17 / Founder / Shipping now</span>
          <span>
            <MousePointer2 size={12} /> Move to influence field
          </span>
        </div>
      </motion.div>

      <motion.a
        className="experience-hero__scroll"
        href="#work"
        aria-label="Scroll to selected project"
        style={reduceMotion ? undefined : { opacity: copyOpacity }}
      >
        <span>Scroll to enter orbit</span>
        <ArrowDown size={15} aria-hidden="true" />
      </motion.a>

      <motion.div
        className="experience-hero__bridge"
        aria-hidden="true"
        style={reduceMotion ? undefined : { y: bridgeY }}
      >
        <span>Selected work</span>
        <i />
        <ArrowUpRight size={16} />
      </motion.div>
    </section>
  );
};

export default CinematicHero;
