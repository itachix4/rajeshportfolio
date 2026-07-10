import { motion } from "motion/react";
import { Reveal } from "./Reveal";
import { CAREER } from "./data";

const CareerSection = () => (
  <section
    id="career"
    className="on-paper relative bg-[#F2EFE6] text-[#1A231C] rounded-t-[2.5rem] rounded-b-[2.5rem] md:rounded-t-[3rem] md:rounded-b-[3rem] -mt-6"
  >
    <div className="max-w-7xl mx-auto px-6 py-24 md:py-36">
      <Reveal className="flex items-baseline gap-4 mb-14 md:mb-20">
        <span className="text-sm md:text-base font-medium tracking-widest uppercase text-[#5A635A]">
          04
        </span>
        <span className="h-px flex-none w-10 md:w-16 bg-[#1A231C]/20 self-center" />
        <h2 className="font-display text-4xl md:text-6xl tracking-tight">
          The journey
        </h2>
      </Reveal>

      <div className="relative">
        <motion.span
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-px bg-[#1A231C]/15 origin-top"
          aria-hidden="true"
        />
        <ol className="space-y-14 md:space-y-20">
          {CAREER.map((entry, index) => (
            <li key={entry.year} className="relative pl-10 md:pl-16">
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.15 * index,
                }}
                className={`absolute left-0 top-2 w-[15px] h-[15px] md:w-[19px] md:h-[19px] rounded-full ${
                  entry.year === "NOW"
                    ? "bg-[#4D6D47] ring-4 ring-[#4D6D47]/25"
                    : "bg-[#1A231C]/30"
                }`}
                aria-hidden="true"
              />
              <Reveal delay={0.1 * index}>
                <span className="text-sm font-semibold tracking-widest uppercase text-[#4D6D47]">
                  {entry.year}
                </span>
                <h3 className="mt-2 font-display text-3xl md:text-5xl tracking-tight">
                  {entry.title}
                </h3>
                <p className="mt-3 text-base md:text-lg text-[#4A544C] leading-relaxed max-w-2xl">
                  {entry.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

export default CareerSection;
