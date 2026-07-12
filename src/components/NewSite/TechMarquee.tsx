import { lazy, Suspense, useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, CircleDot } from "lucide-react";
import { BuildMode, useBuildMode } from "../buildMode";
import { WORKBENCH_MODES } from "./data";
import { Reveal } from "./Reveal";
import ClientOnly from "../ClientOnly";
import useAdaptiveWebGL from "../useAdaptiveWebGL";
import RenderBoundary from "../RenderBoundary";

const SkillConstellationScene = lazy(() => import("./SkillConstellationScene"));

const MODE_ORDER: BuildMode[] = ["designer", "engineer", "founder"];

const SkillWorkbench = () => {
  const { mode: modeId, setMode: setModeId } = useBuildMode();
  const [skillIndex, setSkillIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const allowWebGL = useAdaptiveWebGL();
  const detailId = useId();
  const orderedModes = MODE_ORDER.map(
    (id) => WORKBENCH_MODES.find((mode) => mode.id === id) ?? WORKBENCH_MODES[0]
  );
  const activeMode =
    WORKBENCH_MODES.find((mode) => mode.id === modeId) ?? WORKBENCH_MODES[0];
  const activeSkill = activeMode.skills[skillIndex] ?? activeMode.skills[0];

  const constellationNodes = useMemo(
    () =>
      activeMode.skills.flatMap((skill, index) =>
        skill.tools.slice(0, 2).map((tool) => ({
          tool,
          skillIndex: index,
          outcome: skill.name,
        }))
      ),
    [activeMode]
  );

  useEffect(() => {
    setSkillIndex(0);
  }, [modeId]);

  const selectMode = (nextMode: BuildMode) => {
    setModeId(nextMode);
    setSkillIndex(0);
  };

  return (
    <section className="section section--workbench" aria-labelledby="workbench-title">
      <div className="portfolio-container">
        <Reveal className="workbench-intro">
          <span>05 / Interactive skill map</span>
          <h2 id="workbench-title">Choose a lens. See the craft.</h2>
          <p>
            Switch perspectives, trace the constellation and see how each tool
            connects to a real outcome.
          </p>
        </Reveal>

        <Reveal className="workbench-shell">
          <header className="workbench-bar">
            <div className="workbench-bar__identity">
              <span>PP</span>
              <div>
                <strong>Live build mode</strong>
                <small>One portfolio · three perspectives</small>
              </div>
            </div>
            <div className="workbench-bar__status">
              <i aria-hidden="true" />
              SYNCED SITE-WIDE
            </div>
          </header>

          <div className="workbench-mode-row">
            <p>Choose the lens</p>
            <div role="group" aria-label="Choose a skill lens">
              {orderedModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={modeId === mode.id ? "is-active" : undefined}
                  aria-pressed={modeId === mode.id}
                  onClick={() => selectMode(mode.id)}
                >
                  <span>{mode.index}</span>
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="constellation-stage">
            <div className="constellation-visual">
              <ClientOnly
                fallback={
                  <div className="constellation-fallback" aria-hidden="true">
                    <span />
                  </div>
                }
              >
                {allowWebGL && !reduceMotion ? (
                  <RenderBoundary
                    fallback={
                      <div className="constellation-fallback" aria-hidden="true">
                        <span />
                      </div>
                    }
                  >
                    <Suspense fallback={null}>
                      <SkillConstellationScene
                        mode={modeId}
                        activeSkillIndex={skillIndex}
                        reducedMotion={false}
                        onSelectSkill={setSkillIndex}
                      />
                    </Suspense>
                  </RenderBoundary>
                ) : (
                  <div className="constellation-fallback" aria-hidden="true">
                    <span />
                  </div>
                )}
              </ClientOnly>
              <div className="constellation-core-label" aria-hidden="true">
                <span>OUTCOME</span>
                <strong>{activeMode.label}</strong>
              </div>
            </div>

            <div className="constellation-map">
              <div className="constellation-map__heading">
                <span>Tools → capabilities</span>
                <p>Tap a node or tool to inspect the craft behind it.</p>
              </div>
              <div className="constellation-node-list">
                {constellationNodes.map((node, index) => (
                  <button
                    key={`${node.tool}-${index}`}
                    type="button"
                    className={skillIndex === node.skillIndex ? "is-active" : undefined}
                    aria-pressed={skillIndex === node.skillIndex}
                    onClick={() => setSkillIndex(node.skillIndex)}
                  >
                    <span>{node.tool}</span>
                    <small>{node.outcome}</small>
                  </button>
                ))}
              </div>
              <div className="constellation-result" aria-live="polite">
                <span>Current outcome</span>
                <strong>{activeSkill.outcome}</strong>
              </div>
            </div>
          </div>

          <div className="workbench-body">
            <aside className="workbench-skills" aria-label={`${activeMode.label} capabilities`}>
              <div className="workbench-skills__heading">
                <span>{activeMode.prompt}</span>
                <p>{activeMode.description}</p>
              </div>
              <div className="workbench-skill-list">
                {activeMode.skills.map((skill, index) => (
                  <button
                    key={skill.name}
                    type="button"
                    className={skillIndex === index ? "is-active" : undefined}
                    aria-pressed={skillIndex === index}
                    aria-controls={detailId}
                    onClick={() => setSkillIndex(index)}
                  >
                    <span>0{index + 1}</span>
                    <strong>{skill.name}</strong>
                    <ArrowDownRight size={18} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </aside>

            <div id={detailId} className="workbench-detail" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={`${activeMode.id}-${activeSkill.name}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="workbench-detail__eyebrow">
                    <CircleDot size={14} aria-hidden="true" />
                    SELECTED CAPABILITY
                  </div>
                  <h3>{activeSkill.name}</h3>
                  <p className="workbench-detail__copy">{activeSkill.detail}</p>

                  <div className="workbench-outcome">
                    <span>What it changes</span>
                    <p>{activeSkill.outcome}</p>
                  </div>

                  <div className="workbench-tools">
                    <span>Working tools</span>
                    <ul>
                      {activeSkill.tools.map((tool) => (
                        <li key={tool}>{tool}</li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>

          <footer className="workbench-footer">
            <span>{activeMode.label} mode</span>
            <p>{activeMode.title}</p>
            <div className="workbench-signal" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => (
                <i key={index} style={{ height: `${25 + ((index * 17) % 70)}%` }} />
              ))}
            </div>
          </footer>
        </Reveal>
      </div>
    </section>
  );
};

export default SkillWorkbench;
