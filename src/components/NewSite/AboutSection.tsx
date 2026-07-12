import { lazy, Suspense } from "react";
import { ArrowUpRight, MousePointer2 } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useBuildMode } from "../buildMode";
import { PROFILE, PRINCIPLES } from "./data";
import { Reveal, SectionHeading } from "./Reveal";
import ClientOnly from "../ClientOnly";

const DigitalTwinScene = lazy(() => import("./DigitalTwinScene"));

const AboutSection = () => {
  const { mode } = useBuildMode();
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <section id="about" className="section section--about">
    <div className="portfolio-container">
      <SectionHeading
        index="02"
        eyebrow="About me"
        title="Strategy, interface and engineering—one system."
        description="One person stays accountable from the first decision to the production build."
      />

      <div className="about-layout">
        <Reveal className="about-portrait">
          <div
            className="digital-twin-frame"
            role="img"
            aria-label="Interactive AI-rendered digital twin of Parth Parwani"
          >
            <img
              className="digital-twin-frame__fallback"
              src="/images/parth-digital-twin.jpg"
              srcSet="/images/parth-digital-twin-960.jpg 720w, /images/parth-digital-twin.jpg 1350w"
              sizes="(max-width: 900px) calc(100vw - 32px), 42vw"
              alt=""
              width="1350"
              height="1800"
              loading="lazy"
            />
            <ClientOnly>
              <Suspense fallback={null}>
                <DigitalTwinScene mode={mode} reducedMotion={reducedMotion} />
              </Suspense>
            </ClientOnly>
          </div>
          <div className="about-portrait__chrome" aria-hidden="true">
            <span>PARTH / 2026</span>
            <span>DIGITAL TWIN 02</span>
          </div>
          <div className="digital-twin-hint" aria-hidden="true">
            <MousePointer2 size={12} />
            <span>Move to shift perspective</span>
          </div>
          <div className="about-portrait__caption">
            <span>17</span>
            <p>Developer. Designer. Founder.</p>
          </div>
        </Reveal>

        <div className="about-story">
          <Reveal className="about-manifesto">
            <p>
              I&apos;m <strong>Parth Parwani</strong>. At 17, I&apos;m studying PCM while
              founding and building ForgeLane.
            </p>
            <p>
              I work across strategy, interface and engineering so fewer decisions
              get diluted between an idea and the product people finally use.
            </p>
            <a className="text-link" href="https://forgelane.vercel.app" target="_blank" rel="noreferrer">
              Discover ForgeLane
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </Reveal>

          <div className="about-facts">
            <Reveal className="fact-card fact-card--featured">
              <span>Founder</span>
              <strong>ForgeLane</strong>
              <p>Premium digital experiences for ambitious brands.</p>
            </Reveal>
            <Reveal delay={0.05} className="fact-card">
              <span>Right now</span>
              <strong>{PROFILE.education}</strong>
              <p>Studying PCM while building a production-focused studio.</p>
            </Reveal>
            <Reveal delay={0.1} className="fact-card">
              <span>Working across</span>
              <strong>Design × Code</strong>
              <p>One accountable system from positioning to production.</p>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="principles-grid">
        {PRINCIPLES.map((principle, index) => (
          <Reveal key={principle.title} delay={index * 0.05}>
            <article className="principle-card">
              <span>{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
    </section>
  );
};

export default AboutSection;
