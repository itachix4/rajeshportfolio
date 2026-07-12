import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PhoneFrame } from "./LabOS";
import type { LabApp } from "./labData";

const LabPage = () => {
  const [activeApp, setActiveApp] = useState<LabApp | null>(null);

  return (
    <div className="lab-os-page" data-active-app={activeApp?.preview ?? "home"}>
      <a className="skip-link" href="#lab-os-device">Skip to PARTH LAB OS</a>
      <motion.div
        className="lab-os-ambient"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <header className="lab-os-nav">
        <a href="/" aria-label="Return to Parth Parwani portfolio"><span>P.</span><strong>Parth Lab</strong></a>
        <div><i aria-hidden="true" /><span>OS BUILD 1.0</span></div>
        <a href="/" className="lab-os-nav__back"><ArrowLeft size={15} /> Portfolio</a>
      </header>

      <main className="lab-os-stage">
        <div className="lab-os-background-copy">
          <span>EXPERIMENTAL SYSTEM / 08 APPS</span>
          <h1>An operating system<br />for unfinished ideas.</h1>
          <p>Open an app. Inspect the system. Break the expected path.</p>
        </div>

        <div id="lab-os-device" className="lab-os-device-column">
          <PhoneFrame onActiveChange={setActiveApp} />
        </div>

        <aside className="lab-os-context" aria-live="polite">
          <span>{activeApp ? activeApp.number : "SYSTEM / READY"}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeApp?.id ?? "home"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <strong>{activeApp?.title ?? "PARTH LAB OS"}</strong>
              <p>{activeApp?.description ?? "A custom mobile interface for experiments, prototypes and technical research."}</p>
            </motion.div>
          </AnimatePresence>
          <a href="https://github.com/itachix4/rajeshportfolio" target="_blank" rel="noreferrer">
            Inspect source <ArrowUpRight size={14} />
          </a>
        </aside>
      </main>
    </div>
  );
};

export default LabPage;
