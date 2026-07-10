import { Reveal, SectionHeading, WordReveal } from "./Reveal";
import { ABOUT_CHIPS, ABOUT_STATEMENT } from "./data";

const AboutSection = () => (
  <section id="about" className="bg-[#0D120E]">
    <div className="max-w-7xl mx-auto px-6 py-24 md:py-36">
      <SectionHeading index="01" label="About" />
      <WordReveal
        text={ABOUT_STATEMENT}
        accents={["ideas", "branding", "business"]}
        className="font-display text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.12] text-[#F1EEE3] max-w-5xl"
      />
      <Reveal delay={0.25} className="mt-12 flex flex-wrap gap-3">
        {ABOUT_CHIPS.map((chip) => (
          <span
            key={chip}
            className="px-5 py-2.5 rounded-full border border-[#F1EEE3]/15 bg-[#141B15] text-[#F1EEE3] text-sm md:text-base font-medium"
          >
            {chip}
          </span>
        ))}
      </Reveal>
    </div>
  </section>
);

export default AboutSection;
