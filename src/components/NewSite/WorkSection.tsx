import type { PointerEvent as ReactPointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { CONTACT_EMAIL, Project, PROJECTS } from "./data";

const ProjectVisual = () => (
  <div className="project-visual project-visual--orange" aria-hidden="true">
    <div className="project-visual__chrome">
      <span>FORGELANE / DIGITAL STUDIO</span>
      <span>FL—01</span>
    </div>

    <div className="forge-case">
      <div className="forge-case__shadow" />
      <div className="forge-case__screen">
        <div className="forge-case__nav">
          <span>FORGELANE®</span>
          <i />
          <span>MAKE IT DISTINCT</span>
        </div>
        <div className="forge-case__mark">
          FORGE
          <span>LANE</span>
        </div>
        <div className="forge-case__footer">
          <span>STRATEGY</span>
          <span>DESIGN</span>
          <span>BUILD</span>
        </div>
      </div>
      <div className="forge-case__stamp">
        <span>F</span>
        <small>STUDIO / 2026</small>
      </div>
    </div>

    <div className="project-visual__status">
      <span />
      ACTIVE VENTURE
    </div>
  </div>
);

const ProjectLinks = ({ project }: { project: Project }) => {
  const inquiryHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Project inquiry — ${project.title}`
  )}`;

  return (
    <div className="project-card__links">
      <a
        className="text-link"
        href={project.url ?? inquiryHref}
        target={project.url ? "_blank" : undefined}
        rel={project.url ? "noreferrer" : undefined}
      >
        {project.url ? "Visit ForgeLane" : "Ask about this work"}
        <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </div>
  );
};

const tiltProject = (event: ReactPointerEvent<HTMLElement>) => {
  if (event.pointerType !== "mouse") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  event.currentTarget.style.setProperty("--project-rx", `${y * -4}deg`);
  event.currentTarget.style.setProperty("--project-ry", `${x * 5}deg`);
};

const resetProjectTilt = (event: ReactPointerEvent<HTMLElement>) => {
  event.currentTarget.style.setProperty("--project-rx", "0deg");
  event.currentTarget.style.setProperty("--project-ry", "0deg");
};

const WorkSection = () => (
  <section id="work" className="section section--work">
    <div className="portfolio-container">
      <SectionHeading
        index="01"
        eyebrow="The venture"
        title="One studio. Full ownership."
        description="ForgeLane is where I bring strategy, identity, interface and engineering together under one roof."
      />

      <div className="work-grid">
        {PROJECTS.map((project) => (
          <Reveal key={project.title} className="project-card-shell">
            <article
              className="project-card"
              onPointerMove={tiltProject}
              onPointerLeave={resetProjectTilt}
            >
              <ProjectVisual />
              <div className="project-card__content">
                <div className="project-card__heading">
                  <span>{project.number}</span>
                  <p>{project.eyebrow}</p>
                </div>
                <h3>{project.title}</h3>
                <p className="project-card__summary">{project.summary}</p>
                <p className="project-card__contribution">{project.contribution}</p>
                <ul className="tag-list" aria-label={`${project.title} disciplines`}>
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <ProjectLinks project={project} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default WorkSection;
