import Marquee from "react-fast-marquee";
import { useReducedMotion } from "motion/react";
import { Reveal } from "./Reveal";
import { TECH_ROW_ONE, TECH_ROW_TWO } from "./data";

const Row = ({
  items,
  direction,
  outlined,
  play,
}: {
  items: string[];
  direction: "left" | "right";
  outlined?: boolean;
  play: boolean;
}) => (
  <Marquee speed={36} direction={direction} autoFill play={play}>
    {items.map((item) => (
      <span key={item} className="flex items-center" aria-hidden="true">
        <span
          className={`mx-5 md:mx-8 text-4xl md:text-6xl font-medium tracking-tight whitespace-nowrap ${
            outlined ? "text-outline" : "text-[#F1EEE3]"
          }`}
        >
          {item}
        </span>
        <span className="text-2xl md:text-3xl text-[#E4C580]">&#10033;</span>
      </span>
    ))}
  </Marquee>
);

/** Two opposing kinetic-type rows of the stack. */
const TechMarquee = () => {
  const reducedMotion = useReducedMotion();
  return (
    <section className="bg-[#0D120E] py-20 md:py-28 overflow-hidden">
      <Reveal className="max-w-7xl mx-auto px-6 mb-10 md:mb-14">
        <h2 className="text-sm md:text-base font-medium tracking-widest uppercase text-[#8C978A]">
          05 — Tools & technologies
        </h2>
      </Reveal>
      <div className="space-y-4 md:space-y-6 select-none">
        <Row items={TECH_ROW_ONE} direction="left" play={!reducedMotion} />
        <Row
          items={TECH_ROW_TWO}
          direction="right"
          outlined
          play={!reducedMotion}
        />
      </div>
      <p className="sr-only">
        Tools and technologies: {[...TECH_ROW_ONE, ...TECH_ROW_TWO].join(", ")}
      </p>
    </section>
  );
};

export default TechMarquee;
