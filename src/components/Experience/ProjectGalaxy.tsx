import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Crosshair,
  Minus,
  MousePointer2,
  Plus,
  Rotate3D,
  X,
} from "lucide-react";
import ClientOnly from "../ClientOnly";
import RenderBoundary from "../RenderBoundary";
import useAdaptiveWebGL from "../useAdaptiveWebGL";
import { PROJECTS, type Project } from "../NewSite/data";

const ProjectGalaxyScene = lazy(() => import("./ProjectGalaxyScene"));

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ForgeLaneVisual = ({ compact = false }: { compact?: boolean }) => (
  <div className={`galaxy-forge-visual${compact ? " galaxy-forge-visual--compact" : ""}`} aria-hidden="true">
    <div className="galaxy-forge-visual__bar">
      <span>FORGELANE®</span>
      <span>DIGITAL / DISTINCT</span>
    </div>
    <div className="galaxy-forge-visual__wordmark">
      <span>FORGE</span>
      <span>LANE</span>
    </div>
    <div className="galaxy-forge-visual__orbit">
      <span>F</span>
    </div>
    <div className="galaxy-forge-visual__footer">
      <span>STRATEGY</span>
      <span>IDENTITY</span>
      <span>INTERFACE</span>
      <span>ENGINEERING</span>
    </div>
  </div>
);

