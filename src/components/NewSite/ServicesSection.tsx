import { motion } from "motion/react";
import { Palette, MonitorSmartphone } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { SERVICES } from "./data";

const ICONS = [Palette, MonitorSmartphone];

const ServicesSection = () => (
  <section id="services" className="bg-[#FAFBF9]">
    <div className="max-w-7xl mx-auto px-6 py-24 md:py-36">
      <SectionHeading index="02" label="What I do" />
      <div className="grid md:grid-cols-2 gap-5 md:gap-6">
        {SERVICES.map((service, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <Reveal key={service.title} delay={index * 0.12}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="group relative h-full bg-white border border-[#F1F3F1] rounded-3xl p-8 md:p-12 flex flex-col gap-6 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 transition-shadow duration-300"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-7 right-8 text-outline-soft text-5xl md:text-6xl font-medium leading-none select-none"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-[#EAECE9] text-[#1C2E1E] flex items-center justify-center group-hover:bg-[#1C2E1E] group-hover:text-white transition-colors duration-300">
                  <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-black">
                  {service.title}
                </h3>
                <p className="text-base md:text-lg text-[#5A635A] leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 rounded-full bg-[#FAFBF9] border border-[#F1F3F1] text-xs md:text-sm text-[#4D6D47] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default ServicesSection;
