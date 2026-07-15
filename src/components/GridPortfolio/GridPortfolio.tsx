"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { PROJECTS, type PortfolioProject } from "./projectData";
import { CONTACT_EMAIL } from "../NewSite/data";

type Palette = "signal" | "paper" | "night";

const PALETTES: Array<{ id: Palette; label: string }> = [
  { id: "signal", label: "A" },
  { id: "paper", label: "B" },
  { id: "night", label: "C" },
];

const useClock = () => {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      );
    };
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return time;
};

const useScrollReadout = () => {
  const [readout, setReadout] = useState({ scroll: 0, width: 0, height: 0 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(() => {
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        setReadout({
          scroll: Math.round((window.scrollY / max) * 100),
          width: window.innerWidth,
          height: window.innerHeight,
        });
        frame.current = null;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return readout;
};

const GridOverlay = () => (
  <div className="gridfolio-grid" aria-hidden="true">
    {Array.from({ length: 4 }, (_, index) => (
      <i key={index} />
    ))}
  </div>
);

const FieldCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const frame = useRef<number | null>(null);
  const visible = useRef(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (entry.isIntersecting && !reduceMotion && frame.current === null) {
        frame.current = window.requestAnimationFrame(draw);
      }
    });
    observer.observe(canvas);

    const respondToPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.tx = (event.clientX - rect.left) / Math.max(rect.width, 1);
      pointer.current.ty = (event.clientY - rect.top) / Math.max(rect.height, 1);
    };
    canvas.addEventListener("pointermove", respondToPointer, { passive: true });

    const draw = (now = 0) => {
      frame.current = null;
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(Math.round(rect.width * ratio), 1);
      const height = Math.max(Math.round(rect.height * ratio), 1);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);

      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.055;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.055;
      const cx = rect.width * (0.5 + (pointer.current.x - 0.5) * 0.08);
      const cy = rect.height * (0.49 + (pointer.current.y - 0.5) * 0.06);
      const shortest = Math.min(rect.width, rect.height);
      const lines = rect.width < 600 ? 44 : 78;
      const phase = reduceMotion ? 0 : now * 0.00022;

      context.lineWidth = 1;
      for (let index = 0; index < lines; index += 1) {
        const progress = index / lines;
        const angle = progress * Math.PI * 2 + phase;
        const pulse = Math.sin(angle * 3 + phase * 7) * shortest * 0.022;
        const inner = shortest * (0.19 + progress * 0.045) + pulse;
        const outer = shortest * (0.42 + Math.sin(angle * 2 - phase * 4) * 0.035);
        const bend = (pointer.current.x - 0.5) * shortest * Math.sin(angle) * 0.16;
        const x1 = cx + Math.cos(angle) * inner;
        const y1 = cy + Math.sin(angle) * inner * 0.72;
        const x2 = cx + Math.cos(angle) * outer + bend;
        const y2 = cy + Math.sin(angle) * outer * 0.76;
        context.beginPath();
        context.moveTo(x1, y1);
        context.quadraticCurveTo(
          cx + Math.cos(angle + 0.18) * outer * 0.78,
          cy + Math.sin(angle - 0.12) * outer * 0.38,
          x2,
          y2,
        );
        context.strokeStyle = `rgba(244, 239, 220, ${0.12 + progress * 0.42})`;
        context.stroke();
      }

      if (!reduceMotion && visible.current) frame.current = window.requestAnimationFrame(draw);
    };

    draw();
    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointermove", respondToPointer);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="gridfolio-artifact__canvas" aria-hidden="true" />;
};

const HeroArtifact = () => {
  const artifactRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const frame = useRef<number | null>(null);

  const handlePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || frame.current !== null) return;
    const x = event.clientX;
    const y = event.clientY;
    frame.current = window.requestAnimationFrame(() => {
      const rect = artifactRef.current?.getBoundingClientRect();
      if (rect) {
        const rx = ((y - rect.top) / rect.height - 0.5) * -7;
        const ry = ((x - rect.left) / rect.width - 0.5) * 9;
        artifactRef.current?.style.setProperty("--artifact-rx", `${rx}deg`);
        artifactRef.current?.style.setProperty("--artifact-ry", `${ry}deg`);
      }
      frame.current = null;
    });
  };

  useEffect(
    () => () => {
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    },
    [],
  );

  return (
    <div ref={artifactRef} className="gridfolio-artifact" onPointerMove={handlePointer}>
      <FieldCanvas />
      <div className="gridfolio-artifact__portrait">
        <Image
          src="/images/parth-digital-twin-960.jpg"
          alt="A stylised digital portrait of Parth Parwani"
          fill
          priority
          sizes="(max-width: 720px) 72vw, 38vw"
        />
        <span className="gridfolio-artifact__scan" aria-hidden="true" />
      </div>
      <span className="gridfolio-artifact__stamp gridfolio-artifact__stamp--one">DESIGN / CODE</span>
      <span className="gridfolio-artifact__stamp gridfolio-artifact__stamp--two">17 / FOUNDER</span>
      <span className="gridfolio-artifact__cursor" aria-hidden="true">
        <b>PP</b>
      </span>
    </div>
  );
};