const ProjectDetail = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
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

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="project-flight"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-flight-title"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.32 }}
    >
      <motion.div
        ref={dialogRef}
        className="project-flight__sheet"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: reduceMotion ? 0 : 0.52, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="project-flight__nav">
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close ForgeLane case study">
            <ArrowLeft size={17} aria-hidden="true" />
            Return to galaxy
          </button>
          <span>{project.number} / SELECTED VENTURE</span>
          <button className="project-flight__close" type="button" onClick={onClose} aria-label="Close case study">
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <div className="project-flight__scroll">
          <header className="project-flight__hero">
            <div className="project-flight__intro">
              <span>{project.eyebrow}</span>
              <h2 id="project-flight-title">{project.title}</h2>
              <p>{project.description}</p>
              <div className="project-flight__actions">
                {project.url && (
                  <a href={project.url} target="_blank" rel="noreferrer">
                    Launch live site
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                )}
                <a className="is-secondary" href="https://github.com/itachix4" target="_blank" rel="noreferrer">
                  GitHub profile
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
            <ForgeLaneVisual />
          </header>

          <section className="project-flight__facts" aria-label="Project overview">
            <div>
              <span>Role</span>
              <p>{project.role}</p>
            </div>
            <div>
              <span>Problem</span>
              <p>{project.problem}</p>
            </div>
            <div>
              <span>Outcome</span>
              <p>{project.outcome}</p>
            </div>
          </section>

          <section className="project-flight__chapter">
            <div className="project-flight__chapter-copy">
              <span>01 / The challenge</span>
              <h3>Distinct—not decorated.</h3>
              <p>{project.challenge}</p>
              <ul aria-label="Technologies used">
                {project.stack.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
            <div className="project-flight__screens" aria-label="ForgeLane interface previews">
              <ForgeLaneVisual compact />
              <div className="project-flight__screen-detail" aria-hidden="true">
                <span>MAKE IT DISTINCT</span>
                <strong>Ideas deserve<br />a sharper edge.</strong>
                <i />
              </div>
            </div>
          </section>

          <section className="project-flight__chapter project-flight__chapter--learning">
            <div>
              <span>02 / What the work taught me</span>
              <h3>Building the studio changed how I build products.</h3>
            </div>
            <ol>
              {project.learnings.map((learning, index) => (
                <li key={learning}>
                  <span>0{index + 1}</span>
                  <p>{learning}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="project-flight__timeline" aria-labelledby="project-timeline-title">
            <span>03 / Development timeline</span>
            <h3 id="project-timeline-title">From position to production.</h3>
            <ol>
              {project.timeline.map((item, index) => (
                <li key={item.phase}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.phase}</strong>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          <footer className="project-flight__footer">
            <div>
              <span>Next transmission</span>
              <strong>More work is being built—not invented for the grid.</strong>
            </div>
            <button type="button" onClick={onClose}>
              Back to project orbit
              <ArrowDownRight size={17} aria-hidden="true" />
            </button>
          </footer>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectGalaxy = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0);
  const reduceMotion = useReducedMotion();
  const allowWebGL = useAdaptiveWebGL();
  const stageVisible = useInView(stageRef, { margin: "300px 0px" });
  const project = PROJECTS[0];

  const openProject = () => setSelectedId(project.id);
  const closeProject = () => setSelectedId(null);
  const handleBeaconKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      setZoomLevel((value) => Math.min(2, value + 1));
    }
    if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      setZoomLevel((value) => Math.max(-1, value - 1));
    }
  };

  return (
    <section id="work" className="project-galaxy" aria-labelledby="project-galaxy-title">
      <div className="project-galaxy__intro portfolio-container">
        <div className="project-galaxy__index">
          <span>01</span>
          <p>Selected venture</p>
        </div>
        <div>
          <span className="project-galaxy__eyebrow">PROJECT SYSTEM / 01 VERIFIED CASE</span>
          <h2 id="project-galaxy-title">Work with gravity.</h2>
          <p>
            No filler projects. Explore the venture I founded, designed and engineered as one connected system.
          </p>
        </div>
      </div>

      <div ref={stageRef} className={`project-galaxy__stage${hoveredId ? " is-hovering" : ""}`}>
        <div className="project-galaxy__static" aria-hidden="true">
          <span className="project-galaxy__static-core" />
          <span className="project-galaxy__static-orbit" />
          <span className="project-galaxy__static-planet">F</span>
        </div>

        <ClientOnly fallback={null}>
          {allowWebGL && !reduceMotion && stageVisible ? (
            <RenderBoundary fallback={null}>
              <Suspense fallback={null}>
                <ProjectGalaxyScene
                  selectedId={selectedId}
                  zoomLevel={zoomLevel}
                  onSelect={setSelectedId}
                  onHover={setHoveredId}
                />
              </Suspense>
            </RenderBoundary>
          ) : null}
        </ClientOnly>

        <div className="project-galaxy__hud" aria-hidden="true">
          <div>
            <Crosshair size={15} />
            <span>PARTH / PROJECT ORBIT</span>
          </div>
          <div>
            <span className="project-galaxy__live-dot" />
            <span>SYSTEM STABLE</span>
          </div>
        </div>

        <div className="project-galaxy__coordinates" aria-hidden="true">
          <span>DESIGN / ENGINEERING / FOUNDER</span>
          <span>27.2046° N / ACTIVE</span>
        </div>

        <button
          type="button"
          className="project-galaxy__beacon"
          onClick={openProject}
          onPointerEnter={() => setHoveredId(project.id)}
          onPointerLeave={() => setHoveredId(null)}
          onKeyDown={handleBeaconKeyDown}
          aria-label="Open ForgeLane immersive case study. Use arrow keys to change galaxy zoom."
        >
          <span>{project.number} / ACTIVE VENTURE</span>
          <strong>{project.title}</strong>
          <small>Enter project</small>
        </button>

        <div className="project-galaxy__disciplines" aria-label="Connected project disciplines">
          {[
            ["Strategy", "Positioning & direction"],
            ["Identity", "A distinct visual system"],
            ["Engineering", "Production-ready build"],
          ].map(([title, detail], index) => (
            <div key={title}>
              <span>0{index + 1}</span>
              <strong>{title}</strong>
              <small>{detail}</small>
            </div>
          ))}
        </div>

        <div className="project-galaxy__controls">
          <span>
            <MousePointer2 size={14} aria-hidden="true" />
            Drag system to orbit
          </span>
          <div role="group" aria-label="Galaxy zoom controls">
            <button
              type="button"
              onClick={() => setZoomLevel((value) => Math.max(-1, value - 1))}
              aria-label="Zoom out"
            >
              <Minus size={16} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setZoomLevel(0)} aria-label="Reset galaxy view">
              <Rotate3D size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((value) => Math.min(2, value + 1))}
              aria-label="Zoom in"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedId && <ProjectDetail project={project} onClose={closeProject} />}
      </AnimatePresence>
    </section>
  );
};

export default ProjectGalaxy;
