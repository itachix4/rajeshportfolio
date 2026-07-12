import {
  lazy,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Code2 } from "lucide-react";
import ClientOnly from "../ClientOnly";
import RenderBoundary from "../RenderBoundary";
import useAdaptiveWebGL from "../useAdaptiveWebGL";
import { LAB_APPS, LabApp, LabIcon, LabStatus } from "./labData";

const LabScene = lazy(() => import("./LabScene"));

const LabGlyph = ({ icon }: { icon: LabIcon }) => {
  const common = { viewBox: "0 0 32 32", fill: "none", xmlns: "http://www.w3.org/2000/svg" };

  switch (icon) {
    case "motion":
      return <svg {...common}><path d="M5 19c4-12 7 8 11-4s7 8 11-4"/><circle cx="5" cy="19" r="2"/></svg>;
    case "ai":
      return <svg {...common}><circle cx="16" cy="16" r="4"/><path d="M16 4v5M16 23v5M4 16h5M23 16h5M7.5 7.5l3.6 3.6M20.9 20.9l3.6 3.6M24.5 7.5l-3.6 3.6M11.1 20.9l-3.6 3.6"/></svg>;
    case "cube":
      return <svg {...common}><path d="m16 4 10 6v12l-10 6-10-6V10l10-6Z"/><path d="m6 10 10 6 10-6M16 16v12"/></svg>;
    case "systems":
      return <svg {...common}><rect x="5" y="5" width="9" height="9" rx="2"/><rect x="18" y="5" width="9" height="9" rx="2"/><rect x="5" y="18" width="9" height="9" rx="2"/><path d="M18 22.5h9M22.5 18v9"/></svg>;
    case "forge":
      return <svg {...common}><path d="M8 27V5h16M8 16h12M8 27h16"/><path d="m20 5 4 4-4 4"/></svg>;
    case "live":
      return <svg {...common}><path d="M5 23 11 17l5 3 11-12"/><path d="M20 8h7v7"/><circle cx="11" cy="17" r="2"/></svg>;
    case "archive":
      return <svg {...common}><path d="M5 9h22v18H5zM3 5h26v6H3z"/><path d="M12 16h8"/></svg>;
    case "about":
      return <svg {...common}><circle cx="16" cy="16" r="12"/><path d="M16 14v8M16 9v1"/></svg>;
  }
};

export const StatusBadge = ({ status, compact = false }: { status: LabStatus; compact?: boolean }) => (
  <span className={`lab-os-status lab-os-status--${status.toLowerCase()}${compact ? " is-compact" : ""}`}>
    <i aria-hidden="true" />
    {!compact && status}
    {compact && <span className="sr-only">{status}</span>}
  </span>
);

export const ProgressIndicator = ({ value }: { value: number }) => {
  const reducedMotion = useReducedMotion();

  return (
    <div className="lab-os-progress" aria-label={`${value}% complete`}>
      <div><span>Progress</span><strong>{value}%</strong></div>
      <div aria-hidden="true">
        <motion.span
          initial={reducedMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: value / 100 }}
          transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.12 }}
        />
      </div>
    </div>
  );
};

const StaticPreview = ({ app }: { app: LabApp }) => (
  <div className={`lab-os-preview-art lab-os-preview-art--${app.preview}`} aria-hidden="true">
    <span /><span /><span /><span />
    <strong>{app.number}</strong>
  </div>
);

const ExperimentPreview = ({ app }: { app: LabApp }) => {
  const reducedMotion = Boolean(useReducedMotion());
  const allowWebGL = useAdaptiveWebGL({ requireWebGL2: true }) && !reducedMotion;

  if (!app.liveScene || !allowWebGL) return <StaticPreview app={app} />;

  return (
    <div className="lab-os-live-preview">
      <StaticPreview app={app} />
      <ClientOnly>
        <RenderBoundary fallback={null}>
          <Suspense fallback={null}>
            <LabScene kind={app.liveScene} />
          </Suspense>
        </RenderBoundary>
      </ClientOnly>
    </div>
  );
};

export const AppIcon = ({ app, index, onOpen }: {
  app: LabApp;
  index: number;
  onOpen: (app: LabApp) => void;
}) => {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      className="lab-os-app-icon"
      data-lab-app={app.id}
      aria-label={`Open ${app.title}. Status: ${app.status}`}
      onClick={() => onOpen(app)}
      initial={reducedMotion ? false : { opacity: 0, y: 15, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 22, delay: index * 0.035 }}
      whileHover={reducedMotion ? undefined : { y: -4 }}
      whileTap={reducedMotion ? undefined : { scale: 0.95 }}
    >
      <motion.span className={`lab-os-app-icon__tile is-${app.icon}`} layoutId={`lab-app-${app.id}`}>
        <LabGlyph icon={app.icon} />
        <StatusBadge status={app.status} compact />
      </motion.span>
      <span>{app.title}</span>
    </motion.button>
  );
};

