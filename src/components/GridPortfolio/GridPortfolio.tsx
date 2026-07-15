"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  type CSSProperties,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import LightTunnel from "./LightTunnel";
import { PROJECTS, type PortfolioProject } from "./projectData";
import { CONTACT_EMAIL } from "../NewSite/data";

const KineticMark = dynamic(() => import("./KineticMark"), {
  ssr: false,
  loading: () => <div className="motionfolio-mark-loading" aria-hidden="true">PP</div>,
});

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const smoothstep = (edgeA: number, edgeB: number, value: number) => {
  const progress = clamp((value - edgeA) / Math.max(edgeB - edgeA, 0.0001));
  return progress * progress * (3 - 2 * progress);
};

const NAVIGATION = [
  { label: "Work", href: "#work" },
  { label: "Profile", href: "#profile" },
  { label: "Lab ↗", href: "/lab" },
  { label: "Contact", href: "#contact" },
];

const useClock = () => {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      );
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return time;
};

const GridOverlay = () => (
  <div className="motionfolio-grid" aria-hidden="true">
    {Array.from({ length: 5 }, (_, index) => <i key={index} />)}
  </div>
);

const ExperienceLoader = () => (
  <div className="motionfolio-loader" aria-hidden="true">
    <div>
      <span>PARTH.PARWANI / PORTFOLIO SYSTEM</span>
      <i><b /></i>
      <small>Loading authored interactions</small>
    </div>
  </div>
);

const useSmoothWheel = (enabled: boolean) => {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || reduceMotion || !window.matchMedia("(min-width: 901px) and (pointer: fine)").matches) return;
    let current = window.scrollY;
    let target = window.scrollY;
    let frame: number | null = null;
    let driving = false;

    const tick = () => {
      const distance = target - current;
      current += distance * 0.115;
      driving = true;
      window.scrollTo(0, current);
      driving = false;
      if (Math.abs(distance) > 0.45) frame = requestAnimationFrame(tick);
      else {
        current = target;
        window.scrollTo(0, target);
        frame = null;
      }
    };

    const onWheel = (event: WheelEvent) => {
      const source = event.target instanceof Element ? event.target : null;
      if (event.ctrlKey || event.metaKey || source?.closest(".gridfolio-story, .parth-assistant")) return;
      event.preventDefault();
      const maximum = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      target = clamp(target + event.deltaY, 0, maximum);
      if (frame === null) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!driving && frame === null) {
        current = window.scrollY;
        target = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [enabled, reduceMotion]);
};

