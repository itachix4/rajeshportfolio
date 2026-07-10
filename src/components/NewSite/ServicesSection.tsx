import { motion } from "motion/react";
import { Palette, MonitorSmartphone } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { SERVICES } from "./data";

const ICONS = [Palette, MonitorSmartphone];

const ServicesSection = () => (
  <section id="services" className="bg-[#0D120E]">
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
                className="group relative h-full bg-[#141B15] border border-[#F1EEE3]/10 rounded-3xl p-8 md:p-12 flex flex-col gap-6 hover:border-[#A8C69F]/40 hover:shadow-2xl hover:shadow-[#A8C69F]/10 transition-[border-color,box-shadow] duration-300"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-7 right-8 text-outline-soft text-5xl md:text-6xl font-medium leading-none select-none"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-[#0D120E] text-[#A8C69F] border border-[#F1EEE3]/10 flex items-center justify-center group-hover:bg-[#A8C69F] group-hover:text-[#0D120E] transition-colors duration-300">
                  <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-[#F1EEE3]">
                  {service.title}
                </h3>
                <p className="text-base md:text-lg text-[#B9C2B4] leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 rounded-full bg-transparent border border-[#F1EEE3]/15 text-xs md:text-sm text-[#A8C69F] font-medium"
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
