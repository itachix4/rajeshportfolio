import { ArrowUpRight, GraduationCap, Layers, Rocket } from "lucide-react";
import { PROFILE, PRINCIPLES } from "./data";
import { Reveal, SectionHeading } from "./Reveal";

const AboutSection = () => (
  <section id="about" className="section section--about">
    <div className="portfolio-container">
      <SectionHeading
        index="02"
        eyebrow="About me"
        title="Young enough to question the default."
        description="Experienced enough to know that the details are the difference."
      />

      <div className="about-layout">
        <Reveal className="about-manifesto">
          <p>
            I&apos;m <strong>Parth Parwani</strong>, a 17-year-old full-stack
            developer, designer and entrepreneur building at the intersection of
            technology, identity and business.
          </p>
          <p>
            I move between code, identity and product thinking because the best
            digital work rarely fits inside one discipline.
          </p>
          <a className="text-link" href="https://forgelane.vercel.app" target="_blank" rel="noreferrer">
            Discover ForgeLane
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </Reveal>

        <div className="about-facts">
          <Reveal className="fact-card fact-card--featured">
            <Rocket size={22} aria-hidden="true" />
            <span>Founder</span>
            <strong>ForgeLane</strong>
            <p>Premium websites and digital experiences for ambitious brands.</p>
          </Reveal>
          <Reveal delay={0.05} className="fact-card">
            <GraduationCap size={22} aria-hidden="true" />
            <span>Right now</span>
            <strong>{PROFILE.education}</strong>
            <p>Learning in class. Building everywhere else.</p>
          </Reveal>
          <Reveal delay={0.1} className="fact-card">
            <Layers size={22} aria-hidden="true" />
            <span>Working across</span>
            <strong>Design × Code</strong>
            <p>One connected process, from the first idea to production.</p>
          </Reveal>
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
