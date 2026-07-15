"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  Braces,
  Code2,
  Mail,
  MessageCircle,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { useBuildMode } from "../buildMode";
import { CONTACT_EMAIL, WORKBENCH_MODES } from "../NewSite/data";

type SceneId = "intro" | "work" | "practice" | "motion" | "about" | "lab" | "contact";

type Scene = {
  id: SceneId;
  index: string;
  label: string;
  backdrop: string;
  ink: string;
  accent: string;
};

const SCENES: Scene[] = [
  {
    id: "intro",
    index: "01",
    label: "Introduction",
    backdrop: "#0b1830",
    ink: "#f0eadb",
    accent: "#e86f51",
  },
  {
    id: "work",
    index: "02",
    label: "Selected practice",
    backdrop: "#101a31",
    ink: "#f1ead9",
    accent: "#e66748",
  },
  {
    id: "practice",
    index: "03",
    label: "Three lenses",
    backdrop: "#d7d0be",
    ink: "#171917",
    accent: "#3d5e69",
  },
  {
    id: "motion",
    index: "04",
    label: "Motion study",
    backdrop: "#6f806f",
    ink: "#f2ead9",
    accent: "#e8ba72",
  },
  {
    id: "about",
    index: "05",
    label: "About Parth",
    backdrop: "#c9a287",
    ink: "#1a1815",
    accent: "#664034",
  },
  {
    id: "lab",
    index: "06",
    label: "PARTH LAB OS",
    backdrop: "#15201d",
    ink: "#eee9db",
    accent: "#a8b69c",
  },
  {
    id: "contact",
    index: "07",
    label: "Start a project",
    backdrop: "#e36b4c",
    ink: "#181713",
    accent: "#f1ead9",
  },
];

const NAV_ITEMS: Array<{ label: string; target: SceneId }> = [
  { label: "Work", target: "work" },
  { label: "Practice", target: "practice" },
  { label: "About", target: "about" },
  { label: "Lab", target: "lab" },
];

const LAB_APPS = [
  { label: "Motion", icon: Sparkles },
  { label: "Shader", icon: Box },
  { label: "Systems", icon: Braces },
  { label: "Forge", icon: Code2 },
];

const clampIndex = (index: number) => (index + SCENES.length) % SCENES.length;

const SceneHeading = ({
  index,
  eyebrow,
  title,
  body,
}: {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
}) => (
  <div className="editorial-heading">
    <p className="editorial-heading__eyebrow">
      <span>{index}</span>
      {eyebrow}
    </p>
    <h2>{title}</h2>
    <p className="editorial-heading__body">{body}</p>
  </div>
);

const PracticeLens = () => {
  const { mode, setMode } = useBuildMode();
  const selected = WORKBENCH_MODES.find((item) => item.id === mode) ?? WORKBENCH_MODES[0];

  return (
    <div className={`editorial-lens editorial-lens--${selected.id}`}>
      <div className="editorial-lens__tabs" role="tablist" aria-label="View Parth's practice by discipline">
        {WORKBENCH_MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={mode === item.id}
            className={mode === item.id ? "is-active" : undefined}
            onClick={() => setMode(item.id)}
          >
            <span>{item.index}</span>
            {item.label}
          </button>
        ))}
      </div>

      <motion.div
        key={selected.id}
        className="editorial-lens__statement"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>{selected.prompt}</span>
        <strong>{selected.title}</strong>
        <p>{selected.description}</p>
      </motion.div>

      <div className="editorial-lens__composition" aria-hidden="true">
        <span>{selected.label}</span>
        <i />
        <i />
        <i />
      </div>

      <div className="editorial-lens__skills">
        {selected.skills.map((skill, index) => (
          <article key={skill.name}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{skill.name}</strong>
            <small>{skill.outcome}</small>
          </article>
        ))}
      </div>
    </div>
  );
};

