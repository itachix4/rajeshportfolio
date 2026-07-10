import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { CONTACT_EMAIL, PROJECTS } from "./data";

/* Per-project cover tints — deliberate art, not just a fallback */
const COVER_GRADIENTS = [
  "from-[#EAECE9] to-[#C9D2C9]",
  "from-[#E7EBE3] to-[#B9C8B6]",
  "from-[#EDEDE7] to-[#CBD4C4]",
  "from-[#E4E9E6] to-[#BFCEC4]",
];

const WorkSection = () => (
  <section id="work" className="bg-white">
    <div className="max-w-7xl mx-auto px-6 py-24 md:py-36">
      <SectionHeading index="03" label="Selected work" />
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {PROJECTS.map((project, index) => (
          <Reveal
            key={project.title}
            delay={(index % 2) * 0.12}
            className={index % 2 === 1 ? "md:mt-20" : ""}
          >
            <article className="group">
              <div
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${
                  COVER_GRADIENTS[index % COVER_GRADIENTS.length]
                } aspect-[4/3]`}
              >
                {/* Typographic cover shows if the screenshot is missing */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center font-accent text-[7rem] md:text-[9rem] text-[#1C2E1E]/20 select-none"
                >
                  {project.title.charAt(0)}
                  <span className="text-[3rem] md:text-[4rem] text-[#4D6D47]/35 ml-3 not-italic">
                    &#10033;
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="absolute bottom-4 right-6 text-outline-soft text-6xl md:text-7xl font-medium leading-none select-none"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <img
                  src={project.image}
                  alt={`${project.title} — project preview`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  className="relative w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="pt-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-black">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-base md:text-lg text-[#5A635A] leading-relaxed max-w-md">
                    {project.category}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 rounded-full border border-[#F1F3F1] text-xs text-[#657464] font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                    `About your project: ${project.title}`
                  )}`}
                  aria-label={`Ask about ${project.title}`}
                  className="mt-2 flex-none w-11 h-11 rounded-full border border-[#F1F3F1] flex items-center justify-center text-[#1C2E1E] transition-all duration-300 group-hover:bg-[#1C2E1E] group-hover:text-white group-hover:rotate-45 hover:bg-[#1C2E1E] hover:text-white"
                >
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-20 md:mt-28 text-center">
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
            "Project inquiry"
          )}`}
          className="inline-flex items-center gap-2 text-lg md:text-xl text-[#1C2E1E] underline underline-offset-4 decoration-[#8FA98B] hover:opacity-60 transition-opacity"
        >
          Have a project in mind? Let&apos;s build it together
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </Reveal>
    </div>
  </section>
);

export default WorkSection;
