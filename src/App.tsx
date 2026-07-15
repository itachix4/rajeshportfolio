"use client";

import dynamic from "next/dynamic";
import { MotionConfig } from "motion/react";
import { BuildModeProvider } from "./components/BuildModeProvider";
import PortfolioAssistant from "./components/Experience/PortfolioAssistant";
import CoreRuntimeBridge from "./components/CoreRuntimeBridge";
import GridPortfolio from "./components/GridPortfolio/GridPortfolio";

const LabPage = dynamic(() => import("./components/Lab/LabPage"), {
  loading: () => <main className="lab-route-loading" aria-label="Loading PARTH LAB OS"><span>PARTH LAB OS</span></main>,
});

const PortfolioPage = () => (
  <BuildModeProvider>
    <GridPortfolio />
    <PortfolioAssistant />
  </BuildModeProvider>
);

const App = ({ pathname = "/" }: { pathname?: string }) => (
  <MotionConfig reducedMotion="user">
    {pathname.startsWith("/lab") ? <LabPage /> : <PortfolioPage />}
    <CoreRuntimeBridge />
  </MotionConfig>
);

export default App;
