import { ArrowUpRight } from "lucide-react";
import { PROFILE, PRINCIPLES } from "./data";
import { Reveal, SectionHeading } from "./Reveal";

const AboutSection = () => (
  <section id="about" className="section section--about">
    <div className="portfolio-container">
      <SectionHeading
        index="02"
        eyebrow="About me"
        title="One mind. Three disciplines."
        description="Design instinct, engineering discipline and a founder’s perspective—working as one system."
      />

      <div className="about-layout">
        <Reveal className="about-portrait">
          <img
            src="/images/parth-portrait.jpg"
            srcSet="/images/parth-portrait-960.jpg 720w, /images/parth-portrait.jpg 1350w"
            sizes="(max-width: 900px) calc(100vw - 32px), 42vw"
            alt="Parth Parwani wearing a black jacket in a mirror portrait"
            width="1350"
            height="1800"
            loading="lazy"
          />
          <div className="about-portrait__chrome" aria-hidden="true">
            <span>PARTH / 2026</span>
            <span>PORTRAIT 01</span>
          </div>
          <div className="about-portrait__caption">
            <span>17</span>
            <p>Developer. Designer. Founder.</p>
          </div>
        </Reveal>

        <div className="about-story">
          <Reveal className="about-manifesto">
            <p>
              I&apos;m <strong>Parth Parwani</strong>. I turn ambitious ideas into
              digital experiences that feel clear, distinctive and built to last.
            </p>
            <p>
              I move between identity, interface and engineering because the most
              valuable work happens where those disciplines meet.
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
              <p>Learning in class. Building everywhere else.</p>
            </Reveal>
            <Reveal delay={0.1} className="fact-card">
              <span>Working across</span>
              <strong>Design × Code</strong>
              <p>From the first idea to production.</p>
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

export default AboutSection;
