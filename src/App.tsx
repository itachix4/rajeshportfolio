import { MotionConfig } from "motion/react";
import HeroNavbar from "./components/NewHero/HeroNavbar";
import HeroSection from "./components/NewHero/HeroSection";
import MarqueeBand from "./components/NewSite/MarqueeBand";
import AboutSection from "./components/NewSite/AboutSection";
import ServicesSection from "./components/NewSite/ServicesSection";
import WorkSection from "./components/NewSite/WorkSection";
import CareerSection from "./components/NewSite/CareerSection";
import TechMarquee from "./components/NewSite/TechMarquee";
import ContactFooter from "./components/NewSite/ContactFooter";

const App = () => (
  <MotionConfig reducedMotion="user">
    <HeroNavbar />
    <HeroSection />
    <MarqueeBand />
    <AboutSection />
    <ServicesSection />
    <WorkSection />
    <CareerSection />
    <TechMarquee />
    <ContactFooter />
  </MotionConfig>
);

export default App;
