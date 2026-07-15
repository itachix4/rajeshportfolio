import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { Braces, CircleStop, Copy, Eye, Play, RotateCcw, Trash2 } from "lucide-react";
import { useLabRuntime, useLabStoredState } from "../../runtime/LabRuntime";

type MotionPoint = { x: number; y: number; t: number };
type EasingKind = "linear" | "cubic" | "inertia" | "spring";
type ExportKind = "css" | "gsap" | "framer";

const clamp = (value: number, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));

const easingFunctions: Record<EasingKind, (value: number) => number> = {
  linear: (value) => value,
  cubic: (value) => value * value * (3 - 2 * value),
  inertia: (value) => 1 - Math.pow(1 - value, 3.2),
  spring: (value) => clamp(1 - Math.exp(-6.2 * value) * Math.cos(10.5 * value)),
};

const interpolatePoint = (points: MotionPoint[], progress: number) => {
  if (points.length === 0) return { x: 50, y: 50 };
  if (points.length === 1) return points[0];
  const scaled = clamp(progress) * (points.length - 1);
  const index = Math.min(points.length - 2, Math.floor(scaled));
  const local = scaled - index;
  return {
    x: points[index].x + (points[index + 1].x - points[index].x) * local,
    y: points[index].y + (points[index + 1].y - points[index].y) * local,
  };
};

const graphPath = (values: number[], width = 240, height = 54) => {
  if (values.length < 2) return "";
  const maximum = Math.max(...values.map(Math.abs), 0.001);
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - (Math.abs(value) / maximum) * (height - 8) - 4;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
};

const buildCode = (kind: ExportKind, points: MotionPoint[], easing: EasingKind) => {
  const sampled = points.filter((_, index) => index % Math.max(1, Math.floor(points.length / 6)) === 0).slice(0, 7);
  const coordinates = sampled.map((point) => `{ x: ${point.x.toFixed(1)}, y: ${point.y.toFixed(1)} }`);

  if (kind === "gsap") {
    return `gsap.to(".target", {\n  duration: 1.2,\n  ease: "${easing === "spring" ? "elastic.out(1, 0.45)" : "power3.out"}",\n  motionPath: {\n    path: [${coordinates.join(", ")}],\n    curviness: 1.25\n  }\n});`;
  }
  if (kind === "framer") {
    return `animate={{\n  x: [${sampled.map((point) => point.x.toFixed(1)).join(", ")}],\n  y: [${sampled.map((point) => point.y.toFixed(1)).join(", ")}],\n}}\ntransition={{\n  duration: 1.2,\n  type: "${easing === "spring" ? "spring" : "tween"}",\n  stiffness: 180, damping: 18\n}}`;
  }

  return `@keyframes recorded-motion {\n${sampled.map((point, index) => `  ${Math.round(index / Math.max(1, sampled.length - 1) * 100)}% { transform: translate(${point.x.toFixed(1)}px, ${point.y.toFixed(1)}px); }`).join("\n")}\n}\n.target {\n  animation: recorded-motion 1.2s ${easing === "cubic" ? "cubic-bezier(.22,1,.36,1)" : easing} both;\n}`;
};

