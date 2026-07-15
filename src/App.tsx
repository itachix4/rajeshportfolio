"use client";

import { MotionConfig } from "motion/react";
import { BuildModeProvider } from "./components/BuildModeProvider";
import LabPage from "./components/Lab/LabPage";
import PortfolioAssistant from "./components/Experience/PortfolioAssistant";
import CoreRuntimeBridge from "./components/CoreRuntimeBridge";
import SpatialPortfolio from "./components/Spatial/SpatialPortfolio";

const PortfolioPage = () => (
  <BuildModeProvider>
    <SpatialPortfolio />
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
