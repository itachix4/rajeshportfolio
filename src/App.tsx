import { MotionConfig } from "motion/react";
import { BuildModeProvider } from "./components/BuildModeProvider";
import HeroNavbar from "./components/NewHero/HeroNavbar";
import HeroSection from "./components/NewHero/HeroSection";
import MarqueeBand from "./components/NewSite/MarqueeBand";
import WorkSection from "./components/NewSite/WorkSection";
import AboutSection from "./components/NewSite/AboutSection";
import ServicesSection from "./components/NewSite/ServicesSection";
import CareerSection from "./components/NewSite/CareerSection";
import TechMarquee from "./components/NewSite/TechMarquee";
import ContactFooter from "./components/NewSite/ContactFooter";
import MobileProjectCTA from "./components/NewSite/MobileProjectCTA";

const App = () => (
  <BuildModeProvider>
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <HeroNavbar />
      <main id="main-content">
        <HeroSection />
        <MarqueeBand />
        <WorkSection />
        <AboutSection />
        <ServicesSection />
        <CareerSection />
        <TechMarquee />
      </main>
      <ContactFooter />
      <MobileProjectCTA />
    </MotionConfig>
  </BuildModeProvider>
);

export default App;
