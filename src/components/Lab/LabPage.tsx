import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronDown, MousePointer2 } from "lucide-react";
import { useReducedMotion } from "motion/react";
import ClientOnly from "../ClientOnly";
import RenderBoundary from "../RenderBoundary";
import useAdaptiveWebGL from "../useAdaptiveWebGL";
import type { LabSceneKind } from "./LabScene";

const LabScene = lazy(() => import("./LabScene"));

const SOURCE_URL =
  "https://github.com/itachix4/rajeshportfolio/blob/main/src/components/Lab/LabScene.tsx";

const EXPERIMENTS: Array<{
  id: string;
  number: string;
  kind: LabSceneKind;
  eyebrow: string;
  title: string;
  description: string;
  instruction: string;
  technique: string;
  budget: string;
  badges: string[];
}> = [
  {
    id: "sdf",
    number: "01",
    kind: "raymarch",
    eyebrow: "Fragment study / SDF",
    title: "Geometry with no geometry.",
    description:
      "A raymarched scene built from signed-distance functions, smooth boolean operations and numerical surface normals.",
    instruction: "Move the pointer to orbit the field",
    technique:
      "Every pixel casts a ray into a mathematical scene. Sphere and torus distance fields are blended with a polynomial smooth-union, then marched in 84 bounded steps. The surface normal is reconstructed from six nearby SDF samples; Fresnel and interference bands create the final orange edge response.",
    budget:
      "No mesh data or texture fetches. The fixed 84-step ceiling prevents pathological rays, and the scene is rendered at a capped 1.35 pixel ratio.",
    badges: ["84 max steps", "SDF normals", "0 textures"],
  },
  {
    id: "flow",
    number: "02",
    kind: "particles",
    eyebrow: "GPU study / Flow field",
    title: "100,000 points. Zero CPU animation loops.",
    description:
      "A deterministic particle volume advected by an analytic curl-like field entirely inside the vertex shader.",
    instruction: "Pull the field with the pointer",
    technique:
      "The CPU creates positions and deterministic seeds once. From then on, each vertex calculates its own divergence-light flow using cross-axis sine and cosine fields. Pointer attraction is a Gaussian falloff in particle space, so interaction remains one draw call instead of 100,000 JavaScript updates.",
    budget:
      "One Points draw call, one static position buffer and one seed buffer. Additive point sprites avoid 100,000 individual meshes; antialiasing is disabled for this scene.",
    badges: ["100k vertices", "1 draw call", "GPU motion"],
  },
  {
    id: "reaction",
    number: "03",
    kind: "reaction",
    eyebrow: "Simulation / Gray–Scott",
    title: "Paint a system that keeps evolving.",
    description:
      "An interactive reaction–diffusion simulation whose patterns emerge from two virtual chemicals competing on the GPU.",
    instruction: "Click and drag to inject chemical B",
    technique:
      "Two 256² half-float framebuffers ping-pong between simulation passes. A nine-sample Laplacian diffuses chemicals A and B; Gray–Scott feed, kill and reaction terms generate the emergent pattern. Pointer input deposits chemical B directly into the field before the next pass.",
    budget:
      "Six fixed simulation passes per frame balance growth speed against integrated-GPU cost. Both render targets, materials, geometry and the seed texture are explicitly disposed on unmount.",
    badges: ["Ping-pong FBO", "6 GPU passes", "256² state"],
  },
];