const ProjectPreview = ({ project, onOpen, onTone }: { project: PortfolioProject; onOpen: () => void; onTone: () => void }) => (
  <motion.article
    className={`gridfolio-project gridfolio-project--${project.id}`}
    style={{ "--project-accent": project.accent, "--project-surface": project.surface } as CSSProperties}
    initial={false}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="gridfolio-project__head">
      <span>{project.index}</span>
      <p>{project.category}</p>
      <span>{project.year}</span>
    </div>
    <button
      className="gridfolio-project__visual"
      type="button"
      onClick={onOpen}
      onPointerEnter={onTone}
      aria-label={`Open ${project.title} project story`}
    >
      <Image src={project.image} alt={`${project.title} website preview`} fill sizes="(max-width: 800px) 100vw, 74vw" />
      <span className="gridfolio-project__veil" aria-hidden="true" />
      <span className="gridfolio-project__open">Open story <ArrowUpRight size={16} /></span>
    </button>
    <div className="gridfolio-project__title">
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <a href={project.liveUrl} target={project.liveUrl.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        Visit live <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </div>
  </motion.article>
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
      if (event.key === "Tab") {
        const focusable = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])") ?? [],
        );
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
          <div>
            <span>{project.category}</span>
            <h2 id="project-story-title">{project.title}</h2>
          </div>
          <p>{project.summary}</p>
        </section>

        <div className="gridfolio-story__image">
          <Image src={project.image} alt={`${project.title} website home page`} fill sizes="100vw" priority />
        </div>

        <section className="gridfolio-story__details">
          <div>
            <span>Challenge</span>
            <p>{project.challenge}</p>
          </div>
          <div>
            <span>Result</span>
            <p>{project.outcome}</p>
          </div>
          <aside>
            <dl>
              <div><dt>Role</dt><dd>{project.role}</dd></div>
              <div><dt>Services</dt><dd>{project.services.join(" · ")}</dd></div>
              <div><dt>Technology</dt><dd>{project.stack.join(" · ")}</dd></div>
              <div><dt>Year</dt><dd>{project.year}</dd></div>
            </dl>
            <a href={project.liveUrl} target={project.liveUrl.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              Launch project <ArrowUpRight size={18} />
            </a>
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
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [sound, setSound] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const clock = useClock();
  const readout = useScrollReadout();
  const palette = PALETTES[paletteIndex];
  const activeProjectIndex = PROJECTS.findIndex((project) => project.id === activeProjectId);
  const activeProject = activeProjectIndex >= 0 ? PROJECTS[activeProjectIndex] : null;

  const playTone = useCallback(
    (frequency = 310) => {
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
      gain.gain.exponentialRampToValueAtTime(0.025, context.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.16);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.18);
    },
    [sound],
  );

  useEffect(
    () => () => {
      void audioContext.current?.close();
    },
    [],
  );

  const moveProject = useCallback((direction: -1 | 1) => {
    setActiveProjectId((current) => {
      const index = PROJECTS.findIndex((project) => project.id === current);
      const nextIndex = (index + direction + PROJECTS.length) % PROJECTS.length;
      return PROJECTS[nextIndex].id;
    });
  }, []);
  const closeProject = useCallback(() => setActiveProjectId(null), []);

  const openAssistant = () => window.dispatchEvent(new Event("parth:assistant-open"));

  const navigation = useMemo(
    () => [
      { label: "Work", href: "#work" },
      { label: "Profile", href: "#profile" },
      { label: "Lab ↗", href: "/lab" },
      { label: "Contact", href: "#contact" },
    ],
    [],
  );

  return (
    <div className="gridfolio" data-palette={palette.id}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <GridOverlay />

      <header className="gridfolio-header">
        <a className="gridfolio-brand" href="#top" aria-label="Parth Parwani, back to top">
          PARTH.PARWANI <span>©26</span>
        </a>
        <nav className="gridfolio-nav" aria-label="Main navigation">
          {navigation.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="gridfolio-controls">
          <button
            type="button"
            onClick={() => setPaletteIndex((current) => (current + 1) % PALETTES.length)}
            aria-label={`Change theme. Current theme ${palette.label}`}
          >
            Theme [{palette.label}]
          </button>
          <button
            type="button"
            onClick={() => setSound((current) => !current)}
            aria-label={sound ? "Disable interface sound" : "Enable interface sound"}
            aria-pressed={sound}
          >
            Sound [{sound ? "+" : "−"}]
          </button>
        </div>
        <button
          className="gridfolio-menu"
          type="button"
          onClick={() => setMobileMenu((current) => !current)}
          aria-expanded={mobileMenu}
          aria-controls="mobile-navigation"
          aria-label={mobileMenu ? "Close navigation" : "Open navigation"}
        >
          {mobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <AnimatePresence>
        {mobileMenu && (
          <motion.nav
            id="mobile-navigation"
            className="gridfolio-mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            {navigation.map((item, index) => (
              <a key={item.label} href={item.href} onClick={() => setMobileMenu(false)}>
                <span>0{index + 1}</span>{item.label}
              </a>
            ))}
            <div>
              <button type="button" onClick={() => setPaletteIndex((current) => (current + 1) % PALETTES.length)}>Theme [{palette.label}]</button>
              <button type="button" onClick={() => setSound((current) => !current)}>Sound [{sound ? "+" : "−"}]</button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <aside className="gridfolio-rail" aria-hidden="true">
        <span>PP / BUILT IN CODE</span>
      </aside>

      <main id="main-content">
        <section id="top" className="gridfolio-hero">
          <div className="gridfolio-hero__intro">
            <p><span>(01)</span> Creative developer<br />UI engineer<br />Digital product designer</p>
            <p>Thinking in systems.<br />Designing with care.<br />Shipping with intent.</p>
            <p>Parth Parwani is a 17-year-old developer and founder building distinct digital products from strategy to final interaction.</p>
          </div>

          <HeroArtifact />

          <h1 className="gridfolio-hero__title">
            <span>CRAFTED TO MOVE.</span>
            <span>BUILT TO WORK.</span>
          </h1>

          <div className="gridfolio-hero__foot">
            <a href="#work">Explore selected work <ArrowDown size={17} /></a>
            <span>Independent practice / Founder, ForgeLane</span>
          </div>
        </section>

        <section id="profile" className="gridfolio-profile">
          <div className="gridfolio-section-index"><span>02</span><p>Profile / Practice</p></div>
          <div className="gridfolio-profile__statement">
            <p>I work where brand, product and engineering stop being separate conversations.</p>
            <h2>ONE MIND<br />FROM FIRST IDEA<br />TO FINAL PIXEL.</h2>
          </div>
          <div className="gridfolio-profile__facts">
            <article><span>01</span><strong>Design systems that give a brand its own behaviour.</strong></article>
            <article><span>02</span><strong>Frontend engineering that protects the idea at every breakpoint.</strong></article>
            <article><span>03</span><strong>Motion that explains hierarchy instead of competing with it.</strong></article>
          </div>
        </section>

        <section id="work" className="gridfolio-work">
          <div className="gridfolio-work__lead">
            <div className="gridfolio-section-index"><span>03</span><p>Selected work / 2025—26</p></div>
            <h2>WORK IS THE<br />ARGUMENT.</h2>
            <p>Real products for real organisations—shown as systems, not thumbnails in identical boxes.</p>
          </div>

          <div className="gridfolio-projects">
            {PROJECTS.map((project, index) => (
              <ProjectPreview
                key={project.id}
                project={project}
                onOpen={() => {
                  playTone(260 + index * 42);
                  setActiveProjectId(project.id);
                }}
                onTone={() => playTone(220 + index * 36)}
              />
            ))}
          </div>
        </section>

        <section className="gridfolio-method">
          <div className="gridfolio-section-index"><span>04</span><p>How I build</p></div>
          <div className="gridfolio-method__orbit" aria-hidden="true">
            <span>01 STRATEGY</span><span>02 SYSTEM</span><span>03 BUILD</span><span>04 POLISH</span>
            <i /><i /><b>PP</b>
          </div>
          <h2>NOT DECORATION.<br />DIRECTION.</h2>
          <p>A strong interface should clarify the product, sharpen the brand and make the technology disappear into the experience.</p>
          <button type="button" onClick={openAssistant}>Ask the portfolio intelligence <ArrowUpRight size={17} /></button>
        </section>

        <section id="contact" className="gridfolio-contact">
          <div className="gridfolio-section-index"><span>05</span><p>New work / Selected collaborations</p></div>
          <p>Have a product, brand or difficult interface that deserves more than the expected answer?</p>
          <h2>LET’S MAKE<br />IT DISTINCT.</h2>
          <div className="gridfolio-contact__links">
            <a href={`mailto:${CONTACT_EMAIL}`}>Start a project <ArrowUpRight size={18} /></a>
            <a href="https://github.com/itachix4" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={18} /></a>
            <a href="https://forgelane.vercel.app" target="_blank" rel="noreferrer">ForgeLane <ArrowUpRight size={18} /></a>
          </div>
          <footer><span>Parth Parwani © 2026</span><span>Designed + engineered in code</span><a href="#top">Back to top ↑</a></footer>
        </section>
      </main>

      <div className="gridfolio-readout" aria-hidden="true">
        <span>IND / {clock}</span>
        <span>{readout.scroll}% / {readout.width}×{readout.height}</span>
      </div>

      <AnimatePresence>
        {activeProject && (
          <ProjectStory
            project={activeProject}
            projectIndex={activeProjectIndex}
            onClose={closeProject}
            onMove={moveProject}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GridPortfolio;
