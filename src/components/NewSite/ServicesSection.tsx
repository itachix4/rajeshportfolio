import { Code2, Compass, PenTool } from "lucide-react";
import { BuildMode, useBuildMode } from "../buildMode";
import { CAPABILITIES } from "./data";
import { Reveal, SectionHeading } from "./Reveal";

const ICONS = {
  compass: Compass,
  pen: PenTool,
  code: Code2,
};

const MODE_CAPABILITIES: Record<
  BuildMode,
  { order: number[]; title: string; description: string }
> = {
  designer: {
    order: [1, 0, 2],
    title: "Make it clear. Make it felt.",
    description:
      "Identity, interface and motion shaped together into one distinctive visual language.",
  },
  engineer: {
    order: [2, 1, 0],
    title: "Complex systems. Effortless use.",
    description:
      "Architecture, interaction and performance engineered as one production-ready system.",
  },
  founder: {
    order: [0, 2, 1],
    title: "Strategy to shipping. One standard.",
    description:
      "Positioning, product and execution aligned around the result the business actually needs.",
  },
};

const ServicesSection = () => {
  const { mode } = useBuildMode();
  const modeContent = MODE_CAPABILITIES[mode];
  const capabilities = modeContent.order.map((index) => CAPABILITIES[index]);

  return (
    <section id="capabilities" className="section section--capabilities">
      <div className="portfolio-container">
        <SectionHeading
          index="03"
          eyebrow={`${mode} capabilities`}
          title={modeContent.title}
          description={modeContent.description}
          inverted
        />

        <div className="capabilities-grid">
          {capabilities.map((capability, index) => {
            const Icon = ICONS[capability.icon as keyof typeof ICONS];
            return (
              <Reveal key={`${mode}-${capability.title}`} delay={index * 0.05}>
                <article className="capability-card">
                  <div className="capability-card__top">
                    <span>0{index + 1}</span>
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
};

export default ServicesSection;