const useScrollChoreography = ({
  rootRef,
  introRef,
  finaleRef,
  contactRef,
  finaleProgress,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
  introRef: RefObject<HTMLElement | null>;
  finaleRef: RefObject<HTMLElement | null>;
  contactRef: RefObject<HTMLElement | null>;
  finaleProgress: React.MutableRefObject<number>;
}) => {
  const [readout, setReadout] = useState({ scroll: 0, width: 0, height: 0 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    document.documentElement.classList.add("motion-home");
    let frame: number | null = null;
    let lastReadout = -1;

    const sectionProgress = (element: HTMLElement | null) => {
      if (!element) return 0;
      const rect = element.getBoundingClientRect();
      return clamp(-rect.top / Math.max(rect.height - window.innerHeight, 1));
    };

    const update = () => {
      frame = null;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const intro = sectionProgress(introRef.current);
      const heroExit = smoothstep(0.08, 0.47, intro);
      const heroFade = smoothstep(0.31, 0.53, intro);
      const profileEnter = smoothstep(0.27, 0.59, intro);
      const profileExit = smoothstep(0.88, 1, intro);

      root.style.setProperty("--hero-y", `${-68 * heroExit}vh`);
      root.style.setProperty("--hero-opacity", `${1 - heroFade}`);
      root.style.setProperty("--mark-y", `${-46 * heroExit}vh`);
      root.style.setProperty("--mark-scale", `${1 - heroExit * 0.13}`);
      root.style.setProperty("--profile-y", `${(1 - profileEnter) * 72 - profileExit * 34}vh`);
      root.style.setProperty("--profile-opacity", `${profileEnter * (1 - profileExit)}`);
      root.style.setProperty("--intro-dark", `${smoothstep(0.32, 0.55, intro)}`);

      root.querySelectorAll<HTMLElement>("[data-project-card]").forEach((card) => {
        const rect = card.getBoundingClientRect();
        const centerDistance = (rect.top + rect.height * 0.5 - viewportHeight * 0.5) / Math.max(viewportHeight, 1);
        const magnitude = Math.min(Math.abs(centerDistance), 1.4);
        card.style.setProperty("--project-rotate", `${clamp(centerDistance * -7.5, -8, 8)}deg`);
        card.style.setProperty("--project-shift", `${clamp(centerDistance * -28, -34, 34)}px`);
        card.style.setProperty("--project-scale", `${1 - Math.min(magnitude * 0.055, 0.07)}`);
        card.style.setProperty("--project-radius", `${Math.min(magnitude * 58, 52)}px`);
      });

      const finale = sectionProgress(finaleRef.current);
      finaleProgress.current = finale;
      finaleRef.current?.style.setProperty("--finale-progress", `${finale}`);
      if (finaleRef.current) {
        finaleRef.current.dataset.phase = finale < 0.34 ? "purpose" : finale < 0.69 ? "human" : "principles";
      }

      const contact = sectionProgress(contactRef.current);
      contactRef.current?.style.setProperty("--contact-progress", `${contact}`);

      const maximum = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      const percentage = Math.round((window.scrollY / maximum) * 100);
      root.style.setProperty("--site-scroll", `${percentage / 100}`);
      if (percentage !== lastReadout) {
        lastReadout = percentage;
        setReadout({ scroll: percentage, width: viewportWidth, height: viewportHeight });
      }
    };

    const requestUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      document.documentElement.classList.remove("motion-home");
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [contactRef, finaleProgress, finaleRef, introRef, rootRef]);

  return readout;
};

const ProjectPreview = ({
  project,
  index,
  onOpen,
  onTone,
}: {
  project: PortfolioProject;
  index: number;
  onOpen: () => void;
  onTone: () => void;
}) => (
  <article
    className={`motionfolio-project motionfolio-project--${project.id}`}
    data-project-card
    style={{ "--project-accent": project.accent, "--project-surface": project.surface } as CSSProperties}
  >
    <div className="motionfolio-project__meta">
      <span>{project.index}</span>
      <span>{project.category}</span>
      <span>{project.year}</span>
    </div>
    <button className="motionfolio-project__visual" type="button" onClick={onOpen} onPointerEnter={onTone} aria-label={`Open ${project.title} project story`}>
      <Image
        src={project.image}
        alt={`${project.title} website preview`}
        fill
        sizes={index === 0 ? "(max-width: 700px) 100vw, 82vw" : "(max-width: 700px) 100vw, 58vw"}
      />
      <span className="motionfolio-project__shade" aria-hidden="true" />
      <span className="motionfolio-project__open">Open story <ArrowUpRight size={16} /></span>
    </button>
    <div className="motionfolio-project__caption">
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <a href={project.liveUrl} target={project.liveUrl.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        Visit live <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </div>
  </article>
);

const ProjectStory = ({
  project,
  projectIndex,
  onClose,
  onMove,
}: {
  project: PortfolioProject;
  projectIndex: number;
  onClose: () => void;
  onMove: (direction: -1 | 1) => void;
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onMove(-1);
      if (event.key === "ArrowRight") onMove(1);
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, [onClose, onMove]);

  return (
    <motion.div
      ref={dialogRef}
      className="gridfolio-story"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-story-title"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(100% 0 0 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: reduceMotion ? 0.01 : 0.72, ease: [0.76, 0, 0.24, 1] }}
      style={{ "--project-accent": project.accent, "--project-surface": project.surface } as CSSProperties}
    >
      <header className="gridfolio-story__header">
        <span>{project.index} / {String(PROJECTS.length).padStart(3, "0")}</span>
        <p>Selected work / Project story</p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close project story"><X size={19} /></button>
      </header>
      <div className="gridfolio-story__scroll">
        <section className="gridfolio-story__hero">
          <div><span>{project.category}</span><h2 id="project-story-title">{project.title}</h2></div>
          <p>{project.summary}</p>
        </section>
        <div className="gridfolio-story__image"><Image src={project.image} alt={`${project.title} website home page`} fill sizes="100vw" priority /></div>
        <section className="gridfolio-story__details">
          <div><span>Challenge</span><p>{project.challenge}</p></div>
          <div><span>Result</span><p>{project.outcome}</p></div>
          <aside>
            <dl>
              <div><dt>Role</dt><dd>{project.role}</dd></div>
              <div><dt>Services</dt><dd>{project.services.join(" · ")}</dd></div>
              <div><dt>Technology</dt><dd>{project.stack.join(" · ")}</dd></div>
              <div><dt>Year</dt><dd>{project.year}</dd></div>
            </dl>
            <a href={project.liveUrl} target={project.liveUrl.startsWith("http") ? "_blank" : undefined} rel="noreferrer">Launch project <ArrowUpRight size={18} /></a>
          </aside>
        </section>
      </div>
      <footer className="gridfolio-story__footer">
        <button type="button" onClick={() => onMove(-1)}><ArrowLeft size={17} /> Previous</button>
        <span>{String(projectIndex + 1).padStart(2, "0")}—{String(PROJECTS.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => onMove(1)}>Next <ArrowRight size={17} /></button>
      </footer>
    </motion.div>
  );
};

const GridPortfolio = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const finaleRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const finaleProgress = useRef(0);
  const audioContext = useRef<AudioContext | null>(null);
  const [sound, setSound] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const clock = useClock();
  const readout = useScrollChoreography({ rootRef, introRef, finaleRef, contactRef, finaleProgress });
  useSmoothWheel(!activeProjectId);

  const activeProjectIndex = PROJECTS.findIndex((project) => project.id === activeProjectId);
  const activeProject = activeProjectIndex >= 0 ? PROJECTS[activeProjectIndex] : null;

  const playTone = useCallback((frequency = 310) => {
    if (!sound) return;
    const Context = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) return;
    audioContext.current ??= new Context();
    const context = audioContext.current;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.022, context.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.14);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.16);
  }, [sound]);

  useEffect(() => () => { void audioContext.current?.close(); }, []);

  const moveProject = useCallback((direction: -1 | 1) => {
    setActiveProjectId((current) => {
      const index = PROJECTS.findIndex((project) => project.id === current);
      return PROJECTS[(index + direction + PROJECTS.length) % PROJECTS.length].id;
    });
  }, []);
  const closeProject = useCallback(() => setActiveProjectId(null), []);

  return (
    <div ref={rootRef} className="motionfolio">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ExperienceLoader />
      <GridOverlay />

      <header className="motionfolio-header">
        <a className="motionfolio-brand" href="#top" aria-label="Parth Parwani, back to top">PARTH.PARWANI <span>©26</span></a>
        <nav className="motionfolio-nav" aria-label="Main navigation">
          {NAVIGATION.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="motionfolio-controls">
          <button type="button" onClick={() => window.dispatchEvent(new Event("parth:assistant-open"))}>Ask portfolio ↗</button>
          <button type="button" onClick={() => setSound((current) => !current)} aria-pressed={sound}>Sound [{sound ? "+" : "−"}]</button>
        </div>
        <button className="motionfolio-menu" type="button" onClick={() => setMobileMenu((current) => !current)} aria-expanded={mobileMenu} aria-controls="mobile-navigation" aria-label={mobileMenu ? "Close navigation" : "Open navigation"}>
          {mobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <AnimatePresence>
        {mobileMenu && (
          <motion.nav id="mobile-navigation" className="motionfolio-mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            {NAVIGATION.map((item, index) => <a key={item.label} href={item.href} onClick={() => setMobileMenu(false)}><span>0{index + 1}</span>{item.label}</a>)}
            <button type="button" onClick={() => setSound((current) => !current)}>Sound [{sound ? "+" : "−"}]</button>
          </motion.nav>
        )}
      </AnimatePresence>

      <aside className="motionfolio-rail" aria-hidden="true"><span>PP / BUILT IN CODE</span></aside>
      <div className="motionfolio-scrollbar" aria-hidden="true"><i /></div>

      <main id="main-content">
        <section ref={introRef} id="top" className="motionfolio-intro-track">
          <div className="motionfolio-intro-sticky">
            <div className="motionfolio-intro-dark" aria-hidden="true" />
            <section className="motionfolio-hero" aria-labelledby="hero-title">
              <div className="motionfolio-hero__eyebrows">
                <p><span>(01)</span> Creative Developer<br />UI Engineer<br />Digital Product Designer</p>
                <p>Strategy → System<br />System → Interaction<br />Interaction → Product</p>
                <p>Parth Parwani builds distinct digital products from first idea to final frame.</p>
              </div>
              <div className="motionfolio-hero__mark"><KineticMark /><span>AUTHORED / NOT ASSEMBLED</span><b>17 / FOUNDER</b></div>
              <h1 id="hero-title"><span>PARTH PARWANI</span><strong>IDEAS WITH A PULSE.<br />CODE WITH A POINT.</strong></h1>
              <div className="motionfolio-hero__foot"><a href="#work">Enter selected work <ArrowDown size={17} /></a><span>Founder, ForgeLane / Available selectively</span></div>
            </section>

            <section id="profile" className="motionfolio-profile" aria-labelledby="profile-title">
              <div className="motionfolio-profile__instrument" aria-hidden="true">
                <div><span>BRAND</span><span>PRODUCT</span><span>CODE</span><span>MOTION</span><i /><i /><b>PP</b></div>
                <small>ONE SYSTEM / FOUR DISCIPLINES</small>
              </div>
              <div className="motionfolio-profile__copy">
                <div><span>02</span><p>Profile / Practice</p></div>
                <p>I work where brand, product and engineering stop being separate conversations.</p>
                <h2 id="profile-title">ONE MIND.<br />FIRST IDEA<br />TO FINAL PIXEL.</h2>
                <ul>
                  <li><span>01</span>Identity with behaviour</li>
                  <li><span>02</span>Interfaces with intent</li>
                  <li><span>03</span>Engineering that protects both</li>
                </ul>
              </div>
            </section>
          </div>
        </section>

        <section id="work" className="motionfolio-work">
          <header className="motionfolio-work__lead">
            <div><span>03</span><p>Selected work / 2025—26</p></div>
            <h2>WORK IS<br />THE ARGUMENT.</h2>
            <p>Real organisations. Real constraints. Each product given its own visual and technical logic.</p>
          </header>
          <div className="motionfolio-projects">
            {PROJECTS.map((project, index) => (
              <ProjectPreview
                key={project.id}
                project={project}
                index={index}
                onOpen={() => { playTone(250 + index * 38); setActiveProjectId(project.id); }}
                onTone={() => playTone(210 + index * 34)}
              />
            ))}
          </div>
        </section>

        <section ref={finaleRef} className="motionfolio-finale" data-phase="purpose" aria-label="Design principles">
          <div className="motionfolio-finale__sticky">
            <LightTunnel progress={finaleProgress} />
            <div className="motionfolio-finale__phase motionfolio-finale__phase--purpose"><span>04 / PRINCIPLE</span><h2>ENGINEER<br />WITH PURPOSE.</h2></div>
            <div className="motionfolio-finale__phase motionfolio-finale__phase--human"><span>04 / PRINCIPLE</span><h2>DESIGN WITH<br />A HUMAN TOUCH.</h2></div>
            <div className="motionfolio-finale__phase motionfolio-finale__phase--principles">
              <p>Motion should explain hierarchy.</p><p>Performance is part of the aesthetic.</p><p>Systems create room for expression.</p><p>The product must outlive the reveal.</p>
              <strong>THE METHOD IS<br />VISIBLE IN THE RESULT.</strong>
            </div>
          </div>
        </section>

        <section ref={contactRef} id="contact" className="motionfolio-contact-track">
          <div className="motionfolio-contact">
            <div className="motionfolio-contact__mark"><KineticMark /></div>
            <div className="motionfolio-contact__meta"><span>05</span><p>New work / Selected collaborations</p></div>
            <p>Have a product, brand or difficult interface that deserves more than the expected answer?</p>
            <h2>LET’S CREATE<br />SOMETHING<br />EXTRAORDINARY.</h2>
            <div className="motionfolio-contact__links">
              <a href={`mailto:${CONTACT_EMAIL}`}>Start a project <ArrowUpRight size={18} /></a>
              <a href="https://github.com/itachix4" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={18} /></a>
              <a href="https://forgelane.vercel.app" target="_blank" rel="noreferrer">ForgeLane <ArrowUpRight size={18} /></a>
            </div>
            <footer><span>Parth Parwani © 2026</span><span>Designed + engineered in code</span><a href="#top">Back to top ↑</a></footer>
          </div>
        </section>
      </main>

      <div className="motionfolio-readout" aria-hidden="true"><span>IND / {clock}</span><span>{readout.scroll}% / {readout.width}×{readout.height}</span></div>

      <AnimatePresence>
        {activeProject && <ProjectStory project={activeProject} projectIndex={activeProjectIndex} onClose={closeProject} onMove={moveProject} />}
      </AnimatePresence>
    </div>
  );
};

export default GridPortfolio;
