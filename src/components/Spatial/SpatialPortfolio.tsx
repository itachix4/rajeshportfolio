"use client";

import Image from "next/image";
import {
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crosshair,
  GitBranch,
  Mail,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ScanLine,
  X,
} from "lucide-react";
import { useBuildMode } from "../buildMode";
import { CONTACT_EMAIL, WORKBENCH_MODES } from "../NewSite/data";

type FieldNodeId =
  | "overview"
  | "forgelane"
  | "lenses"
  | "motion"
  | "about"
  | "lab"
  | "contact";

type FieldNode = {
  id: FieldNodeId;
  hour: string;
  index: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  summary: string;
  proof: string[];
  tags: string[];
  x: number;
  y: number;
  kind: "origin" | "forge" | "lenses" | "motion" | "portrait" | "lab" | "contact";
};

type Camera = { x: number; y: number; scale: number };

const FIELD_WIDTH = 2500;
const FIELD_HEIGHT = 1500;
const MIN_SCALE = 0.68;
const MAX_SCALE = 1.22;

const FIELD_NODES: FieldNode[] = [
  {
    id: "overview",
    hour: "00",
    index: "00",
    navLabel: "Origin",
    eyebrow: "Creative developer · UI engineer · Founder",
    title: "Parth Parwani",
    summary:
      "I design and engineer distinct digital products—from first idea to production.",
    proof: [
      "Founder of ForgeLane",
      "17 · Building while studying PCM",
      "Strategy, interface and engineering in one practice",
    ],
    tags: ["Next.js", "TypeScript", "Motion", "WebGL"],
    x: 1060,
    y: 690,
    kind: "origin",
  },
  {
    id: "forgelane",
    hour: "03",
    index: "01",
    navLabel: "Work",
    eyebrow: "Selected venture · Founder / Designer / Engineer",
    title: "ForgeLane",
    summary:
      "A premium digital studio built as one connected brand, interface and delivery system.",
    proof: [
      "Positioning and brand direction",
      "UI/UX, motion and interaction system",
      "Responsive production build on Vercel",
    ],
    tags: ["React", "TypeScript", "Motion", "Vercel"],
    x: 430,
    y: 340,
    kind: "forge",
  },
  {
    id: "lenses",
    hour: "07",
    index: "02",
    navLabel: "Capabilities",
    eyebrow: "Three disciplines · One accountable system",
    title: "Change the lens",
    summary:
      "See the same product problem through designer, engineer and founder perspectives.",
    proof: [
      "Interface systems with a point of view",
      "Production-minded frontend architecture",
      "Decisions tied back to product value",
    ],
    tags: ["Product design", "Frontend", "Strategy"],
    x: 1720,
    y: 330,
    kind: "lenses",
  },
  {
    id: "motion",
    hour: "11",
    index: "03",
    navLabel: "Motion",
    eyebrow: "Interaction engineering · 60fps target",
    title: "Motion with a job",
    summary:
      "Transitions explain hierarchy, input creates visible output, and performance remains part of the design.",
    proof: [
      "Pointer and scroll-driven systems",
      "Custom WebGL and shader studies",
      "Reduced-motion and low-power fallbacks",
    ],
    tags: ["Framer Motion", "Canvas", "GLSL", "Accessibility"],
    x: 1920,
    y: 930,
    kind: "motion",
  },
  {
    id: "about",
    hour: "14",
    index: "04",
    navLabel: "About",
    eyebrow: "Developer · Designer · Entrepreneur",
    title: "Young by age. Serious by output.",
    summary:
      "At 17, I am studying PCM while founding ForgeLane and building across brand, product and code.",
    proof: [
      "One person from positioning to production",
      "AI-assisted workflow, human judgment",
      "Craft, performance and usability held together",
    ],
    tags: ["Founder mindset", "Creative direction", "Full-stack"],
    x: 650,
    y: 1260,
    kind: "portrait",
  },
  {
    id: "lab",
    hour: "18",
    index: "05",
    navLabel: "Lab",
    eyebrow: "PARTH LAB OS · Live technical experiments",
    title: "The source is part of the proof.",
    summary:
      "Eight interactive mini-products for motion, shaders, AI interfaces, systems and deployment engineering.",
    proof: [
      "Shader Forge and real-time material tools",
      "Motion recorder and code generation",
      "Forge OS, deployment heist and hidden CORE",
    ],
    tags: ["WebGL", "State machines", "Generative UI", "Runtime tooling"],
    x: 1260,
    y: 1240,
    kind: "lab",
  },
  {
    id: "contact",
    hour: "21",
    index: "06",
    navLabel: "Contact",
    eyebrow: "Available for select projects",
    title: "Bring the ambition. I’ll bring the system.",
    summary:
      "Send the brief, the constraint and what success should feel like. I’ll reply with a clear next step.",
    proof: [
      "Premium websites and digital products",
      "Brand identity, UI systems and motion",
      "Direct collaboration from idea to launch",
    ],
    tags: ["Start a project", "ForgeLane", "Remote collaboration"],
    x: 2210,
    y: 610,
    kind: "contact",
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const clampCamera = (camera: Camera): Camera => ({
  x: clamp(camera.x, 150, FIELD_WIDTH - 150),
  y: clamp(camera.y, 120, FIELD_HEIGHT - 120),
  scale: clamp(camera.scale, MIN_SCALE, MAX_SCALE),
});

const createContourPath = (
  cx: number,
  cy: number,
  radiusX: number,
  radiusY: number,
  phase: number,
) => {
  const points: string[] = [];
  const steps = 72;

  for (let step = 0; step <= steps; step += 1) {
    const angle = (step / steps) * Math.PI * 2;
    const distortion =
      1 + Math.sin(angle * 3 + phase) * 0.065 + Math.cos(angle * 7 - phase) * 0.028;
    const x = cx + Math.cos(angle) * radiusX * distortion;
    const y = cy + Math.sin(angle) * radiusY * distortion;
    points.push(`${step === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  return `${points.join(" ")} Z`;
};

const CONTOURS = [
  ...Array.from({ length: 8 }, (_, index) =>
    createContourPath(480, 390, 190 + index * 28, 120 + index * 22, index * 0.38),
  ),
  ...Array.from({ length: 10 }, (_, index) =>
    createContourPath(1550, 790, 210 + index * 31, 155 + index * 25, 1.3 + index * 0.31),
  ),
  ...Array.from({ length: 7 }, (_, index) =>
    createContourPath(2160, 260, 120 + index * 24, 84 + index * 20, 2.1 + index * 0.42),
  ),
  ...Array.from({ length: 6 }, (_, index) =>
    createContourPath(820, 1280, 145 + index * 25, 90 + index * 18, 0.7 + index * 0.39),
  ),
];

const useCompactLayout = () => {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 820px), (max-height: 520px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return compact;
};

const Terrain = () => (
  <>
    <div className="field-terrain__grid" aria-hidden="true" />
    <svg
      className="field-terrain__contours"
      viewBox={`0 0 ${FIELD_WIDTH} ${FIELD_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {CONTOURS.map((path, index) => (
        <path key={path} d={path} className={index % 4 === 0 ? "is-major" : undefined} />
      ))}
    </svg>
    <div className="field-terrain__coordinates" aria-hidden="true">
      {Array.from({ length: 26 }, (_, index) => (
        <span key={index} style={{ left: index * 100 }}>{String(index).padStart(2, "0")}</span>
      ))}
    </div>
  </>
);

const LandmarkGlyph = ({ node, compact = false }: { node: FieldNode; compact?: boolean }) => {
  if (node.kind === "forge") {
    return (
      <div className={`field-forge${compact ? " is-compact" : ""}`} aria-hidden="true">
        <span className="field-forge__top">FORGELANE® / DIGITAL STUDIO</span>
        <strong>
          FORGE
          <em>LANE</em>
        </strong>
        <span className="field-forge__bottom">STRATEGY · IDENTITY · INTERFACE · CODE</span>
      </div>
    );
  }

  if (node.kind === "lenses") {
    return (
      <div className={`field-lenses${compact ? " is-compact" : ""}`} aria-hidden="true">
        <i className="field-lenses__orbit field-lenses__orbit--one" />
        <i className="field-lenses__orbit field-lenses__orbit--two" />
        <span>D</span>
        <span>E</span>
        <span>F</span>
        <b>ONE SYSTEM</b>
      </div>
    );
  }

  if (node.kind === "motion") {
    return (
      <div className={`field-wave${compact ? " is-compact" : ""}`} aria-hidden="true">
        <svg viewBox="0 0 260 90">
          <path d="M2 46 C23 46 21 16 42 16 S62 72 82 72 102 28 122 28 142 61 162 61 181 8 201 8 220 47 258 47" />
          <path className="field-wave__echo" d="M2 54 C23 54 21 24 42 24 S62 80 82 80 102 36 122 36 142 69 162 69 181 16 201 16 220 55 258 55" />
        </svg>
        <span>INPUT → INTERPOLATION → OUTPUT</span>
      </div>
    );
  }

  if (node.kind === "portrait") {
    return (
      <div className={`field-portrait${compact ? " is-compact" : ""}`}>
        <Image
          src="/images/parth-digital-twin-960.jpg"
          alt="AI-rendered digital twin of Parth Parwani"
          width={960}
          height={1280}
          sizes={compact ? "72vw" : "260px"}
          priority={false}
        />
        <span aria-hidden="true">PARTH / DIGITAL TWIN</span>
      </div>
    );
  }

  if (node.kind === "lab") {
    return (
      <div className={`field-lab-mark${compact ? " is-compact" : ""}`} aria-hidden="true">
        <div>
          {Array.from({ length: 9 }, (_, index) => (
            <i key={index} />
          ))}
        </div>
        <strong>LAB<br />OS</strong>
        <span>08 ACTIVE INSTRUMENTS</span>
      </div>
    );
  }

  if (node.kind === "contact") {
    return (
      <div className={`field-beacon${compact ? " is-compact" : ""}`} aria-hidden="true">
        <i />
        <i />
        <i />
        <Mail size={compact ? 30 : 22} />
        <span>SIGNAL OPEN</span>
      </div>
    );
  }

  return (
    <div className={`field-origin${compact ? " is-compact" : ""}`} aria-hidden="true">
      <Crosshair />
      <span>PARTH<br />PARWANI</span>
      <i />
    </div>
  );
};

const FieldLandmark = ({
  node,
  active,
  onSelect,
}: {
  node: FieldNode;
  active: boolean;
  onSelect: (node: FieldNode) => void;
}) => (
  <button
    type="button"
    className={`field-landmark field-landmark--${node.kind}${active ? " is-active" : ""}`}
    style={{ left: node.x, top: node.y }}
    aria-label={`Open ${node.title}`}
    aria-pressed={active}
    onClick={() => onSelect(node)}
  >
    <LandmarkGlyph node={node} />
    <span className="field-landmark__label">
      <i>{node.index}</i>
      <span>
        <strong>{node.navLabel}</strong>
        <small>{node.eyebrow}</small>
      </span>
    </span>
  </button>
);

const ModeInstrument = () => {
  const { mode, setMode } = useBuildMode();
  const selectedMode = WORKBENCH_MODES.find((item) => item.id === mode) ?? WORKBENCH_MODES[0];

  return (
    <div className="field-mode-instrument">
      <div className="field-mode-instrument__switch" role="group" aria-label="Change portfolio lens">
        {WORKBENCH_MODES.map((item) => (
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
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selectedMode.id}
          className="field-mode-instrument__readout"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          <span>{selectedMode.prompt}</span>
          <strong>{selectedMode.title}</strong>
          <p>{selectedMode.description}</p>
          <ul>
            {selectedMode.skills.map((skill) => (
              <li key={skill.name}>
                <span>{skill.name}</span>
                <small>{skill.outcome}</small>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const FieldDetailContent = ({
  node,
  onNavigate,
  compact = false,
}: {
  node: FieldNode;
  onNavigate: (id: FieldNodeId) => void;
  compact?: boolean;
}) => (
  <div className="field-detail">
    <div className="field-detail__meta">
      <span>COORD / {node.index}</span>
      <span>{node.hour}:00 / BUILD CYCLE</span>
    </div>
    {compact && <LandmarkGlyph node={node} compact />}
    <p className="field-detail__eyebrow">{node.eyebrow}</p>
    <h1>{node.title}</h1>
    <p className="field-detail__summary">{node.summary}</p>

    {node.id === "lenses" ? (
      <ModeInstrument />
    ) : (
      <div className="field-detail__proof">
        {node.proof.map((item, index) => (
          <div key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    )}

    <ul className="field-detail__tags" aria-label="Related skills and technologies">
      {node.tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>

    <div className="field-detail__actions">
      {node.id === "overview" && (
        <>
          <button type="button" onClick={() => onNavigate("forgelane")}>
            Explore selected work
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <a className="is-secondary" href={`mailto:${CONTACT_EMAIL}`}>
            Start a project
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </>
      )}
      {node.id === "forgelane" && (
        <>
          <a href="https://forgelane.vercel.app" target="_blank" rel="noreferrer">
            Launch ForgeLane
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a className="is-secondary" href="https://github.com/itachix4" target="_blank" rel="noreferrer">
            <GitBranch size={15} aria-hidden="true" />
            GitHub profile
          </a>
        </>
      )}
      {node.id === "lenses" && (
        <button type="button" onClick={() => onNavigate("motion")}>
          Continue to interaction systems
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      )}
      {node.id === "motion" && (
        <a href="/lab">
          Open technical Lab
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
      {node.id === "about" && (
        <button type="button" onClick={() => onNavigate("contact")}>
          Work with me
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      )}
      {node.id === "lab" && (
        <a href="/lab">
          Enter PARTH LAB OS
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
      {node.id === "contact" && (
        <>
          <a href={`mailto:${CONTACT_EMAIL}`}>
            Email Parth
            <Mail size={15} aria-hidden="true" />
          </a>
          <a className="is-secondary" href="https://github.com/itachix4" target="_blank" rel="noreferrer">
            GitHub
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </>
      )}
    </div>
  </div>
);

const FieldInspector = ({
  node,
  open,
  onClose,
  onNavigate,
}: {
  node: FieldNode;
  open: boolean;
  onClose: () => void;
  onNavigate: (id: FieldNodeId) => void;
}) => (
  <AnimatePresence>
    {open && (
      <motion.aside
        key={node.id}
        className="field-inspector"
        aria-label={`${node.title} details`}
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 18 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="field-inspector__close" onClick={onClose} aria-label="Close details">
          <X size={18} aria-hidden="true" />
        </button>
        <div className="field-inspector__scroll">
          <FieldDetailContent node={node} onNavigate={onNavigate} />
        </div>
      </motion.aside>
    )}
  </AnimatePresence>
);

const FieldTimeline = ({
  activeId,
  onSelect,
  compact = false,
}: {
  activeId: FieldNodeId;
  onSelect: (id: FieldNodeId) => void;
  compact?: boolean;
}) => (
  <nav className={`field-timeline${compact ? " is-compact" : ""}`} aria-label="Portfolio build route">
    <span className="field-timeline__range">00HR</span>
    <div className="field-timeline__track">
      {FIELD_NODES.map((node) => (
        <button
          key={node.id}
          type="button"
          className={activeId === node.id ? "is-active" : undefined}
          aria-current={activeId === node.id ? "step" : undefined}
          onClick={() => onSelect(node.id)}
        >
          <span>{node.hour}</span>
          <strong>{node.navLabel}</strong>
        </button>
      ))}
    </div>
    <span className="field-timeline__range">21HR</span>
  </nav>
);

const FieldChrome = ({
  activeId,
  tourActive,
  onSelect,
  onToggleTour,
}: {
  activeId: FieldNodeId;
  tourActive: boolean;
  onSelect: (id: FieldNodeId) => void;
  onToggleTour: () => void;
}) => (
  <header className="field-header">
    <button className="field-brand" type="button" onClick={() => onSelect("overview")}>
      <span>P.</span>
      <strong>PARTH / FIELD SYSTEM</strong>
    </button>
    <nav className="field-header__nav" aria-label="Primary navigation">
      {FIELD_NODES.filter((node) => ["forgelane", "lenses", "about", "lab"].includes(node.id)).map(
        (node) => (
          <button
            key={node.id}
            type="button"
            className={activeId === node.id ? "is-active" : undefined}
            onClick={() => onSelect(node.id)}
          >
            {node.navLabel}
          </button>
        ),
      )}
    </nav>
    <div className="field-header__actions">
      <button type="button" className="field-tour" onClick={onToggleTour} aria-pressed={tourActive}>
        {tourActive ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
        {tourActive ? "Pause route" : "Guided route"}
      </button>
      <a href={`mailto:${CONTACT_EMAIL}`}>
        Start a project
        <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </div>
  </header>
);

const DesktopSpatialField = () => {
  const reducedMotion = Boolean(useReducedMotion());
  const [activeId, setActiveId] = useState<FieldNodeId>("overview");
  const [panelOpen, setPanelOpen] = useState(true);
  const [tourActive, setTourActive] = useState(false);
  const [camera, setCamera] = useState<Camera>({ x: 1060, y: 690, scale: 0.92 });
  const [dragging, setDragging] = useState(false);
  const [kinetic, setKinetic] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const coordinateRef = useRef<HTMLOutputElement>(null);
  const cameraRef = useRef(camera);
  const inertiaFrameRef = useRef<number | null>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const dragRef = useRef({ pointerId: -1, x: 0, y: 0, time: 0, velocityX: 0, velocityY: 0 });

  const activeNode = useMemo(
    () => FIELD_NODES.find((node) => node.id === activeId) ?? FIELD_NODES[0],
    [activeId],
  );

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  const stopInertia = useCallback(() => {
    if (inertiaFrameRef.current !== null) window.cancelAnimationFrame(inertiaFrameRef.current);
    inertiaFrameRef.current = null;
    setKinetic(false);
  }, []);

  useEffect(() => () => stopInertia(), [stopInertia]);

  const focusNode = useCallback((node: FieldNode, manual = true) => {
    if (manual) setTourActive(false);
    stopInertia();
    setActiveId(node.id);
    setPanelOpen(true);
    setCamera((current) => ({
      x: node.x,
      y: node.y,
      scale: node.id === "overview" ? 0.92 : Math.max(current.scale, 0.94),
    }));
  }, [stopInertia]);

  const navigateTo = useCallback(
    (id: FieldNodeId) => {
      const node = FIELD_NODES.find((item) => item.id === id);
      if (node) focusNode(node);
    },
    [focusNode],
  );

  useEffect(() => {
    if (!tourActive) return;
    const timer = window.setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = FIELD_NODES.findIndex((node) => node.id === currentId);
        const nextNode = FIELD_NODES[(currentIndex + 1) % FIELD_NODES.length];
        setPanelOpen(true);
        setCamera((current) => ({
          x: nextNode.x,
          y: nextNode.y,
          scale: Math.max(current.scale, 0.9),
        }));
        return nextNode.id;
      });
    }, reducedMotion ? 6000 : 4200);

    return () => window.clearInterval(timer);
  }, [reducedMotion, tourActive]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanelOpen(false);
        setTourActive(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const interactiveTarget = (event.target as HTMLElement).closest("button, a, input, [role='dialog']");
    if (interactiveTarget || event.button !== 0) return;
    stopInertia();
    setTourActive(false);
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
      velocityX: 0,
      velocityY: 0,
    };
  };

  const updatePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerFrameRef.current === null) {
      const x = event.clientX;
      const y = event.clientY;
      pointerFrameRef.current = window.requestAnimationFrame(() => {
        stageRef.current?.style.setProperty("--field-pointer-x", `${x}px`);
        stageRef.current?.style.setProperty("--field-pointer-y", `${y}px`);
        if (coordinateRef.current) {
          const rect = stageRef.current?.getBoundingClientRect();
          if (rect) {
            const current = cameraRef.current;
            const worldX = current.x + (x - rect.width * 0.45) / current.scale;
            const worldY = current.y + (y - rect.height * 0.5) / current.scale;
            coordinateRef.current.textContent = `X ${Math.round(worldX).toString().padStart(4, "0")} · Y ${Math.round(worldY).toString().padStart(4, "0")}`;
          }
        }
        pointerFrameRef.current = null;
      });
    }

    if (!dragging || dragRef.current.pointerId !== event.pointerId) return;
    const now = performance.now();
    const elapsed = Math.max(now - dragRef.current.time, 8);
    const deltaX = event.clientX - dragRef.current.x;
    const deltaY = event.clientY - dragRef.current.y;
    dragRef.current.velocityX = deltaX / elapsed;
    dragRef.current.velocityY = deltaY / elapsed;
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;
    dragRef.current.time = now;

    setCamera((current) =>
      clampCamera({
        ...current,
        x: current.x - deltaX / current.scale,
        y: current.y - deltaY / current.scale,
      }),
    );
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    dragRef.current.pointerId = -1;

    if (reducedMotion) return;
    let velocityX = dragRef.current.velocityX * 15;
    let velocityY = dragRef.current.velocityY * 15;
    if (Math.abs(velocityX) + Math.abs(velocityY) < 0.45) return;
    setKinetic(true);

    const glide = () => {
      velocityX *= 0.91;
      velocityY *= 0.91;
      setCamera((current) =>
        clampCamera({
          ...current,
          x: current.x - velocityX / current.scale,
          y: current.y - velocityY / current.scale,
        }),
      );

      if (Math.abs(velocityX) + Math.abs(velocityY) > 0.18) {
        inertiaFrameRef.current = window.requestAnimationFrame(glide);
      } else {
        inertiaFrameRef.current = null;
        setKinetic(false);
      }
    };

    inertiaFrameRef.current = window.requestAnimationFrame(glide);
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest(".field-inspector, .field-header, .field-timeline")) return;
    event.preventDefault();
    stopInertia();
    setTourActive(false);
    const rect = event.currentTarget.getBoundingClientRect();
    const focusX = rect.width * (panelOpen ? 0.42 : 0.5);
    const focusY = rect.height * 0.5;

    setCamera((current) => {
      const nextScale = clamp(current.scale * Math.exp(-event.deltaY * 0.0012), MIN_SCALE, MAX_SCALE);
      const worldX = current.x + (event.clientX - focusX) / current.scale;
      const worldY = current.y + (event.clientY - focusY) / current.scale;
      return clampCamera({
        x: worldX - (event.clientX - focusX) / nextScale,
        y: worldY - (event.clientY - focusY) / nextScale,
        scale: nextScale,
      });
    });
  };

  const resetView = () => navigateTo("overview");
  const zoomBy = (amount: number) => {
    setTourActive(false);
    setCamera((current) => ({ ...current, scale: clamp(current.scale + amount, MIN_SCALE, MAX_SCALE) }));
  };

  const mapTransform = `translate3d(calc(${panelOpen ? "42vw" : "50vw"} - ${camera.x * camera.scale}px), calc(50dvh - ${camera.y * camera.scale}px), 0) scale(${camera.scale})`;

  return (
    <div className="spatial-portfolio spatial-portfolio--desktop">
      <FieldChrome
        activeId={activeId}
        tourActive={tourActive}
        onSelect={navigateTo}
        onToggleTour={() => setTourActive((active) => !active)}
      />
      <div
        ref={stageRef}
        className={`field-stage${dragging ? " is-dragging" : ""}`}
        role="region"
        aria-label="Interactive portfolio field. Drag to explore and use the map controls to zoom."
        tabIndex={0}
        onPointerDown={beginDrag}
        onPointerMove={updatePointer}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={handleWheel}
      >
        <div
          className={`field-map${dragging || kinetic ? " is-direct" : ""}`}
          style={{ width: FIELD_WIDTH, height: FIELD_HEIGHT, transform: mapTransform }}
        >
          <Terrain />
          {FIELD_NODES.map((node) => (
            <FieldLandmark key={node.id} node={node} active={activeId === node.id} onSelect={focusNode} />
          ))}
        </div>
        <div className="field-pointer-light" aria-hidden="true" />
      </div>

      <div className="field-map-controls" aria-label="Map controls">
        <button type="button" onClick={resetView} aria-label="Reset map view" title="Reset view">
          <RotateCcw size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => zoomBy(0.1)} aria-label="Zoom in">
          <Plus size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => zoomBy(-0.1)} aria-label="Zoom out">
          <Minus size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="field-readout" aria-hidden="true">
        <span><Compass size={13} /> FIELD ACTIVE</span>
        <output ref={coordinateRef}>X 1060 · Y 0690</output>
        <span>Z {camera.scale.toFixed(2)}</span>
      </div>

      <div className="field-drag-hint" aria-hidden="true">
        <ScanLine size={15} />
        <span>Drag to explore · Scroll to zoom</span>
      </div>

      <FieldInspector
        node={activeNode}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onNavigate={navigateTo}
      />
      <FieldTimeline activeId={activeId} onSelect={navigateTo} />
      <div className="field-frame" aria-hidden="true"><i /><i /><i /><i /></div>
    </div>
  );
};

const MobileSpatialField = () => {
  const reducedMotion = Boolean(useReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const activeNode = FIELD_NODES[activeIndex];

  const showIndex = useCallback((index: number) => {
    const nextIndex = (index + FIELD_NODES.length) % FIELD_NODES.length;
    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  }, [activeIndex]);

  const navigateTo = useCallback((id: FieldNodeId) => {
    const nextIndex = FIELD_NODES.findIndex((node) => node.id === id);
    if (nextIndex >= 0) showIndex(nextIndex);
  }, [showIndex]);

  return (
    <div className="spatial-portfolio spatial-portfolio--mobile">
      <header className="mobile-field-header">
        <button type="button" onClick={() => navigateTo("overview")} aria-label="Return to portfolio origin">
          <span>P.</span>
          <strong>FIELD SYSTEM</strong>
        </button>
        <div className="mobile-field-header__actions">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("parth:assistant-open"))}
            aria-label="Open Parth portfolio assistant"
          >
            Ask
          </button>
          <a href="/lab">Lab ↗</a>
        </div>
      </header>

      <main className="mobile-field-stage">
        <Terrain />
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.article
            key={activeNode.id}
            className={`mobile-field-card mobile-field-card--${activeNode.kind}`}
            custom={direction}
            initial={reducedMotion ? false : { opacity: 0, x: direction * 46 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -32 }}
            transition={{ duration: reducedMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
            drag={reducedMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, info) => {
              if (info.offset.x < -64) showIndex(activeIndex + 1);
              if (info.offset.x > 64) showIndex(activeIndex - 1);
            }}
          >
            <FieldDetailContent node={activeNode} onNavigate={navigateTo} compact />
          </motion.article>
        </AnimatePresence>
      </main>

      <div className="mobile-field-controls">
        <button type="button" onClick={() => showIndex(activeIndex - 1)} aria-label="Previous coordinate">
          <ChevronLeft size={19} aria-hidden="true" />
        </button>
        <span>{String(activeIndex + 1).padStart(2, "0")} / {String(FIELD_NODES.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => showIndex(activeIndex + 1)} aria-label="Next coordinate">
          <ChevronRight size={19} aria-hidden="true" />
        </button>
      </div>

      <FieldTimeline activeId={activeNode.id} onSelect={navigateTo} compact />
    </div>
  );
};

const SpatialPortfolio = () => {
  const compact = useCompactLayout();

  useEffect(() => {
    document.documentElement.classList.add("spatial-home");
    return () => document.documentElement.classList.remove("spatial-home");
  }, []);

  return (
    <>
      <a className="skip-link" href="#spatial-main">Skip to portfolio map</a>
      <div id="spatial-main">
        {compact ? <MobileSpatialField /> : <DesktopSpatialField />}
      </div>
    </>
  );
};

export default SpatialPortfolio;
