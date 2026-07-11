import { Code2, Compass, PenTool } from "lucide-react";
import { CAPABILITIES } from "./data";
import { Reveal, SectionHeading } from "./Reveal";

const ICONS = {
  compass: Compass,
  pen: PenTool,
  code: Code2,
};

const ServicesSection = () => (
  <section id="capabilities" className="section section--capabilities">
    <div className="portfolio-container">
      <SectionHeading
        index="03"
        eyebrow="Capabilities"
        title="From blurry thought to polished launch."
        description="One connected process across brand, product design and engineering—so the final experience feels coherent, not assembled."
        inverted
      />

      <div className="capabilities-grid">
        {CAPABILITIES.map((capability, index) => {
          const Icon = ICONS[capability.icon as keyof typeof ICONS];
          return (
            <Reveal key={capability.title} delay={index * 0.06}>
              <article className="capability-card">
                <div className="capability-card__top">
                  <span>{capability.number}</span>
                  <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                </div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
                <ul aria-label={`${capability.title} services`}>
                  {capability.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default ServicesSection;
