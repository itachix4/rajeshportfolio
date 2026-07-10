import { motion } from "motion/react";
import { Reveal } from "./Reveal";
import { CAREER } from "./data";

const CareerSection = () => (
  <section id="career" className="bg-[#1C2E1E] text-[#FAFBF9]">
    <div className="max-w-7xl mx-auto px-6 py-24 md:py-36">
      <Reveal className="flex items-baseline gap-4 mb-14 md:mb-20">
        <span className="text-sm md:text-base font-medium tracking-widest uppercase text-[#8FA98B]">
          04
        </span>
        <span className="h-px flex-none w-10 md:w-16 bg-white/20 self-center" />
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight">
          The journey
        </h2>
      </Reveal>

      <div className="relative">
        <motion.span
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-px bg-white/20 origin-top"
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
                    ? "bg-[#8FA98B] ring-4 ring-[#8FA98B]/30"
                    : "bg-white/40"
                }`}
                aria-hidden="true"
              />
              <Reveal delay={0.1 * index}>
                <span className="text-sm font-semibold tracking-widest uppercase text-[#8FA98B]">
                  {entry.year}
                </span>
                <h3 className="mt-2 text-2xl md:text-4xl font-medium tracking-tight">
                  {entry.title}
                </h3>
                <p className="mt-3 text-base md:text-lg text-[#C9D2C9] leading-relaxed max-w-2xl">
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
