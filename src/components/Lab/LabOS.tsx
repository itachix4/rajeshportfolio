import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent,
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
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { CORE_APP, LAB_APPS, type LabApp, type LabIcon, type LabStatus } from "./labData";
import { LabApplication } from "./apps/LabApplication";
import { useLabRuntime } from "./runtime/LabRuntime";

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
    case "core":
      return <svg {...common}><path d="M16 3 27 9v14l-11 6-11-6V9l11-6Z"/><circle cx="16" cy="16" r="5"/><path d="M16 3v8M27 9l-7 4M27 23l-7-4M16 29v-8M5 23l7-4M5 9l7 4"/></svg>;
  }
};

export const StatusBadge = ({ status, compact = false }: { status: LabStatus; compact?: boolean }) => (
  <span className={`lab-os-status lab-os-status--${status.toLowerCase()}${compact ? " is-compact" : ""}`}>
    <i aria-hidden="true" />
    {!compact && status}
    {compact && <span className="sr-only">{status}</span>}
  </span>
);

export const AppIcon = ({ app, index, onOpen }: {
  app: LabApp;
  index: number;
  onOpen: (app: LabApp) => void;
}) => {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      className={`lab-os-app-icon${app.id === "core" ? " is-core" : ""}`}
      data-lab-app={app.id}
      aria-label={`Open ${app.title}. Status: ${app.status}`}
      onClick={() => onOpen(app)}
      initial={reducedMotion ? false : { opacity: 0, y: 15, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 22, delay: index * 0.035 }}
      whileHover={reducedMotion ? undefined : { y: app.id === "core" ? -2 : -4 }}
      whileTap={reducedMotion ? undefined : { scale: 0.95 }}
    >
      <motion.span className={`lab-os-app-icon__tile is-${app.icon}`} layoutId={`lab-app-${app.id}`}>
        <LabGlyph icon={app.icon} />
        <StatusBadge status={app.status} compact />
        {app.clue && <i className="lab-os-app-icon__clue" aria-label="This app contains a CORE trace" />}
      </motion.span>
      <span>{app.title}</span>
    </motion.button>
  );
};

export const HomeScreen = ({ onOpen }: { onOpen: (app: LabApp) => void }) => {
  const { clues } = useLabRuntime();
  const apps = clues.coreUnlocked ? [...LAB_APPS, CORE_APP] : LAB_APPS;

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
      className={`lab-os-home${clues.coreUnlocked ? " has-core" : ""}`}
      aria-label="PARTH LAB OS home screen"
      initial={{ opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="lab-os-home__top">
        <div><span>PARTH</span><strong>LAB OS</strong></div>
        <span>{clues.coreUnlocked ? "09 APPS / CORE ONLINE" : "08 APPS / SYSTEM LIVE"}</span>
      </div>
      <div className="lab-os-home__statement">
        <span>Experimental build 2.0</span>
        <p>{clues.coreUnlocked ? "The system opened inward." : "Ideas become instruments here."}</p>
      </div>
      <div className="lab-os-grid" role="group" aria-label="Lab applications" onKeyDown={handleArrowNavigation}>
        {apps.map((app, index) => (
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

const AppLoadingState = ({ app }: { app: LabApp }) => (
  <div className={`lab-app-loading is-${app.preview}`} role="status">
    <span aria-hidden="true"><i /><i /><i /></span>
    <strong>Opening {app.title}</strong>
    <small>Loading only this instrument</small>
  </div>
);

export const AppWindow = ({ app, onHome }: { app: LabApp; onHome: () => void }) => {
  const swipeStart = useRef<number | null>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const { soundEnabled, toggleSound, playSound } = useLabRuntime();

  useEffect(() => {
    backButton.current?.focus();
    playSound(app.id === "core" ? "core" : "system");
  }, [app.id, playSound]);

  const beginSwipe = (event: PointerEvent<HTMLElement>) => {
    swipeStart.current = event.clientY;
  };
  const finishSwipe = (event: PointerEvent<HTMLElement>) => {
    if (swipeStart.current !== null && event.clientY - swipeStart.current < -72) onHome();
    swipeStart.current = null;
  };

  return (
    <motion.article
      className={`lab-app-host lab-app-host--${app.id}`}
      data-app-id={app.id}
      layoutId={`lab-app-${app.id}`}
      aria-labelledby="lab-app-title"
      onPointerDown={beginSwipe}
      onPointerUp={finishSwipe}
      transition={{ type: "spring", stiffness: 250, damping: 27, mass: 0.8 }}
    >
      <header className="lab-app-chrome">
        <button ref={backButton} type="button" onClick={onHome} aria-label="Return to Lab OS home">
          <ArrowLeft size={17} aria-hidden="true" />
        </button>
        <div>
          <span>{app.number}</span>
          <strong id="lab-app-title">{app.title}</strong>
        </div>
        <button
          type="button"
          onClick={toggleSound}
          aria-label={soundEnabled ? "Mute Lab sound design" : "Enable Lab sound design"}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
        </button>
      </header>

      <div className="lab-app-runtime">
        <Suspense fallback={<AppLoadingState app={app} />}>
          <LabApplication app={app} onHome={onHome} />
        </Suspense>
      </div>

      <button className="lab-os-home-indicator" type="button" onClick={onHome} aria-label="Return to home screen" />
    </motion.article>
  );
};

export const PhoneFrame = ({ onActiveChange }: { onActiveChange?: (app: LabApp | null) => void }) => {
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
      const immediate = window.setTimeout(() => setPhase("home"), 0);
      return () => window.clearTimeout(immediate);
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
    manualUnlockTimer.current = window.setTimeout(() => setPhase("home"), reducedMotion ? 0 : 430);
  }, [phase, reducedMotion]);
  const openApp = useCallback((app: LabApp) => setActiveApp(app), []);
  const closeApp = useCallback(() => {
    const previousId = activeApp?.id;
    setActiveApp(null);
    if (previousId) window.requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[data-lab-app="${previousId}"]`)?.focus();
    });
  }, [activeApp?.id]);

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if (!activeApp) return;
      if (event.key === "Escape") closeApp();
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [activeApp, closeApp]);

  const cacheBounds = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || activeApp || event.pointerType !== "mouse") return;
    bounds.current = event.currentTarget.getBoundingClientRect();
  };
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (!bounds.current || reducedMotion || activeApp || event.pointerType !== "mouse") return;
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
        className={`lab-device${activeApp ? " is-app-open" : ""}`}
        data-open-app={activeApp?.id}
        layout
        style={reducedMotion || activeApp ? undefined : { rotateX, rotateY }}
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
              {phase === "home" && activeApp && <AppWindow key={activeApp.id} app={activeApp} onHome={closeApp} />}
            </AnimatePresence>
          </LayoutGroup>
        </div>
      </motion.div>
    </motion.div>
  );
};
