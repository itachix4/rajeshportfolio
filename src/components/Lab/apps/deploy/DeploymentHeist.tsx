import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { AlertOctagon, Check, ChevronRight, Clock3, Gauge, Play, RotateCcw, ShieldAlert, TerminalSquare, X } from "lucide-react";
import { useLabRuntime } from "../../runtime/LabRuntime";

type Issue = { id: string; file: string; line: string; title: string; log: string; before: string; after: string; options: string[]; correct: number; gain: number };
const issues: Issue[] = [
  { id: "type", file: "app/api/build/route.ts", line: "18:12", title: "Failed type check", log: "Type 'string | undefined' is not assignable to type 'string'.", before: "const key: string = process.env.API_KEY", after: "const key = process.env.API_KEY ?? fail('API_KEY')", options: ["Cast with as any", "Add a guarded fallback", "Disable strict mode"], correct: 1, gain: 6 },
  { id: "env", file: ".env.production", line: "04:01", title: "Missing environment variable", log: "Required variable NEXT_PUBLIC_SITE_URL was not found.", before: "NEXT_PUBLIC_SITE_URL=", after: "NEXT_PUBLIC_SITE_URL=https://parthparwani.com", options: ["Set the production URL", "Make every variable optional", "Commit local .env"], correct: 0, gain: 5 },
  { id: "bundle", file: "components/Galaxy.tsx", line: "02:01", title: "Oversized client bundle", log: "Route / includes 742 kB of first-load JavaScript.", before: "import Galaxy from './Galaxy'", after: "const Galaxy = dynamic(() => import('./Galaxy'))", options: ["Increase warning limit", "Lazy-load the WebGL route", "Minify variable names"], correct: 1, gain: 11 },
  { id: "a11y", file: "components/Nav.tsx", line: "44:05", title: "Accessibility gate failed", log: "Interactive control does not have an accessible name.", before: "<button><MenuIcon /></button>", after: "<button aria-label='Open menu'><MenuIcon /></button>", options: ["Add aria-label", "Hide the button", "Use a div with onClick"], correct: 0, gain: 4 },
  { id: "route", file: "app/work/[slug]/page.tsx", line: "12:03", title: "Broken project route", log: "generateStaticParams returned an unknown slug.", before: "return projects.map(p => ({ slug: p.title }))", after: "return projects.map(p => ({ slug: p.slug }))", options: ["Turn off static output", "Use the canonical slug", "Catch every 404"], correct: 1, gain: 5 },
  { id: "image", file: "components/ProjectHero.tsx", line: "29:02", title: "Image optimization warning", log: "Largest image has no sizes hint and shifts layout.", before: "<Image src={hero} fill />", after: "<Image src={hero} fill sizes='100vw' priority />", options: ["Convert it to base64", "Add sizes and priority", "Remove dimensions"], correct: 1, gain: 8 },
];

