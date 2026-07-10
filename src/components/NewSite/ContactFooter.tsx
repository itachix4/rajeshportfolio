import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal, WordReveal } from "./Reveal";
import { CONTACT_EMAIL } from "./data";

const ContactFooter = () => (
  <section id="contact" className="bg-[#FAFBF9] border-t border-[#F1F3F1]">
    <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-36 pb-10">
      <h2 className="text-sm md:text-base font-medium tracking-widest uppercase text-[#657464] mb-8">
        06 — Contact
      </h2>
      <WordReveal
        text="Have an idea? Let's build it."
        className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.05] text-black max-w-4xl"
      />
      <Reveal delay={0.2} className="mt-12 flex flex-wrap items-center gap-6">
        <motion.a
          href={`mailto:${CONTACT_EMAIL}`}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="group inline-flex items-center gap-3 bg-[#1C2E1E] text-white rounded-full px-8 py-4 text-lg md:text-xl font-medium shadow-lg shadow-emerald-950/10"
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
          className="text-lg md:text-xl text-[#5A635A] underline underline-offset-4 decoration-[#8FA98B] hover:opacity-60 transition-opacity"
        >
          {CONTACT_EMAIL}
        </a>
      </Reveal>

      <div className="mt-24 md:mt-32 pt-8 border-t border-[#F1F3F1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-[#657464]">
        <p>
          &copy; {new Date().getFullYear()} Parth Parwani &mdash; Entrepreneur,
          Designer &amp; Developer
        </p>
        <div className="flex items-center gap-6">
          <p>Class 12 Student (PCM) &middot; India</p>
          <a
            href="#top"
            className="inline-flex items-center min-h-11 px-3 -mx-3 text-[#1C2E1E] font-medium hover:opacity-60 transition-opacity"
          >
            Back to top &uarr;
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default ContactFooter;
