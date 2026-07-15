import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArchiveRestore, GitBranch, Pause, Play, Rewind, ScanLine } from "lucide-react";
import { useLabRuntime, useLabStoredState } from "../../runtime/LabRuntime";

const eras = [
  { date: "2022.08", title: "First Interface", tech: ["HTML", "CSS"], color: "#c8d2b2", status: "RETIRED", abandoned: "Visual rules were coupled to every page.", survived: "The instinct to make every state intentional.", version: "v0.2", glyph: "□" },
  { date: "2023.03", title: "Component Habit", tech: ["React", "Vite"], color: "#73b7ff", status: "FORKED", abandoned: "Too much abstraction before real product pressure.", survived: "Composition, typed props and reusable transitions.", version: "v1.4", glyph: "◇" },
  { date: "2024.01", title: "Forge Prototype", tech: ["Next.js", "Motion"], color: "#ff6a00", status: "ANCESTOR", abandoned: "The studio story outgrew the first visual shell.", survived: "ForgeLane's direct, high-contrast product voice.", version: "v2.1", glyph: "⌁" },
  { date: "2024.09", title: "Depth Studies", tech: ["Three.js", "GLSL"], color: "#b59cff", status: "MERGED", abandoned: "Scenes were impressive but did not always serve the story.", survived: "GPU restraint: depth only when it communicates.", version: "v3.6", glyph: "△" },
  { date: "2025.07", title: "Product Portfolio", tech: ["R3F", "TypeScript"], color: "#ff8f58", status: "SUPERSEDED", abandoned: "Project views still behaved like presentation cards.", survived: "Interactive proof instead of long claims.", version: "v5.0", glyph: "✦" },
  { date: "2026.07", title: "Lab Instruments", tech: ["Next 16", "WebGL"], color: "#f6f5f2", status: "CURRENT", abandoned: "Nothing yet. The runtime is still evolving.", survived: "Eight products, one operating system, zero repeated templates.", version: "v7.13", glyph: "◎" },
];

const ArchiveMachine = () => {
  const reducedMotion = Boolean(useReducedMotion());
  const [index, setIndex] = useLabStoredState("archive:index", eras.length - 1);
  const [compare, setCompare] = useState(52);
  const [playing, setPlaying] = useState(false);
  const [branch, setBranch] = useState(false);
  const [restored, setRestored] = useState(false);
  const autoplayTimer = useRef<number | null>(null);
  const { revealClue, clues, playSound } = useLabRuntime();
  const era = eras[index];
  const previous = eras[Math.max(0, index - 1)];
  const style = { "--archive-color": era.color, "--archive-index": index, "--archive-compare": `${compare}%` } as React.CSSProperties;
  const path = useMemo(() => eras.map((_, itemIndex) => `${itemIndex === 0 ? "M" : "L"}${8 + itemIndex * 17},${itemIndex % 2 ? 54 : 38}`).join(" "), []);

  useEffect(() => () => {
    if (autoplayTimer.current !== null) window.clearInterval(autoplayTimer.current);
  }, []);

  const travel = (next: number) => { setIndex(Math.max(0, Math.min(eras.length - 1, next))); setRestored(false); playSound("archive"); };
  const autoplay = () => {
    if (playing) {
      if (autoplayTimer.current !== null) window.clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
      setPlaying(false);
      return;
    }
    setPlaying(true); let next = index;
    autoplayTimer.current = window.setInterval(() => {
      next += 1;
      if (next >= eras.length) {
        if (autoplayTimer.current !== null) window.clearInterval(autoplayTimer.current);
        autoplayTimer.current = null;
        setPlaying(false);
        return;
      }
      travel(next);
    }, reducedMotion ? 120 : 850);
  };

  return (
    <motion.div className={`archive-machine era-${index}`} style={style} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="archive-machine__header"><div><Rewind size={16} /><b>ARCHIVE TIME MACHINE</b><span>LOCAL HISTORY / 2022—2026</span></div><div><button type="button" onClick={autoplay}>{playing ? <Pause size={14} /> : <Play size={14} />} {playing ? "PAUSE" : "AUTOPLAY"}</button><button type="button" onClick={() => setBranch((value) => !value)} aria-pressed={branch}><GitBranch size={14} /> ALTERNATE BRANCH</button></div><strong>{era.date}</strong></header>
      <section className="archive-machine__timeline" aria-label="Experiment history timeline"><svg viewBox="0 0 100 90" preserveAspectRatio="none"><path d={path} />{branch && <path className="is-branch" d="M42 54 C50 80 61 80 76 38" />}</svg>{eras.map((item, itemIndex) => <button key={item.date} type="button" className={itemIndex === index ? "is-active" : ""} onClick={() => travel(itemIndex)} style={{ left: `${8 + itemIndex * 17}%`, top: `${itemIndex % 2 ? 60 : 42}%` }}><i>{item.glyph}</i><span>{item.date}<b>{item.title}</b></span></button>)}</section>
      <main className="archive-machine__viewer">
        <section className="archive-machine__artifact"><header><span>SNAPSHOT / {era.version}</span><b>{era.status}</b></header><div className="archive-machine__comparison">
          <div className="archive-screen archive-screen--before"><small>{previous.date} / {previous.version}</small><h3>{previous.title}</h3><div><i /><i /><i /></div><p>Earlier interface DNA.</p></div>
          <div className="archive-screen archive-screen--after" style={{ clipPath: `inset(0 0 0 ${compare}%)` }}><small>{era.date} / {era.version}</small><h3>{era.title}</h3><div><i /><i /><i /></div><p>Recovered product snapshot.</p></div>
          <i className="archive-machine__divider" style={{ left: `${compare}%` }}><span>↔</span></i>
          <input aria-label="Compare current and previous version" type="range" min="4" max="96" value={compare} onChange={(event) => setCompare(Number(event.target.value))} />
        </div><footer><span>VERSION COMPARISON</span><span>DRAG THE DIVIDER</span></footer></section>
        <aside className="archive-machine__record"><span>RECORD {String(index + 1).padStart(2, "0")}</span><h2>{era.title}</h2><div className="archive-machine__tech">{era.tech.map((item) => <i key={item}>{item}</i>)}</div><dl><dt>WHY IT WAS LEFT</dt><dd>{era.abandoned}</dd><dt>WHAT SURVIVED</dt><dd>{era.survived}</dd></dl>
          {era.date === "2024.01" && <button type="button" className={`archive-machine__symbol${clues.archiveSymbol ? " is-found" : ""}`} onClick={() => revealClue("archiveSymbol")}><ScanLine size={16} /><span>{clues.archiveSymbol ? "ARCHIVE SYMBOL RECOVERED / ⌁" : "ANOMALOUS FRAME / INSPECT"}</span></button>}
          <button type="button" className="archive-machine__restore" onClick={() => { setRestored(true); playSound("archive"); }}><ArchiveRestore size={16} /> {restored ? "EXPERIMENT RESTORED TO SANDBOX" : "RESTORE EXPERIMENT"}</button>
        </aside>
      </main>
      <footer className="archive-machine__scrubber"><span>2022</span><input type="range" min="0" max={eras.length - 1} step="1" value={index} onChange={(event) => travel(Number(event.target.value))} /><span>NOW</span></footer>
    </motion.div>
  );
};

export default ArchiveMachine;
