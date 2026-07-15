import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Box, ChevronRight, Code2, Command, FileCode2, Gauge, GitCommit, Grid2X2, Play, Save, Search, TerminalSquare, X } from "lucide-react";
import { useLabRuntime, useLabStoredState } from "../../runtime/LabRuntime";

type WindowKind = "files" | "terminal" | "preview" | "metrics" | "commits";
type WorkspaceTheme = "graphite" | "paper" | "ember";
const commands = ["open terminal", "inspect project", "launch build", "split workspace", "change theme", "run benchmark", "open lab core", "show recent commits", "unlock core"];

const files = [
  { name: "app/", type: "folder" }, { name: "lab/page.tsx", type: "react" }, { name: "core/runtime.ts", type: "ts" },
  { name: "styles/tokens.css", type: "css" }, { name: "shaders/ember.glsl", type: "glsl" }, { name: "package.json", type: "json" },
];

const Window = ({ kind, activeFile, build, onClose, onSend }: { kind: WindowKind; activeFile: string; build: number; onClose: () => void; onSend: (value: string) => void }) => {
  const title = { files: "PROJECT INDEX", terminal: "TASK TERMINAL", preview: "LIVE PREVIEW", metrics: "BENCHMARK", commits: "RECENT COMMITS" }[kind];
  return <motion.section className={`forge-window forge-window--${kind}`} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}><header><span><i />{title}</span><button type="button" onClick={onClose} aria-label={`Close ${title}`}><X size={12} /></button></header>
    {kind === "files" && <div className="forge-files"><small>PARTH-LAB / SRC</small>{files.map((file) => <button type="button" key={file.name} className={activeFile === file.name ? "is-active" : ""} onClick={() => onSend(`file:${file.name}`)}><FileCode2 size={13} /><span>{file.name}</span><em>{file.type}</em></button>)}</div>}
    {kind === "terminal" && <div className="forge-terminal"><p><b>forge</b> boot --workspace lab</p><p>✓ runtime graph hydrated</p>{activeFile && <p><b>inspect</b> {activeFile}<br /><span>→ sent from Project Index</span></p>}{build > 0 && <><p><b>pnpm</b> build --profile</p><p>✓ types · ✓ routes · ✓ static output</p><p className="is-success">deployed in {build}ms</p></>}<i>▌</i></div>}
    {kind === "preview" && <div className="forge-preview"><div><span>PARTH/</span><b>FORGE</b></div><h3>Systems<br />with intent.</h3><p>{activeFile || "Select a source file, then launch the build."}</p><button type="button">EXPLORE BUILD →</button><small>{build ? `BUILD ${build}ms / READY` : "WAITING FOR BUILD"}</small></div>}
    {kind === "metrics" && <div className="forge-metrics"><strong>98</strong><span>RUNTIME SCORE</span>{[["FPS", "60"], ["LCP", "1.1s"], ["MEM", "38mb"], ["JS", "142kb"]].map(([label, value]) => <p key={label}>{label}<b>{value}</b></p>)}</div>}
    {kind === "commits" && <div className="forge-commits">{[["a84f7c", "instrument Lab runtimes"], ["91d2a0", "cap shader pixel ratio"], ["7c0ed1", "add reduced-motion graph"], ["3201aa", "stabilize route shell"]].map(([hash, message]) => <p key={hash}><GitCommit size={12} /><b>{hash}</b><span>{message}</span></p>)}</div>}
  </motion.section>;
};

