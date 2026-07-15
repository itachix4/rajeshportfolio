import { lazy, Suspense, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Braces, CircleDot, Eye, EyeOff, Save, SplitSquareVertical } from "lucide-react";
import { useLabRuntime, useLabStoredState } from "../../runtime/LabRuntime";
import type { ShaderPreset } from "./ShaderViewport";

const ShaderViewport = lazy(() => import("./ShaderViewport"));
type GeometryKind = "sphere" | "torus" | "crystal";

const presets: ShaderPreset[] = [
  { id: "Molten Metal", primary: "#210a02", secondary: "#ff6a00", noise: 0.82, fresnel: 0.34, speed: 0.86, distortion: 0.3 },
  { id: "Liquid Chrome", primary: "#141719", secondary: "#d9e2e5", noise: 0.3, fresnel: 0.92, speed: 0.5, distortion: 0.16 },
  { id: "Digital Ember", primary: "#090909", secondary: "#ff3d00", noise: 1, fresnel: 0.48, speed: 1.25, distortion: 0.46 },
  { id: "Holographic Glass", primary: "#0c1b20", secondary: "#80fff2", noise: 0.48, fresnel: 1, speed: 0.64, distortion: 0.1 },
  { id: "Reactive Grid", primary: "#111111", secondary: "#ff8a3d", noise: 0.15, fresnel: 0.7, speed: 1.5, distortion: 0.05 },
];

const graphNodes = [
  { id: "time", label: "TIME", x: 4, y: 8 }, { id: "noise", label: "NOISE", x: 31, y: 8 },
  { id: "mouse", label: "POINTER", x: 4, y: 54 }, { id: "distort", label: "DISTORT", x: 31, y: 54 },
  { id: "gradient", label: "GRADIENT", x: 59, y: 19 }, { id: "fresnel", label: "FRESNEL", x: 59, y: 65 },
  { id: "material", label: "MATERIAL", x: 84, y: 42 },
];

const ShaderForge = () => {
  const reducedMotion = Boolean(useReducedMotion());
  const [preset, setPreset] = useLabStoredState<ShaderPreset>("shader:preset", presets[0]);
  const [geometry, setGeometry] = useLabStoredState<GeometryKind>("shader:geometry", "sphere");
  const [wireframe, setWireframe] = useState(false);
  const [compare, setCompare] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [saved, setSaved] = useLabStoredState<string[]>("shader:saved", []);
  const [mutedNodes, setMutedNodes] = useState<string[]>([]);
  const { playSound } = useLabRuntime();

  const effective = useMemo(() => ({
    ...preset,
    noise: mutedNodes.includes("noise") ? 0 : preset.noise,
    fresnel: mutedNodes.includes("fresnel") ? 0 : preset.fresnel,
    distortion: mutedNodes.includes("distort") ? 0 : preset.distortion,
    speed: reducedMotion || mutedNodes.includes("time") ? 0 : preset.speed,
  }), [mutedNodes, preset, reducedMotion]);
  const glsl = `vec3 forgeMaterial(vec3 position, vec3 normal) {\n  float field = noise(position * ${(1 + preset.noise * 2).toFixed(2)} + uTime * ${preset.speed.toFixed(2)});\n  float edge = pow(1.0 - dot(viewDir, normal), ${(1.5 + preset.fresnel * 3).toFixed(2)});\n  position += normal * field * ${preset.distortion.toFixed(2)};\n  return mix(${preset.primary}, ${preset.secondary}, field + edge);\n}`;

  const update = (key: keyof ShaderPreset, value: number | string) => { setPreset({ ...preset, [key]: value }); playSound("shader"); };
  const toggleNode = (id: string) => setMutedNodes((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <motion.div className="shader-forge" initial={reducedMotion ? false : { opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}>
      <header className="shader-forge__toolbar">
        <div><CircleDot size={15} /><span>SHADER FORGE / GPU MATERIAL INSTRUMENT</span></div>
        <nav>{(["sphere", "torus", "crystal"] as GeometryKind[]).map((item) => <button key={item} type="button" className={geometry === item ? "is-active" : ""} onClick={() => setGeometry(item)}>{item}</button>)}</nav>
        <div><button type="button" onClick={() => setWireframe((value) => !value)} aria-pressed={wireframe}>{wireframe ? <EyeOff size={14} /> : <Eye size={14} />} WIRES</button><button type="button" onClick={() => setCompare((value) => !value)} aria-pressed={compare}><SplitSquareVertical size={14} /> A/B</button><button type="button" onClick={() => setCodeOpen((value) => !value)} aria-expanded={codeOpen}><Braces size={14} /> GLSL</button></div>
      </header>

      <main className="shader-forge__bench">
        <aside className="shader-forge__presets"><span>CRAFTED ALLOYS</span>{presets.map((item, index) => <button key={item.id} type="button" className={preset.id === item.id ? "is-active" : ""} onClick={() => { setPreset(item); setMutedNodes([]); playSound("shader"); }}><i>{String(index + 1).padStart(2, "0")}</i><b>{item.id}</b><em style={{ background: item.secondary }} /></button>)}<button className="shader-forge__save" type="button" onClick={() => setSaved((current) => [...new Set([...current, `${preset.id} ${current.length + 1}`])])}><Save size={13} /> SAVE CURRENT</button><small>{saved.length} local preset{saved.length === 1 ? "" : "s"}</small></aside>

        <section className={`shader-forge__viewport${compare ? " is-comparing" : ""}`}>
          <div className="shader-forge__canvas"><Suspense fallback={<div className="shader-forge__fallback">COMPILING GPU PROGRAM…</div>}><ShaderViewport preset={effective} geometry={geometry} wireframe={wireframe} paused={reducedMotion} /></Suspense><span>LIVE / {preset.id}</span></div>
          {compare && <div className="shader-forge__before"><div /><span>BASE MATERIAL</span></div>}
        </section>

        <aside className="shader-forge__controls"><span>UNIFORMS</span>{(["noise", "fresnel", "speed", "distortion"] as const).map((key) => <label key={key}>{key.toUpperCase()} <output>{preset[key].toFixed(2)}</output><input type="range" min="0" max={key === "speed" ? "2" : "1"} step="0.01" value={preset[key]} onChange={(event) => update(key, Number(event.target.value))} /></label>)}<label>PRIMARY<input type="color" value={preset.primary} onChange={(event) => update("primary", event.target.value)} /></label><label>ENERGY<input type="color" value={preset.secondary} onChange={(event) => update("secondary", event.target.value)} /></label></aside>
      </main>

      <section className="shader-forge__graph" aria-label="Material node graph">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M16 19 C22 19 22 19 31 19 M16 65 C23 65 23 65 31 65 M43 19 C51 19 51 30 59 30 M43 65 C51 65 51 76 59 76 M71 30 C77 30 77 49 84 49 M71 76 C77 76 77 55 84 55" /></svg>
        {graphNodes.map((node) => <button key={node.id} type="button" className={mutedNodes.includes(node.id) ? "is-muted" : ""} style={{ left: `${node.x}%`, top: `${node.y}%` }} onClick={() => toggleNode(node.id)}><i />{node.label}<small>{node.id === "material" ? "OUTPUT" : mutedNodes.includes(node.id) ? "BYPASS" : "LIVE"}</small></button>)}
      </section>
      {codeOpen && <motion.pre className="shader-forge__code" initial={reducedMotion ? false : { height: 0 }} animate={{ height: "auto" }}><code>{glsl}</code></motion.pre>}
    </motion.div>
  );
};

export default ShaderForge;