const useFrameTelemetry = () => {
  const [telemetry, setTelemetry] = useState({ fps: 60, milliseconds: 16.7 });

  useEffect(() => {
    let animationFrame = 0;
    let sampleStarted = performance.now();
    let previousFrame = sampleStarted;
    let frameCount = 0;
    let accumulatedFrameTime = 0;

    const sample = (now: number) => {
      frameCount += 1;
      accumulatedFrameTime += now - previousFrame;
      previousFrame = now;

      if (now - sampleStarted >= 600) {
        const elapsed = now - sampleStarted;
        setTelemetry({
          fps: Math.round((frameCount * 1000) / elapsed),
          milliseconds: Number((accumulatedFrameTime / frameCount).toFixed(1)),
        });
        frameCount = 0;
        accumulatedFrameTime = 0;
        sampleStarted = now;
      }

      animationFrame = requestAnimationFrame(sample);
    };

    animationFrame = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return telemetry;
};

const StaticLabFallback = ({ kind }: { kind: LabSceneKind }) => (
  <div className={`lab-static lab-static--${kind}`} aria-hidden="true">
    <span />
    <span />
    <span />
  </div>
);

const Experiment = ({ experiment, allowWebGL }: {
  experiment: (typeof EXPERIMENTS)[number];
  allowWebGL: boolean;
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "420px 0px", threshold: 0.01 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const renderLiveScene = allowWebGL && nearViewport;

  return (
  <section ref={sectionRef} id={experiment.id} className="lab-experiment">
    <header className="lab-experiment__heading">
      <div>
        <span>{experiment.number}</span>
        <p>{experiment.eyebrow}</p>
      </div>
      <div>
        <h2>{experiment.title}</h2>
        <p>{experiment.description}</p>
      </div>
    </header>

    <div className="lab-stage">
      <ClientOnly fallback={<StaticLabFallback kind={experiment.kind} />}>
        {renderLiveScene ? (
          <RenderBoundary fallback={<StaticLabFallback kind={experiment.kind} />}>
            <Suspense fallback={<StaticLabFallback kind={experiment.kind} />}>
              <LabScene kind={experiment.kind} />
            </Suspense>
          </RenderBoundary>
        ) : (
          <StaticLabFallback kind={experiment.kind} />
        )}
      </ClientOnly>

      <div className="lab-stage__chrome lab-stage__chrome--top" aria-hidden="true">
        <span>PARTH / COMPUTE LAB</span>
        <span>{renderLiveScene ? "GPU ACTIVE" : "STATIC FALLBACK"}</span>
      </div>
      <div className="lab-stage__instruction">
        <MousePointer2 size={14} aria-hidden="true" />
        {renderLiveScene ? experiment.instruction : "Desktop GPU mode available"}
      </div>
      <ul className="lab-stage__badges" aria-label="Performance characteristics">
        {experiment.badges.map((badge) => <li key={badge}>{badge}</li>)}
      </ul>
    </div>

    <details className="lab-note">
      <summary>
        <span>How it works</span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <div className="lab-note__body">
        <div><span>Technique</span><p>{experiment.technique}</p></div>
        <div><span>Performance tradeoff</span><p>{experiment.budget}</p></div>
        <a href={SOURCE_URL} target="_blank" rel="noreferrer">
          View source
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </details>
  </section>
  );
};

const LabPage = () => {
  const reducedMotion = Boolean(useReducedMotion());
  const capableDevice = useAdaptiveWebGL({ requireWebGL2: true });
  const allowWebGL = capableDevice && !reducedMotion;
  const telemetry = useFrameTelemetry();

  return (
    <div className="lab-page">
      <a className="skip-link" href="#lab-content">Skip to experiments</a>
      <header className="lab-nav">
        <a href="/" aria-label="Return to Parth Parwani portfolio">
          <span>P.</span>
          <strong>Compute Lab</strong>
        </a>
        <div className="lab-telemetry" aria-label="Live browser frame telemetry">
          <span className={allowWebGL ? "is-live" : undefined} />
          <div><small>Frame</small><strong>{telemetry.fps} FPS</strong></div>
          <div><small>Time</small><strong>{telemetry.milliseconds} MS</strong></div>
        </div>
        <a className="lab-nav__back" href="/">
          <ArrowLeft size={15} aria-hidden="true" />
          Portfolio
        </a>
      </header>

      <main id="lab-content">
        <section className="lab-hero">
          <div className="lab-hero__meta">
            <span>LAB / 001</span>
            <span>{allowWebGL ? "REAL-TIME GPU" : "ACCESSIBLE STATIC MODE"}</span>
          </div>
          <h1>
            Proof lives in
            <span> the render loop.</span>
          </h1>
          <div className="lab-hero__footer">
            <p>
              Three experiments in shader math, parallel computation and emergent systems.
              No videos. No presets. Every frame is computed live.
            </p>
            <nav aria-label="Lab experiments">
              {EXPERIMENTS.map((experiment) => (
                <a key={experiment.id} href={`#${experiment.id}`}>
                  <span>{experiment.number}</span>{experiment.kind}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {EXPERIMENTS.map((experiment) => (
          <Experiment key={experiment.id} experiment={experiment} allowWebGL={allowWebGL} />
        ))}
      </main>

      <footer className="lab-footer">
        <div><span>End of buffer</span><strong>Built from first principles.</strong></div>
        <a href="/">Return to portfolio <ArrowUpRight size={16} aria-hidden="true" /></a>
      </footer>
    </div>
  );
};

export default LabPage;