const MotionLab = () => {
  const reducedMotion = Boolean(useReducedMotion());
  const [points, setPoints] = useLabStoredState<MotionPoint[]>("motion:path", []);
  const [easing, setEasing] = useLabStoredState<EasingKind>("motion:easing", "spring");
  const [onionSkin, setOnionSkin] = useLabStoredState("motion:onion", true);
  const [exportKind, setExportKind] = useState<ExportKind>("framer");
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [scrub, setScrub] = useState(0);
  const [copied, setCopied] = useState(false);
  const drawingRef = useRef<SVGSVGElement>(null);
  const recordStart = useRef(0);
  const lastSample = useRef(0);
  const playbackFrame = useRef<number | null>(null);
  const { revealClue, clues, playSound } = useLabRuntime();

  const pathData = useMemo(
    () => points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" "),
    [points],
  );

  const metrics = useMemo(() => {
    const velocities: number[] = [];
    for (let index = 1; index < points.length; index += 1) {
      const distance = Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y);
      const seconds = Math.max(0.008, (points[index].t - points[index - 1].t) / 1000);
      velocities.push(distance / seconds);
    }
    const acceleration = velocities.slice(1).map((value, index) => value - velocities[index]);
    return { velocities, acceleration };
  }, [points]);

  const easedProgress = easingFunctions[easing](scrub);
  const activePoint = interpolatePoint(points, easedProgress);
  const code = useMemo(() => buildCode(exportKind, points, easing), [easing, exportKind, points]);
  const duration = points.at(-1)?.t ?? 1200;

  useEffect(() => () => {
    if (playbackFrame.current !== null) window.cancelAnimationFrame(playbackFrame.current);
  }, []);

  const pointFromEvent = (event: ReactPointerEvent<SVGSVGElement>): MotionPoint => {
    const rect = drawingRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0, t: 0 };
    return {
      x: clamp((event.clientX - rect.left) / rect.width) * 100,
      y: clamp((event.clientY - rect.top) / rect.height) * 100,
      t: performance.now() - recordStart.current,
    };
  };

  const beginRecording = (event: ReactPointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    recordStart.current = performance.now();
    lastSample.current = 0;
    setPlaying(false);
    setScrub(0);
    setRecording(true);
    setPoints([pointFromEvent(event)]);
    playSound("motion");
  };

  const recordMovement = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!recording) return;
    const elapsed = performance.now() - recordStart.current;
    if (elapsed - lastSample.current < 16) return;
    lastSample.current = elapsed;
    setPoints((current) => current.length >= 180 ? current : [...current, pointFromEvent(event)]);
  };

  const endRecording = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!recording) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setRecording(false);
    setScrub(1);
    playSound("motion");
  };

  const replay = () => {
    if (points.length < 2) return;
    if (playbackFrame.current !== null) window.cancelAnimationFrame(playbackFrame.current);
    const start = performance.now();
    const playbackDuration = reducedMotion ? 20 : Math.min(2200, Math.max(650, duration));
    setPlaying(true);
    setScrub(0);
    playSound("motion");

    const tick = (now: number) => {
      const progress = clamp((now - start) / playbackDuration);
      setScrub(progress);
      if (progress < 1) playbackFrame.current = window.requestAnimationFrame(tick);
      else {
        setPlaying(false);
        playbackFrame.current = null;
      }
    };
    playbackFrame.current = window.requestAnimationFrame(tick);
  };

  const selectEasing = (next: EasingKind) => {
    setEasing(next);
    playSound("motion");
    if (next === "spring" && points.length >= 2) revealClue("motionSignature");
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.div
      className="motion-recorder"
      initial={reducedMotion ? false : { opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="motion-recorder__transport">
        <div>
          <span className={recording ? "is-recording" : undefined}><i /> {recording ? "CAPTURING" : `${points.length} SAMPLES`}</span>
          <strong>{(duration / 1000).toFixed(2)}s</strong>
        </div>
        <div>
          <button type="button" onClick={replay} disabled={points.length < 2} aria-label="Replay recorded motion">
            {playing ? <CircleStop size={15} /> : <Play size={15} />}
          </button>
          <button type="button" onClick={() => setOnionSkin((value) => !value)} aria-pressed={onionSkin} aria-label="Toggle onion skin frames">
            <Eye size={15} />
          </button>
          <button type="button" onClick={() => { setPoints([]); setScrub(0); }} aria-label="Clear recorded path">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="motion-recorder__workspace">
        <section className="motion-recorder__canvas" aria-label="Motion path recorder">
          <div className="motion-recorder__canvas-label">
            <span>GESTURE FIELD / POINTER + TOUCH</span>
            <span>{recording ? "RECORDING LIVE" : "DRAW TO REPLACE PATH"}</span>
          </div>
          <svg
            ref={drawingRef}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            onPointerDown={beginRecording}
            onPointerMove={recordMovement}
            onPointerUp={endRecording}
            onPointerCancel={endRecording}
            aria-label="Draw a motion path"
          >
            <defs>
              <pattern id="motion-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M10 0H0V10" fill="none" stroke="currentColor" strokeWidth=".18" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#motion-grid)" className="motion-recorder__grid" />
            {pathData && <path d={pathData} className="motion-recorder__path" vectorEffect="non-scaling-stroke" />}
            {onionSkin && points.length > 2 && Array.from({ length: 7 }, (_, index) => {
              const point = interpolatePoint(points, index / 6);
              return <circle key={index} cx={point.x} cy={point.y} r="1.05" className="motion-recorder__onion" opacity={(index + 1) / 9} />;
            })}
            {points.length > 0 && (
              <g transform={`translate(${activePoint.x} ${activePoint.y})`} className="motion-recorder__target">
                <rect x="-2.4" y="-2.4" width="4.8" height="4.8" rx="1.1" />
                <circle r="4.8" />
              </g>
            )}
          </svg>
          {points.length === 0 && <p>Press, draw and release.<br />Your gesture becomes the timeline.</p>}
        </section>

        <aside className="motion-recorder__inspector">
          <div className="motion-recorder__easing">
            <span>MOTION MODEL</span>
            {(["linear", "cubic", "inertia", "spring"] as EasingKind[]).map((kind) => (
              <button key={kind} type="button" className={easing === kind ? "is-active" : undefined} onClick={() => selectEasing(kind)}>
                <i className={`ease-curve is-${kind}`} />
                <span>{kind}</span>
              </button>
            ))}
          </div>

          <div className="motion-recorder__graphs">
            <span>VELOCITY</span>
            <svg viewBox="0 0 240 54" role="img" aria-label="Recorded pointer velocity graph">
              <path d={graphPath(metrics.velocities)} />
            </svg>
            <span>ACCELERATION</span>
            <svg viewBox="0 0 240 54" role="img" aria-label="Recorded pointer acceleration graph">
              <path d={graphPath(metrics.acceleration)} />
            </svg>
          </div>
        </aside>
      </div>

      <div className="motion-recorder__timeline">
        <button type="button" onClick={() => setScrub(0)} aria-label="Return playhead to start"><RotateCcw size={14} /></button>
        <span>00:00</span>
        <input
          type="range"
          min="0"
          max="1000"
          value={Math.round(scrub * 1000)}
          onChange={(event) => { setPlaying(false); setScrub(Number(event.target.value) / 1000); }}
          aria-label="Scrub recorded motion timeline"
        />
        <span>{(duration / 1000).toFixed(2)}s</span>
      </div>

      <div className="motion-recorder__output">
        <div className="motion-recorder__compare">
          <span>COMPARE MOTION</span>
          <div>
            {(["linear", "cubic", "inertia", "spring"] as EasingKind[]).map((kind) => {
              const comparePoint = interpolatePoint(points, easingFunctions[kind](scrub));
              return (
                <div key={kind}>
                  <span>{kind}</span>
                  <i><b style={{ transform: `translateX(${comparePoint.x * 1.35}px)` }} /></i>
                </div>
              );
            })}
          </div>
          {clues.motionSignature && (
            <button className="motion-recorder__clue" type="button" onClick={() => playSound("core")}>
              SIGNATURE EXTRACTED <strong>3 · 1 · 4</strong>
            </button>
          )}
        </div>

        <section className="motion-recorder__code" aria-label="Generated animation code">
          <header>
            <div role="tablist" aria-label="Animation code format">
              {(["css", "gsap", "framer"] as ExportKind[]).map((kind) => (
                <button role="tab" aria-selected={exportKind === kind} key={kind} type="button" onClick={() => setExportKind(kind)}>{kind}</button>
              ))}
            </div>
            <button type="button" onClick={copyCode}><Copy size={13} /> {copied ? "Copied" : "Copy"}</button>
          </header>
          <pre><code><Braces size={14} aria-hidden="true" />{points.length > 1 ? code : "Draw a path to generate production animation code."}</code></pre>
        </section>
      </div>
    </motion.div>
  );
};

export default MotionLab;
