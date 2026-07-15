import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Accessibility, Activity, Box, Braces, Component, Gauge, Grid3X3, Pause, Play, RotateCcw, Route, ScanSearch, Waves } from "lucide-react";
import { dispatchCoreCommand, type CoreCommand } from "../../../CoreRuntimeBridge";
import { useLabRuntime } from "../../runtime/LabRuntime";

type NodeId = "app" | "hero" | "galaxy" | "lab" | "assistant" | "tokens" | "motion" | "webgl";
const nodes = [
  { id: "app" as NodeId, label: "App Router", kind: "ROOT", x: 49, y: 11, selector: "body" },
  { id: "hero" as NodeId, label: "CinematicHero", kind: "COMPONENT", x: 18, y: 35, selector: ".experience-hero" },
  { id: "galaxy" as NodeId, label: "ProjectGalaxy", kind: "WEBGL", x: 18, y: 72, selector: ".project-galaxy" },
  { id: "lab" as NodeId, label: "LabRuntime", kind: "STATE", x: 49, y: 49, selector: ".lab-os-page" },
  { id: "assistant" as NodeId, label: "PortfolioGuide", kind: "STATE", x: 80, y: 34, selector: ".parth-assistant" },
  { id: "tokens" as NodeId, label: "DesignTokens", kind: "CSS", x: 81, y: 72, selector: ":root" },
  { id: "motion" as NodeId, label: "MotionGraph", kind: "TIMELINE", x: 49, y: 86, selector: "[data-motion]" },
  { id: "webgl" as NodeId, label: "SceneBudget", kind: "PERF", x: 49, y: 68, selector: "canvas" },
];
const edges: [NodeId, NodeId, string][] = [["app", "hero", "route"], ["app", "lab", "route"], ["app", "assistant", "state"], ["hero", "galaxy", "scroll"], ["hero", "motion", "timeline"], ["galaxy", "webgl", "frame"], ["lab", "webgl", "lazy"], ["tokens", "hero", "style"], ["tokens", "lab", "style"], ["assistant", "lab", "data"]];