const MotionStudy = () => {
  const frame = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    },
    [],
  );

  const reactToPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (frame.current !== null) return;
    const clientX = event.clientX;
    const clientY = event.clientY;

    frame.current = window.requestAnimationFrame(() => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (rect) {
        const offsetX = clientX - rect.left - rect.width / 2;
        const offsetY = clientY - rect.top - rect.height / 2;
        stageRef.current?.style.setProperty("--motion-x", `${offsetX}px`);
        stageRef.current?.style.setProperty("--motion-y", `${offsetY}px`);
        stageRef.current?.querySelectorAll<HTMLElement>(".editorial-motion-study__lines i").forEach((line, index) => {
          const depth = (index - 5) * 0.055;
          line.style.setProperty("--line-x", `${offsetX * depth}px`);
          line.style.setProperty("--line-y", `${offsetY * depth}px`);
        });
      }
      frame.current = null;
    });
  };

  return (
    <div
      ref={stageRef}
      className="editorial-motion-study"
      onPointerMove={reactToPointer}
      onPointerLeave={() => {
        stageRef.current?.style.setProperty("--motion-x", "0px");
        stageRef.current?.style.setProperty("--motion-y", "0px");
        stageRef.current?.querySelectorAll<HTMLElement>(".editorial-motion-study__lines i").forEach((line) => {
          line.style.setProperty("--line-x", "0px");
          line.style.setProperty("--line-y", "0px");
        });
      }}
    >
      <div className="editorial-motion-study__lines" aria-hidden="true">
        {Array.from({ length: 11 }, (_, index) => (
          <i
            key={index}
            style={{
              "--line-x": "0px",
              "--line-y": "0px",
              "--line-rotation": `${(index - 5) * 0.7}deg`,
            } as CSSProperties}
          />
        ))}
      </div>
      <div className="editorial-motion-study__cursor" aria-hidden="true">
        <span />
      </div>
      <p>Move through the field</p>
      <strong>INPUT / EASING / RESPONSE</strong>
    </div>
  );
};

const LabPreview = () => {
  const [activeApp, setActiveApp] = useState(0);
  const selected = LAB_APPS[activeApp];

  return (
    <div className="editorial-lab-preview">
      <div className="editorial-lab-preview__bar">
        <span>PARTH LAB OS</span>
        <i />
        <small>06:17</small>
      </div>
      <div className="editorial-lab-preview__screen">
        <p>Choose an instrument</p>
        <div className="editorial-lab-preview__apps">
          {LAB_APPS.map((app, index) => {
            const Icon = app.icon;
            return (
              <button
                key={app.label}
                type="button"
                className={activeApp === index ? "is-active" : undefined}
                aria-pressed={activeApp === index}
                onClick={() => setActiveApp(index)}
              >
                <span><Icon size={22} aria-hidden="true" /></span>
                {app.label}
              </button>
            );
          })}
        </div>
        <div className="editorial-lab-preview__readout" aria-live="polite">
          <span>ACTIVE INSTRUMENT</span>
          <strong>{selected.label} Lab</strong>
          <small>Real interaction. Readable source. No video tricks.</small>
        </div>
      </div>
      <div className="editorial-lab-preview__home" aria-hidden="true" />
    </div>
  );
};

