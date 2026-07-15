import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BriefcaseBusiness, Check, Network, Sparkles } from "lucide-react";
import { useLabRuntime, useLabStoredState } from "../../runtime/LabRuntime";

type SkillId = "frontend" | "motion" | "three" | "brand" | "ai" | "product" | "performance" | "accessibility";
type RoleId = "frontend developer" | "creative developer" | "product engineer" | "ui engineer";
type Skill = { id: SkillId; label: string; x: number; y: number; level: number; tools: string[]; proof: string[]; links: SkillId[] };

const skills: Skill[] = [
  { id: "frontend", label: "Frontend", x: 50, y: 18, level: 96, tools: ["React", "Next.js", "TypeScript"], proof: ["Modular portfolio runtime", "Forge OS command architecture"], links: ["motion", "product", "performance", "accessibility"] },
  { id: "motion", label: "Motion", x: 22, y: 33, level: 92, tools: ["Motion", "GSAP", "rAF"], proof: ["Motion recorder", "Scroll choreography", "Easing mathematics"], links: ["frontend", "three", "brand"] },
  { id: "three", label: "3D / GPU", x: 17, y: 68, level: 86, tools: ["R3F", "Three.js", "GLSL"], proof: ["Shader Forge", "GPU material studies"], links: ["motion", "performance"] },
  { id: "brand", label: "Branding", x: 42, y: 83, level: 88, tools: ["Identity", "Type", "Art direction"], proof: ["ForgeLane language", "Visual system direction"], links: ["motion", "product"] },
  { id: "ai", label: "AI Systems", x: 70, y: 78, level: 84, tools: ["Schemas", "Generation", "Orchestration"], proof: ["Interface fabrication engine", "Portfolio guide logic"], links: ["product", "frontend"] },
  { id: "product", label: "Product", x: 82, y: 50, level: 94, tools: ["UX", "Systems", "Prototyping"], proof: ["Eight Lab instruments", "Conversion-first portfolio"], links: ["frontend", "ai", "brand", "accessibility"] },
  { id: "performance", label: "Performance", x: 66, y: 35, level: 91, tools: ["Web Vitals", "Profiling", "Lazy loading"], proof: ["Adaptive WebGL", "Route-level splitting"], links: ["frontend", "three", "accessibility"] },
  { id: "accessibility", label: "Accessibility", x: 87, y: 20, level: 89, tools: ["WCAG", "Keyboard", "Reduced motion"], proof: ["Lab OS keyboard model", "Motion fallbacks"], links: ["frontend", "product", "performance"] },
];
const roles: Record<RoleId, SkillId[]> = {
  "frontend developer": ["frontend", "performance", "accessibility", "product"],
  "creative developer": ["motion", "three", "frontend", "brand"],
  "product engineer": ["product", "frontend", "ai", "performance"],
  "ui engineer": ["frontend", "motion", "brand", "accessibility"],
};

const SkillMap = () => {
  const reducedMotion = Boolean(useReducedMotion());
  const [selected, setSelected] = useLabStoredState<SkillId>("map:selected", "frontend");
  const [role, setRole] = useLabStoredState<RoleId>("map:role", "creative developer");
  const [roleMode, setRoleMode] = useState(false);
  const { revealClue, clues, playSound } = useLabRuntime();
  const active = skills.find((skill) => skill.id === selected) ?? skills[0];
  const highlighted = roleMode ? roles[role] : [selected, ...active.links];
  const connections = useMemo(() => {
    const seen = new Set<string>();
    return skills.flatMap((skill) => skill.links.map((target) => {
      const destination = skills.find((item) => item.id === target)!;
      const key = [skill.id, target].sort().join("-"); if (seen.has(key)) return null; seen.add(key);
      return { key, from: skill, to: destination };
    }).filter(Boolean) as { key: string; from: Skill; to: Skill }[]);
  }, []);

  const select = (id: SkillId) => { setSelected(id); setRoleMode(false); playSound("map"); if (id === "motion") revealClue("capabilityPhrase"); };
  const chooseRole = (next: RoleId) => { setRole(next); setRoleMode(true); setSelected(roles[next][0]); playSound("map"); if (next === "creative developer") revealClue("capabilityPhrase"); };

  return (
    <motion.div className="skill-map" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="skill-map__header"><div><Network size={16} /><span>CAPABILITY GRAPH / 24 LIVE EDGES</span></div><button type="button" onClick={() => setRoleMode((value) => !value)} aria-pressed={roleMode}><BriefcaseBusiness size={14} /> BUILD A ROLE</button><strong>{roleMode ? role.toUpperCase() : `${active.level}% SIGNAL`}</strong></header>
      <main className="skill-map__body">
        <section className="skill-map__field" aria-label="Interactive connected skill map">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{connections.map((connection) => { const activeEdge = highlighted.includes(connection.from.id) && highlighted.includes(connection.to.id); return <line key={connection.key} x1={connection.from.x} y1={connection.from.y} x2={connection.to.x} y2={connection.to.y} className={activeEdge ? "is-active" : ""} />; })}</svg>
          <div className="skill-map__radar" aria-hidden="true"><i /><i /><i /></div>
          {skills.map((skill, index) => <motion.button key={skill.id} type="button" className={`${selected === skill.id ? "is-selected" : ""}${highlighted.includes(skill.id) ? " is-related" : ""}`} style={{ left: `${skill.x}%`, top: `${skill.y}%`, "--skill-level": skill.level / 100 } as React.CSSProperties} onClick={() => select(skill.id)} initial={reducedMotion ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.035, type: "spring" }}><span>{String(index + 1).padStart(2, "0")}</span><b>{skill.label}</b><i /></motion.button>)}
        </section>
        <aside className="skill-map__evidence"><span>{roleMode ? "TAILORED ROLE SIGNAL" : "SELECTED CAPABILITY"}</span><h2>{roleMode ? role : active.label}</h2><p>{roleMode ? `A generated evidence map for a ${role}, using the strongest connected systems—not a generic skills list.` : `${active.label} is connected to ${active.links.length} disciplines and proven through working experiments.`}</p><div className="skill-map__meter"><i style={{ width: `${active.level}%` }} /><span>{active.level} / 100</span></div><section><span>TOOLS IN USE</span>{active.tools.map((tool) => <i key={tool}>{tool}</i>)}</section><section><span>PROOF, NOT CLAIMS</span>{active.proof.map((proof) => <p key={proof}><Check size={12} />{proof}</p>)}</section><section><span>CONNECTED SYSTEMS</span>{active.links.map((id) => <button type="button" key={id} onClick={() => select(id)}>{skills.find((skill) => skill.id === id)?.label} →</button>)}</section>{clues.capabilityPhrase && <div className="skill-map__phrase"><Sparkles size={14} /><span>CAPABILITY PHRASE</span><strong>BUILD THE PROOF</strong></div>}</aside>
      </main>
      <footer className={`skill-map__roles${roleMode ? " is-open" : ""}`}><span>ROLE LENS</span>{(Object.keys(roles) as RoleId[]).map((item) => <button key={item} type="button" className={role === item && roleMode ? "is-active" : ""} onClick={() => chooseRole(item)}>{item}{role === item && roleMode && <i>{roles[item].length} signals</i>}</button>)}</footer>
    </motion.div>
  );
};

export default SkillMap;
