import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Accessibility, AlertTriangle, Check, Gauge, RotateCcw, TestTube2, X } from "lucide-react";
import { useLabRuntime, useLabStoredState } from "../../runtime/LabRuntime";

type SystemTokens = { scale: number; density: number; radius: number; contrast: number; hierarchy: number; motion: number; personality: number; accessible: boolean };
const defaults: SystemTokens = { scale: 1, density: 1, radius: 12, contrast: 1, hierarchy: 1, motion: 1, personality: 0.4, accessible: false };

const ProductSamples = () => (
  <div className="system-products">
    <article className="system-product is-bank"><header><b>NORTH BANK</b><span>•••</span></header><small>AVAILABLE BALANCE</small><strong>$24,860.40</strong><div><i /><i /><i /><i /><i /><i /><i /></div><footer><span>Income <b>+$8.2k</b></span><span>Spend <b>−$3.4k</b></span></footer></article>
    <article className="system-product is-music"><header><span>NOW / 032</span><b>♫</b></header><div className="system-album"><i /></div><h3>Night<br />Assembly</h3><p>PARTH SIGNAL SYSTEM</p><footer>↶ <button type="button">▶</button> ↷</footer></article>
    <article className="system-product is-checkout"><small>ORDER / 02</small><h3>Finish the<br />good decision.</h3><div><span>Interface System</span><b>$180</b></div><div><span>Motion Pack</span><b>$80</b></div><footer><strong>$260</strong><button type="button">PAY SECURELY</button></footer></article>
    <article className="system-product is-message"><header><b>STUDIO TEAM</b><span>3 online</span></header><div><i>PP</i><p>New interaction build is ready.<small>10:42</small></p></div><div><i>FL</i><p>Motion feels exact now.<small>10:44</small></p></div><footer>Write a message… <b>↑</b></footer></article>
    <article className="system-product is-analytics"><header><b>VELOCITY</b><span>LIVE</span></header><strong>94.8<small>/100</small></strong><svg viewBox="0 0 100 45"><path d="M0 38 C12 36 16 20 28 25 S48 6 60 14 S78 35 100 4" /></svg><footer><span>LCP 1.2s</span><span>CLS 0.01</span></footer></article>
    <article className="system-product is-hero"><small>CREATIVE ENGINEER</small><h3>Built to be<br /><em>remembered.</em></h3><p>Engineering and design, composed as one sharp product.</p><button type="button">SEE THE WORK →</button></article>
  </div>
);