export const HomeScreen = ({ onOpen }: { onOpen: (app: LabApp) => void }) => {
  const handleArrowNavigation = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!event.key.startsWith("Arrow")) return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex < 0) return;
    const columns = 4;
    const delta = event.key === "ArrowRight" ? 1
      : event.key === "ArrowLeft" ? -1
        : event.key === "ArrowDown" ? columns : -columns;
    const nextIndex = (currentIndex + delta + buttons.length) % buttons.length;
    event.preventDefault();
    buttons[nextIndex]?.focus();
  };

  return (
    <motion.section
      className="lab-os-home"
      aria-label="PARTH LAB OS home screen"
      initial={{ opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="lab-os-home__top">
        <div><span>PARTH</span><strong>LAB OS</strong></div>
        <span>08 APPS / SYSTEM LIVE</span>
      </div>
      <div className="lab-os-home__statement">
        <span>Experimental build 1.0</span>
        <p>Ideas become interfaces here.</p>
      </div>
      <div className="lab-os-grid" role="group" aria-label="Lab applications" onKeyDown={handleArrowNavigation}>
        {LAB_APPS.map((app, index) => (
          <AppIcon key={app.id} app={app} index={index} onOpen={onOpen} />
        ))}
      </div>
      <div className="lab-os-dock" aria-hidden="true">
        <span>PP</span><i /><i /><i />
      </div>
    </motion.section>
  );
};

export const LockScreen = ({ phase, onUnlock }: {
  phase: "lock" | "unlocking";
  onUnlock: () => void;
}) => (
  <motion.button
    type="button"
    className="lab-os-lock"
    aria-label="Unlock PARTH LAB OS"
    onClick={onUnlock}
    exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
    transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="lab-os-lock__orb" aria-hidden="true"><span /><span /></div>
    <div className="lab-os-lock__copy">
      <span>EXPERIMENTAL MOBILE SYSTEM</span>
      <h2>PARTH<br />LAB OS</h2>
      <p>{phase === "unlocking" ? "Opening system…" : "Tap to unlock"}</p>
    </div>
    <div className="lab-os-lock__scan" aria-hidden="true" />
  </motion.button>
);

export const NavigationControls = ({ onPrevious, onNext, onHome }: {
  onPrevious: () => void;
  onNext: () => void;
  onHome: () => void;
}) => (
  <nav className="lab-os-window__navigation" aria-label="Experiment navigation">
    <button type="button" onClick={onPrevious} aria-label="Previous experiment"><ChevronLeft size={17} /></button>
    <button type="button" onClick={onHome}>All apps</button>
    <button type="button" onClick={onNext} aria-label="Next experiment"><ChevronRight size={17} /></button>
  </nav>
);

export const AppWindow = ({ app, onHome, onPrevious, onNext }: {
  app: LabApp;
  onHome: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  const swipeStart = useRef<number | null>(null);
  const backButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    backButton.current?.focus();
  }, [app.id]);

  const beginSwipe = (event: PointerEvent<HTMLElement>) => {
    swipeStart.current = event.clientY;
  };
  const finishSwipe = (event: PointerEvent<HTMLElement>) => {
    if (swipeStart.current !== null && event.clientY - swipeStart.current < -62) onHome();
    swipeStart.current = null;
  };
  const external = (url: string) => url.startsWith("http");

  return (
    <motion.article
      className="lab-os-window"
      layoutId={`lab-app-${app.id}`}
      aria-labelledby="lab-window-title"
      onPointerDown={beginSwipe}
      onPointerUp={finishSwipe}
      transition={{ type: "spring", stiffness: 270, damping: 27, mass: 0.75 }}
    >
      <header className="lab-os-window__header">
        <button ref={backButton} type="button" onClick={onHome} aria-label="Return to Lab OS home">
          <ArrowLeft size={17} />
        </button>
        <span>{app.number}</span>
        <StatusBadge status={app.status} />
      </header>

      <div className="lab-os-window__scroll">
        <div className="lab-os-window__intro">
          <span className={`lab-os-window__icon is-${app.icon}`}><LabGlyph icon={app.icon} /></span>
          <div><h2 id="lab-window-title">{app.title}</h2><p>{app.description}</p></div>
        </div>

        <div className="lab-os-window__meta">
          <ProgressIndicator value={app.progress} />
          <div><span>Updated</span><strong>{app.updatedAt}</strong></div>
        </div>

        <ExperimentPreview app={app} />

        <div className="lab-os-window__technologies" aria-label="Technologies used">
          {app.technologies.map((technology) => <span key={technology}>{technology}</span>)}
        </div>

        <div className="lab-os-window__notes">
          <section><span>Key challenge</span><p>{app.challenge}</p></section>
          <section><span>What I learned</span><p>{app.learning}</p></section>
        </div>

        <div className="lab-os-window__actions">
          <a href={app.liveUrl} target={external(app.liveUrl) ? "_blank" : undefined} rel={external(app.liveUrl) ? "noreferrer" : undefined}>
            Launch experiment <ArrowUpRight size={15} />
          </a>
          <a href={app.codeUrl} target="_blank" rel="noreferrer"><Code2 size={15} /> View code</a>
        </div>

        <NavigationControls onPrevious={onPrevious} onNext={onNext} onHome={onHome} />
      </div>

      <button className="lab-os-home-indicator" type="button" onClick={onHome} aria-label="Return to home screen" />
    </motion.article>
  );
};

