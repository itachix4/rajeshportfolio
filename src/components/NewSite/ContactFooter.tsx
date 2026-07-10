import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal, WordReveal } from "./Reveal";
import { CONTACT_EMAIL } from "./data";

const ContactFooter = () => (
  <section id="contact" className="bg-[#0D120E] border-t border-[#F1EEE3]/10">
    <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-36 pb-10">
      <h2 className="text-sm md:text-base font-medium tracking-widest uppercase text-[#8C978A] mb-8">
        06 — Contact
      </h2>
      <WordReveal
        text="Have an idea? Let's build it."
        accents={["idea", "build"]}
        className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] text-[#F1EEE3] max-w-4xl"
      />
      <Reveal delay={0.2} className="mt-12 flex flex-wrap items-center gap-6">
        <motion.a
          href={`mailto:${CONTACT_EMAIL}`}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="group inline-flex items-center gap-3 bg-[#A8C69F] text-[#0D120E] rounded-full px-8 py-4 text-lg md:text-xl font-medium shadow-lg shadow-[#A8C69F]/20"
        >
          Get in touch
          <ArrowUpRight
            size={22}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:rotate-45"
          />
        </motion.a>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-lg md:text-xl text-[#B9C2B4] underline underline-offset-4 decoration-[#A8C69F] hover:opacity-60 transition-opacity"
        >
          {CONTACT_EMAIL}
        </a>
      </Reveal>

      {/* Signature watermark */}
      <div
        aria-hidden="true"
        className="mt-20 md:mt-28 overflow-hidden select-none pointer-events-none"
      >
        <p className="text-outline-soft whitespace-nowrap text-center font-medium tracking-tight leading-none text-[13vw]">
          PARTH PARWANI&reg;
        </p>
      </div>

      <div className="mt-8 pt-8 border-t border-[#F1EEE3]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-[#8C978A]">
        <p>
          &copy; {new Date().getFullYear()} Parth Parwani &mdash; Entrepreneur,
          Designer &amp; Developer
        </p>
        <div className="flex items-center gap-6">
          <p>Class 12 Student (PCM) &middot; India</p>
          <a
            href="#top"
            className="inline-flex items-center min-h-11 px-3 -mx-3 text-[#F1EEE3] font-medium hover:opacity-60 transition-opacity"
          >
            Back to top &uarr;
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default ContactFooter;
