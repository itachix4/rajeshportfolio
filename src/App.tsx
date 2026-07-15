"use client";

import { MotionConfig } from "motion/react";
import { BuildModeProvider } from "./components/BuildModeProvider";
import HeroNavbar from "./components/NewHero/HeroNavbar";
import MarqueeBand from "./components/NewSite/MarqueeBand";
import AboutSection from "./components/NewSite/AboutSection";
import ServicesSection from "./components/NewSite/ServicesSection";
import CareerSection from "./components/NewSite/CareerSection";
import TechMarquee from "./components/NewSite/TechMarquee";
import ContactFooter from "./components/NewSite/ContactFooter";
import MobileProjectCTA from "./components/NewSite/MobileProjectCTA";
import LabPage from "./components/Lab/LabPage";
import CinematicHero from "./components/Experience/CinematicHero";
import ProjectGalaxy from "./components/Experience/ProjectGalaxy";
import PortfolioAssistant from "./components/Experience/PortfolioAssistant";
import CoreRuntimeBridge from "./components/CoreRuntimeBridge";

const PortfolioPage = () => (
  <BuildModeProvider>
    <a className="skip-link" href="#main-content">
      Skip to content
    </a>
    <HeroNavbar />
    <main id="main-content">
      <CinematicHero />
      <ProjectGalaxy />
      <MarqueeBand />
      <AboutSection />
      <ServicesSection />
      <CareerSection />
      <TechMarquee />
    </main>
    <ContactFooter />
    <MobileProjectCTA />
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