type GameState = "briefing" | "active" | "success" | "failed";
const DeploymentHeist = () => {
  const reducedMotion = Boolean(useReducedMotion());
  const [game, setGame] = useState<GameState>("briefing");
  const [seconds, setSeconds] = useState(90);
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(66);
  const [selected, setSelected] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>(["$ vercel build --prod", "[trace] CORE checksum 03/01/04", "✕ production gate intercepted 6 faults"]);
  const startedAt = useRef(0);
  const { playSound } = useLabRuntime();
  const issue = issues[index];

  useEffect(() => {
    if (game !== "active") return;
    const timer = window.setInterval(() => setSeconds((value) => {
      if (value <= 1) { setGame("failed"); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [game]);

  const reset = () => { setGame("briefing"); setSeconds(90); setIndex(0); setSolved([]); setMistakes(0); setScore(66); setSelected(null); setLogs(["$ vercel build --prod", "[trace] CORE checksum 03/01/04", "✕ production gate intercepted 6 faults"]); };
  const start = () => { reset(); startedAt.current = performance.now(); setGame("active"); playSound("deploy"); };
  const choose = (choice: number) => {
    if (game !== "active" || selected !== null) return;
    setSelected(choice); playSound("deploy");
    const correct = choice === issue.correct;
    if (correct) { setSolved((current) => [...current, issue.id]); setScore((value) => Math.min(100, value + issue.gain)); setLogs((current) => [...current, `✓ ${issue.title.toLowerCase()} repaired`]); }
    else { setMistakes((value) => value + 1); setSeconds((value) => Math.max(0, value - 8)); setLogs((current) => [...current, `! rejected patch: ${issue.options[choice]}`]); }
    window.setTimeout(() => {
      setSelected(null);
      if (correct && index === issues.length - 1) { setGame("success"); setLogs((current) => [...current, "✓ all gates passed", "→ production deployment live"]); }
      else if (correct) setIndex((value) => value + 1);
    }, reducedMotion ? 80 : 650);
  };
  const elapsed = Math.round((90 - seconds));
  const result = useMemo(() => ({ time: elapsed, solved: solved.length, score: Math.max(0, score - mistakes * 2) }), [elapsed, mistakes, score, solved.length]);

  return (
    <motion.div className={`deploy-heist is-${game}`} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="deploy-heist__header"><div><ShieldAlert size={16} /><span>PRODUCTION INTERCEPT / INCIDENT 0713</span></div><div><i className={game === "active" ? "is-live" : ""} /><span>{game === "briefing" ? "AWAITING OPERATOR" : game.toUpperCase()}</span></div><strong className={seconds < 20 ? "is-critical" : ""}><Clock3 size={16} />{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</strong></header>
      {game === "briefing" ? <section className="deploy-heist__brief"><span>URGENT / PRODUCTION GATE</span><h2>The build is broken.<br /><em>Shipping window closes in 90 seconds.</em></h2><p>Trace six faults across types, environment, bundle size, accessibility, routing and media. Bad patches cost eight seconds.</p><button type="button" onClick={start}><Play size={16} /> ACCEPT INCIDENT</button><small>Interactive simulation. No real production system is modified.</small></section> : game === "success" || game === "failed" ? <section className="deploy-heist__result"><div className="deploy-heist__result-ring"><strong>{result.score}</strong><span>SHIP SCORE</span></div><div><span>{game === "success" ? "DEPLOYMENT CLEARED" : "WINDOW MISSED"}</span><h2>{game === "success" ? "Production is live." : "The gate held."}</h2><p>{result.solved}/6 issues solved · {result.time}s elapsed · {mistakes} rejected patch{mistakes === 1 ? "" : "es"}</p><button type="button" onClick={start}><RotateCcw size={15} /> RUN ANOTHER INCIDENT</button></div></section> : <div className="deploy-heist__control">
        <aside className="deploy-heist__pipeline"><span>DEPLOY PIPELINE</span>{issues.map((item, itemIndex) => <div key={item.id} className={solved.includes(item.id) ? "is-solved" : itemIndex === index ? "is-current" : ""}><i>{solved.includes(item.id) ? <Check size={11} /> : itemIndex + 1}</i><span>{item.title}<small>{solved.includes(item.id) ? "REPAIRED" : itemIndex === index ? "BLOCKING" : "QUEUED"}</small></span></div>)}<footer><Gauge size={14} /> PERFORMANCE <strong>{score}</strong></footer></aside>
        <main className="deploy-heist__workbench"><header><AlertOctagon size={15} /><div><span>{issue.file}:{issue.line}</span><strong>{issue.title}</strong></div><b>BLOCKER</b></header><pre className="deploy-heist__diff"><code><span>− {issue.before}</span><i>+ {issue.after}</i></code></pre><p>{issue.log}</p><div className="deploy-heist__choices"><span>SELECT THE PRODUCTION-SAFE PATCH</span>{issue.options.map((option, optionIndex) => <button key={option} type="button" className={selected === optionIndex ? optionIndex === issue.correct ? "is-correct" : "is-wrong" : ""} onClick={() => choose(optionIndex)} disabled={selected !== null}><i>{String.fromCharCode(65 + optionIndex)}</i><span>{option}</span>{selected === optionIndex ? optionIndex === issue.correct ? <Check size={15} /> : <X size={15} /> : <ChevronRight size={15} />}</button>)}</div></main>
        <aside className="deploy-heist__logs"><header><TerminalSquare size={14} /> BUILD LOG</header><div>{logs.map((line, lineIndex) => <p key={`${line}-${lineIndex}`} className={line.includes("CORE") ? "is-trace" : line.startsWith("✓") ? "is-pass" : line.startsWith("!") || line.startsWith("✕") ? "is-error" : ""}>{line}</p>)}<i>▌</i></div><footer><span>TESTS {solved.length}/6</span><span>FAULTS {mistakes}</span></footer></aside>
      </div>}
    </motion.div>
  );
};

export default DeploymentHeist;
