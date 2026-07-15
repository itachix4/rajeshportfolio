import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Braces, Check, ChevronRight, Component, History, RefreshCw, Sparkles } from "lucide-react";
import { useLabRuntime, useLabStoredState } from "../../runtime/LabRuntime";

type BuildKind = "music" | "pricing" | "game";
type CodeView = "react" | "html" | "schema";
type Tokens = { accent: string; radius: number; density: number };

const stages = ["Planning", "Layout", "Components", "Styles", "Motion", "Final preview"];

const blueprints: Record<BuildKind, { label: string; prompt: string; tree: string[]; code: Record<CodeView, string> }> = {
  music: {
    label: "Brutalist player",
    prompt: "Create a brutalist music player",
    tree: ["PlayerShell", "TrackMarquee", "Waveform", "Transport", "QueueRail"],
    code: {
      react: `export function Player() {\n  return <PlayerShell density="tight">\n    <TrackMarquee title="SIGNAL / 04" />\n    <Waveform source={track.buffer} />\n    <Transport mode="brutalist" />\n  </PlayerShell>\n}`,
      html: `<main class="player" data-density="tight">\n  <header>SIGNAL / 04</header>\n  <canvas aria-label="Track waveform"></canvas>\n  <nav class="transport">...</nav>\n</main>`,
      schema: `{\n  "type": "music-player",\n  "layout": "asymmetric-stack",\n  "modules": ["marquee", "waveform", "transport"]\n}`,
    },
  },
  pricing: {
    label: "Luxury pricing",
    prompt: "Make a luxury pricing card",
    tree: ["OfferStage", "EditionMark", "PriceLockup", "BenefitIndex", "ReserveAction"],
    code: {
      react: `export function PrivateEdition() {\n  return <OfferStage material="paper">\n    <EditionMark>PRIVATE / 01</EditionMark>\n    <PriceLockup currency="USD" value={480} />\n    <ReserveAction>Request access</ReserveAction>\n  </OfferStage>\n}`,
      html: `<article class="private-edition">\n  <small>PRIVATE / 01</small>\n  <h2>One deliberate release.</h2>\n  <strong>$480</strong>\n  <button>Request access</button>\n</article>`,
      schema: `{\n  "type": "pricing-offer",\n  "tone": "editorial-luxury",\n  "hierarchy": ["edition", "promise", "price", "action"]\n}`,
    },
  },
  game: {
    label: "Button game",
    prompt: "Turn this button into a game interface",
    tree: ["MissionButton", "ChargeRing", "ComboCounter", "FeedbackBurst", "ScoreTape"],
    code: {
      react: `export function MissionButton() {\n  const [charge, setCharge] = useState(0)\n  return <button onPointerDown={beginCharge}>\n    <ChargeRing value={charge} />\n    HOLD TO LAUNCH\n  </button>\n}`,
      html: `<button class="mission" data-state="charging">\n  <svg class="charge-ring">...</svg>\n  <span>HOLD TO LAUNCH</span>\n  <output>COMBO ×3</output>\n</button>`,
      schema: `{\n  "type": "micro-game",\n  "input": "press-duration",\n  "feedback": ["charge", "combo", "score"]\n}`,
    },
  },
};

const inferBlueprint = (prompt: string): BuildKind => {
  const value = prompt.toLowerCase();
  if (value.includes("price") || value.includes("luxury")) return "pricing";
  if (value.includes("game") || value.includes("button")) return "game";
  return "music";
};

const Preview = ({ kind, tokens, revision }: { kind: BuildKind; tokens: Tokens; revision: number }) => {
  const style = { "--fabric-accent": tokens.accent, "--fabric-radius": `${tokens.radius}px`, "--fabric-density": tokens.density } as React.CSSProperties;
  if (kind === "pricing") return (
    <div className="fabric-preview fabric-preview--pricing" style={style}>
      <small>PRIVATE EDITION / 0{revision + 1}</small><span>FOR THE FEW</span>
      <h3>One deliberate<br />digital release.</h3><p>Strategy, interface, motion and engineering—composed as one system.</p>
      <div><strong>$480</strong><button type="button">REQUEST ACCESS <ChevronRight size={14} /></button></div>
    </div>
  );
  if (kind === "game") return (
    <div className="fabric-preview fabric-preview--game" style={style}>
      <header><span>MISSION 0{revision + 4}</span><strong>12,480</strong></header>
      <button type="button"><i /><b>HOLD<br />TO LAUNCH</b><em>+240</em></button>
      <footer>CHARGE 84% <span>COMBO ×3</span></footer>
    </div>
  );
  return (
    <div className="fabric-preview fabric-preview--music" style={style}>
      <header><span>PP–FM</span><b>04:18</b></header><h3>SIGNAL<br />WITHOUT<br />NOISE</h3>
      <div className="fabric-wave">{Array.from({ length: 34 }, (_, index) => <i key={index} style={{ height: `${18 + ((index * 17 + revision * 13) % 76)}%` }} />)}</div>
      <footer><button type="button">▶</button><span>NEON STATIC / 004</span><strong>02:41</strong></footer>
    </div>
  );
};