export const PhoneFrame = ({ onActiveChange }: {
  onActiveChange?: (app: LabApp | null) => void;
}) => {
  const reducedMotion = Boolean(useReducedMotion());
  const [phase, setPhase] = useState<"lock" | "unlocking" | "home">(reducedMotion ? "home" : "lock");
  const [activeApp, setActiveApp] = useState<LabApp | null>(null);
  const bounds = useRef<DOMRect | null>(null);
  const manualUnlockTimer = useRef<number | null>(null);
  const manualUnlockRequested = useRef(false);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 120, damping: 22, mass: 0.8 });
  const rotateY = useSpring(rawRotateY, { stiffness: 120, damping: 22, mass: 0.8 });

  useEffect(() => {
    if (reducedMotion) {
      setPhase("home");
      return;
    }
    const unlockTimer = window.setTimeout(() => setPhase("unlocking"), 820);
    const homeTimer = window.setTimeout(() => setPhase("home"), 1420);
    return () => {
      window.clearTimeout(unlockTimer);
      window.clearTimeout(homeTimer);
    };
  }, [reducedMotion]);

  useEffect(() => onActiveChange?.(activeApp), [activeApp, onActiveChange]);

  useEffect(() => {
    if (phase !== "home" || !manualUnlockRequested.current) return;
    manualUnlockRequested.current = false;
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>("[data-lab-app]")?.focus();
    });
  }, [phase]);

  useEffect(() => () => {
    if (manualUnlockTimer.current !== null) window.clearTimeout(manualUnlockTimer.current);
  }, []);

  const unlock = useCallback(() => {
    if (phase === "home") return;
    manualUnlockRequested.current = true;
    setPhase("unlocking");
    if (manualUnlockTimer.current !== null) window.clearTimeout(manualUnlockTimer.current);
    manualUnlockTimer.current = window.setTimeout(
      () => setPhase("home"),
      reducedMotion ? 0 : 430,
    );
  }, [phase, reducedMotion]);
  const openApp = useCallback((app: LabApp) => setActiveApp(app), []);
  const closeApp = useCallback(() => {
    const previousId = activeApp?.id;
    setActiveApp(null);
    if (previousId) window.requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[data-lab-app="${previousId}"]`)?.focus();
    });
  }, [activeApp?.id]);
  const navigate = useCallback((direction: number) => {
    setActiveApp((current) => {
      const currentIndex = current ? LAB_APPS.findIndex((app) => app.id === current.id) : 0;
      return LAB_APPS[(currentIndex + direction + LAB_APPS.length) % LAB_APPS.length];
    });
  }, []);

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if (!activeApp) return;
      if (event.key === "Escape" || event.key === "ArrowUp") closeApp();
      if (event.key === "ArrowLeft") navigate(-1);
      if (event.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [activeApp, closeApp, navigate]);
  const cacheBounds = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;
    bounds.current = event.currentTarget.getBoundingClientRect();
  };
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (!bounds.current || reducedMotion || event.pointerType !== "mouse") return;
    const x = (event.clientX - bounds.current.left) / bounds.current.width - 0.5;
    const y = (event.clientY - bounds.current.top) / bounds.current.height - 0.5;
    rawRotateX.set(y * -4.5);
    rawRotateY.set(x * 5.5);
  };
  const releaseTilt = () => {
    bounds.current = null;
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  return (
    <motion.div
      className="lab-device-entrance"
      initial={reducedMotion ? false : { opacity: 0, y: 150, rotateX: -9, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 70, damping: 18, mass: 1.05 }}
    >
      <motion.div
        className="lab-device"
        style={reducedMotion ? undefined : { rotateX, rotateY }}
        onPointerEnter={cacheBounds}
        onPointerMove={tilt}
        onPointerLeave={releaseTilt}
      >
        <span className="lab-device__button lab-device__button--one" aria-hidden="true" />
        <span className="lab-device__button lab-device__button--two" aria-hidden="true" />
        <div className="lab-device__screen">
          <div className="lab-device__camera" aria-hidden="true"><i /></div>
          <LayoutGroup id="parth-lab-os">
            <AnimatePresence mode="popLayout" initial={false}>
              {phase !== "home" && <LockScreen key="lock" phase={phase} onUnlock={unlock} />}
              {phase === "home" && !activeApp && <HomeScreen key="home" onOpen={openApp} />}
              {phase === "home" && activeApp && (
                <AppWindow
                  key={activeApp.id}
                  app={activeApp}
                  onHome={closeApp}
                  onPrevious={() => navigate(-1)}
                  onNext={() => navigate(1)}
                />
              )}
            </AnimatePresence>
          </LayoutGroup>
        </div>
      </motion.div>
    </motion.div>
  );
};