const SystemStressTest = () => {
  const reducedMotion = Boolean(useReducedMotion());
  const [tokens, setTokens] = useLabStoredState<SystemTokens>("systems:tokens", defaults);
  const [broken, setBroken] = useState(false);
  const [reportOpen, setReportOpen] = useState(true);
  const { playSound } = useLabRuntime();
  const tests = useMemo(() => [
    { label: "Contrast", value: tokens.contrast >= 0.72 || tokens.accessible, detail: `${(4.5 * tokens.contrast).toFixed(1)}:1` },
    { label: "Touch targets", value: tokens.density <= 1.45 || tokens.accessible, detail: `${Math.round(44 / tokens.density)}px` },
    { label: "Type scale", value: tokens.scale > 0.72 && tokens.scale < 1.7, detail: `${tokens.scale.toFixed(2)}×` },
    { label: "Spacing rhythm", value: tokens.density > 0.52 && tokens.density < 1.58, detail: `${Math.round(8 / tokens.density)}pt` },
    { label: "Breakpoints", value: tokens.hierarchy < 1.65, detail: tokens.hierarchy < 1.65 ? "4 stable" : "2 collide" },
    { label: "Overflow", value: tokens.scale * tokens.hierarchy < 1.68, detail: tokens.scale * tokens.hierarchy < 1.68 ? "0 found" : "6 found" },
  ], [tokens]);
  const passCount = tests.filter((test) => test.value).length;
  const style = { "--sys-scale": tokens.scale, "--sys-density": tokens.density, "--sys-radius": `${tokens.radius}px`, "--sys-contrast": tokens.accessible ? 1.15 : tokens.contrast, "--sys-hierarchy": tokens.hierarchy, "--sys-personality": tokens.personality, "--sys-motion": reducedMotion ? "0s" : `${0.35 / tokens.motion}s` } as React.CSSProperties;

  const update = <K extends keyof SystemTokens>(key: K, value: SystemTokens[K]) => { setTokens({ ...tokens, [key]: value }); setBroken(false); };
  const breakSystem = () => { setTokens({ scale: 1.82, density: 1.78, radius: 31, contrast: 0.48, hierarchy: 1.72, motion: 2, personality: 1, accessible: false }); setBroken(true); setReportOpen(true); playSound("system"); };

  return (
    <motion.div className={`system-stress${broken ? " is-broken" : ""}`} style={style} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="system-stress__header"><div><TestTube2 size={16} /><span>DESIGN SYSTEM STRESS RIG</span><b>6 PRODUCTS / 1 TOKEN GRAPH</b></div><div><button type="button" onClick={() => update("accessible", !tokens.accessible)} aria-pressed={tokens.accessible}><Accessibility size={15} /> A11Y</button><button type="button" onClick={breakSystem}><AlertTriangle size={15} /> BREAK THE SYSTEM</button><button type="button" onClick={() => { setTokens(defaults); setBroken(false); }}><RotateCcw size={14} /> RESET</button></div></header>
      <div className="system-stress__body">
        <aside className="system-stress__controls">
          <span>SYSTEM PARAMETERS</span>
          {([
            ["scale", "TYPE SCALE", 0.7, 1.85, 0.01], ["density", "DENSITY", 0.5, 1.8, 0.01], ["radius", "RADIUS", 0, 32, 1], ["contrast", "CONTRAST", 0.4, 1.2, 0.01], ["hierarchy", "HIERARCHY", 0.65, 1.75, 0.01], ["personality", "PERSONALITY", 0, 1, 0.01], ["motion", "MOTION SPEED", 0.4, 2, 0.01],
          ] as const).map(([key, label, min, max, step]) => <label key={key}><span>{label}<output>{typeof tokens[key] === "number" ? tokens[key].toFixed(key === "radius" ? 0 : 2) : ""}</output></span><input type="range" min={min} max={max} step={step} value={tokens[key] as number} onChange={(event) => update(key, Number(event.target.value))} /></label>)}
          <div className="system-stress__philosophy"><span>RADIUS PHILOSOPHY</span><button type="button" onClick={() => update("radius", 0)}>SHARP</button><button type="button" onClick={() => update("radius", 12)}>SOFT</button><button type="button" onClick={() => update("radius", 28)}>PLAYFUL</button></div>
        </aside>
        <main className="system-stress__viewport"><div className="system-stress__ruler"><span>1440</span><i /><span>768</span><i /><span>375</span></div><ProductSamples /></main>
        <aside className={`system-stress__report${reportOpen ? " is-open" : ""}`}><button type="button" onClick={() => setReportOpen((value) => !value)}><Gauge size={15} /><span>AUTOMATED AUDIT</span><strong>{passCount}/6</strong></button><div>{tests.map((test) => <article key={test.label} className={test.value ? "is-pass" : "is-fail"}>{test.value ? <Check size={13} /> : <X size={13} />}<span>{test.label}<small>{test.detail}</small></span></article>)}</div><footer>{passCount === 6 ? "SYSTEM HOLDS" : `${6 - passCount} FAILURE${6 - passCount === 1 ? "" : "S"} INDUCED`}<span>{passCount === 6 ? "Ready across six contexts." : "Tune the shared tokens to recover every product."}</span></footer></aside>
      </div>
    </motion.div>
  );
};

export default SystemStressTest;