const GenerativeInterface = () => {
  const reducedMotion = Boolean(useReducedMotion());
  const [prompt, setPrompt] = useLabStoredState("fabric:prompt", blueprints.music.prompt);
  const [kind, setKind] = useLabStoredState<BuildKind>("fabric:kind", "music");
  const [tokens, setTokens] = useLabStoredState<Tokens>("fabric:tokens", { accent: "#ff6a00", radius: 2, density: 1 });
  const [history, setHistory] = useLabStoredState<BuildKind[]>("fabric:history", ["music"]);
  const [stage, setStage] = useState(stages.length);
  const [building, setBuilding] = useState(false);
  const [codeView, setCodeView] = useState<CodeView>("react");
  const [revision, setRevision] = useState(0);
  const { playSound } = useLabRuntime();

  useEffect(() => {
    if (!building) return;
    if (reducedMotion) { setStage(stages.length); setBuilding(false); return; }
    const timer = window.setInterval(() => {
      setStage((current) => {
        if (current >= stages.length - 1) {
          window.clearInterval(timer);
          setBuilding(false);
          return stages.length;
        }
        playSound("fabricate");
        return current + 1;
      });
    }, 420);
    return () => window.clearInterval(timer);
  }, [building, playSound, reducedMotion]);

  const generate = () => {
    const next = inferBlueprint(prompt);
    setKind(next); setHistory((current) => [...current.filter((item) => item !== next), next].slice(-4));
    setStage(0); setBuilding(true); setRevision(0); playSound("fabricate");
  };
  const blueprint = blueprints[kind];
  const progress = building ? Math.min(100, Math.round(((stage + 1) / stages.length) * 100)) : 100;
  const visibleTree = building ? blueprint.tree.slice(0, Math.max(1, Math.ceil((stage / stages.length) * blueprint.tree.length))) : blueprint.tree;
  const outputCode = useMemo(() => blueprint.code[codeView].replace("480", String(480 + revision * 20)), [blueprint, codeView, revision]);

  return (
    <motion.div className="fabric-machine" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
      <aside className="fabric-machine__brief">
        <div className="fabric-machine__mark"><Sparkles size={15} /><span>DETERMINISTIC<br />FABRICATION ENGINE</span></div>
        <label htmlFor="fabric-prompt">Describe an interface</label>
        <textarea id="fabric-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={4} />
        <button type="button" onClick={generate} disabled={building}><span>{building ? "FABRICATING" : "BUILD INTERFACE"}</span><ChevronRight size={17} /></button>
        <small>No fake AI endpoint. This prototype maps intent into tested component schemas.</small>
        <div className="fabric-machine__recipes">
          {Object.entries(blueprints).map(([id, recipe]) => <button key={id} type="button" onClick={() => setPrompt(recipe.prompt)}>{recipe.label}</button>)}
        </div>
        <div className="fabric-machine__history"><History size={14} /><span>HISTORY</span>{history.map((item) => <button key={item} type="button" onClick={() => { setKind(item); setPrompt(blueprints[item].prompt); }}>{blueprints[item].label}</button>)}</div>
      </aside>

      <main className="fabric-machine__chamber">
        <header><div><span>FABRICATION CHAMBER</span><strong>{building ? stages[Math.min(stage, stages.length - 1)].toUpperCase() : "OUTPUT STABLE"}</strong></div><b>{progress}%</b></header>
        <div className="fabric-machine__rail" aria-label={`Build progress ${progress}%`}><i style={{ width: `${progress}%` }} />{stages.map((item, index) => <span key={item} className={index <= stage || !building ? "is-complete" : ""}>{index <= stage || !building ? <Check size={11} /> : index + 1}<em>{item}</em></span>)}</div>
        <section className="fabric-machine__stage">
          <div className="fabric-machine__tree"><header><Component size={14} /> COMPONENT TREE</header>{visibleTree.map((node, index) => <motion.button key={`${node}-${revision}`} type="button" initial={reducedMotion ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ paddingLeft: `${12 + index * 7}px` }} onClick={() => setRevision((value) => value + 1)}><i />{node}<RefreshCw size={11} /></motion.button>)}</div>
          <div className={`fabric-machine__preview${building ? " is-building" : ""}`}><Preview kind={kind} tokens={tokens} revision={revision} /></div>
          <aside className="fabric-machine__tokens"><span>LIVE TOKENS</span><label>Accent<input type="color" value={tokens.accent} onChange={(event) => setTokens({ ...tokens, accent: event.target.value })} /></label><label>Radius <output>{tokens.radius}</output><input type="range" min="0" max="28" value={tokens.radius} onChange={(event) => setTokens({ ...tokens, radius: Number(event.target.value) })} /></label><label>Density <output>{tokens.density.toFixed(1)}</output><input type="range" min="0.7" max="1.4" step="0.1" value={tokens.density} onChange={(event) => setTokens({ ...tokens, density: Number(event.target.value) })} /></label></aside>
        </section>
        <section className="fabric-machine__code"><nav>{(["react", "html", "schema"] as CodeView[]).map((view) => <button key={view} type="button" className={codeView === view ? "is-active" : ""} onClick={() => setCodeView(view)}>{view === "schema" ? "PSEUDOCODE" : view.toUpperCase()}</button>)}<span><Braces size={13} /> GENERATED SOURCE</span></nav><pre><code>{outputCode}</code></pre></section>
      </main>
    </motion.div>
  );
};

export default GenerativeInterface;