const CoreApp = () => {
  const reducedMotion = Boolean(useReducedMotion());
  const [selected, setSelected] = useState<NodeId>("lab");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [paused, setPaused] = useState(false);
  const [scrub, setScrub] = useState(0.42);
  const [fps, setFps] = useState(60);
  const [events, setEvents] = useState<string[]>(["runtime:core mounted", "graph:8 nodes linked", "observer:frame budget active"]);
  const [pulse, setPulse] = useState(false);
  const frame = useRef(0); const sampleStart = useRef(0); const raf = useRef(0); const lastEvent = useRef(0);
  const { playSound } = useLabRuntime();
  const active = nodes.find((node) => node.id === selected)!;

  useEffect(() => {
    sampleStart.current = performance.now();
    const tick = (time: number) => { frame.current += 1; if (time - sampleStart.current >= 700) { setFps(Math.round(frame.current * 1000 / (time - sampleStart.current))); frame.current = 0; sampleStart.current = time; } raf.current = requestAnimationFrame(tick); };
    raf.current = requestAnimationFrame(tick);
    const observe = (event: Event) => { const now = performance.now(); if (now - lastEvent.current < 280) return; lastEvent.current = now; setEvents((current) => [`${event.type}:${(event.target as HTMLElement)?.tagName?.toLowerCase() ?? "window"}`, ...current].slice(0, 8)); };
    window.addEventListener("pointerdown", observe); window.addEventListener("scroll", observe, { passive: true });
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("pointerdown", observe); window.removeEventListener("scroll", observe); dispatchCoreCommand({ command: "restore" }); };
  }, []);

  const metrics = { components: document.querySelectorAll("[class]").length, canvases: document.querySelectorAll("canvas").length, animations: document.getAnimations().length, nodes: document.querySelectorAll("*").length };
  const toggle = (command: CoreCommand) => { const next = !enabled[command]; setEnabled((current) => ({ ...current, [command]: next })); dispatchCoreCommand({ command, enabled: next }); setEvents((current) => [`command:${command} ${next ? "on" : "off"}`, ...current].slice(0, 8)); playSound("core"); };
  const highlight = () => {
    if (active.selector === ".lab-os-page" || active.selector === "body" || active.selector === ":root") dispatchCoreCommand({ command: "highlight", selector: active.selector });
    else { try { sessionStorage.setItem("parth-core-highlight-selector", active.selector); } catch { /* optional */ } window.location.href = "/"; }
  };
  const sourcePulse = () => { setPulse(true); dispatchCoreCommand({ command: "source-pulse" }); playSound("core"); window.setTimeout(() => setPulse(false), 4200); };

  return (
    <motion.div className="core-app" initial={reducedMotion ? false : { opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }}>
      <header className="core-app__header"><div><Waves size={16} /><b>CORE / LIVE ARCHITECTURE</b><span>INSTRUMENTING THIS RUNTIME</span></div><div><i className={fps >= 54 ? "is-good" : ""} />{fps} FPS</div><button type="button" className={pulse ? "is-live" : ""} onClick={sourcePulse}><Activity size={15} /> SOURCE PULSE</button></header>
      <div className="core-app__body">
        <aside className="core-app__routes"><span>ROUTE ARCHITECTURE</span><div><Route size={14} /><b>/</b><small>PORTFOLIO</small></div><div className="is-current"><Route size={14} /><b>/lab</b><small>ACTIVE</small></div><div><Route size={14} /><b>/work/[slug]</b><small>DYNAMIC</small></div><span>RUNTIME MODULES</span>{nodes.map((node) => <button key={node.id} type="button" className={selected === node.id ? "is-active" : ""} onClick={() => setSelected(node.id)}><i />{node.label}<small>{node.kind}</small></button>)}</aside>
        <main className="core-app__graph">
          <div className="core-app__graph-label"><span>COMPONENT + DATA GRAPH</span><strong>{active.label}</strong></div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{edges.map(([from, to, label]) => { const a = nodes.find((node) => node.id === from)!; const b = nodes.find((node) => node.id === to)!; const activeEdge = from === selected || to === selected; return <g key={`${from}-${to}`} className={activeEdge ? "is-active" : ""}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} /><text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2}>{label}</text></g>; })}</svg>
          {nodes.map((node) => <button key={node.id} type="button" className={`${selected === node.id ? "is-selected" : ""} is-${node.kind.toLowerCase()}`} style={{ left: `${node.x}%`, top: `${node.y}%` }} onClick={() => setSelected(node.id)}><i>{node.kind === "WEBGL" ? <Braces /> : node.kind === "ROOT" ? <Box /> : <Component />}</i><span>{node.label}<small>{node.kind}</small></span></button>)}
          <div className="core-app__inspector"><span>SELECTED / {active.kind}</span><strong>{active.label}</strong><code>{active.selector}</code><button type="button" onClick={highlight}><ScanSearch size={13} /> HIGHLIGHT IN REAL PAGE</button></div>
        </main>
        <aside className="core-app__telemetry"><span>LIVE METRICS</span>{[["DOM NODES", metrics.nodes], ["COMPONENTS", metrics.components], ["CANVASES", metrics.canvases], ["ANIMATIONS", metrics.animations]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}<span>EVENT STREAM</span><section>{events.map((event, index) => <p key={`${event}-${index}`}><i />{event}</p>)}</section></aside>
      </div>
      <section className="core-app__timeline"><button type="button" onClick={() => { const next = !paused; setPaused(next); dispatchCoreCommand({ command: "pause", enabled: next }); }}>{paused ? <Play size={14} /> : <Pause size={14} />} {paused ? "RESUME" : "PAUSE"} GLOBAL MOTION</button><span>ANIMATION TIME</span><input type="range" min="0" max="1" step="0.01" value={scrub} onChange={(event) => { const value = Number(event.target.value); setScrub(value); dispatchCoreCommand({ command: "scrub", value }); }} /><output>{Math.round(scrub * 100)}%</output></section>
      <footer className="core-app__controls"><span>RUNTIME LENSES</span><button type="button" className={enabled.wireframe ? "is-active" : ""} onClick={() => toggle("wireframe")}><Braces size={14} /> WIREFRAME</button><button type="button" className={enabled.grid ? "is-active" : ""} onClick={() => toggle("grid")}><Grid3X3 size={14} /> SPACING GRID</button><button type="button" className={enabled.a11y ? "is-active" : ""} onClick={() => toggle("a11y")}><Accessibility size={14} /> A11Y SIM</button><button type="button" className={enabled.metrics ? "is-active" : ""} onClick={() => toggle("metrics")}><Gauge size={14} /> PERF OVERLAY</button><button type="button" onClick={() => dispatchCoreCommand({ command: "overload" })}><Activity size={14} /> SYSTEM OVERLOAD</button><button type="button" onClick={() => { setEnabled({}); setPaused(false); dispatchCoreCommand({ command: "restore" }); }}><RotateCcw size={14} /> RESTORE</button></footer>
    </motion.div>
  );
};

export default CoreApp;
