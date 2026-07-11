import { JOURNEY } from "./data";
import { Reveal, SectionHeading } from "./Reveal";

const CareerSection = () => (
  <section id="journey" className="section section--journey">
    <div className="portfolio-container">
      <SectionHeading
        index="04"
        eyebrow="Journey"
        title="Early chapter. Serious intent."
        description="The timeline is short because I’m 17. The direction is clear because I’ve already started building."
      />

      <ol className="journey-list">
        {JOURNEY.map((entry, index) => (
          <li key={entry.year}>
            <Reveal delay={index * 0.06} className="journey-entry">
              <div className="journey-entry__marker">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="journey-entry__year">{entry.year}</div>
              <div className="journey-entry__copy">
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default CareerSection;