const ForgeOS = () => {
  const reducedMotion = Boolean(useReducedMotion());
  const [openWindows, setOpenWindows] = useLabStoredState<WindowKind[]>("forge:windows", ["files", "terminal", "preview"]);
  const [theme, setTheme] = useLabStoredState<WorkspaceTheme>("forge:theme", "graphite");
  const [activeFile, setActiveFile] = useLabStoredState("forge:file", "lab/page.tsx");
  const [build, setBuild] = useLabStoredState("forge:build", 0);
  const [history, setHistory] = useLabStoredState<string[]>("forge:history", []);
  const [split, setSplit] = useLabStoredState("forge:split", 58);
  const [query, setQuery] = useState("");
  const [palette, setPalette] = useState(true);
  const [notice, setNotice] = useState("READY FOR COMMAND");
  const [awaitingSequence, setAwaitingSequence] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { clues, revealClue, unlockCore, playSound } = useLabRuntime();

  const visibleCommands = useMemo(() => commands.filter((command) => command.includes(query.toLowerCase())).slice(0, 6), [query]);
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setPalette(true); window.setTimeout(() => inputRef.current?.focus(), 20); }
    };
    window.addEventListener("keydown", keyboard); return () => window.removeEventListener("keydown", keyboard);
  }, []);

  const open = (kind: WindowKind) => setOpenWindows((current) => current.includes(kind) ? current : [...current, kind]);
  const run = (raw: string) => {
    const command = raw.trim().toLowerCase(); if (!command) return;
    setHistory((current) => [...current, command].slice(-12)); setQuery(""); playSound("command");
    if (command.startsWith("file:")) { const next = raw.slice(5); setActiveFile(next); open("terminal"); setNotice(`${next.toUpperCase()} SENT TO TERMINAL`); return; }
    if (awaitingSequence) {
      if (command.replace(/\D/g, "") === "314") { unlockCore(); setAwaitingSequence(false); setNotice("CORE MOUNTED TO HOME SCREEN"); }
      else setNotice("SEQUENCE REJECTED / THREE SIGNALS REQUIRED");
      return;
    }
    if (command === "open terminal") { open("terminal"); setNotice("TERMINAL FOCUSED"); }
    else if (command === "inspect project") { open("files"); setNotice("PROJECT GRAPH INDEXED"); }
    else if (command === "launch build") { open("terminal"); open("preview"); setBuild(684 + ((activeFile.length * 37 + history.length * 53) % 151)); setNotice("BUILD PASSED / PREVIEW UPDATED"); }
    else if (command === "split workspace") { setSplit((value) => value === 58 ? 42 : 58); setNotice("WORKSPACE RETILED"); }
    else if (command === "change theme") { setTheme((value) => value === "graphite" ? "paper" : value === "paper" ? "ember" : "graphite"); setNotice("THEME TOKENS RECOMPILED"); }
    else if (command === "run benchmark") { open("metrics"); setNotice("BENCHMARK / 98"); }
    else if (command === "show recent commits") { open("commits"); setNotice("4 COMMITS LOADED"); }
    else if (command === "open lab core") { setNotice(clues.coreUnlocked ? "CORE IS AVAILABLE ON HOME" : "CORE ROUTE IS SEALED"); }
    else if (command === "unlock core") {
      revealClue("forgeCommand");
      if (clues.motionSignature && clues.archiveSymbol && clues.capabilityPhrase) { setAwaitingSequence(true); setNotice("ENTER THE MOTION SEQUENCE"); setPalette(true); }
      else setNotice(`CORE NEEDS ${[!clues.motionSignature && "MOTION", !clues.archiveSymbol && "ARCHIVE", !clues.capabilityPhrase && "MAP"].filter(Boolean).join(" + ")}`);
    } else setNotice(`UNKNOWN COMMAND / TRY “${visibleCommands[0] ?? "OPEN TERMINAL"}”`);
    setPalette(false);
  };

  const saveSnapshot = () => { localStorage.setItem("parth-forge-snapshot", JSON.stringify({ openWindows, theme, activeFile, split })); setNotice("WORKSPACE SNAPSHOT SAVED"); };

  return (
    <motion.div className={`forge-os is-${theme}`} style={{ "--forge-split": `${split}%` } as React.CSSProperties} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="forge-os__bar"><div><Box size={15} /><b>FORGE OS</b><span>WORKSPACE / LAB</span></div><nav><button type="button" onClick={() => setPalette(true)}><Command size={13} /> COMMAND <kbd>⌘K</kbd></button><button type="button" onClick={() => run("split workspace")}><Grid2X2 size={13} /> TILE</button><button type="button" onClick={saveSnapshot}><Save size={13} /> SNAPSHOT</button></nav><div><i />{notice}</div></header>
      <div className="forge-os__desktop">
        <aside className="forge-os__rail"><button type="button" onClick={() => run("inspect project")} aria-label="Open project files"><FileCode2 /></button><button type="button" onClick={() => run("open terminal")} aria-label="Open terminal"><TerminalSquare /></button><button type="button" onClick={() => run("launch build")} aria-label="Launch build"><Play /></button><button type="button" onClick={() => run("run benchmark")} aria-label="Run benchmark"><Gauge /></button><button type="button" onClick={() => run("show recent commits")} aria-label="Show commits"><GitCommit /></button></aside>
        <main className="forge-os__workspace" style={{ gridTemplateColumns: openWindows.length > 1 ? `minmax(0, ${split}fr) minmax(0, ${100 - split}fr)` : "1fr" }}>
          {openWindows.map((kind) => <Window key={kind} kind={kind} activeFile={activeFile} build={build} onClose={() => setOpenWindows((current) => current.filter((item) => item !== kind))} onSend={run} />)}
          {openWindows.length === 0 && <button className="forge-os__empty" type="button" onClick={() => setPalette(true)}><Command />OPEN THE COMMAND BAR</button>}
        </main>
      </div>

      {palette && <motion.div className="forge-command" role="dialog" aria-label="Forge OS command palette" initial={reducedMotion ? false : { opacity: 0, y: -18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}><label><Search size={17} /><input ref={inputRef} autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") run(query || visibleCommands[0] || ""); if (event.key === "Escape") setPalette(false); }} placeholder={awaitingSequence ? "ENTER SEQUENCE" : "Type a command…"} /><kbd>ESC</kbd></label>{!awaitingSequence && <div>{visibleCommands.map((command, index) => <button type="button" key={command} onClick={() => run(command)}>{index === 0 ? <ChevronRight size={14} /> : <span />}{command}<kbd>↵</kbd></button>)}</div>}<footer><span><Code2 size={12} /> {history.at(-1) ?? "command history empty"}</span><button type="button" onClick={() => setPalette(false)}>CLOSE</button></footer></motion.div>}
    </motion.div>
  );
};

export default ForgeOS;