const EditorialPortfolio = () => {
  const reducedMotion = Boolean(useReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const wheelLock = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const activeScene = SCENES[activeIndex];

  const showScene = useCallback((nextIndex: number, manual = true) => {
    if (manual) setPlaying(false);
    setActiveIndex(clampIndex(nextIndex));
  }, []);

  const showSceneById = useCallback(
    (id: SceneId) => {
      const nextIndex = SCENES.findIndex((scene) => scene.id === id);
      if (nextIndex >= 0) showScene(nextIndex);
    },
    [showScene],
  );

  useEffect(() => {
    document.documentElement.classList.add("editorial-home");
    return () => document.documentElement.classList.remove("editorial-home");
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => clampIndex(current + 1));
    }, 6200);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        showScene(activeIndex + 1);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        showScene(activeIndex - 1);
      }
      if (event.key === "Home") showScene(0);
      if (event.key === "End") showScene(SCENES.length - 1);
      if (event.key === "Escape") setPlaying(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, showScene]);

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 16 || wheelLock.current) return;
    if ((event.target as HTMLElement).closest("button, a, [role='tablist']")) return;
    wheelLock.current = true;
    showScene(activeIndex + (event.deltaY > 0 ? 1 : -1));
    window.setTimeout(() => {
      wheelLock.current = false;
    }, reducedMotion ? 120 : 760);
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 54) return;
    const direction = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
    showScene(activeIndex + (direction < 0 ? 1 : -1));
  };

  const rootStyle = useMemo(
    () =>
      ({
        "--editorial-ink": activeScene.ink,
        "--editorial-accent": activeScene.accent,
      }) as CSSProperties,
    [activeScene],
  );

  return (
    <div
      className={`editorial-portfolio editorial-portfolio--${activeScene.id}`}
      style={rootStyle}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <a className="skip-link" href="#editorial-main">Skip to portfolio</a>

      <div className="editorial-backdrops" aria-hidden="true">
        {SCENES.map((scene, index) => (
          <div
            key={scene.id}
            className={`editorial-backdrop editorial-backdrop--${scene.id}${activeIndex === index ? " is-active" : ""}`}
            style={{ "--scene-background": scene.backdrop } as CSSProperties}
          />
        ))}
        <div className="editorial-grain" />
      </div>

      <header className="editorial-header">
        <button type="button" className="editorial-brand" onClick={() => showSceneById("intro")}>
          <span>P/P</span>
          <strong>Parth Parwani</strong>
        </button>

        <nav className="editorial-header__nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.target}
              type="button"
              className={activeScene.id === item.target ? "is-active" : undefined}
              onClick={() => showSceneById(item.target)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="editorial-header__actions">
          <button
            type="button"
            className="editorial-ask"
            onClick={() => window.dispatchEvent(new CustomEvent("parth:assistant-open"))}
          >
            <MessageCircle size={14} aria-hidden="true" />
            Ask Parth
          </button>
          <a href={`mailto:${CONTACT_EMAIL}`}>
            Start a project <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </header>

      <main id="editorial-main" className="editorial-scenes" aria-live="polite">
        <section
          className={`editorial-scene editorial-scene--intro${activeScene.id === "intro" ? " is-active" : ""}`}
          aria-hidden={activeScene.id !== "intro"}
          inert={activeScene.id !== "intro"}
        >
          <div className="editorial-hero__title" aria-label="Parth Parwani">
            <span>PARTH</span>
            <span>PARWANI</span>
          </div>
          <div className="editorial-hero__aperture" aria-hidden="true">
            <i /><i /><i /><i />
            <span>PP</span>
          </div>
          <div className="editorial-hero__intro">
            <p>Creative developer · UI engineer · Founder</p>
            <h1>I build digital products with the polish of a brand and the discipline of production.</h1>
            <button type="button" onClick={() => showSceneById("work")}>
              See selected work <ArrowDown size={16} aria-hidden="true" />
            </button>
          </div>
          <p className="editorial-hero__note">Independent digital practice · 2026</p>
        </section>

        <section
          className={`editorial-scene editorial-scene--work${activeScene.id === "work" ? " is-active" : ""}`}
          aria-hidden={activeScene.id !== "work"}
          inert={activeScene.id !== "work"}
        >
          <SceneHeading
            index="02"
            eyebrow="Selected practice"
            title="A studio. A lab. The systems between."
            body="A concise edit of the work—not an endless wall of case-study cards."
          />
          <div className="editorial-work-reel">
            <a className="editorial-work-frame editorial-work-frame--forge" href="https://forgelane.vercel.app" target="_blank" rel="noreferrer">
              <span>01 / Venture</span>
              <strong>FORGE<br />LANE</strong>
              <small>Founder · Brand · UI · Engineering</small>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="editorial-work-frame editorial-work-frame--lab" href="/lab">
              <span>02 / Technical showcase</span>
              <div aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</div>
              <strong>PARTH<br />LAB OS</strong>
              <small>Eight real interactive instruments</small>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <button className="editorial-work-frame editorial-work-frame--motion" type="button" onClick={() => showSceneById("motion")}>
              <span>03 / Interaction</span>
              <svg viewBox="0 0 320 160" aria-hidden="true">
                <path d="M0 81 C35 81 31 27 64 27 S94 132 128 132 158 54 191 54 222 111 254 111 282 36 320 36" />
              </svg>
              <strong>MOTION<br />SYSTEMS</strong>
              <small>Input becomes meaning</small>
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </section>

        <section
          className={`editorial-scene editorial-scene--practice${activeScene.id === "practice" ? " is-active" : ""}`}
          aria-hidden={activeScene.id !== "practice"}
          inert={activeScene.id !== "practice"}
        >
          <SceneHeading
            index="03"
            eyebrow="One practice · Three lenses"
            title="Change the point of view."
            body="The same product decision looks different to a designer, engineer and founder. Select a lens."
          />
          <PracticeLens />
        </section>

        <section
          className={`editorial-scene editorial-scene--motion${activeScene.id === "motion" ? " is-active" : ""}`}
          aria-hidden={activeScene.id !== "motion"}
          inert={activeScene.id !== "motion"}
        >
          <SceneHeading
            index="04"
            eyebrow="Interaction engineering"
            title="Motion should explain, not decorate."
            body="This field responds directly to your input. The full Lab goes deeper into sampling, easing, shaders and real-time systems."
          />
          <MotionStudy />
          <a className="editorial-motion-link" href="/lab">
            Open the technical Lab <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </section>

        <section
          className={`editorial-scene editorial-scene--about${activeScene.id === "about" ? " is-active" : ""}`}
          aria-hidden={activeScene.id !== "about"}
          inert={activeScene.id !== "about"}
        >
          <div className="editorial-about__portrait">
            <Image
              src="/images/parth-digital-twin-960.jpg"
              alt="AI-rendered digital twin of Parth Parwani"
              fill
              loading="eager"
              sizes="(max-width: 820px) 100vw, 48vw"
            />
            <span>Digital twin / art-directed from Parth’s portraits</span>
          </div>
          <SceneHeading
            index="05"
            eyebrow="Developer · Designer · Entrepreneur"
            title="Young by age. Serious by output."
            body="I’m 17, studying PCM, founding ForgeLane and building across brand, product and code. The advantage is range without hand-offs."
          />
          <div className="editorial-about__facts">
            <p><span>01</span>Founder of ForgeLane</p>
            <p><span>02</span>Strategy to production</p>
            <p><span>03</span>Built for real deployment</p>
          </div>
        </section>

        <section
          className={`editorial-scene editorial-scene--lab${activeScene.id === "lab" ? " is-active" : ""}`}
          aria-hidden={activeScene.id !== "lab"}
          inert={activeScene.id !== "lab"}
        >
          <SceneHeading
            index="06"
            eyebrow="Technical playground"
            title="The source is part of the proof."
            body="PARTH LAB OS is where motion capture, shader tools, deployment games and system architecture become usable experiments."
          />
          <LabPreview />
          <a className="editorial-lab-link" href="/lab">
            Enter PARTH LAB OS <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </section>

        <section
          className={`editorial-scene editorial-scene--contact${activeScene.id === "contact" ? " is-active" : ""}`}
          aria-hidden={activeScene.id !== "contact"}
          inert={activeScene.id !== "contact"}
        >
          <p className="editorial-contact__eyebrow">Available for select projects · Remote</p>
          <h2>LET’S BUILD<br />THE ONE THEY<br /><em>REMEMBER.</em></h2>
          <div className="editorial-contact__actions">
            <a href={`mailto:${CONTACT_EMAIL}`}>
              <Mail size={17} aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            <a href="https://github.com/itachix4" target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a href="https://forgelane.vercel.app" target="_blank" rel="noreferrer">
              ForgeLane <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <p className="editorial-contact__foot">Parth Parwani · Creative developer / UI engineer / founder</p>
        </section>
      </main>

      <aside className="editorial-progress" aria-label="Portfolio scene navigation">
        <button type="button" onClick={() => showScene(activeIndex - 1)} aria-label="Previous scene">
          <ArrowLeft size={15} aria-hidden="true" />
        </button>
        <div className="editorial-progress__track">
          {SCENES.map((scene, index) => (
            <button
              key={scene.id}
              type="button"
              className={activeIndex === index ? "is-active" : undefined}
              aria-current={activeIndex === index ? "step" : undefined}
              aria-label={`Open ${scene.label}`}
              onClick={() => showScene(index)}
            >
              <i />
              <span>{scene.label}</span>
            </button>
          ))}
        </div>
        <span>{activeScene.index} / {String(SCENES.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => showScene(activeIndex + 1)} aria-label="Next scene">
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </aside>

      <button
        type="button"
        className="editorial-play"
        aria-pressed={playing}
        onClick={() => setPlaying((current) => !current)}
        disabled={reducedMotion}
      >
        {playing ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
        {playing ? "Pause reel" : "Play the reel"}
      </button>

      <div className="editorial-crop-marks" aria-hidden="true"><i /><i /><i /><i /></div>
    </div>
  );
};

export default EditorialPortfolio;
